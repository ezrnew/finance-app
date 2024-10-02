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

interface InputDropdownProps<T> {
  data: T[];
  value: T | null;
  setValue: React.Dispatch<React.SetStateAction<T | null>>;
  placeholder?: string;
  label?: string;
}
export function InputDropdown<
  T extends string | { name: string; id?: string },
>({ data, value, setValue, label, placeholder }: InputDropdownProps<T>) {
  const [open, setOpen] = React.useState(false);

  const getItemName = (item: T) => {
    if (typeof item === "string") return item;
    return item.name;
  };
  const getItemId = (item: T) => {
    if (typeof item === "string") return item;

    return item.id ? item.id : item.name;
  };

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
          {value ? getItemName(value) : label || ""}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[196px] p-0">
        <Command>
          {data.length > 5 ? (
            <CommandInput placeholder={placeholder || ""} />
          ) : null}
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  className="cursor-pointer"
                  key={getItemId(item)}
                  value={getItemId(item)}
                  onSelect={(currentValue) => {
                    const selectedItem = data.find(
                      (i) => getItemId(i) === currentValue,
                    );
                    setValue(selectedItem || null);
                    setOpen(false);
                  }}
                >
                  {getItemName(item)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
