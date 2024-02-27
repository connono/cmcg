import { ProCard } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Badge, Button, Tabs } from 'antd';
import _ from 'lodash';
import React from 'react';

interface PurchaseNotificationCardProps {
  data?: any;
}

interface Props {
  data?: any;
}

const PurchaseNotificationCard: React.FC<PurchaseNotificationCardProps> = (
  props,
) => {
  if (!props.data) return <div></div>;
  const listTitleMap = new Map([
    ['wait', '待设置下次时间'],
    ['document', '待制单'],
    ['finance_audit', '待财务科审核'],
    ['dean_audit', '待副院长审核'],
    ['audit', '待审核'],
    ['process', '待收款'],
    ['apply', '待申请'],
  ]);
  const procardlists = _.map(
    _.groupBy(props.data, 'type'),
    (value: any, key: any) => {
      const procardlist = _.map(value, (v: any, k: any) => {
        console.log(v);
        return (
          <ProCard
            key={k}
            title={
              <span>
                {v.title}
                <span>的{_.get(v, 'data.category')}</span>
                {_.get(v, 'data.assessment') &&
                _.get(v, 'data.assessment') !== 'undefined' ? (
                  <span>{_.get(v, 'data.assessment')}元</span>
                ) : null}
              </span>
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
              {listTitleMap.has(key) ? listTitleMap.get(key) : '待设置下次时间'}
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

const PurchaseNotificationTab: React.FC<Props> = (props) => {
  const paymentPlanData = _.filter(props.data, ['n_category', 'paymentPlan']);
  const paymentProcessData = _.filter(props.data, [
    'n_category',
    'paymentProcess',
  ]);
  const advanceData = _.filter(props.data, ['n_category', 'advance']);
  const items = [
    {
      label: <Badge count={paymentPlanData.length}>服务型合同</Badge>,
      key: '1',
      children: <PurchaseNotificationCard data={paymentPlanData} />,
    },
    {
      label: <Badge count={paymentProcessData.length}>物资型合同</Badge>,
      key: '2',
      children: <PurchaseNotificationCard data={paymentProcessData} />,
    },
    {
      label: <Badge count={advanceData.length}>垫付款管理</Badge>,
      key: '3',
      children: <PurchaseNotificationCard data={advanceData} />,
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} />;
};

export default PurchaseNotificationTab;
