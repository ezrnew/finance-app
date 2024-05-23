import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  data: string[];
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  label?: string;
}
export function InputDropdown({
  data,
  value,
  setValue,
  label,
  placeholder,
}: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size={"sm"}
          role="combobox"
          aria-expanded={open}
          aria-label="Select Asset"
          className="w-[196px] h-10 !ml-0 justify-between dark:text-white"
        >
          {value ? data.find((item) => item === value) : label || ""}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[196px] p-0">
        <Command>
          <CommandInput placeholder={placeholder || ""} />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  className="cursor-pointer"
                  key={item}
                  value={item}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {item}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
