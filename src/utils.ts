export const fmtSize = (b: number): string => {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(2)} MB`;
};

export const estCompressed = (b: number, q: number): number =>
  Math.round(b * (0.15 + (q / 100) * 0.75));
