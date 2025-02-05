import PreviewListVisible from '@/components/PreviewListVisible';
import { SERVER_HOST } from '@/constants';
import { PageContainer } from '@ant-design/pro-components';
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

const getItem = async (serial_number: string) => {
  return await axios.get(
    `${SERVER_HOST}/consumable/apply/getItem?serial_number=${serial_number}`,
  );
};

const getDirectoryItem = async (id: string) => {
  return await axios.get(
    `${SERVER_HOST}/consumable/directory/getItem?serial_number=${id}`,
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
      </Row>
      <Row>
        <PreviewListVisible
          title="合同附件"
          fileListString={props.record.contract_file}
        />
      </Row>
    </div>
  );
};

const ConsumableRecordPage: React.FC = () => {
  const hashArray = history.location.hash.split('#')[1].split('&');
  const id = hashArray[0];
  const [consumableApplyItem, setConsumableApplyItem] = useState<any>({});
  const [consumableDirectoryItem, setConsumableDirectoryItem] = useState<any>(
    {},
  );
  const [items, setItems] = useState<CollapseProps['items']>([]);
  const { run: runGetConsumableRecords } = useRequest(getConsumableRecords, {
    manual: true,
    onSuccess: (result: any) => {
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

  const { run: runGetItem } = useRequest(getItem, {
    manual: true,
    onSuccess: (result: any) => {
      setConsumableApplyItem(result.data);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runGetDiretoryItem } = useRequest(getDirectoryItem, {
    manual: true,
    onSuccess: (result: any) => {
      setConsumableDirectoryItem(result.data);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  useEffect(() => {
    runGetItem(id);
    runGetConsumableRecords(id);
    runGetDiretoryItem(id);
  }, []);
  return (
    <PageContainer
      ghost
      header={{
        title: '耗材动态记录',
      }}
    >
      <Divider orientation="left">耗材列表</Divider>
      <Row>
        <ConsumableRecordCardItem
          label="申请编号："
          value={consumableDirectoryItem.consumable_apply_id}
        />
        <ConsumableRecordCardItem
          label="平台ID："
          value={consumableDirectoryItem.platform_id}
        />
        <ConsumableRecordCardItem
          label="申请科室："
          value={consumableDirectoryItem.department}
        />
        <ConsumableRecordCardItem
          label="耗材名称："
          value={consumableDirectoryItem.consumable}
        />
        <ConsumableRecordCardItem
          label="型号："
          value={consumableDirectoryItem.model}
        />
        <ConsumableRecordCardItem
          label="采购单价："
          value={consumableDirectoryItem.price}
        />
        <ConsumableRecordCardItem
          label="失效日期："
          value={consumableDirectoryItem.exp_date}
        />
        <ConsumableRecordCardItem
          label="注册证号："
          value={consumableDirectoryItem.registration_num}
        />
        <ConsumableRecordCardItem
          label="供应商："
          value={consumableDirectoryItem.company}
        />
        <ConsumableRecordCardItem
          label="生产厂家："
          value={consumableDirectoryItem.manufacturer}
        />
        <ConsumableRecordCardItem
          label="浙江分类："
          value={consumableDirectoryItem.category_zj}
        />
        <ConsumableRecordCardItem
          label="一级目录："
          value={consumableDirectoryItem.parent_directory}
        />
        <ConsumableRecordCardItem
          label="二级目录："
          value={consumableDirectoryItem.child_directory}
        />
        <ConsumableRecordCardItem
          label="中止原因："
          value={consumableDirectoryItem.stop_reason}
        />
      </Row>

      <Divider orientation="left">申请记录</Divider>
      <Row>
        <ConsumableRecordCardItem
          label="申请编号："
          value={consumableApplyItem.serial_number}
        />
        <ConsumableRecordCardItem
          label="平台ID："
          value={consumableApplyItem.platform_id}
        />
        <ConsumableRecordCardItem
          label="申请科室："
          value={consumableApplyItem.department}
        />
        <ConsumableRecordCardItem
          label="耗材名称："
          value={consumableApplyItem.consumable}
        />
        <ConsumableRecordCardItem
          label="型号："
          value={consumableApplyItem.model}
        />
        <ConsumableRecordCardItem
          label="采购单价："
          value={consumableApplyItem.price}
        />
        <ConsumableRecordCardItem
          label="申请日期："
          value={consumableApplyItem.apply_date}
        />
        <ConsumableRecordCardItem
          label="注册证号："
          value={consumableApplyItem.registration_num}
        />
        <ConsumableRecordCardItem
          label="供应商："
          value={consumableApplyItem.company}
        />
        <ConsumableRecordCardItem
          label="生产厂家："
          value={consumableApplyItem.manufacturer}
        />
        <ConsumableRecordCardItem
          label="浙江分类："
          value={consumableApplyItem.category_zj}
        />
        <ConsumableRecordCardItem
          label="一级目录："
          value={consumableApplyItem.parent_directory}
        />
        <ConsumableRecordCardItem
          label="二级目录："
          value={consumableApplyItem.child_directory}
        />
      </Row>
      <Row style={{ marginBottom: '10px' }} gutter={16}>
        {/* <PreviewListVisible
          title="申请单附件"
          fileListString={history.location.state.apply_file}
        /> */}
      </Row>
      <Divider orientation="left">询价记录</Divider>
      <Collapse accordion items={items} />
    </PageContainer>
  );
};

export default ConsumableRecordPage;
