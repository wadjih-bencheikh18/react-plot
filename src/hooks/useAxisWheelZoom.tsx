import {
  usePlotControls,
  usePlotEvents,
} from '../contexts/plotController/plotControllerContext';

export interface UseAxisWheelZoomOptions {
  direction?: 'horizontal' | 'vertical';
  axisId?: string;
}

export function useAxisWheelZoom(options: UseAxisWheelZoomOptions = {}) {
  const {
    direction = 'vertical',
    axisId = direction === 'horizontal' ? 'x' : 'y',
  } = options;

  const plotControls = usePlotControls();

  usePlotEvents({
    onWheel({
      domain: {
        [axisId]: [y1, y2],
      },
    }) {
      plotControls.setAxis(axisId, {
        min: Math.min(y1, y2),
        max: Math.max(y1, y2),
      });
    },
    onDoubleClick({ event: { button } }) {
      if (button !== 0) return;
      plotControls.resetAxis(axisId);
    },
  });
}