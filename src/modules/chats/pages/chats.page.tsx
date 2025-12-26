import type { AppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useChats } from "../hooks/use-chats";
import { changeTitle } from "@/redux/global.slice";
import ChatCard from "../components/chat-card";
import { ScreenStatus } from "@/types/enums";
import ErrorComponent from "@/common/components/error-component";
import LoaderComponent from "@/common/components/loader";
import ChatDetailComponent from "./chat-detail.page";
import { setSelectedChat } from "../store/chats.slice";
import type { IConversation } from "@/models/chats/conversation.model";

const ChatsPage: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { chats, fetchChats, status, message, detail } = useChats();

  useEffect(() => {
    dispatch(changeTitle("Chats"));
    fetchChats()
  }, [])
  const onSelectChat = async (conversation: IConversation) => {
    if (conversation.uuid === detail?.uuid) return
    dispatch(setSelectedChat(conversation));
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-full gap-1">
      {/* ------------------ IZQUIERDA – BUSCADOR + LISTADO ------------------ */}
      <div className="h-full flex flex-col bg-background rounded-xl overflow-hidden">

        {/* Buscador */}
        <div className="px-5 py-3">
          <div className="bg-hintColor rounded-xl flex items-center px-3 py-2">
            <input
              placeholder="Buscar ..."
              className="bg-transparent ml-2 outline-none w-full text-sm text-colorText"
            />
          </div>
        </div>

        {/* Listado de chats */}
        {status === ScreenStatus.success ? <div className="flex-1 overflow-y-auto">
          {
            chats.length === 0 &&
            <div className="flex-1 flex items-center justify-center">
              <ErrorComponent title="Sin conversaciones" subtitle="No tienes ninguna conversación" onRetry={fetchChats} />
            </div>
          }

          {chats && chats.map((item) => (
            <ChatCard key={item.uuid} conversation={item} onClick={() => onSelectChat(item)} />
          ))}
        </div> : <div className="flex-1 flex items-center justify-center">
          {
            status === ScreenStatus.loading &&
            <LoaderComponent />
          }
          {
            status === ScreenStatus.error &&
            <ErrorComponent subtitle={message} onRetry={fetchChats} />
          }
        </div>}
      </div>

      {/* ------------------ DERECHA – DETALLE DEL CHAT ------------------ */}
      <ChatDetailComponent />

    </div>
  );
};

export default ChatsPage;