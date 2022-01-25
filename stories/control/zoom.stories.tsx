import { Meta } from '@storybook/react';
import { useRef, useState } from 'react';

import { Axis, LineSeries, Plot, Annotations, SeriesPoint } from '../../src';
import { Rectangle } from '../../src/components/Annotations/Rectangle';
import { toNumber } from '../../src/utils';
import { DEFAULT_PLOT_CONFIG } from '../utils';

export default {
  title: 'Examples/Zoom',
} as Meta;

const data = [
  { x: 1, y: 10 },
  { x: 2, y: 5 },
  { x: 3, y: 3 },
  { x: 4, y: 5 },
  { x: 5, y: 10 },
  { x: 8, y: 5 },
  { x: 9, y: 1 },
];

interface Positions {
  position?: {
    x1: number | Date;
    x2: number | Date;
  } | null;
  min?: number;
  max?: number;
}

interface ZoomProps {
  data: SeriesPoint[];
  displayMarker?: boolean;
}
function Zoom({ data, displayMarker }: ZoomProps) {
  const [{ position, min, max }, setPositions] = useState<Positions | null>({
    position: null,
    min: undefined,
    max: undefined,
  });
  let click = useRef<boolean>(false);
  return (
    <div>
      <Plot
        {...DEFAULT_PLOT_CONFIG}
        onMouseDown={({ coordinates: { x } }) => {
          setPositions({
            position: {
              x1: x,
              x2: x,
            },
            min: min,
            max: max,
          });
          click.current = true;
        }}
        onMouseUp={() => {
          click.current = false;
          if (position.x1 !== position.x2) {
            setPositions({
              position: null,
              min: Math.min(toNumber(position.x1), toNumber(position.x2)),
              max: Math.max(toNumber(position.x1), toNumber(position.x2)),
            });
          }
        }}
        onMouseMove={({ coordinates: { x } }) => {
          if (click.current) {
            setPositions(({ position }) => ({
              position: {
                x1: position ? position.x1 : x,
                x2: x,
              },
              min: min,
              max: max,
            }));
          }
        }}
        onMouseLeave={() => {
          setPositions({
            position: null,
            min: min,
            max: max,
          });
          click.current = false;
        }}
        onDoubleClick={() => {
          setPositions({ min: undefined, max: undefined });
        }}
      >
        <LineSeries
          data={data}
          xAxis="x"
          yAxis="y"
          displayMarker={displayMarker}
        />
        <Annotations>
          {position && (
            <Rectangle
              color="red"
              style={{ fillOpacity: 0.2, stroke: 'red' }}
              x1={position.x1}
              y1="540"
              x2={position.x2}
              y2="0"
            />
          )}
        </Annotations>
        <Axis min={min} max={max} id="x" position="bottom" label="time [s]" />
        <Axis id="y" position="left" />
      </Plot>
    </div>
  );
}

export function ZoomExample() {
  return <Zoom data={data} displayMarker />;
}
