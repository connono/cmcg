import PdfPreview from '@/components/PdfPreview';
import PicturePreview from '@/components/PicturePreview';
import { SERVER_HOST } from '@/constants';
import { isPDF, isPicture } from '@/utils/file-uploader';
import { PageContainer, ProFormItem } from '@ant-design/pro-components';
import { history, useRequest } from '@umijs/max';
import type { CollapseProps } from 'antd';
import { Col, Collapse, Divider, Row, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';

const getConsumableRecords = async (id: string) => {
  return await axios.get(
    `${SERVER_HOST}/consumable/trends/index?serial_number=${id}`,
  );
};

const ConsumableRecordCardItem: React.FC = (props: any) => {
  return (
    <Col span={8}>
      <div style={{ marginBottom: '5px' }}>
        <span>{props.label}</span>
        <span>{props.value}</span>
      </div>
    </Col>
  );
};

const ConsumableRecordCardChildren: React.FC = (props: any) => {
  const preview = (contract_file: any) => {
    if (!contract_file) return <div></div>;
    if (isPDF(contract_file)) return <PdfPreview url={contract_file} />;
    if (isPicture(contract_file)) return <PicturePreview url={contract_file} />;
  };

  return (
    <div>
      <Row>
        <ConsumableRecordCardItem
          label="申请编号："
          value={props.record.consumable_apply_id}
        />
        <ConsumableRecordCardItem
          label="平台ID："
          value={props.record.platform_id}
        />
        <ConsumableRecordCardItem
          label="申请科室："
          value={props.record.department}
        />
        <ConsumableRecordCardItem
          label="耗材名称："
          value={props.record.consumable}
        />
        <ConsumableRecordCardItem label="型号：" value={props.record.model} />
        <ConsumableRecordCardItem
          label="采购单价："
          value={props.record.price}
        />
        <ConsumableRecordCardItem
          label="合同日期："
          value={props.record.start_date}
        />
        <ConsumableRecordCardItem
          label="失效日期："
          value={props.record.exp_date}
        />
        <ConsumableRecordCardItem
          label="注册证号："
          value={props.record.registration_num}
        />
        <ConsumableRecordCardItem
          label="供应商："
          value={props.record.company}
        />
        <ConsumableRecordCardItem
          label="生产厂家："
          value={props.record.manufacturer}
        />
        <ConsumableRecordCardItem
          label="浙江分类："
          value={props.record.category_zj}
        />
        <ConsumableRecordCardItem
          label="一级目录："
          value={props.record.parent_directory}
        />
        <ConsumableRecordCardItem
          label="二级目录："
          value={props.record.child_directory}
        />
        <ConsumableRecordCardItem
          label="是否为便民药房："
          value={props.record.in_drugstore}
        />
        <ConsumableRecordCardItem
          label="停用日期："
          value={props.record.stop_date}
        />
      </Row>

      <ProFormItem label="申请单附件：">
        {preview(props.record.contract_file)}
      </ProFormItem>
    </div>
  );
};

const ConsumableRecordPage: React.FC = () => {
  const hashArray = history.location.hash.split('#')[1].split('&');
  const id = hashArray[0];
  const [items, setItems] = useState<CollapseProps['items']>([]);
  const { run: runGetConsumableRecords } = useRequest(getConsumableRecords, {
    manual: true,
    onSuccess: (result: any) => {
      console.log('result:', result);
      const i = _.map(result, (value: any, key: any) => {
        return {
          key: key.toString(),
          label: `生产厂家:${value.manufacturer + '    '}型号:${
            value.model + '    '
          }价格：${value.price + '    '}`,
          children: <ConsumableRecordCardChildren record={value} />,
        };
      });
      setItems(i);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  useEffect(() => {
    runGetConsumableRecords(id);
  }, []);

  return (
    <PageContainer
      ghost
      header={{
        title: '耗材动态记录',
      }}
    >
      <Divider orientation="left">{history.location.state.consumable}</Divider>
      <Row style={{ marginBottom: '10px' }} gutter={16}>
        <Col span={6}>申请科室：{history.location.state.department}</Col>
      </Row>
      <Collapse accordion items={items} />
    </PageContainer>
  );
};

export default ConsumableRecordPage;
