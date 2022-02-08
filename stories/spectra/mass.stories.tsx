import { Meta } from '@storybook/react';
import { IsotopicDistribution, getBestPeaks } from 'mass-tools';
import { xyToXYObject } from 'ml-spectra-processing';
import { useMemo } from 'react';

import {
  Annotations,
  Axis,
  BarSeries,
  LineSeries,
  Plot,
  useAxisZoom,
} from '../../src';
import { Group } from '../../src/components/Annotations/Group';
import { Line } from '../../src/components/Annotations/Line';
import { Text } from '../../src/components/Annotations/Text';
import { useScrollZoom } from '../../src/hooks/useScrollZoom';
import data from '../data/mass.json';
import { DEFAULT_PLOT_CONFIG, PlotControllerDecorator } from '../utils';

export default {
  title: 'Experimental spectra/Mass',
  decorators: [PlotControllerDecorator],
} as Meta;

export function MassExample() {
  return (
    <Plot {...DEFAULT_PLOT_CONFIG}>
      <BarSeries
        data={data}
        xAxis="x"
        yAxis="y"
        lineStyle={{ stroke: 'blue' }}
      />
      <Axis id="x" position="bottom" label="Mass [m/z]" />
      <Axis
        id="y"
        position="left"
        label="Relative intensity [%]"
        paddingEnd={0.1}
      />
    </Plot>
  );
}

interface AdvancedMassExampleProps {
  mf: string;
}
export function AdvancedMassExample({ mf }: AdvancedMassExampleProps) {
  const { annotations, min, max } = useAxisZoom();
  useScrollZoom();
  // we calculate the 'profile' and 'centroid', this should be done only if `mf` is changing
  const isotopicDistribution = new IsotopicDistribution(mf, {
    ensureCase: true,
  });

  const profileXY = isotopicDistribution.getGaussian({
    maxValue: 100,
  });
  const profile = xyToXYObject(profileXY);

  const centroid = isotopicDistribution.getTable({
    maxValue: 100,
  });

  // calculating the bestPeaks should be done each time the zoom (from, to) is changing and should create the new annotations
  const bestPeaks = useMemo(
    () =>
      getBestPeaks(centroid, {
        from: min,
        to: max,
        limit: 5,
        numberSlots: 10,
        threshold: 0.01,
      }),
    [centroid, max, min],
  );

  return (
    <div>
      <Plot
        {...DEFAULT_PLOT_CONFIG}
        // svgStyle={{
        //   cursor: `${alt ? (click.current ? 'grabbing' : 'grab') : ''}`,
        // }}
        // TODO: rewrite this differently.
        // onKeyDown={({
        //   event: { altKey },
        //   x: { max: maxX, min: minX },
        //   y: { max: maxY, min: minY },
        // }) => {
        //   if (!click.current) {
        //     setPositions((positions) => ({
        //       ...positions,
        //       alt: altKey,
        //       maxX,
        //       minX,
        //       maxY,
        //       minY,
        //     }));
        //   }
        // }}
        // onKeyUp={({ event: { altKey } }) => {
        //   if (!click.current || alt) {
        //     click.current = false;
        //     setPositions((positions) => ({ ...positions, alt: altKey }));
        //   }
        // }}
        // onMouseMove={({
        //   coordinates: { x },
        //   movement: { x: movementX, y: movementY },
        // }) => {
        //   if (click.current) {
        //     if (alt) {
        //       setPositions((positions) => ({
        //         ...positions,
        //         maxX: maxX - movementX,
        //         minX: minX - movementX,
        //         maxY: maxY - movementY,
        //         minY: minY - movementY,
        //       }));
        //     } else {
        //       setPositions((positions) => ({
        //         ...positions,
        //         rectangle: {
        //           x1: rectangle ? rectangle.x1 : x,
        //           x2: x,
        //         },
        //       }));
        //     }
        //   }
        // }}
      >
        <LineSeries
          data={profile}
          lineStyle={{ stroke: 'green' }}
          xAxis="x"
          yAxis="y"
        />
        <BarSeries
          data={centroid}
          xAxis="x"
          yAxis="y"
          lineStyle={{ stroke: 'red' }}
        />
        <Annotations>
          {bestPeaks.map((peak) => (
            <Group key={peak.label} x={peak.x} y={peak.y}>
              <Line
                x1="0"
                x2="0"
                y1="0"
                y2="-5"
                style={{ strokeWidth: 2, stroke: 'blue' }}
              />
              <Text style={{ fontSize: '13px', fontWeight: '600' }} x="2" y="0">
                {peak.shortLabel}
              </Text>
              <Text
                style={{ fontSize: '13px', fontWeight: '600' }}
                x="2"
                y="-14"
              >
                {peak.x.toFixed(4)}
              </Text>
            </Group>
          ))}
          {annotations}
        </Annotations>
        <Axis
          displayPrimaryGridLines
          id="x"
          position="bottom"
          label="Mass [m/z]"
        />
        <Axis
          displayPrimaryGridLines
          id="y"
          position="left"
          label="Relative intensity [%]"
        />
      </Plot>
    </div>
  );
}

AdvancedMassExample.args = { mf: 'HCys100OH' };
