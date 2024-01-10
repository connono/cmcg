import {
  BasicAreaRender,
  basicAreaSchema,
} from '@/components/charts/area/BasicArea';
import {
  DepositAreaRender,
  DepositAreaSchema,
} from '@/components/charts/area/DepositArea';
import {
  PercentDepositAreaRender,
  PercentDepositAreaSchema,
} from '@/components/charts/area/PercentDepositArea';
import {
  BasicBarRender,
  basicBarSchema,
} from '@/components/charts/bar/BasicBar';
import {
  GroupBarRender,
  groupBarSchema,
} from '@/components/charts/bar/GroupBar';
import {
  PercentBarRender,
  percentBarSchema,
} from '@/components/charts/bar/PercentBar';
import {
  RangeBarRender,
  rangeBarSchema,
} from '@/components/charts/bar/RangeBar';
import {
  StackBarRender,
  stackBarSchema,
} from '@/components/charts/bar/StackBar';
import {
  BasicIndicatorCardRender,
  basicIndicatorCardSchema,
} from '@/components/charts/card/BasicIndicatorCard';
import {
  BasicColumnRender,
  basicColumnSchema,
} from '@/components/charts/column/BasicColumn';
import {
  GroupColumnRender,
  groupColumnSchema,
} from '@/components/charts/column/GroupColumn';
import {
  PercentColumnRender,
  percentColumnSchema,
} from '@/components/charts/column/PercentColumn';
import {
  RangeColumnRender,
  rangeColumnSchema,
} from '@/components/charts/column/RangeColumn';
import {
  StackColumnRender,
  stackColumnSchema,
} from '@/components/charts/column/StackColumn';
import {
  BasicChordRender,
  basicChordSchema,
} from '@/components/charts/connection/BasicChord';
import {
  BasicSankeyRender,
  basicSankeySchema,
} from '@/components/charts/connection/BasicSankey';
import {
  BasicHeatmapRender,
  basicHeatmapSchema,
} from '@/components/charts/heatmap/BasicHeatmap';
import {
  DensityHeatmapRender,
  densityHeatmapSchema,
} from '@/components/charts/heatmap/DensityHeatmap';
import {
  PolarHeatmapRender,
  polarHeatmapSchema,
} from '@/components/charts/heatmap/PolarHeatmap';
import {
  BasicCurveRender,
  basicCurveSchema,
} from '@/components/charts/line/BasicCurve';
import {
  BasicLineRender,
  basicLineSchema,
} from '@/components/charts/line/BasicLine';
import {
  MultipleLineRender,
  multipleLineSchema,
} from '@/components/charts/line/MultipleLine';
import {
  MultipleStepLineRender,
  multipleStepLineSchema,
} from '@/components/charts/line/MultipleStepLine';
import {
  StepLineRender,
  stepLineSchema,
} from '@/components/charts/line/StepLine';
import {
  BasicPieRender,
  basicPieSchema,
} from '@/components/charts/pie/BasicPie';
import {
  BasicRingRender,
  basicRingSchema,
} from '@/components/charts/pie/BasicRing';
import {
  BasicRoseRender,
  basicRoseSchema,
} from '@/components/charts/rose/BasicRose';
import {
  GroupRoseRender,
  groupRoseSchema,
} from '@/components/charts/rose/GroupRose';
import {
  StackRoseRender,
  stackRoseSchema,
} from '@/components/charts/rose/StackRose';
import {
  BasicBubbleRender,
  basicBubbleSchema,
} from '@/components/charts/scatter/BasicBubble';
import {
  BasicScatterRender,
  basicScatterSchema,
} from '@/components/charts/scatter/BasicScatter';
// const BasicGaugeRender = async (
//   container?: any,
//   component_name?: string,
//   config?: any,
//   callback?: any,
// ) => {
//   let Gauge;
//   await import('@antv/g2plot/lib/plots/gauge').then((Module) => {
//     Gauge = Module.Gauge;
//   });

//   const gauge = new Gauge(container, {
//     percent: 0.75,
//     range: {
//       color: '#30BF78',
//     },
//     indicator: {
//       pointer: {
//         style: {
//           stroke: '#D0D0D0',
//         },
//       },
//       pin: {
//         style: {
//           stroke: '#D0D0D0',
//         },
//       },
//     },
//     axis: {
//       label: {
//         formatter(v) {
//           return Number(v) * 100;
//         },
//       },
//       subTickLine: {
//         count: 3,
//       },
//     },
//     statistic: {
//       content: {
//         formatter: ({ percent }) => `Rate: ${(percent * 100).toFixed(0)}%`,
//         style: {
//           color: 'rgba(0,0,0,0.65)',
//           fontSize: 48,
//         },
//       },
//     },
//   });

//   gauge.render();
//   callback(gauge);
// };

// const BasicLiquidRender = async (
//   container?: any,
//   component_name?: string,
//   config?: any,
//   callback?: any,
// ) => {
//   let Liquid;
//   await import('@antv/g2plot/lib/plots/liquid').then((Module) => {
//     Liquid = Module.Liquid;
//   });

//   const liquid = new Liquid(container, {
//     percent: 0.25,
//     outline: {
//       border: 4,
//       distance: 8,
//     },
//     wave: {
//       length: 128,
//     },
//   });
//   liquid.render();
//   callback(liquid);
// };

// const BasicBulletRender = async (
//   container?: any,
//   component_name?: string,
//   config?: any,
//   callback?: any,
// ) => {
//   let Bullet;
//   await import('@antv/g2plot/lib/plots/bullet').then((Module) => {
//     Bullet = Module.Bullet;
//   });

//   const data = [
//     {
//       title: '满意度',
//       ranges: [100],
//       measures: [80],
//       target: 85,
//     },
//   ];

//   const bullet = new Bullet(container, {
//     data,
//     measureField: 'measures',
//     rangeField: 'ranges',
//     targetField: 'target',
//     xField: 'title',
//     color: {
//       range: '#f0efff',
//       measure: '#5B8FF9',
//       target: '#3D76DD',
//     },
//     xAxis: {
//       line: null,
//     },
//     yAxis: {
//       tickMethod: ({ max }) => {
//         const interval = Math.ceil(max / 5);
//         // 自定义刻度 ticks
//         return [0, interval, interval * 2, interval * 3, interval * 4, max];
//       },
//     },
//     // 自定义 legend
//     legend: {
//       custom: true,
//       position: 'bottom',
//       items: [
//         {
//           value: '实际值',
//           name: '实际值',
//           marker: { symbol: 'square', style: { fill: '#5B8FF9', r: 5 } },
//         },
//         {
//           value: '目标值',
//           name: '目标值',
//           marker: { symbol: 'line', style: { stroke: '#3D76DD', r: 5 } },
//         },
//       ],
//     },
//   });

//   bullet.render();
//   callback(bullet);
// };

export const PICTURE_LIST = [
  {
    label: '基本指标卡',
    name: 'BasicIndicatorCard',
    type: 'Card',
    render: BasicIndicatorCardRender,
    schema: basicIndicatorCardSchema,
  },
  {
    label: '基础折线图',
    name: 'BasicLine',
    type: 'Line',
    render: BasicLineRender,
    schema: basicLineSchema,
  },
  {
    label: '基础曲线图',
    name: 'BasicCurve',
    type: 'Line',
    render: BasicCurveRender,
    schema: basicCurveSchema,
  },
  {
    label: '多折线图',
    name: 'MultipleLine',
    type: 'Line',
    render: MultipleLineRender,
    schema: multipleLineSchema,
  },
  {
    label: '阶梯折线图',
    name: 'StepLine',
    type: 'Line',
    render: StepLineRender,
    schema: stepLineSchema,
  },
  {
    label: '多阶梯折线图',
    name: 'MultipleStepLine',
    type: 'Line',
    render: MultipleStepLineRender,
    schema: multipleStepLineSchema,
  },
  {
    label: '基础面积图',
    name: 'BasicArea',
    type: 'Area',
    render: BasicAreaRender,
    schema: basicAreaSchema,
  },
  {
    label: '堆积面积图',
    name: 'DepositArea',
    type: 'Area',
    render: DepositAreaRender,
    schema: DepositAreaSchema,
  },
  {
    label: '百分比堆叠面积图',
    name: 'PercentDepositArea',
    type: 'Area',
    render: PercentDepositAreaRender,
    schema: PercentDepositAreaSchema,
  },
  {
    label: '基础柱状图',
    name: 'BasicColumn',
    type: 'Column',
    render: BasicColumnRender,
    schema: basicColumnSchema,
  },
  {
    label: '堆叠柱状图',
    name: 'StackColumn',
    type: 'Column',
    render: StackColumnRender,
    schema: stackColumnSchema,
  },
  {
    label: '分组柱状图',
    name: 'GroupColumn',
    type: 'Column',
    render: GroupColumnRender,
    schema: groupColumnSchema,
  },
  {
    label: '百分比柱状图',
    name: 'PercentColumn',
    type: 'Column',
    render: PercentColumnRender,
    schema: percentColumnSchema,
  },
  {
    label: '区间柱状图',
    name: 'RangeColumn',
    type: 'Column',
    render: RangeColumnRender,
    schema: rangeColumnSchema,
  },
  {
    label: '基础条形图',
    name: 'BasicBar',
    type: 'Bar',
    render: BasicBarRender,
    schema: basicBarSchema,
  },
  {
    label: '堆叠条形图',
    name: 'StackBar',
    type: 'Bar',
    render: StackBarRender,
    schema: stackBarSchema,
  },
  {
    label: '分组条形图',
    name: 'GroupBar',
    type: 'Bar',
    render: GroupBarRender,
    schema: groupBarSchema,
  },
  {
    label: '百分比条形图',
    name: 'PercentBar',
    type: 'Bar',
    render: PercentBarRender,
    schema: percentBarSchema,
  },
  {
    label: '区间条形图',
    name: 'RangeBar',
    type: 'Bar',
    render: RangeBarRender,
    schema: rangeBarSchema,
  },
  {
    label: '基础饼图',
    name: 'BasicPie',
    type: 'Pie',
    render: BasicPieRender,
    schema: basicPieSchema,
  },
  {
    label: '基础环图',
    name: 'BasicRing',
    type: 'Pie',
    render: BasicRingRender,
    schema: basicRingSchema,
  },
  // {
  //   label: '基础仪表盘',
  //   name: 'BasicGauge',
  //   type: 'Process',
  //   render: BasicGaugeRender,
  // },
  // {
  //   label: '基础水波图',
  //   name: 'BasicLiquid',
  //   type: 'Process',
  //   render: BasicLiquidRender,
  // },
  // {
  //   label: '基础子弹图',
  //   name: 'BasicBullet',
  //   type: 'Process',
  //   render: BasicBulletRender,
  // },
  {
    label: '基础散点图',
    name: 'BasicScatter',
    type: 'Scatter',
    render: BasicScatterRender,
    schema: basicScatterSchema,
  },
  {
    label: '基础气泡图',
    name: 'BasicBubble',
    type: 'Scatter',
    render: BasicBubbleRender,
    schema: basicBubbleSchema,
  },
  {
    label: '基础玫瑰图',
    name: 'BasicRose',
    type: 'Rose',
    render: BasicRoseRender,
    schema: basicRoseSchema,
  },
  {
    label: '分组玫瑰图',
    name: 'GroupRose',
    type: 'Rose',
    render: GroupRoseRender,
    schema: groupRoseSchema,
  },
  {
    label: '堆叠玫瑰图',
    name: 'StackRose',
    type: 'Rose',
    render: StackRoseRender,
    schema: stackRoseSchema,
  },
  {
    label: '基础桑基图',
    name: 'BasicSankey',
    type: 'Connection',
    render: BasicSankeyRender,
    schema: basicSankeySchema,
  },
  {
    label: '基础弦图',
    name: 'BasicChord',
    type: 'Connection',
    render: BasicChordRender,
    schema: basicChordSchema,
  },
  {
    label: '基础热力图',
    name: 'BasicHeatmap',
    type: 'Heatmap',
    render: BasicHeatmapRender,
    schema: basicHeatmapSchema,
  },
  {
    label: '极坐标色块图',
    name: 'PolarHeatmap',
    type: 'Heatmap',
    render: PolarHeatmapRender,
    schema: polarHeatmapSchema,
  },
  {
    label: '密度热力图',
    name: 'DensityHeatmap',
    type: 'Heatmap',
    render: DensityHeatmapRender,
    schema: densityHeatmapSchema,
  },
];

export const chartRender = (
  container_id: string,
  component_name: string,
  config: any,
  callback: any,
) => {
  const render = _.find(PICTURE_LIST, ['name', component_name])?.render;
  if (render) render(container_id, config, callback);
  return <div id={container_id} style={{ width: '100%', height: '100%' }} />;
};
