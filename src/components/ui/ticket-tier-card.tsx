import { FC, useState } from "react";
import { Badge, Minus, Plus } from "lucide-react";

import { Popup } from "@/components/ui/popup";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ITicketTierCardProps {
  name: string;
  price: number;
  currency?: string;
  soldOut: boolean;
  active: boolean;
  seated: boolean;
  selection: {
    qty: number;
    max: number;
    changeQty: (qty: number) => void;
  } | null;
  totalTicketCount: number;
}

const TicketTierCard: FC<ITicketTierCardProps> = ({
  name,
  price,
  currency = "LKR",
  soldOut = false,
  active = true,
  selection,
  totalTicketCount,
  seated = false,
}) => {
  const [popupOpen, setPopupOpen] = useState(false);

  const handleOnQtyIncrement = () => {
    if (totalTicketCount >= 5) {
      setPopupOpen(true);
    } else {
      selection?.changeQty(selection.qty + 1);
    }
  };

  return (
    <div
      className={cn(
        "flex h-[56px] items-center justify-between rounded-lg border-[1px] border-solid p-[10px] md:h-[64px] md:p-[12px]",
        active && soldOut
          ? "border-primary-1000 bg-[#00000066]"
          : "border-[#ffffff14] bg-grey-550",
      )}
    >
      <Popup open={popupOpen}>
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center">
            <div className="relative mb-[12px] h-[60px] w-[60px]">
              <Badge className="h-[60px] w-[60px] fill-primary-600 text-primary-600" />
              <p className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] text-[16px] font-bold">
                5x
              </p>
            </div>
            <div className="flex flex-col items-center gap-[4px]">
              <h3 className="mb-[4px] text-[16px] font-semibold leading-[22.95px]">
                Max ticket limit reached!
              </h3>
              <p className="mb-[30px] text-center text-[14px] leading-[24px] text-grey-350">
                A maximum of 5 tickets may be purchased per NIC to ensure fair
                access for all attendees
              </p>
            </div>
          </div>
          <Button
            variant={"ghost"}
            className="h-auto min-h-[34px] rounded-lg bg-primary-600 px-[24px] py-[0] text-[14px] font-semibold leading-[17.85px] hover:bg-primary-600 hover:text-white hover:opacity-75"
            onClick={() => setPopupOpen(false)}
          >
            Understood
          </Button>
        </div>
      </Popup>
      <div className="flex flex-col gap-[2px]">
        <h4 className="text-[14px] font-semibold leading-[17.85px] text-grey-100 md:text-[16px] md:leading-[20.4px]">
          {name}
        </h4>
        <p className="text-[12px] font-normal leading-[15.3px] md:text-[14px] md:leading-[17.85px]">
          {currency} {price.toLocaleString()}
          {` - ${seated ? "Seated" : "Standing"}`}
        </p>
      </div>
      <div>
        {active && soldOut ? (
          <div className="rounded-[6px] bg-primary-700 px-[12px] py-[6px] text-[12px] font-normal leading-[15.3px] md:text-[14px] md:leading-[17.85px]">
            SOLD OUT
          </div>
        ) : !active ? (
          <div className="rounded-[6px] border border-primary-700 px-[12px] py-[6px] text-[12px] font-normal leading-[15.3px] text-primary-700 md:text-[14px] md:leading-[17.85px]">
            RELEASING SOON
          </div>
        ) : (
          <div className="flex items-center gap-[8px]">
            <button
              onClick={() => {
                selection?.changeQty(selection.qty - 1);
              }}
              className={`flex aspect-square w-[36px] items-center justify-center rounded-lg bg-[#FFFFFF47] md:w-[40px] ${(selection?.qty ?? 0) <= 0 ? "bg-[#00000066]" : ""}`}
              disabled={(selection?.qty ?? 0) <= 0}
            >
              <Minus
                className={` ${(selection?.qty ?? 0) <= 0 ? "opacity-50" : "opacity-100"} h-[16px] w-[16px]`}
              />
            </button>
            <p className="w-[36px] text-center text-[16px] font-normal leading-[20.4px] md:w-[40px]">
              {selection?.qty ?? "N/A"}
            </p>
            <button
              onClick={handleOnQtyIncrement}
              className={`flex aspect-square w-[36px] items-center justify-center rounded-lg bg-[#FFFFFF47] md:w-[40px]`}
              // disabled={(selection?.qty ?? 0) >= (selection?.max ?? 0)}
            >
              <Plus
                className={` ${
                  (selection?.qty ?? 0) >= (selection?.max ?? 0)
                    ? "opacity-50"
                    : "opacity-100"
                } h-[16px] w-[16px]`}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export { TicketTierCard };
