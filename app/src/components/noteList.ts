import type { KeyboardEvent } from 'react';

/**
 * Enter inside a list carries the list on: "- " after a bullet, the next number after "1. ".
 * Enter on an empty list line ends the list. Returns true when it handled the key.
 */
export function continueList(e: KeyboardEvent<HTMLTextAreaElement>, set: (v: string) => void): boolean {
  if (e.key !== 'Enter' || e.shiftKey || e.metaKey || e.ctrlKey || e.altKey || e.nativeEvent.isComposing) return false;
  const el = e.currentTarget;
  const { value, selectionStart: s, selectionEnd: end } = el;
  if (s !== end) return false;
  const lineStart = value.lastIndexOf('\n', s - 1) + 1;
  const line = value.slice(lineStart, s);
  const m = /^(\s*)([-•*]|\d+[.)])(\s+)(.*)$/.exec(line);
  if (!m) return false;
  e.preventDefault();
  const [, indent, mark, gap, rest] = m;
  if (!rest.trim()) {
    // Empty item: drop the marker and end the list.
    el.setRangeText('', lineStart, s, 'end');
  } else {
    const num = /^(\d+)([.)])$/.exec(mark);
    const marker = num ? `${Number(num[1]) + 1}${num[2]}` : mark;
    el.setRangeText(`\n${indent}${marker}${gap}`, s, s, 'end');
  }
  // The box already shows the new text with the caret in place; the state just catches up.
  set(el.value);
  return true;
}
