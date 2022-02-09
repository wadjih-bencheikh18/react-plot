import { CSSProperties, useState } from 'react';

import { Group } from '../components/Annotations/Group';
import {
  AnnotationRectangleProps,
  Rectangle,
} from '../components/Annotations/Rectangle';
import { AnnotationTextProps, Text } from '../components/Annotations/Text';
import { usePlotEvents } from '../contexts/plotController/plotControllerContext';

import { DualAxisOptions } from './types';

export interface UseTrackingOptions extends DualAxisOptions {
  textStyle?: CSSProperties;
  rectStyle?: CSSProperties;
}
type Positions = Record<string, number>;

export function useTracking(options: UseTrackingOptions = {}) {
  const [hover, setHover] = useState<Positions | null>(null);
  const {
    horizontalAxisId = 'x',
    verticalAxisId = 'y',
    rectStyle,
    textStyle,
  } = options;

  usePlotEvents({
    onMouseMove({ coordinates }) {
      setHover(coordinates);
    },
    onMouseLeave() {
      setHover(null);
    },
  });

  const rectProps: Partial<AnnotationRectangleProps> = {
    style: { ...rectStyle, stroke: 'black' },
  };
  const textProps: Partial<AnnotationTextProps> = {
    style: textStyle,
  };

  if (!hover) return { annotations: null };

  const annotations = (
    <Group x={hover[horizontalAxisId]} y={hover[verticalAxisId]}>
      <Text x="200" y="0" {...textProps}>
        <tspan x="10" dy="1.2em">
          VALUES
        </tspan>
        {Object.keys(hover).map((key) => (
          <tspan x="20" dy="1.2em" key={key}>
            {key}: {Math.round(hover[key] * 100) / 100}
          </tspan>
        ))}
      </Text>
      <Rectangle color="none" x1="0" x2="85" y1="0" y2="70" {...rectProps} />
    </Group>
  );

  return { annotations };
}
