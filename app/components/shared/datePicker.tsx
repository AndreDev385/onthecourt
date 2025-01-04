import { es } from "date-fns/locale";
import { addMonths, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn, DATE_FORMAT } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import React from "react";

export function DatePicker({ name, defaultValue }: Props) {
  const DEFAULT_EXPERIENCE_DATE = addMonths(new Date(), 1);
  const [date, setDate] = React.useState<Date>(
    defaultValue ?? DEFAULT_EXPERIENCE_DATE
  );

  return (
    <>
      <input
        type="date"
        className="hidden"
        name={name}
        value={format(date, DATE_FORMAT)}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "PPP", { locale: es })
            ) : (
              <span>Selecciona una fecha</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate as any}
            initialFocus
            disabled={(date) => date < new Date()}
          />
        </PopoverContent>
      </Popover>
    </>
  );
}

type Props = {
  name: string;
  defaultValue?: Date;
};
