import { Meta } from '@storybook/react';
import { xyToXYObject } from 'ml-spectra-processing';

import { Annotations, LineSeries, Plot, useCrossHair } from '../../src';
import measurement from '../data/measurement.json';
import { DEFAULT_PLOT_CONFIG, PlotControllerDecorator } from '../utils';

export default {
  title: 'Examples/Measurement',
  decorators: [PlotControllerDecorator],
  args: { xAxis: 'x', yAxis: 'y' },
} as Meta<MeasurementProps>;
interface MeasurementProps {
  xAxis: 'x' | 'y' | 't' | 'a';
  yAxis: 'x' | 'y' | 't' | 'a';
}
export function Measurement(props: MeasurementProps) {
  const { xAxis = 'x', yAxis = 'y' } = props;
  const { data } = measurement;
  const {
    variables: { [xAxis]: x, [yAxis]: y },
  } = data[0];
  const crossHair = useCrossHair({
    horizontalAxisId: xAxis,
    verticalAxisId: yAxis,
  });
  return (
    <Plot {...DEFAULT_PLOT_CONFIG}>
      <LineSeries
        data={xyToXYObject({
          x: x.data,
          y: y.data,
        })}
      />
      <Annotations>{crossHair.annotations}</Annotations>
    </Plot>
  );
}
