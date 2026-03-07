import { useState, useCallback } from 'react';
import type { CanvasState, CanvasMode } from '../types';

export function useCanvasState() {
  const [canvasState, setCanvasState] = useState<CanvasState>({ mode: 'idle', data: null });

  const setCanvas = useCallback((mode: CanvasMode, data: any = null) => {
    setCanvasState({ mode, data });
  }, []);

  const resetCanvas = useCallback(() => {
    setCanvasState({ mode: 'idle', data: null });
  }, []);

  return { canvasState, setCanvas, resetCanvas };
}
