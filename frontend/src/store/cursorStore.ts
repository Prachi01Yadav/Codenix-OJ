import { create } from 'zustand';

interface CursorState {
  x: number;
  y: number;
  isVisible: boolean;
  setCursor: (x: number, y: number) => void;
  setVisible: (v: boolean) => void;
}

export const useCursorStore = create<CursorState>((set) => ({
  x: 0,
  y: 0,
  isVisible: false,
  setCursor: (x, y) => set({ x, y, isVisible: true }),
  setVisible: (v) => set({ isVisible: v }),
}));
