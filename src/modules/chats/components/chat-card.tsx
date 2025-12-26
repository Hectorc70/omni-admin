import {  type IConversation } from "@/models/chats/conversation.model";
import { MessageModel } from "@/models/chats/message.model";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface ChatCardProps {
  conversation: IConversation;
  onClick: (row: any) => void;
}



const ChatCard: React.FC<ChatCardProps> = ({conversation, onClick}) => {
  const chatSelected = useSelector((state: RootState) => state.chats.chatSelected);
  return (
    <div onClick={() => onClick(conversation)}
      className={`px-5 py-4 flex items-center gap-3 cursor-pointer border-b ${conversation.uuid === chatSelected?.uuid ? 'bg-gray-50' : ''} border-gray-100 hover:bg-gray-50`}
    >
      <img
        src={conversation.photo_from_user}
        className="w-12 h-12 rounded-full object-cover"
      />

      <div className="flex-1">
        <p className="font-semibold text-colorText">{conversation.name_from_user}</p>
        <p className="text-xs text-colorGrey">{conversation.last_message?.message}</p>
      </div>

      <span className="text-xs text-colorGrey">{!conversation.last_message ? '--:--' : new MessageModel(conversation.last_message || {}).getHourCreatedAt()}</span>
    </div>
  );
};

export default ChatCard;


