import { ProCard } from '@ant-design/pro-components';
import { Badge, Button, Space, Tabs } from 'antd';
import _ from 'lodash';
import React from 'react';

interface EquipmentApplyNotificationCardProps {
  data?: any;
  ignore: any;
}

interface InstrumentApplyNotificationCardProps {
  data?: any;
  ignore: any;
}

interface RepairApplyNotificationCardProps {
  data?: any;
  ignore: any;
}

interface Props {
  data?: any;
  ignore: any;
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
                {v.data.price ? (
                  <span style={{ marginRight: '25px' }}>
                    金额：{v.data.price}
                  </span>
                ) : (
                  <span style={{ marginRight: '25px' }}>
                    预算：{v.data.budget}
                  </span>
                )}
              </div>
            }
            extra={
              <Space>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => window.open('/#' + v.link, '_blank')}
                >
                  去处理
                </Button>
                <Button
                  size="small"
                  type="primary"
                  onClick={async () => await props.ignore(v.notification_id)}
                >
                  忽略该通知
                </Button>
              </Space>
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
                {v.data.price ? (
                  <span style={{ marginRight: '25px' }}>
                    金额：{v.data.price}
                  </span>
                ) : (
                  <span style={{ marginRight: '25px' }}>
                    预算：{v.data.budget}
                  </span>
                )}
              </div>
            }
            extra={
              <Space>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => window.open('/#' + v.link, '_blank')}
                >
                  去处理
                </Button>
                <Button
                  size="small"
                  type="primary"
                  onClick={async () => await props.ignore(v.notification_id)}
                >
                  忽略该通知
                </Button>
              </Space>
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

const RepairApplyNotificationCard: React.FC<
  RepairApplyNotificationCardProps
> = (props) => {
  if (!props.data) return <div></div>;
  const listTitleMap = new Map([
    ['install', '待验收'],
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
                  维修项目名称：{v.data.name}
                </span>
                <span style={{ marginRight: '25px' }}>
                  维修设备：{v.data.equipment}
                </span>
                {v.data.price ? (
                  <span style={{ marginRight: '25px' }}>
                    金额：{v.data.price}
                  </span>
                ) : (
                  <span style={{ marginRight: '25px' }}>
                    最高报价：{v.data.budget}
                  </span>
                )}
              </div>
            }
            extra={
              <Space>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => window.open('/#' + v.link, '_blank')}
                >
                  去处理
                </Button>
                <Button
                  size="small"
                  type="primary"
                  onClick={async () => await props.ignore(v.notification_id)}
                >
                  忽略该通知
                </Button>
              </Space>
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
  const repairApplyRecordData = _.filter(props.data, [
    'n_category',
    'repairApplyRecord',
  ]);

  const items = [
    {
      label: <Badge count={equipmentApplyRecordData.length}>设备采购</Badge>,
      key: '1',
      children: (
        <EquipmentApplyNotificationCard
          data={equipmentApplyRecordData}
          ignore={props.ignore}
        />
      ),
    },
    {
      label: (
        <Badge count={instrumentApplyRecordData.length}>器械医疗用品采购</Badge>
      ),
      key: '2',
      children: (
        <InstrumentApplyNotificationCard
          data={instrumentApplyRecordData}
          ignore={props.ignore}
        />
      ),
    },
    {
      label: <Badge count={repairApplyRecordData.length}>设备维修</Badge>,
      key: '3',
      children: (
        <RepairApplyNotificationCard
          data={repairApplyRecordData}
          ignore={props.ignore}
        />
      ),
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} />;
};

export default ApplyNotificationTab;
