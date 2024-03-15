import { isValidDateString } from "@/lib/utils";
import { subDays } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { DateRange } from "react-day-picker";

// Custom hook to get the from and to dates from the URL search parameters
function useDateRangeFromSearchParams() {
  const searchParams = useSearchParams();
  const today = useMemo(() => new Date(), []); // Memoize today's date

  const initialDate: DateRange = useMemo(() => {
    const dateString = searchParams.get("date");
    if (!dateString) {
      return { from: subDays(today, 30), to: today };
    }

    const [fromDateString, toDateString] = dateString.split(".");
    const fromDate = isValidDateString(fromDateString, today);
    const toDate = isValidDateString(toDateString, today);
    return { from: fromDate, to: toDate };
  }, [searchParams, today]);

  const result = useMemo(
    () => ({
      fromDate: initialDate.from,
      toDate: initialDate.to,
      hasDateParams: !!searchParams.get("date"),
    }),
    [initialDate, searchParams],
  );

  return result;
}

export default useDateRangeFromSearchParams;
