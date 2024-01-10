import { mockData } from '@/constants/mockData';
import { PICTURE_LIST } from '@/utils/chart-render';
import { DeleteOutlined, FormOutlined } from '@ant-design/icons';
import { FormLayout } from '@formily/antd-v5';
import { createForm, onFormValuesChange } from '@formily/core';
import { FormConsumer, FormProvider } from '@formily/react';
import { Drawer, FloatButton } from 'antd';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

interface Props {
  chart: any;
  deleteChart: any;
}

const ChartComponent: React.FC<Props> = (props) => {
  const [chart, setChart] = useState();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState({});
  const [data, setData] = useState([]);

  const render = _.find(PICTURE_LIST, ['name', props.chart.component])?.render;
  const schema = _.find(PICTURE_LIST, ['name', props.chart.component])?.schema;

  const form = useMemo(
    () =>
      createForm({
        effects() {
          onFormValuesChange((form) => {
            setConfig(schema.formToConfig(form.values));
          });
        },
      }),
    [],
  );

  useEffect(() => {
    fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/heatmap.json')
      .then((res) => res.json())
      .then(() => {
        setData(mockData);
      })
      .then(() => {
        form.setInitialValues({
          ...schema.initialValue,
        });
        setConfig(schema.formToConfig(form.values));
      });
    console.log('getData && initial');
  }, []);
  useEffect(() => {
    if (_.isEmpty(chart) && !_.isEmpty(data) && !_.isEmpty(config)) {
      console.log('draw plot');
      render(props.chart.name, { data, ...config }, (c: any) => setChart(c));
    }
  }, [data, config]);
  useEffect(() => {
    if (!_.isEmpty(chart) && !_.isEmpty(data) && !_.isEmpty(config)) {
      console.log('changeData');
      chart.changeData(data);
    }
  }, [data]);
  useEffect(() => {
    if (!_.isEmpty(chart) && !_.isEmpty(data) && !_.isEmpty(config)) {
      console.log('update config');
      chart.update(config);
    }
  }, [config]);
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => {
        setVisible(true);
      }}
      onMouseLeave={() => {
        setVisible(false);
      }}
    >
      <FormProvider form={form}>
        <FormConsumer>
          {() => (
            <div
              style={{
                width: '100%',
                padding:
                  parseInt(form.values.basic_title_height) / 2 + 'px 0px',
                fontWeight: form.values.basic_title_fontWeight,
                fontSize: parseInt(form.values.basic_title_fontSize) + 'px',
                overflow: 'hidden',
                textAlign: 'center',
              }}
            >
              {form.values.basic_title}
            </div>
          )}
        </FormConsumer>
        <div
          id={props.chart.name}
          key={props.chart.name}
          style={{ width: '100%', flex: 1 }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            display: !visible ? 'none' : 'inherit',
          }}
        >
          <FloatButton.Group
            shape="square"
            type="primary"
            style={{ right: -24 }}
          >
            <FloatButton
              icon={<FormOutlined />}
              onClick={() => {
                setOpen(true);
              }}
            />
            <FloatButton
              icon={<DeleteOutlined />}
              onClick={() => {
                props.deleteChart(props.chart.name);
              }}
            />
          </FloatButton.Group>
        </div>
        <Drawer onClose={() => setOpen(false)} mask={false} open={open}>
          <FormLayout layout="vertical">
            <schema.SchemaField schema={schema.schema} scope={schema.scope} />
          </FormLayout>
        </Drawer>
      </FormProvider>
    </div>
  );
};

export default ChartComponent;
