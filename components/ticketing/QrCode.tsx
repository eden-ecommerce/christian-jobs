import { cn } from "@lib/utils";

/**
 * A decorative, deterministic QR-style code rendered from a string.
 * Not a scannable QR — it's a faithful visual stand-in for product mockups.
 */
export function QrCode({
  value,
  className,
  size = 21,
}: {
  value: string;
  className?: string;
  size?: number;
}) {
  // Seeded pseudo-random fill derived from the input string.
  let seed = 0;
  for (let i = 0; i < value.length; i++) {
    seed = (seed * 31 + value.charCodeAt(i)) >>> 0;
  }
  const rand = (n: number) => {
    // xorshift-ish deterministic generator
    let x = (seed + n * 2654435761) >>> 0;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) % 1000) / 1000;
  };

  const isFinder = (r: number, c: number) => {
    const inBox = (br: number, bc: number) =>
      r >= br && r < br + 7 && c >= bc && c < bc + 7;
    return inBox(0, 0) || inBox(0, size - 7) || inBox(size - 7, 0);
  };
  const finderOn = (r: number, c: number) => {
    const local = (br: number, bc: number) => {
      const rr = r - br;
      const cc = c - bc;
      if (rr === 0 || rr === 6 || cc === 0 || cc === 6) return true; // outer ring
      if (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4) return true; // inner block
      return false;
    };
    if (r < 7 && c < 7) return local(0, 0);
    if (r < 7 && c >= size - 7) return local(0, size - 7);
    if (r >= size - 7 && c < 7) return local(size - 7, 0);
    return false;
  };

  const cells: boolean[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (isFinder(r, c)) {
        cells.push(finderOn(r, c));
      } else {
        cells.push(rand(r * size + c) > 0.55);
      }
    }
  }

  return (
    <div
      className={cn("grid bg-card p-1", className)}
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      role="img"
      aria-label="QR code for ticket check-in"
    >
      {cells.map((on, i) => (
        <span
          key={i}
          className={on ? "bg-foreground" : "bg-card"}
          style={{ aspectRatio: "1 / 1" }}
        />
      ))}
    </div>
  );
}
