import { useEffect } from 'react';

let activeLocks = 0;
let lockedScrollY = 0;
let savedHtmlOverflow = '';
let savedHtmlOverscroll = '';
let savedBodyStyles: Partial<Record<'overflow' | 'overscrollBehavior' | 'position' | 'top' | 'left' | 'right' | 'width' | 'paddingRight', string>> = {};

function lockPageScroll() {
  const html = document.documentElement;
  const { body } = document;

  if (activeLocks === 0) {
    lockedScrollY = window.scrollY;
    savedHtmlOverflow = html.style.overflow;
    savedHtmlOverscroll = html.style.overscrollBehavior;
    savedBodyStyles = {
      overflow: body.style.overflow,
      overscrollBehavior: body.style.overscrollBehavior,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };

    const scrollbar = window.innerWidth - html.clientWidth;
    html.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    body.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';
    body.style.position = 'fixed';
    body.style.top = `-${lockedScrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
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

  const previousScrollBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  window.scrollTo(0, lockedScrollY);
  html.style.scrollBehavior = previousScrollBehavior;
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
