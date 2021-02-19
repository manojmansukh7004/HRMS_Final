export default function (date, isSeconds) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours %= 12;
  hours = hours || 12;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const seconds = date.getSeconds();
  const strTime = `${hours}:${minutes}${isSeconds ? `:${seconds}` : null}`;
  return strTime;
}
