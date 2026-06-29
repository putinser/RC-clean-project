import {memo} from 'react';
import {
  Canvas,
  DashPathEffect,
  Path,
} from '@shopify/react-native-skia';
import type {buildSkiaChartPaths} from '../lib/buildSkiaPaths';

type RenderedChart = ReturnType<typeof buildSkiaChartPaths>;

type ChartStaticLayerProps = {
  chartKey: string;
  width: number;
  height: number;
  rendered: RenderedChart;
};

export const ChartStaticLayer = memo(function ChartStaticLayer({
  chartKey,
  width,
  height,
  rendered,
}: ChartStaticLayerProps) {
  return (
    <Canvas key={chartKey} style={{width, height}}>
      {rendered.gridPaths.map((item, index) => (
        <Path
          key={`grid-${index}`}
          path={item.path}
          color={item.color}
          style="stroke"
          strokeWidth={item.strokeWidth}
        />
      ))}

      {rendered.seriesPaths.map((item, index) => (
        <Path
          key={`series-${index}`}
          path={item.path}
          color={item.color}
          style="stroke"
          strokeWidth={item.strokeWidth}
          strokeJoin="round"
          strokeCap="round"
        />
      ))}

      {rendered.markLinePaths.map((item, index) => (
        <Path
          key={`mark-${index}`}
          path={item.path}
          color={item.color}
          style="stroke"
          strokeWidth={item.strokeWidth}>
          {item.dashed ? <DashPathEffect intervals={[6, 4]} /> : null}
        </Path>
      ))}
    </Canvas>
  );
});
