export const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  
  const options = { 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  
  return date.toLocaleString(undefined, options);
};

export const isToday = (dateString) => {
  const today = new Date().toISOString().split('T')[0];
  return dateString === today;
};

export const isTomorrow = (dateString) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  return dateString === tomorrowStr;
};

export const getRelativeDateLabel = (dateString) => {
  if (isToday(dateString)) return 'Today';
  if (isTomorrow(dateString)) return 'Tomorrow';
  return formatDate(dateString);
};

export const groupAppointmentsByDate = (appointments) => {
  return appointments.reduce((groups, appointment) => {
    const date = appointment.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(appointment);
    return groups;
  }, {});
};