import { ProCard } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Badge, Button, Tabs } from 'antd';
import _ from 'lodash';
import React from 'react';

interface TemporaryConsumableNotificationCardProps {
  data?: any;
}

interface ConsumableApplyNotificationCardProps {
  data?: any;
}

interface ConsumableListNotificationCardProps {
  data?: any;
}

interface Props {
  data?: any;
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

const ConsumableListNotificationCard: React.FC<
  ConsumableListNotificationCardProps
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
        <TemporaryConsumableNotificationCard data={TemporyConsumableData} />
      ),
    },
    {
      label: <Badge count={ApplyConsumableData.length}>院内耗材申请</Badge>,
      key: '2',
      children: <ConsumableApplyNotificationCard data={ApplyConsumableData} />,
    },
    {
      label: <Badge count={ConsumableListData.length}>院内耗材目录</Badge>,
      key: '3',
      children: <ConsumableListNotificationCard data={ConsumableListData} />,
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} />;
};

export default ConsumableNotificationTab;
