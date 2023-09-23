const toCamelCase = (string) =>{
  const words = string.split(" ")
  const camelCase = words.map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join("")
  return camelCase
}

module.exports = {
  toCamelCase
}