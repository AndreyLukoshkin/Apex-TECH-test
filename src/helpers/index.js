export const timeToLocal = (time) => {
  const utcTimestamp = time
  const date = new Date(utcTimestamp)
  const localTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localTime.getTime()
}
