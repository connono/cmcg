import {
  Checkbox,
  FormCollapse,
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
              'x-component': 'Input',
            },
            basic_title_fontWeight: {
              type: 'string',
              title: '标题字体粗细',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'Input',
            },
            basic_title_lineHeight: {
              type: 'string',
              title: '标题字体行高',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'Input',
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
          },
        },
        legend: {
          type: 'void',
          'x-component': 'FormCollapse.CollapsePanel',
          'x-component-props': {
            header: '图例设置',
          },
          properties: {
            legend_layout: {
              type: 'string',
              title: '图例布局',
              enum: [
                {
                  label: '横向布局',
                  value: 'horizontal',
                },
                {
                  label: '纵向布局',
                  value: 'vertical',
                },
              ],
              'x-decorator': 'FormItem',
              'x-component': 'Radio.Group',
            },
            legend_offsetX: {
              type: 'string',
              title: 'X轴偏差',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
            },
            legend_offsetY: {
              type: 'string',
              title: 'Y轴偏差',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
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
            axis_isHide: {
              type: 'boolean',
              title: '是否显示',
              required: false,
              'x-decorator': 'FormItem',
              'x-component': 'Checkbox',
            },
            axis_position: {
              type: 'string',
              title: '坐标轴位置',
              enum: [
                {
                  label: '顶部',
                  value: 'top',
                },
                {
                  label: '底部',
                  value: 'bottom',
                },
                {
                  label: '左边',
                  value: 'left',
                },
                {
                  label: '右边',
                  value: 'right',
                },
              ],
              'x-decorator': 'FormItem',
              'x-component': 'Radio.Group',
            },
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
                axis_xAxis_min: {
                  type: 'string',
                  title: '横坐标轴最小值',
                  'x-decorator': 'FormItem',
                  'x-component': 'NumberPicker',
                },
                axis_xAxis_max: {
                  type: 'string',
                  title: '横坐标轴最大值',
                  'x-decorator': 'FormItem',
                  'x-component': 'NumberPicker',
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
                axis_yAxis_min: {
                  type: 'string',
                  title: '纵坐标轴最小值',
                  'x-decorator': 'FormItem',
                  'x-component': 'NumberPicker',
                },
                axis_yAxis_max: {
                  type: 'string',
                  title: '纵坐标轴最大值',
                  'x-decorator': 'FormItem',
                  'x-component': 'NumberPicker',
                },
              },
            },
          },
        },
        slider: {
          type: 'void',
          'x-component': 'FormCollapse.CollapsePanel',
          'x-component-props': {
            header: '缩略轴',
          },
          properties: {
            slider_isHide: {
              type: 'boolean',
              title: '是否显示',
              required: true,
              'x-decorator': 'FormItem',
              'x-component': 'Checkbox',
            },
            slider_start: {
              type: 'string',
              title: '默认起始位置',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            slider_end: {
              type: 'string',
              title: '默认结束位置',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
          },
        },
        label: {
          type: 'void',
          'x-component': 'FormCollapse.CollapsePanel',
          'x-component-props': {
            header: '数据标签',
          },
          properties: {
            label_offsetX: {
              type: 'string',
              title: 'X轴偏差',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
            },
            label_offsetY: {
              type: 'string',
              title: 'Y轴偏差',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
            },
            label_position: {
              type: 'string',
              title: '标签位置',
              enum: [
                {
                  label: '顶部',
                  value: 'top',
                },
                {
                  label: '底部',
                  value: 'bottom',
                },
                {
                  label: '左边',
                  value: 'left',
                },
                {
                  label: '右边',
                  value: 'right',
                },
                {
                  label: '中间',
                  value: 'middle',
                },
              ],
              'x-decorator': 'FormItem',
              'x-component': 'Radio.Group',
            },
          },
        },
        tooltip: {
          type: 'void',
          'x-component': 'FormCollapse.CollapsePanel',
          'x-component-props': {
            header: '悬浮提示',
          },
          properties: {
            tooltip_fields: {
              type: 'string',
              title: '字段选择',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            tooltip_fields_follow: {
              type: 'boolean',
              title: '是否跟随鼠标移动',
              'x-decorator': 'FormItem',
              'x-component': 'Checkbox',
            },
            tooltip_fields_enterable: {
              type: 'boolean',
              title: '是否允许鼠标滑入',
              'x-decorator': 'FormItem',
              'x-component': 'Checkbox',
            },
            tooltip_fields_showCrosshairs: {
              type: 'boolean',
              title: '是否展示十字线',
              'x-decorator': 'FormItem',
              'x-component': 'Checkbox',
            },
            tooltip_fields_shared: {
              type: 'boolean',
              title: '是否合并当前点对应的所有数据并展示',
              'x-decorator': 'FormItem',
              'x-component': 'Checkbox',
            },
            tooltip_fields_position: {
              type: 'string',
              title: '悬浮提示位置',
              enum: [
                {
                  label: '顶部',
                  value: 'top',
                },
                {
                  label: '底部',
                  value: 'bottom',
                },
                {
                  label: '左边',
                  value: 'left',
                },
                {
                  label: '右边',
                  value: 'right',
                },
              ],
              'x-decorator': 'FormItem',
              'x-component': 'Radio.Group',
            },
          },
        },
      },
    },
  },
};

const initialValue = {
  basic_title: '未命名图表',
  basic_title_fontSize: '14px',
  basic_title_fontWeight: '60',
  basic_title_lineHeight: '45px',
  basic_xField: '',
  basic_yField: '',
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
  };
  return config;
};

export const basicLineSchema = {
  schema,
  SchemaField,
  initialValue,
  formToConfig,
  scope: {
    formCollapse,
  },
};

export const BasicLineRender = async (
  container?: any,
  component_name?: string,
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
