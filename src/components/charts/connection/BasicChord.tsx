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
          },
        },
      },
    },
  },
};

const initialValue = {
  basic_title: '基本弦图',
  basic_title_fontSize: '14',
  basic_title_fontWeight: '60',
  basic_title_height: '42',
  basic_sourceField: '',
  basic_targetField: '',
  basic_weightField: '',
};

const formToConfig = (values: any) => {
  const config = {
    sourceField: values.basic_sourceField,
    targetField: values.basic_targetField,
    weightField: values.basic_weightField,
  };
  return config;
};

export const basicChordSchema = {
  schema,
  SchemaField,
  initialValue,
  formToConfig,
  scope: {
    formCollapse,
  },
};

export const BasicChordRender = async (
  container?: any,
  config?: any,
  callback?: any,
) => {
  let Chord;
  await import('@antv/g2plot/lib/plots/chord').then((Module) => {
    Chord = Module.Chord;
  });

  const chord = new Chord(container, config);
  chord.render();
  callback(chord);
};
