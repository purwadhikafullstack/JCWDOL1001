export function formatDate(date) {
    const dateObj = new Date(date);//"2023-12-31"
    const options = { month: "long", day: "numeric", year: "numeric" };
    return dateObj.toLocaleString("en-US", options);
}

export function formatDateValue(date) {
    const dateObj = new Date(date)
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth()+1).padStart(2,"0")
    const day = String(dateObj.getDate()).padStart(2,"0")
    return `${year}-${month}-${day}`
}