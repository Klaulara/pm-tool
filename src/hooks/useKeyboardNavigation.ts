import { useEffect, useRef, RefObject } from 'react';

/**
 * Hook to trap focus within a modal/dialog
 * Manages Tab/Shift+Tab navigation within focusable elements
 */
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Store element that had focus before modal opened
    const previouslyFocusedElement = document.activeElement as HTMLElement;

    // Focus first element
    firstElement?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    return () => {
      container.removeEventListener('keydown', handleTabKey);
      // Restore focus when modal closes
      previouslyFocusedElement?.focus();
    };
  }, [isActive]);

  return containerRef;
};

/**
 * Hook to handle keyboard navigation for lists
 * Supports Arrow Up/Down navigation
 */
export const useKeyboardNavigation = (itemCount: number, onSelect?: (index: number) => void) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedIndexRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const { key } = e;

      switch (key) {
        case 'ArrowDown':
          e.preventDefault();
          selectedIndexRef.current = Math.min(selectedIndexRef.current + 1, itemCount - 1);
          focusItem(selectedIndexRef.current);
          break;

        case 'ArrowUp':
          e.preventDefault();
          selectedIndexRef.current = Math.max(selectedIndexRef.current - 1, 0);
          focusItem(selectedIndexRef.current);
          break;

        case 'Home':
          e.preventDefault();
          selectedIndexRef.current = 0;
          focusItem(0);
          break;

        case 'End':
          e.preventDefault();
          selectedIndexRef.current = itemCount - 1;
          focusItem(itemCount - 1);
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          onSelect?.(selectedIndexRef.current);
          break;
      }
    };

    const focusItem = (index: number) => {
      const items = containerRef.current?.querySelectorAll<HTMLElement>('[role="option"], [role="menuitem"], button, a');
      items?.[index]?.focus();
    };

    const container = containerRef.current;
    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [itemCount, onSelect]);

  return containerRef;
};

/**
 * Hook to handle Escape key press
 */
export const useEscapeKey = (onEscape: () => void, isActive: boolean = true) => {
  useEffect(() => {
    if (!isActive) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onEscape();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onEscape, isActive]);
};

/**
 * Hook to handle Enter key press on an element
 */
export const useEnterKey = (onEnter: () => void, ref?: RefObject<HTMLElement>) => {
  useEffect(() => {
    const element = ref?.current || document;

    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onEnter();
      }
    };

    element.addEventListener('keydown', handleEnter as EventListener);

    return () => {
      element.removeEventListener('keydown', handleEnter as EventListener);
    };
  }, [onEnter, ref]);
};
