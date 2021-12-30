export const formatDuration = (duration: number) => {
  const formatAs2Digit = (number: number) =>
    `${number < 10 ? '0' : ''}${number}`;

  const durationFormatted = `${formatAs2Digit(
    Math.floor((duration % (60 * 60)) / 60)
  )}:${formatAs2Digit(duration % 60)}`;

  if (duration >= 60 * 60)
    return `${Math.floor(duration / (60 * 60))}:${durationFormatted}`;

  return durationFormatted;
};
