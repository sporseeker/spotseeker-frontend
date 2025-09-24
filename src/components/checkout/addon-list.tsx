import { IAddon } from "@/types/addon";
import Paginator from "../paginator/pagination";
import { CustomTabsContent } from "./additional-checkout";
import { AdditionalItem } from "./additional-items";
import { useState } from "react";

const AddonList: React.FC<{
  additionalItems: IAddon[];
  categoryName: string;
  pageSize?: number;
}> = ({ additionalItems, categoryName, pageSize = 8 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(additionalItems.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const itemsToDisplay = additionalItems.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <CustomTabsContent value={categoryName}>
      <div className="grid grid-cols-2 gap-x-[12px] gap-y-[16px] pb-[24px] sm:grid-cols-3 xl:grid-cols-4">
        {itemsToDisplay.map((v) => (
          <AdditionalItem
            key={v.id}
            src={v.image_url}
            title={v.name}
            price={v.price.toString()}
            id={v.id}
          />
        ))}
      </div>
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        showPreviousNext={true}
      />
    </CustomTabsContent>
  );
};

export default AddonList;
