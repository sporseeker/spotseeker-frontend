"use client";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { HTMLInputTypeAttribute, useState, forwardRef } from "react";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Eye, EyeOff } from "lucide-react";

interface IFormTextField {
  name: string;
  placeholder?: string;
  description?: string;
  type?: HTMLInputTypeAttribute | undefined;
  className?: string;
}

export const FormTextField = forwardRef<HTMLInputElement, IFormTextField>(
  ({ name, placeholder, type, className }, ref) => {
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
          <FormItem className={cn("space-y-[3px]", className)}>
            <FormControl>
              <div className="relative">
                <Input
                  placeholder={placeholder}
                  {...field}
                  ref={ref} // Forward the ref here
                  type={inputType}
                  className={cn(
                    "inputDarkModeOverride border-white/10 bg-white/5 !py-[20px] text-white placeholder:text-white/50 autofill:bg-white/5",
                    (isTouched && isDirty) || isSubmitted
                      ? error
                        ? "!ring-1 !ring-primary-600"
                        : ""
                      : "",
                    type === "password" ? "pr-[30px] lg:pr-[45px]" : "",
                  )}
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
  },
);

// Set the display name for debugging purposes
FormTextField.displayName = "FormTextField";
