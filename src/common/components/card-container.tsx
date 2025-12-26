import React from 'react';
import { BiSolidPencil } from 'react-icons/bi';

interface CardContainerComponentProps {
  children: React.ReactNode;
  title: string
  titleChildren?: React.ReactNode
  subtitle?: string
  onEditAction?: () => void
}


const CardContainerComponent: React.FC<CardContainerComponentProps> = ({
  children,
  title, titleChildren,
  onEditAction

}) => {


  return (<>
    <div className='w-full gap-5 mb-2 border rounded-lg p-5 bg-background'>
      <div className='flex justify-between pb-2 border-b-2 border-hintColor'>
        <div>
          {title && <span className="font-bold text-lg w-full rounded-md p-1 px-2 mb-0 text-colorText">{title}</span>}
          {titleChildren}
        </div>

        {
          onEditAction && <BiSolidPencil className="text-2xl cursor-pointer text-primary hover:text-hoverPrimary" onClick={onEditAction} />
        }
      </div>
      <div className='mt-2'>
        {children}
      </div>
    </div>

  </>
  );
};

export default CardContainerComponent;