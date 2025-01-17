import { Meta } from '@storybook/react';

import { Axis, LineSeries, Plot } from '../../src';
import data1 from '../data/tga1.json';
import data2 from '../data/tga2.json';
import { DEFAULT_PLOT_CONFIG } from '../utils';

export default {
  title: 'Experimental spectra/TGA',
} as Meta;

export function TgaExample() {
  return (
    <Plot {...DEFAULT_PLOT_CONFIG}>
      <LineSeries
        data={data1}
        xAxis="x"
        yAxis="y"
        lineStyle={{ stroke: 'red' }}
      />

      <LineSeries
        data={data2.map(({ x, y }) => {
          return { x, y: y * 100 };
        })}
        xAxis="x"
        yAxis="y"
        lineStyle={{ stroke: 'blue' }}
      />

      <Axis id="x" position="bottom" label="Temperature/°C" />
      <Axis
        id="y"
        position="left"
        label="Weight loss/%"
        paddingStart="10%"
        paddingEnd="10%"
      />
    </Plot>
  );
}
