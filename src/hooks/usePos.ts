import { useState } from 'react';

export interface PositionType {
  x: number;
  y: number;
}

export type DispatchPosition = (x: number, y: number) => void;

const usePos = (
  initialValue?: PositionType,
): [PositionType, DispatchPosition] => {
  const [posX, setPosX] = useState(initialValue ? initialValue.x : 0);
  const [posY, setPosY] = useState(initialValue ? initialValue.y : 0);

  return [
    { x: posX, y: posY },
    (x: number, y: number) => {
      if (x !== posX) setPosX(x);
      if (y !== posY) setPosY(y);
    },
  ];
};

export default usePos;
