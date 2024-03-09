import { isValidDateString } from "@/lib/utils";
import { subDays } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { DateRange } from "react-day-picker";

// Custom hook to get the from and to dates from the URL search parameters
function useDateRangeFromSearchParams() {
    const searchParams = useSearchParams();
    const today = new Date();
    // Parse the date string from the URL search parameters
    const dateString = searchParams.get("date");
    let initialDate: DateRange = { from: subDays(today, 30), to: today };

    if (dateString) {
        const [fromDateString, toDateString] = dateString.split(".");
        const fromDate = isValidDateString(fromDateString, today);
        const toDate = isValidDateString(toDateString, today);
        initialDate = { from: fromDate, to: toDate };
    }

    const result = useMemo(() => ({
        fromDate: initialDate.from,
        toDate: initialDate.to,
        hasDateParams: !!dateString
    }), [dateString]);
    return result;
}

export default useDateRangeFromSearchParams;
