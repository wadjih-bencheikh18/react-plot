import { CSSProperties, useState } from 'react';

import { AnnotationShapeName } from '../components/Annotations/Annotation';
import { AnnotationRectangleProps } from '../components/Annotations/Rectangle';
import { Shape } from '../components/Annotations/Shape';
import { ClosestInfoResult } from '../components/Tracking';
import { usePlotEvents } from '../contexts/plotController/plotControllerContext';

export interface UseClosestPointOptions {
  textStyle?: CSSProperties;
  shapeStyle?: CSSProperties;
  shape?: AnnotationShapeName;
  shapeSize?: number;
}

export function useClosestPoint(options: UseClosestPointOptions = {}) {
  const [closest, setClosest] = useState<ClosestInfoResult | null>(null);
  const { shapeStyle, textStyle, shape = 'circle', shapeSize = 5 } = options;

  usePlotEvents({
    onClick({ getClosest }) {
      setClosest(getClosest('euclidean'));
    },
  });

  const shapeProps: Partial<AnnotationRectangleProps> = {
    style: shapeStyle,
  };
  if (!closest) return { annotations: null, coordinates: null };

  const annotations = Object.entries(closest).map(([id, info]) => (
    <Shape
      key={id}
      shape={shape}
      x={info.point.x}
      y={info.point.y}
      size={shapeSize}
      {...shapeProps}
    />
  ));
  const coordinates = (
    <div style={textStyle}>
      <b>Closest point</b>
      {Object.keys(closest).map((key) => (
        <p key={key}>
          <b>{closest[key].label}</b>
          <span>
            {' x: '}
            {Math.round((closest[key].point.x || 0) * 100) / 100}
          </span>
          <span>
            {' y: '}
            {Math.round((closest[key].point.y || 0) * 100) / 100}
          </span>
        </p>
      ))}
    </div>
  );
  return { annotations, coordinates };
}
