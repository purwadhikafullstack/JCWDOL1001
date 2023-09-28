export function formatDate(date) {
    const dateObj = new Date(date);//"2023-12-31"
    const options = { month: "long", day: "numeric", year: "numeric" };
    return dateObj.toLocaleString("id-ID", options);
}

export function formatDateValue(date) {
    const dateObj = new Date(date)
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth()+1).padStart(2,"0")
    const day = String(dateObj.getDate()).padStart(2,"0")
    return `${year}-${month}-${day}`
}

export function formatTime(date) {
    const dateObj = new Date(date)
    const time = dateObj.getHours() + ':' + dateObj.getMinutes()
    return `${time}`
}

export function formatDateWithTime(date) {
    const dateObj = new Date(date)
    const options = { month: "long", day: "numeric", year: "numeric" }
    const time = dateObj.getHours() + ':' + dateObj.getMinutes()
    return `${dateObj.toLocaleString("id-ID", options)} ${time}`
}