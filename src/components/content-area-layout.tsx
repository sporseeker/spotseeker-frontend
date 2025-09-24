import { FC, ReactNode } from "react";

interface IContentAreaLayoutProps {
  children: ReactNode;
  className?: string;
}

const ContentAreaLayout: FC<IContentAreaLayoutProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`container mx-auto flex w-full px-3 sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl xxl:max-w-xxl ${className}`}
    >
      {children}
    </div>
  );
};

export { ContentAreaLayout };
