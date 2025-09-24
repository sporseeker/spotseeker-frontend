import { FC, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface IPromoCode {
  value: string | undefined;
  onChange: (v: string) => void;
  disabled: boolean | undefined;
}
export const PromoCode: FC<IPromoCode> = ({
  onChange,
  value,
  disabled = false,
}) => {
  const [promo, setPromo] = useState<string | undefined>(value);
  return (
    <div className="flex max-w-[420px] gap-x-[12px] pb-[8px]">
      <div className="relative w-full">
        <Input
          placeholder="XXXXXXXX"
          value={promo}
          onChange={(promo) => setPromo(promo.target.value)}
          className="h-[42px] rounded-[8px] border border-white/[8%] bg-black/[15%] text-14 tracking-[5px] text-grey-100"
          disabled={disabled}
        />
        {value && (
          <X
            className={cn(
              "absolute right-[9px] top-[9px] text-primary-700",
              disabled ? "" : "hover:opacity-75",
            )}
            onClick={() => {
              if (!disabled) {
                setPromo("");
                onChange("");
              }
            }}
          />
        )}
      </div>
      <Button
        className="h-[42px] rounded-[8px] bg-primary-600 p-0 px-[23px] text-12 font-bold text-grey-100 hover:bg-primary-600 hover:opacity-75"
        type="button"
        onClick={() => onChange(promo ?? "")}
        disabled={disabled}
      >
        Apply
      </Button>
    </div>
  );
};
