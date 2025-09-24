import { FC } from "react";
import { ChevronRight, Loader2 } from "lucide-react";

import { ContentAreaLayout } from "@/components/content-area-layout";
import { Button } from "@/components/ui/button";
import Sticky from "react-sticky-el";
import { cn, convertToLKR } from "@/lib/utils";
import { Step } from "@/enum/step";
import { FloatButtonInner } from "../float-button";
import { PaymentMethod } from "@/enum/event";

interface ICheckoutBarProps {
  qty?: number;
  total: number;
  boundaryElement: string;
  step: Step;
  onClick: () => void;
  loading?: boolean;
  selectedPaymentMethod?: PaymentMethod;
}

const CheckoutBar: FC<ICheckoutBarProps> = ({
  qty,
  total,
  boundaryElement,
  step,
  onClick,
  loading = false,
  selectedPaymentMethod,
}) => {
  return (
    <Sticky
      boundaryElement={boundaryElement}
      hideOnBoundaryHit={false}
      mode="bottom"
      dontUpdateHolderHeightWhenSticky={true}
      disabled={false}
      isIOSFixEnabled={true}
    >
      <div
        className={cn(
          "sticky bottom-0 flex min-h-[85px] w-full items-center border-b border-t border-grey-550 bg-grey-650",
        )}
      >
        <ContentAreaLayout className="static h-full flex-col items-end justify-center">
          <div className="absolute left-0 w-full">
            <FloatButtonInner className="-mt-[120px]" />
          </div>
          <div className="flex w-full items-center justify-between lg:w-auto lg:gap-x-[25px]">
            <p className="flex flex-col gap-x-[8px] text-14 tracking-[-0.36px] text-neutral-700 lg:flex-row lg:text-18">
              {step === Step.EVENT
                ? qty && qty > 0
                  ? `${qty} x`
                  : ""
                : selectedPaymentMethod === PaymentMethod.KOKO
                  ? "1st Installment"
                  : "Total"}
              {total > 0 && (
                <span className="text-14 font-medium tracking-[0.36px] text-neutral-100 lg:text-18">
                  {selectedPaymentMethod === PaymentMethod.KOKO
                    ? convertToLKR(total / 3)
                    : convertToLKR(total)}
                </span>
              )}
            </p>
            <Button
              onClick={() => onClick()}
              className="min-h-[52px] min-w-[175px] gap-x-[5px] rounded-[8px] !bg-primary-600 !text-16 !font-bold !text-white hover:!opacity-75 lg:min-w-[205px]"
              disabled={total <= 0 || loading}
            >
              {step === Step.EVENT ? "Proceed to Billing" : "Checkout & Finish"}{" "}
              {!loading ? (
                <ChevronRight width="20px" height="20px" />
              ) : (
                <Loader2 className="animate-spin" width="20px" height="20px" />
              )}
            </Button>
          </div>
        </ContentAreaLayout>
      </div>
    </Sticky>
  );
};

export { CheckoutBar };
