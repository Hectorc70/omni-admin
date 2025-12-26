
// src/hooks/useUser.ts
import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "@/redux/store";
import { useCallback, useEffect, useRef, useState } from "react";
import { setChats, setSelectedChat } from "../store/chats.slice";
import { ScreenStatus } from "@/types/enums";
import ChatService from "../services/chats.service";
import BaseWsService from "@/common/api/ws.service";
import { WSAppUrls } from "@/common/api/endpoints";
import { lsAccessToken } from "@/common/constants";


export function useChats() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const chats = useSelector((state: RootState) => state.chats.chats);
  const detail = useSelector((state: RootState) => state.chats.chatSelected);
  const [status, setStatus] = useState<ScreenStatus>(ScreenStatus.success)
  const [message, setMessage] = useState<string>("");
  const wsRef = useRef<BaseWsService | null>(null);


  const fetchChats: () => Promise<void> = useCallback(async () => {
    try {
      setStatus(ScreenStatus.loading)
      const response = await ChatService.getConversations();
      dispatch(setChats(response));
      setStatus(ScreenStatus.success)
      setMessage("Error fetching chats")
    } catch (err: any) {
      // setStatus(ScreenStatus.error)
      console.error("Error fetching chats:", err);
      setMessage(err.toString())
    }
  }, [dispatch]);

  const fetchDetailConversation: (uuidConversation?: string) => Promise<void> = useCallback(async (uuidConversation?: string) => {
    try {
      if (!detail && !uuidConversation) return
      const id = uuidConversation ?? detail?.uuid
      console.log("📩 uuidConversation", id)
      // if (detail?.messages?.length! > 0) return
      // setStatus(ScreenStatus.loading)
      const response = await ChatService.getDetailConversation(id ?? "");
      dispatch(setSelectedChat(response));
      // setStatus(ScreenStatus.success)
      // setMessage("Error fetching chats")
    } catch (err: any) {
      // setStatus(ScreenStatus.error)
      // console.error("Error fetching chats:", err);
      setMessage(err.toString())
    }
  }, []);

  // ============================================================
  // 🔌 Inicializar WebSocket una vez
  // ============================================================
  useEffect(() => {
    if (!detail) {
      // No hay chat → cerrar WS
      wsRef.current?.disconnect();
      return;
    }
    wsRef.current = new BaseWsService(async () => {
      return localStorage.getItem(lsAccessToken) || "";
    });
    // 3. Registrar listener ANTES de conectar
    wsRef.current.listen((data) => {
      console.log("📩 WS MESSAGE", data);

      // Actualizar preview
      dispatch(setChats(
        chats.map((c) =>
          c.uuid === data.conversation_uuid
            ? { ...c, last_message: data }
            : c
        )
      ));

      console.log("current detail", detail.uuid === data.conversation_uuid);
      // Actualizar la conversación seleccionada
      if (detail && detail.uuid === data.conversation_uuid) {
        dispatch(setSelectedChat({
          ...detail,
          messages: [...(detail.messages ?? []), data],
        }));
      }
    });

    const fullUrl = `${WSAppUrls.chat}${detail.uuid}`;
    console.log(`🟢 WS connecting... ${fullUrl}`);
    wsRef.current.connect(fullUrl);

    return () => wsRef.current?.disconnect();
  }, [detail, dispatch]);
  // useEffect(() => {
  //   if (!wsRef.current) return;

  //   wsRef.current.listen((data) => {
  //     console.log("📩 WS MESSAGE", data);

  //     // 1) Actualizar listado de chats (preview)
  //     const updatedChats = chats.map((c) =>
  //       c.uuid === data.conversation_uuid
  //         ? { ...c, last_message: data.message }
  //         : c
  //     );
  //     dispatch(setChats(updatedChats));

  //     // 2) Si el mensaje es del chat seleccionado → actualizar detalle
  //     if (detail && detail.uuid === data.conversation_uuid) {
  //       const updatedDetail = {
  //         ...detail,
  //         messages: [...(detail.messages ?? []), data.message],
  //       };
  //       dispatch(setSelectedChat(updatedDetail));
  //     }
  //   });
  // }, [chats, detail, dispatch]);


  const onSendMessage = async (message: string) => {
    try {
      if (!detail) return;

      // Enviar por WS
      wsRef.current?.sendJson({
        message: message,
      });

      // UI optimista: agregamos el mensaje localmente
      const optimisticDetail = {
        ...detail,
        messages: [
          ...(detail.messages ?? []),
          {
            uuid: "temp-" + Date.now(),
            message,
            user_uuid: user.uuid,
            created_at: new Date().toISOString(),
          },
        ],
      };

      dispatch(setSelectedChat(optimisticDetail));
    } catch (err: any) {
      setStatus(ScreenStatus.error);
      setMessage(err.toString());
    }
  };

  return { chats, fetchChats, status, message, fetchDetailConversation, detail, onSendMessage, };
}
