import * as React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";

interface YearPickerProps {
  value?: number | null;
  onChange: (year: number | null) => void;
  minYear?: number;
  maxYear?: number;
  placeholder?: string;
  className?: string;
}

export function YearPicker({
  value,
  onChange,
  minYear = 1980,
  maxYear = new Date().getFullYear(),
  placeholder = "Selecione o ano",
  className = "",
}: YearPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const years = React.useMemo(() => {
    const arr = [];
    for (let y = maxYear; y >= minYear; y--) arr.push(y);
    return arr;
  }, [minYear, maxYear]);
  const filtered = years.filter(y => y.toString().includes(search));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${className}`}
        >
          {value ? value : <span className="text-muted-foreground">{placeholder}</span>}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-48">
        <div className="p-2">
          <Input
            placeholder="Buscar ano..."
            value={search}
            onChange={e => setSearch(e.target.value.replace(/\D/g, ""))}
            className="mb-2"
            maxLength={4}
          />
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="text-center text-muted-foreground py-4 text-sm">Nenhum ano encontrado</div>
            )}
            {filtered.map(y => (
              <Button
                key={y}
                variant={y === value ? "secondary" : "ghost"}
                className="w-full justify-start px-2 py-1 rounded-none"
                onClick={() => {
                  onChange(y);
                  setOpen(false);
                  setSearch("");
                }}
              >
                {y}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} 