import ChartComponent from '@/components/ChartComponent';
import { ItemTypes } from '@/constants';
import { PICTURE_LIST } from '@/utils/chart-render';
import { DomToPng } from '@/utils/file-saver';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import {
  Button,
  Collapse,
  ColorPicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
} from 'antd';
import _ from 'lodash';
import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import '../../../node_modules/react-grid-layout/css/styles.css';
import '../../../node_modules/react-resizable/css/styles.css';
import './index.less';

const PictureCard: React.FC = (props: any) => {
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: ItemTypes.PICTURECARD,
      item: { label: props.label, name: props.name },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
    }),
    [],
  );
  return (
    <div className="picture-card" ref={dragRef} style={{ opacity }}>
      {props.label}
    </div>
  );
};

const PictureList: React.FC = () => {
  const Group_By_TYPE_PICTURE_LIST = _.groupBy(PICTURE_LIST, 'type');
  const PICTURE_ITEMS = _.map(
    Group_By_TYPE_PICTURE_LIST,
    (value: any, key: any) => {
      const pictures = _.map(value, (v: any) => {
        //@ts-ignore
        return <PictureCard key={v.name} label={v.label} name={v.name} />;
      });
      if (key === 'Line') {
        return {
          key,
          label: '折线图/曲线图',
          children: (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>{pictures}</div>
          ),
        };
      } else if (key === 'Area') {
        return {
          key,
          label: '面积图',
          children: (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>{pictures}</div>
          ),
        };
      } else if (key === 'Column') {
        return {
          key,
          label: '柱状图',
          children: (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>{pictures}</div>
          ),
        };
      } else if (key === 'Bar') {
        return {
          key,
          label: '条形图',
          children: (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>{pictures}</div>
          ),
        };
      } else if (key === 'Pie') {
        return {
          key,
          label: '饼图/环图',
          children: (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>{pictures}</div>
          ),
        };
      } else if (key === 'Process') {
        return {
          key,
          label: '进度图',
          children: (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>{pictures}</div>
          ),
        };
      } else if (key === 'Scatter') {
        return {
          key,
          label: '散点图/气泡图',
          children: (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>{pictures}</div>
          ),
        };
      } else if (key === 'Rose') {
        return {
          key,
          label: '玫瑰图',
          children: (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>{pictures}</div>
          ),
        };
      } else if (key === 'Connection') {
        return {
          key,
          label: '关系图',
          children: (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>{pictures}</div>
          ),
        };
      } else if (key === 'Heatmap') {
        return {
          key,
          label: '热力图/色块图',
          children: (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>{pictures}</div>
          ),
        };
      }
    },
  );
  return <Collapse accordion items={PICTURE_ITEMS} />;
};

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
    console.log('item:', item);
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

const DataAnalysisPage: React.FC = () => {
  const [modalOpen, setModelOpen] = useState<boolean>(false);
  const [drawOpen, setDrawOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({});
  const { resetCanvas } = useModel('canvasData', (model) => ({
    resetCanvas: model.resetCanvas,
  }));

  return (
    <PageContainer ghost>
      <DndProvider backend={HTML5Backend}>
        <Button type="primary" onClick={() => setModelOpen(true)}>
          设置画布大小
        </Button>
        <Modal
          title="设置画布大小"
          open={modalOpen}
          onCancel={() => setModelOpen(false)}
          onOk={() =>
            resetCanvas(
              formData.name,
              formData.width,
              formData.height,
              formData.color,
            )
          }
          okText="确认修改"
          cancelText="取消"
        >
          <Form.Item
            label="画布名称"
            name="name"
            rules={[
              {
                required: true,
                message: '请输入画布名称',
              },
            ]}
          >
            <Input
              value={formData.name}
              onChange={(value) =>
                setFormData({ ...formData, name: value.target.value })
              }
            />
          </Form.Item>
          <Form.Item
            label="画布高度"
            name="height"
            rules={[
              {
                required: true,
                message: '请输入画布高度',
              },
            ]}
          >
            <InputNumber
              value={formData.height}
              onChange={(value) => setFormData({ ...formData, height: value })}
            />
          </Form.Item>
          <Form.Item
            label="画布宽度"
            name="width"
            rules={[
              {
                required: true,
                message: '请输入画布宽度',
              },
            ]}
          >
            <InputNumber
              value={formData.width}
              onChange={(value) => setFormData({ ...formData, width: value })}
            />
          </Form.Item>
          <Form.Item
            label="画布背景颜色"
            name="color"
            rules={[
              {
                required: true,
                message: '请选择画布背景颜色',
              },
            ]}
          >
            <ColorPicker
              value={formData.color}
              onChange={(value) =>
                setFormData({ ...formData, color: value.toHexString() })
              }
            />
          </Form.Item>
        </Modal>
        <Button
          type="primary"
          onClick={() => {
            setDrawOpen(true);
          }}
        >
          打开图表列表
        </Button>
        <Drawer
          title="图表盘"
          mask={false}
          placement="right"
          onClose={() => setDrawOpen(false)}
          open={drawOpen}
        >
          <PictureList />
        </Drawer>
        <Button type="primary" onClick={() => DomToPng('canvas')}>
          下载快照
        </Button>
        <DataAnalysisCanvas />
      </DndProvider>
    </PageContainer>
  );
};

export default DataAnalysisPage;