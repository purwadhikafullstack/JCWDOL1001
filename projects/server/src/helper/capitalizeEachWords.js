const capitalizeEachWords = (string) => {
  if (!string) {
    return;
  }

  const words = string?.toLowerCase().split(" ");
  const capitalizeWords = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return capitalizeWords;
};

module.exports = {
  capitalizeEachWords
}
