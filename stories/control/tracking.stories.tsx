import { Meta } from '@storybook/react';

import {
  Axis,
  LineSeries,
  Plot,
  Annotations,
  SeriesPoint,
  useClosestPoint,
  useTracking,
} from '../../src';
import { DEFAULT_PLOT_CONFIG, PlotControllerDecorator } from '../utils';

export default {
  title: 'API/Tracking',
  decorators: [PlotControllerDecorator],
} as Meta;

const data = [
  { x: 1, y: 10 },
  { x: 2, y: 5 },
  { x: 3, y: 3 },
  { x: 4, y: 5 },
  { x: 5, y: 10 },
];

interface TrackingProps {
  data: SeriesPoint[][];
  displayMarker?: boolean;
}
function Tracking({ data, displayMarker }: TrackingProps) {
  const closestPoint = useClosestPoint();
  const tracking = useTracking();
  return (
    <div>
      <Plot {...DEFAULT_PLOT_CONFIG}>
        {data.map((subdata, i) => (
          <LineSeries
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            data={subdata}
            xAxis="x"
            yAxis="y"
            displayMarker={displayMarker}
            label={`Series ${i + 1}`}
          />
        ))}
        <Axis id="x" position="bottom" label="time [s]" />
        <Axis id="y" position="left" />

        <Annotations>
          {closestPoint.annotations}
          {tracking.annotations}
        </Annotations>
      </Plot>
      {closestPoint.coordinates}
    </div>
  );
}

export function TrackingExample() {
  return <Tracking data={[data]} displayMarker />;
}

export function TrackingBig() {
  const len = 100000;
  let data1: SeriesPoint[] = new Array(len);
  let data2: SeriesPoint[] = new Array(len);
  for (let i = 0; i < len; i++) {
    data1[i] = {
      x: i - 100,
      y: Math.abs(Math.sin((i * 4 * Math.PI) / len)),
    };
    data2[i] = {
      x: i - 100,
      y: Math.abs(Math.cos((i * 4 * Math.PI) / len)),
    };
  }
  return <Tracking data={[data1, data2]} />;
}
TrackingBig.storyName = 'Tracking on medium amount of data';
