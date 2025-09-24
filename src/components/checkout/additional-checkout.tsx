import React, { FC, ReactNode, useMemo, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store";
import { ISortedAddons } from "@/types/addon";
import AddonList from "./addon-list";

interface ICustomTabsTrigger {
  label: string;
  value: string;
}
export const CustomTabsTrigger: FC<ICustomTabsTrigger> = ({ label, value }) => {
  return (
    <TabsTrigger
      value={value}
      defaultChecked
      className="!text-grey-440 !h-[30px] rounded-full p-0 !text-12 data-[state=active]:!bg-grey-250 data-[state=active]:px-[14px] data-[state=active]:py-[8px] data-[state=active]:!text-black lg:!h-[34px] lg:!text-16 lg:data-[state=active]:px-[20px]"
    >
      {label}
    </TabsTrigger>
  );
};

interface ICustomTabsContent {
  value: string;
  children: ReactNode;
}
const addonCategories = [
  { key: "food", label: "Food" },
  { key: "beverages", label: "Beverages" },
  { key: "liquor", label: "Liquor" },
  { key: "other", label: "Other" },
];
export const CustomTabsContent: FC<ICustomTabsContent> = ({
  value,
  children,
}) => {
  return (
    <TabsContent value={value} className="m-0">
      {children}
    </TabsContent>
  );
};

const AdditionalCheckout = () => {
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([]);
  const event = useAppSelector((state: RootState) => state.event.event);

  const sortAddonsByCategory = useMemo(() => {
    return event?.addons.reduce<ISortedAddons>((acc, addon) => {
      if (!acc[addon.category]) {
        acc[addon.category] = [];
      }
      acc[addon.category].push(addon);
      return acc;
    }, {});
  }, [event]);
  const filteredAddonCategories = useMemo(
    () =>
      addonCategories.filter((addon) =>
        sortAddonsByCategory &&
        sortAddonsByCategory[addon.key] &&
        sortAddonsByCategory[addon.key].length > 0
          ? true
          : false,
      ),
    [sortAddonsByCategory],
  );

  return (
    <Accordion
      type="multiple"
      className="w-full"
      value={openAccordionItems}
      onValueChange={setOpenAccordionItems}
    >
      <div className="rounded-[12px] border border-grey-550 bg-grey-650 px-[16px] py-[24px] pb-[28px] lg:px-[28px]">
        <AccordionItem value="item-1" className="border-none">
          <div className="flex justify-between">
            <h2 className="text-16 font-semibold text-grey-100 lg:text-20">
              Eats & Sprits
            </h2>
            <AccordionTrigger className="p-0 !text-[14px] text-primary-600 [&>svg]:hidden">
              {openAccordionItems.includes("item-1") ? "Hide" : "Show"}
            </AccordionTrigger>
          </div>
          <AccordionContent className="p-0">
            <Tabs
              defaultValue={filteredAddonCategories[0].key}
              className="mt-[24px]"
            >
              <ScrollArea className="whitespace-nowrap">
                <div className="flex w-max pb-[18px] lg:pb-[28px]">
                  <TabsList className="h-full space-x-[36px] !bg-transparent p-0">
                    {filteredAddonCategories.map((addon) => (
                      <CustomTabsTrigger
                        value={addon.key}
                        label={addon.label}
                        key={`title-${addon.key}`}
                      />
                    ))}
                  </TabsList>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              {filteredAddonCategories.map((addon) => (
                <CustomTabsContent
                  value={addon.key}
                  key={`content-${addon.key}`}
                >
                  <AddonList
                    additionalItems={
                      (sortAddonsByCategory &&
                        sortAddonsByCategory[addon.key]) ??
                      []
                    }
                    categoryName={addon.key}
                  />
                </CustomTabsContent>
              ))}
            </Tabs>
          </AccordionContent>
        </AccordionItem>
      </div>
    </Accordion>
  );
};

export default AdditionalCheckout;
