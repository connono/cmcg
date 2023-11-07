import {
  Checkbox,
  FormCollapse,
  FormGrid,
  FormItem,
  Input,
  NumberPicker,
  Radio,
} from '@formily/antd-v5';
import { createSchemaField } from '@formily/react';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormCollapse,
    Input,
    Radio,
    NumberPicker,
    Checkbox,
    FormGrid,
  },
});

const formCollapse = FormCollapse.createFormCollapse();

const schema = {
  type: 'object',
  properties: {
    collapse: {
      type: 'void',
      'x-decorator': 'FormItem',
      'x-component': 'FormCollapse',
      'x-component-props': {
        formCollapse: '{{formCollapse}}',
      },
      properties: {
        basic: {
          type: 'void',
          'x-component': 'FormCollapse.CollapsePanel',
          'x-component-props': {
            header: '基本信息',
          },
          properties: {
            basic_title: {
              type: 'string',
              title: '图表标题',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'Input',
            },
            basic_title_fontSize: {
              type: 'string',
              title: '标题字体大小',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'NumberPicker',
            },
            basic_title_fontWeight: {
              type: 'string',
              title: '标题字体粗细',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'Input',
            },
            basic_title_height: {
              type: 'string',
              title: '标题高度',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'NumberPicker',
            },
            basic_xField: {
              type: 'string',
              title: 'x轴',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'Input',
            },
            basic_yField: {
              type: 'string',
              title: 'y轴',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'Input',
            },
            basic_seriesField: {
              type: 'string',
              title: '分类值',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'Input',
            },
            basic_radius: {
              type: 'string',
              title: '外径比例（0-1）',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'NumberPicker',
            },
          },
        },
      },
    },
  },
};

const initialValue = {
  basic_title: '分组玫瑰图',
  basic_title_fontSize: '14',
  basic_title_fontWeight: '60',
  basic_title_height: '42',
  basic_xField: '',
  basic_yField: '',
  basic_seriesField: '',
  basic_radius: '0.8',
};

const formToConfig = (values: any) => {
  const config = {
    xField: values.basic_xField,
    yField: values.basic_yField,
    seriesField: values.basic_seriesField,
    radius: values.basic_radius,
    isGroup: true,
  };
  return config;
};

export const groupRoseSchema = {
  schema,
  SchemaField,
  initialValue,
  formToConfig,
  scope: {
    formCollapse,
  },
};

export const GroupRoseRender = async (
  container?: any,
  config?: any,
  callback?: any,
) => {
  let Rose;
  await import('@antv/g2plot/lib/plots/rose').then((Module) => {
    Rose = Module.Rose;
  });

  const rose = new Rose(container, config);
  rose.render();
  callback(rose);
};
