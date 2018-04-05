import dc from "distinct-colors";

export default function findMeColors(n) {
  return dc({ count: n, lightMin: 50 });
}
