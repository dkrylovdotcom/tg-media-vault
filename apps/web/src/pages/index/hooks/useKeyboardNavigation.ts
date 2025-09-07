import { useEffect } from 'react';

interface Options {
  onLeft?: () => void;
  onRight?: () => void;
  onEscape?: () => void;
  active?: boolean;
}

export const useKeyboardNavigation = ({ onLeft, onRight, onEscape, active = true }: Options) => {
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && onLeft) {
        onLeft();
      } else if (e.key === 'ArrowRight' && onRight) {
        onRight();
      } else if (e.key === 'Escape' && onEscape) {
        onEscape();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onLeft, onRight, onEscape, active]);
};
