import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
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
  data: { name: string; type: string; quantity?: number }[];
  value: { name: string; type: string; quantity?: number };
  setValue: React.Dispatch<
    React.SetStateAction<{
      name: string;
      type: string;
      quantity?: number;
    } | null>
  >;
  placeholder?: string;
  label?: string;
}
export function InputDropdownCustom({
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
          className="w-[200px] justify-between dark:text-white"
        >
          {value ? value.name : ""}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder || ""} />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  className="cursor-pointer"
                  key={item.name}
                  value={item.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue === item.name ? item : null);

                    setOpen(false);
                  }}
                >
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
