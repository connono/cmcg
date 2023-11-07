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
            basic_colorField: {
              type: 'string',
              title: '分类值',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'Input',
            },
            basic_shape: {
              type: 'string',
              title: '散点形状',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'Input',
            },
            basic_min_size: {
              type: 'string',
              title: '点最小半径',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'NumberPicker',
            },
            basic_max_size: {
              type: 'string',
              title: '点最大半径',
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
  basic_title: '基本散点图',
  basic_title_fontSize: '14',
  basic_title_fontWeight: '60',
  basic_title_height: '42',
  basic_xField: '',
  basic_yField: '',
  basic_colorField: '',
  basic_shape: 'circle',
  basic_min_size: 4,
  basic_max_size: 4,
};

const formToConfig = (values: any) => {
  const size =
    values.basic_min_size === values.basic_max_size
      ? values.basic_min_size
      : [values.basic_min_size, values.basic_max_size];
  const config = {
    xField: values.basic_xField,
    yField: values.basic_yField,
    colorField: values.basic_colorField,
    shape: values.basic_shape,
    size,
  };
  return config;
};

export const basicScatterSchema = {
  schema,
  SchemaField,
  initialValue,
  formToConfig,
  scope: {
    formCollapse,
  },
};

export const BasicScatterRender = async (
  container?: any,
  config?: any,
  callback?: any,
) => {
  let Scatter;
  await import('@antv/g2plot/lib/plots/scatter').then((Module) => {
    Scatter = Module.Scatter;
  });

  const scatter = new Scatter(container, config);
  scatter.render();
  callback(scatter);
};
