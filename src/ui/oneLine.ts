/*
  Split a caption into pieces that each fit on ONE line, so text is shown one line at a time.
  Breaks prefer sentence and comma boundaries, then fall back to whole words.
  Widths are measured with the real font on a canvas (works for Bangla too).
*/

let ctx: CanvasRenderingContext2D | null = null;
function measure(text: string, font: string) {
  if (!ctx) ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return text.length * 9;
  ctx.font = font;
  return ctx.measureText(text).width;
}

export function splitIntoLines(text: string, maxPx: number, font: string): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (cur && measure(next, font) > maxPx) {
      lines.push(cur);
      cur = w;
    } else {
      cur = next;
      // end a line early at a sentence end, if the line already has some words
      if (/[.!?।]$/.test(w) && measure(cur, font) > maxPx * 0.45) { lines.push(cur); cur = ''; }
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

/** How long a piece stays on screen, so all pieces together roughly match the reading time of the line. */
export function pieceMs(piece: string) {
  const words = piece.split(/\s+/).length;
  return Math.max(1100, words * 380 + 250);
}
