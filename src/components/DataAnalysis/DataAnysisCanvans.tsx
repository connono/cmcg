import { ItemTypes } from '@/constants';
import { useModel } from '@umijs/max';
import _ from 'lodash';
import React from 'react';
import { useDrop } from 'react-dnd';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import '../../../node_modules/react-grid-layout/css/styles.css';
import '../../../node_modules/react-resizable/css/styles.css';
import ChartComponent from './ChartComponent';

const PureDataAnalysisCanvas: React.FC = (props: any) => {
  if (props.charts && props.charts.length < 1)
    return (
      <div
        id="canvas"
        className="canvas"
        ref={props.drop}
        style={{
          backgroundColor: props.color,
          width: props.width,
          height: props.height,
        }}
      >
        暂无内容
      </div>
    );

  const charts = _.map(props.charts, (value: any) => {
    return (
      <div key={value.name}>
        <ChartComponent chart={value} deleteChart={props.deleteChart} />
      </div>
    );
  });
  return (
    <div
      id="canvas"
      className="canvas"
      ref={props.drop}
      style={{
        backgroundColor: props.color,
        width: props.width,
        height: props.height,
      }}
    >
      <ResponsiveGridLayout
        className="layout"
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        width={props.width}
      >
        {charts}
      </ResponsiveGridLayout>
    </div>
  );
};

const DataAnalysisCanvas: React.FC = () => {
  const { canvasData, addChart, deleteChart } = useModel(
    'canvasData',
    (model) => ({
      canvasData: model.canvasData,
      addChart: model.addChart,
      deleteChart: model.deleteChart,
    }),
  );
  const handleDrop = (item: any) => {
    addChart(item.name, item.label);
  };
  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.PICTURECARD,
      drop: (item) => handleDrop(item),
    }),
    [],
  );

  return (
    <PureDataAnalysisCanvas
      drop={drop}
      height={canvasData.height}
      width={canvasData.width}
      color={canvasData.color}
      charts={canvasData.chartList}
      deleteChart={deleteChart}
    />
  );
};

export default DataAnalysisCanvas;
