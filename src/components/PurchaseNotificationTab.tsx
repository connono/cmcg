import { ProCard } from '@ant-design/pro-components';
import { Badge, Button, Col, Row, Space, Tabs } from 'antd';
import _ from 'lodash';
import React from 'react';

interface PurchaseNotificationCardProps {
  data?: any;
  contentRender?: any;
  ignore: any;
}

interface Props {
  data?: any;
  ignore: any;
}

const PurchaseNotificationListItem: React.FC = (props: any) => {
  return (
    <Col span={props.col}>
      <div style={{ marginBottom: '5px' }}>
        <span>{props.label}</span>
        <span>{props.value}</span>
      </div>
    </Col>
  );
};

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
    ['approve', '待院办审核'],
    ['upload', '待上传'],
    ['delete', '待重新创建'],
    ['finance_dean_audit', '待财务院长审核'],
  ]);
  const procardlists = _.map(
    _.groupBy(props.data, 'type'),
    (value: any, key: any) => {
      const procardlist = _.map(value, (v: any, k: any) => {
        if (props.contentRender) {
          const title = props.contentRender(v);
          return (
            <ProCard
              key={k}
              title={title}
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
        } else {
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
        }
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
  const paymentDocumentData = _.filter(props.data, [
    'n_category',
    'paymentDocument',
  ]);
  const advanceData = _.filter(props.data, ['n_category', 'advance']);
  const contractData = _.filter(props.data, ['n_category', 'contract']);
  const items = [
    {
      label: <Badge count={paymentPlanData.length}>服务型合同</Badge>,
      key: '1',
      children: (
        <PurchaseNotificationCard
          data={paymentPlanData}
          ignore={props.ignore}
          contentRender={(data: any) => (
            <Row>
              <PurchaseNotificationListItem
                col={14}
                label="名称："
                value={data.data.contract_name}
              />
              <PurchaseNotificationListItem
                col={4}
                label="科室："
                value={data.data.department}
              />
              <PurchaseNotificationListItem
                col={6}
                label="类型："
                value={data.data.category}
              />
              <PurchaseNotificationListItem
                col={4}
                label="金额："
                value={data.data.assessment}
              />
              <PurchaseNotificationListItem
                col={8}
                label="公司："
                value={data.data.company}
              />
            </Row>
          )}
        />
      ),
    },
    {
      label: <Badge count={paymentProcessData.length}>物资型合同</Badge>,
      key: '2',
      children: (
        <PurchaseNotificationCard
          data={paymentProcessData}
          ignore={props.ignore}
        />
      ),
    },
    {
      label: <Badge count={paymentDocumentData.length}>制单管理</Badge>,
      key: '3',
      children: (
        <PurchaseNotificationCard
          ignore={props.ignore}
          data={paymentDocumentData}
        />
      ),
    },
    {
      label: <Badge count={advanceData.length}>垫付款管理</Badge>,
      key: '4',
      children: (
        <PurchaseNotificationCard data={advanceData} ignore={props.ignore} />
      ),
    },
    {
      label: <Badge count={contractData.length}>合同管理</Badge>,
      key: '5',
      children: (
        <PurchaseNotificationCard
          data={contractData}
          ignore={props.ignore}
          contentRender={(data: any) => <span>合同名称：{data.title}</span>}
        />
      ),
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} />;
};

export default PurchaseNotificationTab;
