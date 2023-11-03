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

const BasicGaugeRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Gauge;
  await import('@antv/g2plot/lib/plots/gauge').then((Module) => {
    Gauge = Module.Gauge;
  });

  const gauge = new Gauge(container, {
    percent: 0.75,
    range: {
      color: '#30BF78',
    },
    indicator: {
      pointer: {
        style: {
          stroke: '#D0D0D0',
        },
      },
      pin: {
        style: {
          stroke: '#D0D0D0',
        },
      },
    },
    axis: {
      label: {
        formatter(v) {
          return Number(v) * 100;
        },
      },
      subTickLine: {
        count: 3,
      },
    },
    statistic: {
      content: {
        formatter: ({ percent }) => `Rate: ${(percent * 100).toFixed(0)}%`,
        style: {
          color: 'rgba(0,0,0,0.65)',
          fontSize: 48,
        },
      },
    },
  });

  gauge.render();
  callback(gauge);
};

const BasicLiquidRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Liquid;
  await import('@antv/g2plot/lib/plots/liquid').then((Module) => {
    Liquid = Module.Liquid;
  });

  const liquid = new Liquid(container, {
    percent: 0.25,
    outline: {
      border: 4,
      distance: 8,
    },
    wave: {
      length: 128,
    },
  });
  liquid.render();
  callback(liquid);
};

const BasicBulletRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Bullet;
  await import('@antv/g2plot/lib/plots/bullet').then((Module) => {
    Bullet = Module.Bullet;
  });

  const data = [
    {
      title: '满意度',
      ranges: [100],
      measures: [80],
      target: 85,
    },
  ];

  const bullet = new Bullet(container, {
    data,
    measureField: 'measures',
    rangeField: 'ranges',
    targetField: 'target',
    xField: 'title',
    color: {
      range: '#f0efff',
      measure: '#5B8FF9',
      target: '#3D76DD',
    },
    xAxis: {
      line: null,
    },
    yAxis: {
      tickMethod: ({ max }) => {
        const interval = Math.ceil(max / 5);
        // 自定义刻度 ticks
        return [0, interval, interval * 2, interval * 3, interval * 4, max];
      },
    },
    // 自定义 legend
    legend: {
      custom: true,
      position: 'bottom',
      items: [
        {
          value: '实际值',
          name: '实际值',
          marker: { symbol: 'square', style: { fill: '#5B8FF9', r: 5 } },
        },
        {
          value: '目标值',
          name: '目标值',
          marker: { symbol: 'line', style: { stroke: '#3D76DD', r: 5 } },
        },
      ],
    },
  });

  bullet.render();
  callback(bullet);
};

const BasicScatterRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Scatter;
  await import('@antv/g2plot/lib/plots/scatter').then((Module) => {
    Scatter = Module.Scatter;
  });

  fetch('https://gw.alipayobjects.com/os/antfincdn/aao6XnO5pW/IMDB.json')
    .then((res) => res.json())
    .then((data) => {
      const scatter = new Scatter(container, {
        appendPadding: 10,
        data,
        xField: 'Revenue (Millions)',
        yField: 'Rating',
        shape: 'circle',
        colorField: 'Genre',
        size: 4,
        yAxis: {
          nice: true,
          line: {
            style: {
              stroke: '#aaa',
            },
          },
        },
        xAxis: {
          min: -100,
          grid: {
            line: {
              style: {
                stroke: '#eee',
              },
            },
          },
          line: {
            style: {
              stroke: '#aaa',
            },
          },
        },
      });
      scatter.render();
      callback(scatter);
    });
};

const BasicBubbleRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Scatter;
  await import('@antv/g2plot/lib/plots/scatter').then((Module) => {
    Scatter = Module.Scatter;
  });

  fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/0b37279d-1674-42b4-b285-29683747ad9a.json',
  )
    .then((res) => res.json())
    .then((data) => {
      const scatter = new Scatter(container, {
        appendPadding: 30,
        data,
        xField: 'change in female rate',
        yField: 'change in male rate',
        sizeField: 'pop',
        colorField: 'continent',
        color: ['#ffd500', '#82cab2', '#193442', '#d18768', '#7e827a'],
        size: [4, 30],
        shape: 'circle',
        pointStyle: {
          fillOpacity: 0.8,
          stroke: '#bbb',
        },
        xAxis: {
          min: -25,
          max: 5,
          grid: {
            line: {
              style: {
                stroke: '#eee',
              },
            },
          },
          line: {
            style: {
              stroke: '#aaa',
            },
          },
        },
        yAxis: {
          line: {
            style: {
              stroke: '#aaa',
            },
          },
        },
        quadrant: {
          xBaseline: 0,
          yBaseline: 0,
          labels: [
            {
              content: 'Male decrease,\nfemale increase',
            },
            {
              content: 'Female decrease,\nmale increase',
            },
            {
              content: 'Female & male decrease',
            },
            {
              content: 'Female &\n male increase',
            },
          ],
        },
      });
      scatter.render();
      callback(scatter);
    });
};

const BasicRoseRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Rose;
  await import('@antv/g2plot/lib/plots/rose').then((Module) => {
    Rose = Module.Rose;
  });

  const data = [
    { type: '分类一', value: 27 },
    { type: '分类二', value: 25 },
    { type: '分类三', value: 18 },
    { type: '分类四', value: 15 },
    { type: '分类五', value: 10 },
    { type: '其他', value: 5 },
  ];

  const rose = new Rose(container, {
    data,
    xField: 'type',
    yField: 'value',
    seriesField: 'type',
    radius: 0.9,
    legend: {
      position: 'bottom',
    },
  });

  rose.render();
  callback(rose);
};

const GroupRoseRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Rose;
  await import('@antv/g2plot/lib/plots/rose').then((Module) => {
    Rose = Module.Rose;
  });

  fetch('https://gw.alipayobjects.com/os/antfincdn/XcLAPaQeeP/rose-data.json')
    .then((data) => data.json())
    .then((data) => {
      // 分组玫瑰图
      const rose = new Rose(container, {
        data,
        xField: 'type',
        yField: 'value',
        isGroup: true,
        // 当 isGroup 为 true 时，该值为必填
        seriesField: 'user',
        radius: 0.9,
        label: {
          offset: -15,
        },
        interactions: [
          {
            type: 'element-active',
          },
        ],
      });

      rose.render();
      callback(rose);
    });
};

const StackRoseRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Rose;
  await import('@antv/g2plot/lib/plots/rose').then((Module) => {
    Rose = Module.Rose;
  });

  const data = [
    {
      type: '分类一',
      value: 27,
      user: '用户一',
    },
    {
      type: '分类二',
      value: 25,
      user: '用户一',
    },
    {
      type: '分类三',
      value: 18,
      user: '用户一',
    },
    {
      type: '分类四',
      value: 15,
      user: '用户一',
    },
    {
      type: '分类五',
      value: 10,
      user: '用户一',
    },
    {
      type: '其它',
      value: 5,
      user: '用户一',
    },
    {
      type: '分类一',
      value: 7,
      user: '用户二',
    },
    {
      type: '分类二',
      value: 5,
      user: '用户二',
    },
    {
      type: '分类三',
      value: 38,
      user: '用户二',
    },
    {
      type: '分类四',
      value: 5,
      user: '用户二',
    },
    {
      type: '分类五',
      value: 20,
      user: '用户二',
    },
    {
      type: '其它',
      value: 15,
      user: '用户二',
    },
  ];

  // 堆叠玫瑰图
  const rose = new Rose(container, {
    data,
    xField: 'type',
    yField: 'value',
    isStack: true,
    // 当 isStack 为 true 时，该值为必填
    seriesField: 'user',
    radius: 0.9,
    label: {
      offset: -15,
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  });

  rose.render();
  callback(rose);
};

const BasicSankeyRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Sankey;
  await import('@antv/g2plot/lib/plots/sankey').then((Module) => {
    Sankey = Module.Sankey;
  });

  const DATA = [
    { source: '首次打开', target: '首页 UV', value: 160 },
    { source: '结果页', target: '首页 UV', value: 40 },
    { source: '验证页', target: '首页 UV', value: 10 },
    { source: '我的', target: '首页 UV', value: 10 },
    { source: '朋友', target: '首页 UV', value: 8 },
    { source: '其他来源', target: '首页 UV', value: 27 },
    { source: '首页 UV', target: '理财', value: 30 },
    { source: '首页 UV', target: '扫一扫', value: 40 },
    { source: '首页 UV', target: '服务', value: 35 },
    { source: '首页 UV', target: '蚂蚁森林', value: 25 },
    { source: '首页 UV', target: '跳失', value: 10 },
    { source: '首页 UV', target: '借呗', value: 30 },
    { source: '首页 UV', target: '花呗', value: 40 },
    { source: '首页 UV', target: '其他流向', value: 45 },
  ];

  const sankey = new Sankey(container, {
    data: DATA,
    sourceField: 'source',
    targetField: 'target',
    weightField: 'value',
    nodeWidthRatio: 0.008,
    nodePaddingRatio: 0.03,
  });

  sankey.render();
  callback(sankey);
};

const BasicChordRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Chord;
  await import('@antv/g2plot/lib/plots/chord').then((Module) => {
    Chord = Module.Chord;
  });

  const DATA = [
    { source: '北京', target: '天津', value: 30 },
    { source: '北京', target: '上海', value: 80 },
    { source: '北京', target: '河北', value: 46 },
    { source: '北京', target: '辽宁', value: 49 },
    { source: '北京', target: '黑龙江', value: 69 },
    { source: '北京', target: '吉林', value: 19 },
    { source: '天津', target: '河北', value: 62 },
    { source: '天津', target: '辽宁', value: 82 },
    { source: '天津', target: '上海', value: 16 },
    { source: '上海', target: '黑龙江', value: 16 },
    { source: '河北', target: '黑龙江', value: 76 },
    { source: '河北', target: '内蒙古', value: 24 },
    { source: '内蒙古', target: '北京', value: 32 },
  ];

  const chord = new Chord(container, {
    data: DATA,
    sourceField: 'source',
    targetField: 'target',
    weightField: 'value',
  });

  chord.render();

  callback(chord);
};

const BasicHeatmapRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Heatmap;
  await import('@antv/g2plot/lib/plots/heatmap').then((Module) => {
    Heatmap = Module.Heatmap;
  });

  fetch(
    'https://gw.alipayobjects.com/os/basement_prod/a719cd4e-bd40-4878-a4b4-df8a6b531dfe.json',
  )
    .then((res) => res.json())
    .then((data) => {
      const heatmap = new Heatmap(container, {
        data,
        xField: 'Month of Year',
        yField: 'District',
        colorField: 'AQHI',
        color: ['#174c83', '#7eb6d4', '#efefeb', '#efa759', '#9b4d16'],
        meta: {
          'Month of Year': {
            type: 'cat',
          },
        },
      });
      heatmap.render();
      callback(heatmap);
    });
};

const PolarHeatmapRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Heatmap;
  await import('@antv/g2plot/lib/plots/heatmap').then((Module) => {
    Heatmap = Module.Heatmap;
  });

  fetch(
    'https://gw.alipayobjects.com/os/antvdemo/assets/data/polar-heatmap.json',
  )
    .then((res) => res.json())
    .then((data) => {
      const heatmap = new Heatmap(container, {
        data,
        xField: 'time',
        yField: 'week',
        colorField: 'value',
        legend: true,
        color: '#BAE7FF-#1890FF-#1028ff',
        coordinate: {
          // 坐标轴属性配置
          type: 'polar', // 极坐标
          cfg: {
            innerRadius: 0.2,
          },
        },
        heatmapStyle: {
          stroke: '#f5f5f5',
          opacity: 0.8,
        },
        meta: {
          time: {
            type: 'cat',
          },
          value: {
            min: 0,
            max: 1,
          },
        },
        xAxis: {
          line: null,
          grid: null,
          tickLine: null,
          label: {
            offset: 12,
            style: {
              fill: '#666',
              fontSize: 12,
              textBaseline: 'top',
            },
          },
        },
        yAxis: {
          top: true,
          line: null,
          grid: null,
          tickLine: null,
          label: {
            offset: 0,
            style: {
              fill: '#fff',
              textAlign: 'center',
              shadowBlur: 2,
              shadowColor: 'rgba(0, 0, 0, .45)',
            },
          },
        },
        tooltip: {
          showMarkers: false,
        },
        interactions: [{ type: 'element-active' }],
      });
      heatmap.render();
      callback(heatmap);
    });
};

export const PICTURE_LIST = [
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
  {
    label: '基础仪表盘',
    name: 'BasicGauge',
    type: 'Process',
    render: BasicGaugeRender,
  },
  {
    label: '基础水波图',
    name: 'BasicLiquid',
    type: 'Process',
    render: BasicLiquidRender,
  },
  {
    label: '基础子弹图',
    name: 'BasicBullet',
    type: 'Process',
    render: BasicBulletRender,
  },
  {
    label: '基础散点图',
    name: 'BasicScatter',
    type: 'Scatter',
    render: BasicScatterRender,
  },
  {
    label: '基础气泡图',
    name: 'BasicBubble',
    type: 'Scatter',
    render: BasicBubbleRender,
  },
  {
    label: '基础玫瑰图',
    name: 'BasicRose',
    type: 'Rose',
    render: BasicRoseRender,
  },
  {
    label: '分组玫瑰图',
    name: 'GroupRose',
    type: 'Rose',
    render: GroupRoseRender,
  },
  {
    label: '堆叠玫瑰图',
    name: 'StackRose',
    type: 'Rose',
    render: StackRoseRender,
  },
  {
    label: '基础桑基图',
    name: 'BasicSankey',
    type: 'Connection',
    render: BasicSankeyRender,
  },
  {
    label: '基础弦图',
    name: 'BasicChord',
    type: 'Connection',
    render: BasicChordRender,
  },
  {
    label: '基础热力图',
    name: 'BasicHeatmap',
    type: 'Heatmap',
    render: BasicHeatmapRender,
  },
  {
    label: '极坐标色块图',
    name: 'PolarHeatmap',
    type: 'Heatmap',
    render: PolarHeatmapRender,
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
