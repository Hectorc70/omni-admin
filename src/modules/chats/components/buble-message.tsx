import { type IMessage } from "@/models/chats/message.model";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface ChatCardProps {
  message: IMessage;
  onClick?: (row: any) => void;
}



const BubbleMessage: React.FC<ChatCardProps> = ({ message }) => {
  const user = useSelector((state: RootState) => state.user);
  return (
    <div className="flex justify-start">
      <p className={`${message?.user_uuid==user.uuid? "bg-primary text-onPrimary" : "bg-hintColor text-colorText"} px-4 py-2 rounded-2xl rounded-tl-none max-w-sm text-sm`}>
        {message.message}
      </p>
    </div>
  );
};

export default BubbleMessage;


