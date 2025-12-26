import { useChats } from "../hooks/use-chats";
import {  BsFillMicFill, BsImage } from "react-icons/bs";
import BubbleMessage from "../components/buble-message";
import { MdArrowBackIos } from "react-icons/md";
import type { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { setUnSelectedChat } from "../store/chats.slice";
import logo from '@/assets/logo.png'
import ErrorComponent from "@/common/components/error-component";
import { useEffect, useRef, useState } from "react";


const ChatDetailComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { detail, onSendMessage, fetchDetailConversation } = useChats();
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [detail?.messages]);

  useEffect(() => {
    fetchDetailConversation(detail?.uuid)
  }, [detail?.uuid])
  return (
    <div className="h-full flex flex-col bg-background rounded-xl overflow-hidden">

      {/* HEADER */}
      <div className="px-5 py-4 flex items-center justify-between gap-2  border-b border-gray-200">
        {detail && <MdArrowBackIos className="text-2xl text-primary cursor-pointer" onClick={() => dispatch(setUnSelectedChat())} />}
        <div className="flex items-center gap-3 w-full">
          <img
            src={detail ? detail.photo_from_user : logo}
            className="w-12 h-12 rounded-full object-cover"
          />
          <p className="font-bold text-colorText text-2xl" >{detail ? detail.name_from_user : " "}</p>
        </div>

      </div>

      {/* MENSAJES */}
      {detail ? <div className="flex-1 px-5 py-5 overflow-y-auto space-y-5">
        {
          detail && detail?.messages?.map((message, index) => (
            <BubbleMessage key={index} message={message} />
          ))
        }
        <div ref={messagesEndRef} />

      </div> : <div className="flex-1 flex items-center justify-center">
        <ErrorComponent title="" subtitle="Selecciona un chat" />
      </div>
      }
      {/* INPUT */}
      {detail && <div className="px-5 py-4 border-t border-gray-200 bg-background flex items-center gap-3">
        <input
          placeholder="Message ..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-4 py-2 rounded-xl bg-hintColor text-colorText text-sm outline-none border border-[#EAEAEA]"
          maxLength={256}
        />

        <BsImage className="text-xl text-primary cursor-pointer" />
        <BsFillMicFill className="text-xl text-primary cursor-pointer" />
      </div>}

    </div>
  );
};

export default ChatDetailComponent;