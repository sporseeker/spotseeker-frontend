import { convertToLKR } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { FC } from "react";

interface ISingleCheckoutItem {
  count: number;
  title: string;
  price: number;
  onRemove?: () => void;
}
export const SingleCheckoutItem: FC<ISingleCheckoutItem> = ({
  count,
  title,
  price,
  onRemove,
}) => (
  <div className="flex justify-between gap-x-[20px]">
    <div className="flex items-center justify-center gap-x-[8px]">
      <span className="flex h-[24px] min-w-[34px] items-center justify-center rounded-[200px] bg-white/10 px-[8px] text-14 font-medium text-grey-250">
        {count}x
      </span>
      <p className="line-clamp-2 flex max-w-[200px] items-center text-14 font-semibold text-grey-250">
        {title}
      </p>
    </div>
    <p className="flex items-center gap-x-[10px] text-14 text-grey-250">
      {onRemove && (
        <Trash2
          height="16px"
          width="16px"
          className="text-primary-700 hover:cursor-pointer hover:opacity-75"
          onClick={() => onRemove()}
        />
      )}

      {convertToLKR(price)}
    </p>
  </div>
);
