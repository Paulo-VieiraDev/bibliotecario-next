"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface ComboBoxProps<T> {
  items: T[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  displayValue: (item: T) => string;
  disabled?: boolean;
}

// Função para remover acentos
function normalize(str: string) {
  return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export function ComboBox<T extends { id: string }>({
  items,
  value,
  onChange,
  placeholder,
  displayValue,
  disabled,
}: ComboBoxProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const selected = items.find((item) => item.id === value);

  // Filtro manual dos itens conforme o termo de busca
  const filteredItems = search
    ? items.filter((item) => {
        const itemText = normalize(displayValue(item));
        return search
          .split(/\s+/)
          .every((word) => itemText.includes(normalize(word)));
      })
    : items;
  const itemsToShow = filteredItems.slice(0, 3);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full min-w-0 justify-between min-h-[44px]"
          disabled={disabled}
        >
          {selected ? displayValue(selected) : placeholder || "Selecione..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput
            placeholder={placeholder || "Buscar..."}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            <CommandGroup>
              {itemsToShow.map((item) => (
                <CommandItem
                  key={item.id}
                  value={displayValue(item)}
                  onSelect={() => {
                    onChange(item.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {displayValue(item)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 