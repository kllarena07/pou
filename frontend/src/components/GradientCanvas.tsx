'use client';

import { useEffect, useRef } from 'react';
import { Gradient } from '../gradient';

export default function GradientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const gradient = new Gradient();
    gradient.initGradient('#gradient-canvas');
  }, []);

  return (
    <canvas
      id="gradient-canvas"
      data-js-darken-top
      data-transition-in
      ref={canvasRef}
    />
  );
} 