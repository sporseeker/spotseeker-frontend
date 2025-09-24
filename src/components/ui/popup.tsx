import { FC } from "react";

interface IPopupProps {
  children: React.ReactNode;
  open: boolean;
}

const Popup: FC<IPopupProps> = ({ children, open }) => {
  return (
    <div
      className={`fixed inset-0 z-50 z-[9999] flex items-center justify-center bg-black bg-opacity-70 ${
        open ? "visible" : "hidden"
      }`}
    >
      <div className="border-grey-500 w-[340px] rounded-lg border-[1px] border-solid bg-grey-550 p-[24px]">
        {children}
      </div>
    </div>
  );
};

export { Popup };
