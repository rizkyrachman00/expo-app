// Format date
export const formatDate = (date: Date) => date.toISOString().split("T")[0];

// Get today
export const getToday = () => new Date();

// Get date 1 month later
export const getOneMonthLater = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date;
};

// Generate marked dates calendar modal
export const generateMarkedDates = (start: string, end: string) => {
  const dates: Record<string, any> = {};

  let current = new Date(start);
  const endDate = new Date(end);

  while (current <= endDate) {
    const dateStr = formatDate(current);
    dates[dateStr] = {
      color: "#60a5fa",
      textColor: "white",
    };
    current.setDate(current.getDate() + 1);
  }

  dates[start] = {
    ...dates[start],
    startingDay: true,
  };

  dates[end] = {
    ...dates[end],
    endingDay: true,
  };

  return dates;
};
