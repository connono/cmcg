import { PICTURE_LIST } from '@/constants';
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
import _ from 'lodash';
import React, { useState } from 'react';
import './index.less';

const PictureList: React.FC = () => {
  const pictures = _.map(PICTURE_LIST, (value: any, key: any) => {
    return (
      <div className="picture-card" key={key}>
        {value.label}
      </div>
    );
  });
  return <div>{pictures}</div>;
};

const DataAnalysisPage: React.FC = () => {
  const [modalOpen, setModelOpen] = useState<boolean>(false);
  const [drawOpen, setDrawOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({});
  const { canvasData, setCanvasData } = useModel('canvasData');

  return (
    <PageContainer ghost>
      <Button type="primary" onClick={() => setModelOpen(true)}>
        设置画布大小
      </Button>
      <Modal
        title="设置画布大小"
        open={modalOpen}
        onCancel={() => setModelOpen(false)}
        onOk={() => setCanvasData(formData)}
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
      <div
        id="canvas"
        style={{
          backgroundColor: canvasData.color,
          width: canvasData.width,
          height: canvasData.height,
        }}
      >
        这里是画布.
      </div>
    </PageContainer>
  );
};

export default DataAnalysisPage;
