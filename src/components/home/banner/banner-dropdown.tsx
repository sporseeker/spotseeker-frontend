import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface IBannerDropdown {
  label: string;
}
const BannerDropdown: React.FC<IBannerDropdown> = ({ label }) => {
  return (
    <Select>
      <SelectTrigger className="min-w-[100px] rounded-full border !border-primary-900 !bg-grey-650 !pr-[8px] ring-0 hover:ring-0">
        <p className="pr-[8px] text-14 text-gray-100">{label}</p>
        <SelectValue placeholder="All" className="mr-[4px]" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>All</SelectLabel>
          <SelectItem value="1">1</SelectItem>
          <SelectItem value="2">2</SelectItem>
          <SelectItem value="3">3</SelectItem>
          <SelectItem value="4">4</SelectItem>
          <SelectItem value="5">5 Next</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default BannerDropdown;
