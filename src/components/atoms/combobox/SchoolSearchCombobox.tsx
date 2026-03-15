"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ChevronsUpDown, Loader2, School } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { preloadSekolah, searchSekolah, Sekolah } from "@/http/sekolah/search-sekolah";
import { cn } from "@/lib/utils";

interface SchoolSearchComboboxProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function SchoolSearchCombobox({
  value,
  onChange,
  disabled,
}: SchoolSearchComboboxProps) {
  const [open, setOpen] = useState(false);
  const [allSekolah, setAllSekolah] = useState<Sekolah[]>([]);
  const [displayed, setDisplayed] = useState<Sekolah[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedRef = useRef(false);

  // Load initial data the first time the popover opens
  useEffect(() => {
    if (open && !loadedRef.current) {
      loadedRef.current = true;
      setIsLoading(true);
      preloadSekolah()
        .then((data) => {
          setAllSekolah(data);
          setDisplayed(data.slice(0, 40)); // show first 40 by default
        })
        .catch(() => setDisplayed([]))
        .finally(() => setIsLoading(false));
    }

    if (open && loadedRef.current && query === "") {
      setDisplayed(allSekolah.slice(0, 40));
    }
  }, [open]);

  const handleSearch = useCallback(
    (keyword: string) => {
      setQuery(keyword);
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!keyword.trim()) {
        setDisplayed(allSekolah.slice(0, 40));
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const results = await searchSekolah(keyword, allSekolah);
          setDisplayed(results.slice(0, 40));
        } finally {
          setIsLoading(false);
        }
      }, 350);
    },
    [allSekolah],
  );

  const handleSelect = (sekolah: Sekolah) => {
    onChange(sekolah.sekolah);
    setOpen(false);
    setQuery("");
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setQuery("");
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal h-9 text-sm",
            !value && "text-muted-foreground",
          )}
        >
          <span className="truncate text-left">
            {value || "Pilih asal sekolah..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 w-[--radix-popover-trigger-width]"
        align="start"
        side="bottom"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cari nama sekolah..."
            value={query}
            onValueChange={handleSearch}
          />
          <CommandList className="max-h-52">
            {isLoading && (
              <div className="flex items-center justify-center gap-2 py-5 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Memuat data sekolah...
              </div>
            )}

            {!isLoading && displayed.length === 0 && (
              <CommandEmpty>
                {query.length > 0
                  ? "Sekolah tidak ditemukan."
                  : "Data tidak tersedia."}
              </CommandEmpty>
            )}

            {!isLoading && displayed.length > 0 && (
              <CommandGroup>
                {displayed.map((s) => (
                  <CommandItem
                    key={s.id || s.npsn}
                    value={s.sekolah}
                    onSelect={() => handleSelect(s)}
                  >
                    <School className="mr-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium truncate">
                        {s.sekolah}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {s.kabupaten_kota} · {s.bentuk}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
