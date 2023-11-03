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
            basic_angleField: {
              type: 'string',
              title: '角度映射',
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
            basic_radius: {
              type: 'string',
              title: '外径比例（0-1）',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'NumberPicker',
            },
            basic_innerRadius: {
              type: 'string',
              title: '内径比例（0-1）',
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
  basic_title: '基本饼图',
  basic_title_fontSize: '14',
  basic_title_fontWeight: '60',
  basic_title_height: '42',
  basic_angleField: '',
  basic_colorField: '',
  basic_radius: '0.8',
  basic_innerRadius: '0.6',
};

const formToConfig = (values: any) => {
  const config = {
    angleField: values.basic_angleField,
    colorField: values.basic_colorField,
    radius: values.basic_radius,
    innerRadius: values.basic_innerRadius,
  };
  return config;
};

export const basicRingSchema = {
  schema,
  SchemaField,
  initialValue,
  formToConfig,
  scope: {
    formCollapse,
  },
};

export const BasicRingRender = async (
  container?: any,
  config?: any,
  callback?: any,
) => {
  let Pie;
  await import('@antv/g2plot/lib/plots/pie').then((Module) => {
    Pie = Module.Pie;
  });

  const pie = new Pie(container, config);
  pie.render();
  callback(pie);
};
