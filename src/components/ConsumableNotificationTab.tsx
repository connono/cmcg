import { ProCard } from '@ant-design/pro-components';
import { Badge, Button, Space, Tabs } from 'antd';
import _ from 'lodash';
import React from 'react';

interface TemporaryConsumableNotificationCardProps {
  data?: any;
  ignore: any;
}

interface ConsumableApplyNotificationCardProps {
  data?: any;
  ignore: any;
}

interface ConsumableListNotificationCardProps {
  data?: any;
  ignore: any;
}

interface Props {
  data?: any;
  ignore: any;
}

const TemporaryConsumableNotificationCard: React.FC<
  TemporaryConsumableNotificationCardProps
> = (props) => {
  if (!props.data) return <div></div>;
  const listTitleMap = new Map([
    ['buy', '待购买'],
    ['vertify', '待审批'],
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
                  耗材名称：{v.data.consumable}
                </span>
                <span style={{ marginRight: '25px' }}>
                  申请科室：{v.data.department}
                </span>
                <span style={{ marginRight: '25px' }}>
                  数量: {v.data.count}
                </span>
                {v.data.arrive_price ? (
                  <span style={{ marginRight: '25px' }}>
                    采购价格：{v.data.arrive_price}
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

const ConsumableApplyNotificationCard: React.FC<
  ConsumableApplyNotificationCardProps
> = (props) => {
  if (!props.data) return <div></div>;
  const listTitleMap = new Map([
    ['buy', '待购买'],
    ['vertify', '待分管院长审批'],
    ['engineer_approve', '待医工科审批'],
  ]);
  const procardlists = _.map(
    _.groupBy(props.data, 'type'),
    (value: any, key: any) => {
      const procardlist = _.map(value, (v: any, k: any) => {
        console.log('data', v.data);
        return (
          <ProCard
            key={k}
            title={
              <div>
                <span style={{ marginRight: '25px' }}>
                  耗材名称：{v.data.consumable}
                </span>
                <span style={{ marginRight: '25px' }}>
                  申请科室：{v.data.department}
                </span>
                <span style={{ marginRight: '25px' }}>
                  年用量: {v.data.count_year}
                </span>
                {v.data.price ? (
                  <span style={{ marginRight: '25px' }}>
                    采购价格：{v.data.price}
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

const ConsumableListNotificationCard: React.FC<
  ConsumableListNotificationCardProps
> = (props) => {
  if (!props.data) return <div></div>;
  const listTitleMap = new Map([
    ['buy', '待重新采购'],
    ['vertify', '待分管院长审批'],
    ['engineer_approve', '待医工科审批'],
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
                  耗材名称：{v.data.consumable}
                </span>
                <span style={{ marginRight: '25px' }}>
                  申请科室：{v.data.department}
                </span>
                {v.data.price ? (
                  <span style={{ marginRight: '25px' }}>
                    采购价格：{v.data.price}
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

const ConsumableNotificationTab: React.FC<Props> = (props) => {
  const TemporyConsumableData = _.filter(props.data, [
    'n_category',
    'temporary_consumable',
  ]);
  const ApplyConsumableData = _.filter(props.data, [
    'n_category',
    'consumable_apply',
  ]);
  const ConsumableListData = _.filter(props.data, [
    'n_category',
    'consumable_list',
  ]);
  const items = [
    {
      label: <Badge count={TemporyConsumableData.length}>临时耗材申请</Badge>,
      key: '1',
      children: (
        <TemporaryConsumableNotificationCard
          data={TemporyConsumableData}
          ignore={props.ignore}
        />
      ),
    },
    {
      label: <Badge count={ApplyConsumableData.length}>院内耗材申请</Badge>,
      key: '2',
      children: (
        <ConsumableApplyNotificationCard
          data={ApplyConsumableData}
          ignore={props.ignore}
        />
      ),
    },
    {
      label: <Badge count={ConsumableListData.length}>院内耗材目录</Badge>,
      key: '3',
      children: (
        <ConsumableListNotificationCard
          data={ConsumableListData}
          ignore={props.ignore}
        />
      ),
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} />;
};

export default ConsumableNotificationTab;
