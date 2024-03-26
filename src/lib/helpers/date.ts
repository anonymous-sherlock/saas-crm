import { endOfDay, format, isValid, parse, startOfDay } from "date-fns";
import { DateRange } from "react-day-picker";

// Helper function to check if a day string is valid
export const isValidDay = (value: string): boolean => {
  const validDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  return validDays.includes(value.toLowerCase());
};

// Helper function to parse and validate a date string
export const parseAndValidateDate = (dateString: string | undefined): Date | undefined => {
  if (!dateString) return undefined;
  const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());
  return isValid(parsedDate) ? parsedDate : undefined;
};

// Function to get date range from a date string
export const getDateFromParams = (date: string | undefined): { from: Date | undefined; to: Date | undefined } => {
  const [fromString = "", toString = ""] = date ? date.split(".") : [];
  const from = parseAndValidateDate(fromString);
  const to = parseAndValidateDate(toString);
  const startDay = from ? startOfDay(from) : undefined;
  const endDay = to ? endOfDay(to) : startDay ? endOfDay(startDay) : undefined;
  return { from: startDay, to: endDay };
};

// Function to format a date range for URL params
export const formatDateRangeForParams = (dateRange: DateRange | undefined): string => {
  if (!dateRange) return "";
  const { from, to } = dateRange;
  const fromDate = from ? format(from, "yyyy-MM-dd") : "";
  const toDate = to ? `.${format(to, "yyyy-MM-dd")}` : "";
  return `${fromDate}${toDate}`;
};
