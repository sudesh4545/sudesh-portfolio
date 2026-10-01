import { useEffect } from 'react';

let activeLocks = 0;
let savedHtmlOverflow = '';
let savedHtmlOverscroll = '';
let savedBodyStyles: Partial<Record<'overflow' | 'overscrollBehavior' | 'paddingRight', string>> = {};

function lockPageScroll() {
  const html = document.documentElement;
  const { body } = document;

  if (activeLocks === 0) {
    savedHtmlOverflow = html.style.overflow;
    savedHtmlOverscroll = html.style.overscrollBehavior;
    savedBodyStyles = {
      overflow: body.style.overflow,
      overscrollBehavior: body.style.overscrollBehavior,
      paddingRight: body.style.paddingRight,
    };

    const scrollbar = window.innerWidth - html.clientWidth;
    html.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    body.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
  }

  activeLocks += 1;
}

function unlockPageScroll() {
  activeLocks = Math.max(0, activeLocks - 1);
  if (activeLocks > 0) return;

  const html = document.documentElement;
  const { body } = document;
  html.style.overflow = savedHtmlOverflow;
  html.style.overscrollBehavior = savedHtmlOverscroll;
  Object.entries(savedBodyStyles).forEach(([property, value]) => {
    body.style[property as keyof typeof savedBodyStyles] = value ?? '';
  });
}

/**
 * Freezes background scrolling while the mobile menu / project modal is open,
 * padding for the scrollbar so the layout doesn't jump.
 */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    lockPageScroll();
    return unlockPageScroll;
  }, [locked]);
}
