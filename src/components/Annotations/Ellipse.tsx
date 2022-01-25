import { SVGProps } from 'react';

import { useEllipsePosition } from '../../hooks';

export interface AnnotationEllipseProps
  extends Omit<
    SVGProps<SVGEllipseElement>,
    'x1' | 'x2' | 'y1' | 'y2' | 'cx' | 'cy' | 'rx' | 'ry' | 'x' | 'y'
  > {
  x: number | string | Date;
  y: number | string | Date;
  rx: number | string | Date;
  ry: number | string | Date;
}

export function Ellipse(props: AnnotationEllipseProps) {
  const { x, y, rx: oldRx, ry: oldRy, color, ...otherProps } = props;

  const { cx, cy, rx, ry } = useEllipsePosition({
    cx: x,
    cy: y,
    rx: oldRx,
    ry: oldRy,
  });

  return (
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={color} {...otherProps} />
  );
}
