import {
  BasicCurveRender,
  basicCurveSchema,
} from '@/components/charts/BasicCurve';
import {
  BasicLineRender,
  basicLineSchema,
} from '@/components/charts/BasicLine';
import {
  MultipleLineRender,
  multipleLineSchema,
} from '@/components/charts/MultipleLine';
import {
  MultipleStepLineRender,
  multipleStepLineSchema,
} from '@/components/charts/MultipleStepLine';
import { StepLineRender, stepLineSchema } from '@/components/charts/StepLine';

const BasicAreaRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Area;
  await import('@antv/g2plot/lib/plots/area').then((Module) => {
    Area = Module.Area;
  });

  fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/360c3eae-0c73-46f0-a982-4746a6095010.json',
  )
    .then((res) => res.json())
    .then((data) => {
      const area = new Area(container, {
        data,
        xField: 'timePeriod',
        yField: 'value',
        xAxis: {
          range: [0, 1],
        },
      });
      area.render();
      callback(area);
    });
};

const DepositAreaRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Area;
  await import('@antv/g2plot/lib/plots/area').then((Module) => {
    Area = Module.Area;
  });

  fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/b21e7336-0b3e-486c-9070-612ede49284e.json',
  )
    .then((res) => res.json())
    .then((data) => {
      const area = new Area(container, {
        data,
        xField: 'date',
        yField: 'value',
        seriesField: 'country',
      });
      area.render();
      callback(area);
    });
};

const PercentDepositAreaRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Area;
  await import('@antv/g2plot/lib/plots/area').then((Module) => {
    Area = Module.Area;
  });

  fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/67ef5751-b228-417c-810a-962f978af3e7.json',
  )
    .then((res) => res.json())
    .then((data) => {
      const area = new Area(container, {
        data,
        xField: 'year',
        yField: 'value',
        seriesField: 'country',
        color: ['#82d1de', '#cb302d', '#e3ca8c'],
        areaStyle: {
          fillOpacity: 0.7,
        },
        appendPadding: 10,
        isPercent: true,
        yAxis: {
          label: {
            formatter: (value) => {
              return value * 100;
            },
          },
        },
      });
      area.render();
      callback(area);
    });
};

const ColumnRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Column;
  await import('@antv/g2plot/lib/plots/column').then((Module) => {
    Column = Module.Column;
  });

  const data = [
    {
      type: '家具家电',
      sales: 38,
    },
    {
      type: '粮油副食',
      sales: 52,
    },
    {
      type: '生鲜水果',
      sales: 61,
    },
    {
      type: '美容洗护',
      sales: 145,
    },
    {
      type: '母婴用品',
      sales: 48,
    },
    {
      type: '进口食品',
      sales: 38,
    },
    {
      type: '食品饮料',
      sales: 38,
    },
    {
      type: '家庭清洁',
      sales: 38,
    },
  ];
  const column = new Column(container, {
    data,
    xField: 'type',
    yField: 'sales',
    label: {
      // 可手动配置 label 数据标签位置
      position: 'middle', // 'top', 'bottom', 'middle',
      // 配置样式
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: '类别',
      },
      sales: {
        alias: '销售额',
      },
    },
  });

  column.render();
  callback(column);
};

const StackColumnRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Column;
  await import('@antv/g2plot/lib/plots/column').then((Module) => {
    Column = Module.Column;
  });

  fetch(
    'https://gw.alipayobjects.com/os/antfincdn/8elHX%26irfq/stack-column-data.json',
  )
    .then((data) => data.json())
    .then((data) => {
      const column = new Column(container, {
        data,
        isStack: true,
        xField: 'year',
        yField: 'value',
        seriesField: 'type',
        label: {
          // 可手动配置 label 数据标签位置
          position: 'middle', // 'top', 'bottom', 'middle'
          // 可配置附加的布局方法
          layout: [
            // 柱形图数据标签位置自动调整
            { type: 'interval-adjust-position' },
            // 数据标签防遮挡
            { type: 'interval-hide-overlap' },
            // 数据标签文颜色自动调整
            { type: 'adjust-color' },
          ],
        },
      });
      column.render();
      callback(column);
    });
};

const GroupColumnRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Column;
  await import('@antv/g2plot/lib/plots/column').then((Module) => {
    Column = Module.Column;
  });

  const data = [
    {
      name: 'London',
      月份: 'Jan.',
      月均降雨量: 18.9,
    },
    {
      name: 'London',
      月份: 'Feb.',
      月均降雨量: 28.8,
    },
    {
      name: 'London',
      月份: 'Mar.',
      月均降雨量: 39.3,
    },
    {
      name: 'London',
      月份: 'Apr.',
      月均降雨量: 81.4,
    },
    {
      name: 'London',
      月份: 'May',
      月均降雨量: 47,
    },
    {
      name: 'London',
      月份: 'Jun.',
      月均降雨量: 20.3,
    },
    {
      name: 'London',
      月份: 'Jul.',
      月均降雨量: 24,
    },
    {
      name: 'London',
      月份: 'Aug.',
      月均降雨量: 35.6,
    },
    {
      name: 'Berlin',
      月份: 'Jan.',
      月均降雨量: 12.4,
    },
    {
      name: 'Berlin',
      月份: 'Feb.',
      月均降雨量: 23.2,
    },
    {
      name: 'Berlin',
      月份: 'Mar.',
      月均降雨量: 34.5,
    },
    {
      name: 'Berlin',
      月份: 'Apr.',
      月均降雨量: 99.7,
    },
    {
      name: 'Berlin',
      月份: 'May',
      月均降雨量: 52.6,
    },
    {
      name: 'Berlin',
      月份: 'Jun.',
      月均降雨量: 35.5,
    },
    {
      name: 'Berlin',
      月份: 'Jul.',
      月均降雨量: 37.4,
    },
    {
      name: 'Berlin',
      月份: 'Aug.',
      月均降雨量: 42.4,
    },
  ];

  const column = new Column(container, {
    data,
    isGroup: true,
    xField: '月份',
    yField: '月均降雨量',
    seriesField: 'name',
    /** 设置颜色 */
    //color: ['#1ca9e6', '#f88c24'],
    /** 设置间距 */
    // marginRatio: 0.1,
    label: {
      // 可手动配置 label 数据标签位置
      position: 'middle', // 'top', 'middle', 'bottom'
      // 可配置附加的布局方法
      layout: [
        // 柱形图数据标签位置自动调整
        { type: 'interval-adjust-position' },
        // 数据标签防遮挡
        { type: 'interval-hide-overlap' },
        // 数据标签文颜色自动调整
        { type: 'adjust-color' },
      ],
    },
  });

  column.render();
  callback(column);
};

const PercentColumnRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Column;
  await import('@antv/g2plot/lib/plots/column').then((Module) => {
    Column = Module.Column;
  });

  const data = [
    {
      country: 'Asia',
      year: '1750',
      value: 502,
    },
    {
      country: 'Asia',
      year: '1800',
      value: 635,
    },
    {
      country: 'Asia',
      year: '1850',
      value: 809,
    },
    {
      country: 'Asia',
      year: '1900',
      value: 947,
    },
    {
      country: 'Asia',
      year: '1950',
      value: 1402,
    },
    {
      country: 'Asia',
      year: '1999',
      value: 3634,
    },
    {
      country: 'Asia',
      year: '2050',
      value: 5268,
    },
    {
      country: 'Africa',
      year: '1750',
      value: 106,
    },
    {
      country: 'Africa',
      year: '1800',
      value: 107,
    },
    {
      country: 'Africa',
      year: '1850',
      value: 111,
    },
    {
      country: 'Africa',
      year: '1900',
      value: 133,
    },
    {
      country: 'Africa',
      year: '1950',
      value: 221,
    },
    {
      country: 'Africa',
      year: '1999',
      value: 767,
    },
    {
      country: 'Africa',
      year: '2050',
      value: 1766,
    },
    {
      country: 'Europe',
      year: '1750',
      value: 163,
    },
    {
      country: 'Europe',
      year: '1800',
      value: 203,
    },
    {
      country: 'Europe',
      year: '1850',
      value: 276,
    },
    {
      country: 'Europe',
      year: '1900',
      value: 408,
    },
    {
      country: 'Europe',
      year: '1950',
      value: 547,
    },
    {
      country: 'Europe',
      year: '1999',
      value: 729,
    },
    {
      country: 'Europe',
      year: '2050',
      value: 628,
    },
  ];

  const column = new Column(container, {
    data,
    xField: 'year',
    yField: 'value',
    seriesField: 'country',
    isPercent: true,
    isStack: true,
    label: {
      position: 'middle',
      content: (item) => {
        return item.value.toFixed(2);
      },
      style: {
        fill: '#fff',
      },
    },
  });

  column.render();
  callback(column);
};

const RangeColumnRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Column;
  await import('@antv/g2plot/lib/plots/column').then((Module) => {
    Column = Module.Column;
  });

  const data = [
    { type: '分类一', values: [76, 100] },
    { type: '分类二', values: [56, 108] },
    { type: '分类三', values: [38, 129] },
    { type: '分类四', values: [58, 155] },
    { type: '分类五', values: [45, 120] },
    { type: '分类六', values: [23, 99] },
    { type: '分类七', values: [18, 56] },
    { type: '分类八', values: [18, 34] },
  ];

  const column = new Column(container, {
    data,
    xField: 'type',
    yField: 'values',
    isRange: true,
    label: {
      position: 'middle',
      layout: [{ type: 'adjust-color' }],
    },
  });

  column.render();
  callback(column);
};

const BasicBarRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Bar;
  await import('@antv/g2plot/lib/plots/bar').then((Module) => {
    Bar = Module.Bar;
  });

  const data = [
    { year: '1951 年', value: 38 },
    { year: '1952 年', value: 52 },
    { year: '1956 年', value: 61 },
    { year: '1957 年', value: 145 },
    { year: '1958 年', value: 48 },
  ];

  const bar = new Bar(container, {
    data,
    xField: 'value',
    yField: 'year',
    seriesField: 'year',
    legend: {
      position: 'top-left',
    },
  });

  bar.render();
  callback(bar);
};

const StackBarRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Bar;
  await import('@antv/g2plot/lib/plots/bar').then((Module) => {
    Bar = Module.Bar;
  });

  const data = [
    {
      year: '1991',
      value: 3,
      type: 'Lon',
    },
    {
      year: '1992',
      value: 4,
      type: 'Lon',
    },
    {
      year: '1993',
      value: 3.5,
      type: 'Lon',
    },
    {
      year: '1994',
      value: 5,
      type: 'Lon',
    },
    {
      year: '1995',
      value: 4.9,
      type: 'Lon',
    },
    {
      year: '1996',
      value: 6,
      type: 'Lon',
    },
    {
      year: '1997',
      value: 7,
      type: 'Lon',
    },
    {
      year: '1998',
      value: 9,
      type: 'Lon',
    },
    {
      year: '1999',
      value: 13,
      type: 'Lon',
    },
    {
      year: '1991',
      value: 3,
      type: 'Bor',
    },
    {
      year: '1992',
      value: 4,
      type: 'Bor',
    },
    {
      year: '1993',
      value: 3.5,
      type: 'Bor',
    },
    {
      year: '1994',
      value: 5,
      type: 'Bor',
    },
    {
      year: '1995',
      value: 4.9,
      type: 'Bor',
    },
    {
      year: '1996',
      value: 6,
      type: 'Bor',
    },
    {
      year: '1997',
      value: 7,
      type: 'Bor',
    },
    {
      year: '1998',
      value: 9,
      type: 'Bor',
    },
    {
      year: '1999',
      value: 13,
      type: 'Bor',
    },
  ];

  const bar = new Bar(container, {
    data: data.reverse(),
    isStack: true,
    xField: 'value',
    yField: 'year',
    seriesField: 'type',
    label: {
      // 可手动配置 label 数据标签位置
      position: 'middle', // 'left', 'middle', 'right'
      // 可配置附加的布局方法
      layout: [
        // 柱形图数据标签位置自动调整
        { type: 'interval-adjust-position' },
        // 数据标签防遮挡
        { type: 'interval-hide-overlap' },
        // 数据标签文颜色自动调整
        { type: 'adjust-color' },
      ],
    },
  });

  bar.render();
  callback(bar);
};

const GroupBarRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Bar;
  await import('@antv/g2plot/lib/plots/bar').then((Module) => {
    Bar = Module.Bar;
  });

  const data = [
    {
      label: 'Mon.',
      type: 'series1',
      value: 2800,
    },
    {
      label: 'Mon.',
      type: 'series2',
      value: 2260,
    },
    {
      label: 'Tues.',
      type: 'series1',
      value: 1800,
    },
    {
      label: 'Tues.',
      type: 'series2',
      value: 1300,
    },
    {
      label: 'Wed.',
      type: 'series1',
      value: 950,
    },
    {
      label: 'Wed.',
      type: 'series2',
      value: 900,
    },
    {
      label: 'Thur.',
      type: 'series1',
      value: 500,
    },
    {
      label: 'Thur.',
      type: 'series2',
      value: 390,
    },
    {
      label: 'Fri.',
      type: 'series1',
      value: 170,
    },
    {
      label: 'Fri.',
      type: 'series2',
      value: 100,
    },
  ];

  const bar = new Bar(container, {
    data,
    isGroup: true,
    xField: 'value',
    yField: 'label',
    /** 自定义颜色 */
    // color: ['#1383ab', '#c52125'],
    seriesField: 'type',
    marginRatio: 0,
    label: {
      // 可手动配置 label 数据标签位置
      position: 'middle', // 'left', 'middle', 'right'
      // 可配置附加的布局方法
      layout: [
        // 柱形图数据标签位置自动调整
        { type: 'interval-adjust-position' },
        // 数据标签防遮挡
        { type: 'interval-hide-overlap' },
        // 数据标签文颜色自动调整
        { type: 'adjust-color' },
      ],
    },
  });

  bar.render();
  callback(bar);
};

const PercentBarRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Bar;
  await import('@antv/g2plot/lib/plots/bar').then((Module) => {
    Bar = Module.Bar;
  });

  const data = [
    {
      country: 'Asia',
      year: '1750',
      value: 502,
    },
    {
      country: 'Asia',
      year: '1800',
      value: 635,
    },
    {
      country: 'Asia',
      year: '1850',
      value: 809,
    },
    {
      country: 'Asia',
      year: '1900',
      value: 947,
    },
    {
      country: 'Asia',
      year: '1950',
      value: 1402,
    },
    {
      country: 'Asia',
      year: '1999',
      value: 3634,
    },
    {
      country: 'Asia',
      year: '2050',
      value: 5268,
    },
    {
      country: 'Africa',
      year: '1750',
      value: 106,
    },
    {
      country: 'Africa',
      year: '1800',
      value: 107,
    },
    {
      country: 'Africa',
      year: '1850',
      value: 111,
    },
    {
      country: 'Africa',
      year: '1900',
      value: 133,
    },
    {
      country: 'Africa',
      year: '1950',
      value: 221,
    },
    {
      country: 'Africa',
      year: '1999',
      value: 767,
    },
    {
      country: 'Africa',
      year: '2050',
      value: 1766,
    },
    {
      country: 'Europe',
      year: '1750',
      value: 163,
    },
    {
      country: 'Europe',
      year: '1800',
      value: 203,
    },
    {
      country: 'Europe',
      year: '1850',
      value: 276,
    },
    {
      country: 'Europe',
      year: '1900',
      value: 408,
    },
    {
      country: 'Europe',
      year: '1950',
      value: 547,
    },
    {
      country: 'Europe',
      year: '1999',
      value: 729,
    },
    {
      country: 'Europe',
      year: '2050',
      value: 628,
    },
  ];

  const bar = new Bar(container, {
    data,
    xField: 'value',
    yField: 'year',
    seriesField: 'country',
    isPercent: true,
    isStack: true,
    /** 自定义颜色 */
    // color: ['#2582a1', '#f88c24', '#c52125', '#87f4d0'],
    label: {
      position: 'middle',
      content: (item) => {
        return item.value.toFixed(2);
      },
      style: {
        fill: '#fff',
      },
    },
  });

  bar.render();
  callback(bar);
};

const RangeBarRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Bar;
  await import('@antv/g2plot/lib/plots/bar').then((Module) => {
    Bar = Module.Bar;
  });

  const data = [
    { type: '分类一', values: [76, 100] },
    { type: '分类二', values: [56, 108] },
    { type: '分类三', values: [38, 129] },
    { type: '分类四', values: [58, 155] },
    { type: '分类五', values: [45, 120] },
    { type: '分类六', values: [23, 99] },
    { type: '分类七', values: [18, 56] },
    { type: '分类八', values: [18, 34] },
  ];

  const bar = new Bar(container, {
    data: data.reverse(),
    xField: 'values',
    yField: 'type',
    isRange: true,
    label: {
      position: 'middle',
      layout: [{ type: 'adjust-color' }],
    },
  });

  bar.render();
  callback(bar);
};

const BasicPieRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Pie;
  await import('@antv/g2plot/lib/plots/pie').then((Module) => {
    Pie = Module.Pie;
  });

  const data = [
    { type: '分类一', value: 27 },
    { type: '分类二', value: 25 },
    { type: '分类三', value: 18 },
    { type: '分类四', value: 15 },
    { type: '分类五', value: 10 },
    { type: '其他', value: 5 },
  ];

  const pie = new Pie(container, {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      //@ts-ignore
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [{ type: 'element-active' }],
  });

  pie.render();
  callback(pie);
};

const BasicRingRender = async (
  container?: any,
  component_name?: string,
  config?: any,
  callback?: any,
) => {
  let Pie;
  await import('@antv/g2plot/lib/plots/pie').then((Module) => {
    Pie = Module.Pie;
  });

  const data = [
    { type: '分类一', value: 27 },
    { type: '分类二', value: 25 },
    { type: '分类三', value: 18 },
    { type: '分类四', value: 15 },
    { type: '分类五', value: 10 },
    { type: '其他', value: 5 },
  ];

  const pie = new Pie(container, {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: 'AntV\nG2Plot',
      },
    },
  });

  pie.render();
  callback(pie);
};

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
  },
  {
    label: '堆积面积图',
    name: 'DepositArea',
    type: 'Area',
    render: DepositAreaRender,
  },
  {
    label: '百分比堆叠面积图',
    name: 'PercentDepositArea',
    type: 'Area',
    render: PercentDepositAreaRender,
  },
  {
    label: '基础柱状图',
    name: 'BasicColumn',
    type: 'Column',
    render: ColumnRender,
  },
  {
    label: '堆叠柱状图',
    name: 'StackColumn',
    type: 'Column',
    render: StackColumnRender,
  },
  {
    label: '分组柱状图',
    name: 'GroupColumn',
    type: 'Column',
    render: GroupColumnRender,
  },
  {
    label: '百分比柱状图',
    name: 'PercentColumn',
    type: 'Column',
    render: PercentColumnRender,
  },
  {
    label: '区间柱状图',
    name: 'RangeColumn',
    type: 'Column',
    render: RangeColumnRender,
  },
  {
    label: '基础条形图',
    name: 'BasicBar',
    type: 'Bar',
    render: BasicBarRender,
  },
  {
    label: '堆叠条形图',
    name: 'StackBar',
    type: 'Bar',
    render: StackBarRender,
  },
  {
    label: '分组条形图',
    name: 'GroupBar',
    type: 'Bar',
    render: GroupBarRender,
  },
  {
    label: '百分比条形图',
    name: 'PercentBar',
    type: 'Bar',
    render: PercentBarRender,
  },
  {
    label: '区间条形图',
    name: 'RangeBar',
    type: 'Bar',
    render: RangeBarRender,
  },
  {
    label: '基础饼图',
    name: 'BasicPie',
    type: 'Pie',
    render: BasicPieRender,
  },
  {
    label: '基础环图',
    name: 'BasicRing',
    type: 'Pie',
    render: BasicRingRender,
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
