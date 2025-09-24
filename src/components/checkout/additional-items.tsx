"use client";
import React, { FC, useMemo } from "react";
import ImageWrapper from "../image-wrapper";
import { Button } from "../ui/button";
import { convertToLKR } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { RootState } from "@/lib/store";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  addAdditionItem,
  decrementAdditionCount,
  incrementAdditionCount,
} from "@/lib/store/slices/event-slice";

interface IAdditionalItem {
  id: number;
  src: string;
  title: string;
  price: string;
}
export const AdditionalItem: FC<IAdditionalItem> = ({
  src,
  title,
  price,
  id,
}) => {
  const dispatch = useAppDispatch();
  const additions = useAppSelector((state: RootState) => state.event.additions);

  const count = useMemo(() => {
    const data = additions.find((a) => a.id === id);
    if (!data) {
      return null;
    } else {
      return data.count;
    }
  }, [additions, id]);

  return (
    <div className="flex flex-col overflow-hidden rounded-[12px] border border-grey-550 bg-grey-600">
      <ImageWrapper
        src={src}
        className="h-[120px] w-full"
        imageElementClassName="object-cover"
        skeleton={false}
      />
      <div className="flex flex-col p-[12px]">
        <p className="mb-[4px] line-clamp-2 min-h-[30px] text-12 font-semibold leading-[1.3] text-neutral-100">
          {title}
        </p>
        <p className="mb-[14px] text-12 tracking-[-0.24px] text-grey-350">
          {convertToLKR(price)}
        </p>
        {count === 0 || !count ? (
          <Button
            className="h-[30px] w-full rounded-[8px] !bg-primary-600 p-0 !text-[12px] font-bold !text-white hover:!opacity-75"
            type="button"
            onClick={() => {
              if (count === null) {
                dispatch(
                  addAdditionItem({
                    id,
                    name: title,
                    price,
                    count: 1,
                  }),
                );
              } else {
                dispatch(incrementAdditionCount(id));
              }
            }}
          >
            Add
          </Button>
        ) : (
          <div className="flex justify-between">
            <Button
              className="h-[30px] w-[40px] rounded-[8px] !bg-white/30 p-0 text-[18px] !text-white hover:!opacity-75"
              onClick={() => dispatch(decrementAdditionCount(id))}
              type="button"
            >
              <Minus className="h-[16px] w-[16px]" />
            </Button>
            <span className="flex items-center text-16 text-grey-100">
              {count}
            </span>
            <Button
              className="h-[30px] w-[40px] rounded-[8px] !bg-white/30 p-0 text-[18px] !text-white hover:!opacity-75"
              onClick={() => dispatch(incrementAdditionCount(id))}
              type="button"
            >
              <Plus className="h-[16px] w-[16px]" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
