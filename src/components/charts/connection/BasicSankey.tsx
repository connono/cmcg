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
            basic_sourceField: {
              type: 'string',
              title: '来源节点数据字段',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'Input',
            },
            basic_targetField: {
              type: 'string',
              title: '目标节点数据字段',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'Input',
            },
            basic_weightField: {
              type: 'string',
              title: '权重字段信息',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'Input',
            },
            basic_nodeWidthRatio: {
              type: 'string',
              title: '节点的宽度配置(0 ~ 1）',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'NumberPicker',
            },
            basic_nodePaddingRatio: {
              type: 'string',
              title: '节点的之间垂直方向的间距（0 ~ 1）',
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
  basic_title: '基本桑基图',
  basic_title_fontSize: '14',
  basic_title_fontWeight: '60',
  basic_title_height: '42',
  basic_sourceField: '',
  basic_targetField: '',
  basic_weightField: '',
  basic_nodeWidthRatio: '0.008',
  basic_nodePaddingRatio: '0.01',
};

const formToConfig = (values: any) => {
  const config = {
    sourceField: values.basic_sourceField,
    targetField: values.basic_targetField,
    weightField: values.basic_weightField,
    nodeWidthRatio: values.basic_nodeWidthRatio,
    nodePaddingRatio: values.basic_nodePaddingRatio,
  };
  return config;
};

export const basicSankeySchema = {
  schema,
  SchemaField,
  initialValue,
  formToConfig,
  scope: {
    formCollapse,
  },
};

export const BasicSankeyRender = async (
  container?: any,
  config?: any,
  callback?: any,
) => {
  let Sankey;
  await import('@antv/g2plot/lib/plots/sankey').then((Module) => {
    Sankey = Module.Sankey;
  });

  const sankey = new Sankey(container, config);
  sankey.render();
  callback(sankey);
};
