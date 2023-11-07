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
              title: 'x轴映射',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'Input',
            },
            basic_yField: {
              type: 'string',
              title: 'y轴映射',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'Input',
            },
            basic_colorField: {
              type: 'string',
              title: '颜色映射',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'Input',
            },
          },
        },
      },
    },
  },
};

const initialValue = {
  basic_title: '基本热力图',
  basic_title_fontSize: '14',
  basic_title_fontWeight: '60',
  basic_title_height: '42',
  basic_xField: '',
  basic_yField: '',
  basic_colorField: '',
};

const formToConfig = (values: any) => {
  const xField = values.basic_xField;
  const yField = values.basic_yField;
  const config = {
    xField,
    yField,
    colorField: values.basic_colorField,
    meta: {
      [xField]: {
        type: 'cat',
      },
      [yField]: {
        type: 'cat',
      },
    },
  };
  return config;
};

export const basicHeatmapSchema = {
  schema,
  SchemaField,
  initialValue,
  formToConfig,
  scope: {
    formCollapse,
  },
};

export const BasicHeatmapRender = async (
  container?: any,
  config?: any,
  callback?: any,
) => {
  let Heatmap;
  await import('@antv/g2plot/lib/plots/heatmap').then((Module) => {
    Heatmap = Module.Heatmap;
  });

  const heatmap = new Heatmap(container, config);
  heatmap.render();
  callback(heatmap);
};
