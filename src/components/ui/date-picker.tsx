import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  disabled?: boolean;
}

export function DatePicker({ date, onDateChange, disabled }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          data-empty={!date}
          disabled={disabled}
          className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          {date ? (
            format(date, "PPP", { locale: es })
          ) : (
            <span>Selecciona una fecha</span>
          )}
          <ChevronDownIcon data-icon="inline-end" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          locale={es}
          selected={date}
          onSelect={(selected) => {
            onDateChange(selected);
            setOpen(false);
          }}
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  );
}
