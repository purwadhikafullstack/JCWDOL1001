export default function formatNumber(number) {
  const formatNumber = new Intl.NumberFormat("id-ID");
  return formatNumber.format(number);
}
