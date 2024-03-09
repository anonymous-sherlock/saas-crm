export const isValidDay = (value: string) => {
    const normalizedValue = value.toLowerCase();
    const validDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    return validDays.includes(normalizedValue);
  };