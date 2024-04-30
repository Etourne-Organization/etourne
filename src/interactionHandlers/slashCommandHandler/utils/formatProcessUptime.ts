const formatProcessUptime = (uptime: number): string => {
  const date = new Date(uptime * 1000);

  const days = date.getUTCDate() - 1;
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  const timeSegments: string[] = [];

  if (days) timeSegments.push(`${days} day${days !== 1 ? "s" : ""}`);
  if (hours) timeSegments.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  if (minutes) timeSegments.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
  if (seconds) timeSegments.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);

  return timeSegments.join(", ");
};

export default formatProcessUptime;
