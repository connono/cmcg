import { ProCard } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Badge, Button, Tabs } from 'antd';
import _ from 'lodash';
import React from 'react';

interface EquipmentApplyNotificationCardProps {
  data?: any;
}

interface InstrumentApplyNotificationCardProps {
  data?: any;
}

interface Props {
  data?: any;
}

const EquipmentApplyNotificationCard: React.FC<
  EquipmentApplyNotificationCardProps
> = (props) => {
  if (!props.data) return <div></div>;
  const listTitleMap = new Map([
    ['survey', '待调研'],
    ['approve', '待政府审批'],
    ['tender', '待招标'],
    ['contract', '待合同'],
    ['install', '待安装验收'],
    ['engineer_approve', '待医工科审核'],
    ['warehouse', '待入库'],
    ['finish', '入库结束'],
  ]);
  const procardlists = _.map(
    _.groupBy(props.data, 'type'),
    (value: any, key: any) => {
      const procardlist = _.map(value, (v: any, k: any) => {
        return (
          <ProCard
            key={k}
            title={
              <div>
                <span style={{ marginRight: '25px' }}>
                  固定资产名称：{v.data.equipment}
                </span>
                <span style={{ marginRight: '25px' }}>
                  数量: {v.data.count}
                </span>
                <span style={{ marginRight: '25px' }}>
                  金额：{v.data.budget}
                </span>
              </div>
            }
            extra={
              <Button
                size="small"
                type="primary"
                onClick={() => history.push(v.link, v.data)}
              >
                去处理
              </Button>
            }
          ></ProCard>
        );
      });
      return (
        <ProCard
          layout="center"
          direction="column"
          title={
            <div style={{ display: 'inline-block' }}>
              {listTitleMap.get(key)}
              <Badge
                count={procardlist.length}
                title={'还有' + procardlist.length + '条任务等待处理'}
              />
            </div>
          }
          ghost
          key={key}
          gutter={8}
          collapsible
          bordered
        >
          {procardlist}
        </ProCard>
      );
    },
  );
  return <>{procardlists}</>;
};

const InstrumentApplyNotificationCard: React.FC<
  InstrumentApplyNotificationCardProps
> = (props) => {
  if (!props.data) return <div></div>;
  const listTitleMap = new Map([
    ['survey', '待调研'],
    ['contract', '待采购'],
    ['install', '待安装验收'],
    ['engineer_approve', '待医工科审核'],
  ]);
  const procardlists = _.map(
    _.groupBy(props.data, 'type'),
    (value: any, key: any) => {
      const procardlist = _.map(value, (v: any, k: any) => {
        return (
          <ProCard
            key={k}
            title={
              <div>
                <span style={{ marginRight: '25px' }}>
                  医疗器械名称：{v.data.instrument}
                </span>
                <span style={{ marginRight: '25px' }}>
                  数量: {v.data.count}
                </span>
                <span style={{ marginRight: '25px' }}>
                  金额：{v.data.budget}
                </span>
              </div>
            }
            extra={
              <Button
                size="small"
                type="primary"
                onClick={() => history.push(v.link, v.data)}
              >
                去处理
              </Button>
            }
          ></ProCard>
        );
      });
      return (
        <ProCard
          layout="center"
          direction="column"
          title={
            <div style={{ display: 'inline-block' }}>
              {listTitleMap.get(key)}
              <Badge
                count={procardlist.length}
                title={'还有' + procardlist.length + '条任务等待处理'}
              />
            </div>
          }
          ghost
          key={key}
          gutter={8}
          collapsible
          bordered
        >
          {procardlist}
        </ProCard>
      );
    },
  );
  return <>{procardlists}</>;
};

const ApplyNotificationTab: React.FC<Props> = (props) => {
  const equipmentApplyRecordData = _.filter(props.data, [
    'n_category',
    'equipmentApplyRecord',
  ]);
  const instrumentApplyRecordData = _.filter(props.data, [
    'n_category',
    'instrumentApplyRecord',
  ]);
  const items = [
    {
      label: <Badge count={equipmentApplyRecordData.length}>设备采购</Badge>,
      key: '1',
      children: (
        <EquipmentApplyNotificationCard data={equipmentApplyRecordData} />
      ),
    },
    {
      label: (
        <Badge count={instrumentApplyRecordData.length}>器械医疗用品采购</Badge>
      ),
      key: '2',
      children: (
        <InstrumentApplyNotificationCard data={instrumentApplyRecordData} />
      ),
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} />;
};

export default ApplyNotificationTab;
