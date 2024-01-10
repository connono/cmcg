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
import ReactDOM from 'react-dom';
import './BasicIndicatorCard.css';

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
            basic_field: {
              type: 'string',
              title: '数值',
              'x-decorator': 'FormItem',
              required: true,
              'x-component': 'Input',
            },
            basic_field_describe: {
              type: 'string',
              title: '数值描述',
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
  basic_field: '',
  basic_field_describe: '',
};

const formToConfig = (values: any) => {
  const config = {
    field: values.basic_field,
    field_describe: values.field_describe,
  };
  return config;
};

export const basicIndicatorCardSchema = {
  schema,
  SchemaField,
  initialValue,
  formToConfig,
  scope: {
    formCollapse,
  },
};

export const BasicIndicatorCardRender = async (
  container?: any,
  config?: any,
) => {
  const containerElement = document.getElementById(container);

  ReactDOM.render(
    <div className="g2-tooltip-item">
      <div className="g2-tooltip-item-marker"></div>
      <div className="g2-tooltip-item-label">{config.data.field_describe}</div>
      <div className="g2-tooltip-item-value">{config.data.field}</div>
    </div>,
    containerElement,
  );
};
