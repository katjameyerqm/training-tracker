// Utility functions for date formatting

export function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export function formatDateForInput(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getWeekDates(date = new Date()) {
  const curr = new Date(date);
  const first = curr.getDate() - curr.getDay() + 1; // Monday
  const dates = [];
  
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(curr);
    nextDate.setDate(first + i);
    dates.push(nextDate.toISOString().split('T')[0]);
  }
  
  return dates;
}

export function getWeekRange(date = new Date()) {
  const curr = new Date(date);
  const first = curr.getDate() - curr.getDay() + 1;
  const last = first + 6;
  
  const monday = new Date(curr);
  monday.setDate(first);
  
  const sunday = new Date(curr);
  sunday.setDate(last);
  
  return {
    start: formatDate(monday.toISOString()),
    end: formatDate(sunday.toISOString())
  };
}

export function getDayName(dateString) {
  const date = new Date(dateString);
  const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  return days[date.getDay()];
}

export function isToday(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}
