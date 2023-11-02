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
              title: '分类',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'Input',
            },
            basic_stepType: {
              type: 'string',
              title: '梯高',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'Input',
            },
          },
        },
        axis: {
          type: 'void',
          'x-component': 'FormCollapse.CollapsePanel',
          'x-component-props': {
            header: '坐标轴',
          },
          properties: {
            axis_xAxis: {
              type: 'void',
              'x-component': 'FormGrid',
              'x-component-props': {
                minColumns: [4, 6, 10],
              },
              properties: {
                axis_xAxis_title: {
                  type: 'string',
                  title: '横坐标轴标题',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
              },
            },
            axis_yAxis: {
              type: 'void',
              'x-component': 'FormGrid',
              'x-component-props': {
                minColumns: [4, 6, 10],
              },
              properties: {
                axis_yAxis_title: {
                  type: 'string',
                  title: '纵坐标轴标题',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
              },
            },
          },
        },
      },
    },
  },
};

const initialValue = {
  basic_title: '多阶梯折线图',
  basic_title_fontSize: '14',
  basic_title_fontWeight: '60',
  basic_title_height: '42',
  basic_xField: '',
  basic_yField: '',
  basic_seriesField: '',
  basic_stepType: '',
  axis_isHide: false,
  axis_xAxis_title: '',
  axis_yAxis_title: '',
  slider_isHide: true,
};

const formToConfig = (values: any) => {
  const config = {
    xField: values.basic_xField,
    yField: values.basic_yField,
    xAxis: {
      title: {
        text: values.axis_xAxis_title,
      },
    },
    yAxis: {
      title: {
        text: values.axis_yAxis_title,
      },
    },
    seriesField: values.basic_seriesField,
    stepType: values.basic_stepType,
  };
  return config;
};

export const multipleStepLineSchema = {
  schema,
  SchemaField,
  initialValue,
  formToConfig,
  scope: {
    formCollapse,
  },
};

export const MultipleStepLineRender = async (
  container?: any,
  config?: any,
  callback?: any,
) => {
  let Line;
  await import('@antv/g2plot/lib/plots/line').then((Module) => {
    Line = Module.Line;
  });

  const line = new Line(container, config);
  line.render();
  callback(line);
};
