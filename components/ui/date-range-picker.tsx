"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
        Popover,
        PopoverContent,
        PopoverTrigger,
} from "@/components/ui/popover";

type DateRangePickerProps = {
        value: { from: string; to: string }; // Dates as strings in "yyyy-MM-dd" format
        onChange: (range: { from: string; to: string }) => void; // Callback to update parent state
};

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
        const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
                from: value.from ? new Date(value.from) : null,
                to: value.to ? new Date(value.to) : null,
        });

        const handleDateChange = (range: { from: Date | null; to: Date | null }) => {
                setDateRange(range);

                // Convert dates to "yyyy-MM-dd" format and update parent state
                onChange({
                        from: range.from ? format(range.from, "yyyy-MM-dd") : "",
                        to: range.to ? format(range.to, "yyyy-MM-dd") : "",
                });
        };

        return (
                <Popover>
                        <PopoverTrigger asChild>
                                <Button
                                        id="date"
                                        variant={"outline"}
                                        className={cn(
                                                "w-full justify-between text-left font-normal",
                                                !dateRange.from && "text-muted-foreground"
                                        )}
                                >
                                        {dateRange.from ? (
                                                dateRange.to ? (
                                                        `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`
                                                ) : (
                                                        format(dateRange.from, "LLL dd, y")
                                                )
                                        ) : (
                                                <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                        initialFocus
                                        mode="range"
                                        selected={dateRange}
                                        onSelect={handleDateChange}
                                        numberOfMonths={1}
                                />
                        </PopoverContent>
                </Popover>
        );
}
