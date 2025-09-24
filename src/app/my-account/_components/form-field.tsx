import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { HTMLInputTypeAttribute, useState, FC } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

interface IFormTextField {
  name: string;
  placeholder?: string;
  description?: string;
  type?: HTMLInputTypeAttribute | undefined;
  className?: string;
  label: string;
  disabled?: boolean;
  autoComplete?: boolean;
}

export const FormTextField: FC<IFormTextField> = ({
  name,
  placeholder,
  type,
  className,
  label,
  disabled = false,
  autoComplete = true,
}) => {
  const {
    control,
    formState: { isSubmitted },
  } = useFormContext();
  const [inputType, setInputType] = useState(type);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error, isTouched, isDirty } }) => (
        <FormItem className={cn("", className)}>
          <FormLabel className="text-14 text-grey-300">{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                placeholder={placeholder}
                {...field}
                type={inputType}
                className={cn(
                  "h-[42px] rounded-[8px] border border-white/[12%] bg-white/[0.08] text-14 text-grey-100",
                  (isTouched && isDirty) || isSubmitted
                    ? error
                      ? "!ring-1 !ring-primary-600"
                      : ""
                    : "",
                  type === "password" ? "pr-[30px] lg:pr-[45px]" : "",
                )}
                autoComplete={autoComplete ? "on" : "off"}
                disabled={disabled}
              />
              {type === "password" ? (
                inputType === "password" ? (
                  <EyeOff
                    color="#8c8c8c"
                    size={16}
                    className="absolute right-[14px] top-1/2 h-[16px] w-[16px] -translate-y-1/2 cursor-pointer"
                    onClick={() => setInputType("text")}
                  />
                ) : (
                  <Eye
                    color="#8c8c8c"
                    size={16}
                    className="absolute right-[14px] top-1/2 h-[16px] w-[16px] -translate-y-1/2 cursor-pointer"
                    onClick={() => setInputType("password")}
                  />
                )
              ) : null}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
