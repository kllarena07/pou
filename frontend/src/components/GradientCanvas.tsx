'use client';

import { useEffect, useRef } from 'react';
import { Gradient } from '../gradient';

interface GradientCanvasProps {
  gradientColor1: string;
  gradientColor2: string;
  gradientColor3: string;
}

export default function GradientCanvas({ gradientColor1, gradientColor2, gradientColor3 }: GradientCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gradient: any = new Gradient();
    gradient.initGradient('#gradient-canvas');
  }, []);

  return (
    <canvas
      id="gradient-canvas"
      data-js-darken-top
      data-transition-in
      ref={canvasRef}
      style={{
        '--gradient-color-1': gradientColor1,
        '--gradient-color-2': gradientColor2,
        '--gradient-color-3': gradientColor3,
      } as React.CSSProperties}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
} 