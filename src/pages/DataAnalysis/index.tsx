import DataAnalysisCanvas from '@/components/DataAnalysis/DataAnysisCanvans';
import PictureList from '@/components/DataAnalysis/PictureList';
import { DomToPng } from '@/utils/file-saver';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import {
  Button,
  ColorPicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
} from 'antd';
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../../../node_modules/react-grid-layout/css/styles.css';
import '../../../node_modules/react-resizable/css/styles.css';
import './index.less';

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
