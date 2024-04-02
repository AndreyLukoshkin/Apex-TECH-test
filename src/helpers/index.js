export const timeToLocal = (time) => {
  const utcTimestamp = time
  const date = new Date(utcTimestamp)
  const localTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localTime.getTime()
}
export const formatTimeStampToFullDate = (timestamp) => {
  const date = new Date(timestamp)
  const localTime = new Date(date.getTime() - date.getTimezoneOffset())
  const formattedDate = `${localTime.getDate()}.${
    localTime.getMonth() + 1
  }.${localTime.getFullYear()} ${localTime.getHours()}:${
    localTime.getMinutes() < 10 ? '0' : ''
  }${localTime.getMinutes()}`
  return formattedDate
}
