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

const getRecords = async (id: number) => {
  return await axios.get(`${SERVER_HOST}/payment/records/index/${id}`);
};

const getPlan = async (id: number) => {
  return await axios.get(`${SERVER_HOST}/payment/plans/getItem?id=${id}`);
};

const PaymentRecordCardChildren: React.FC = (props: any) => {
  const preview = (payment_file: any) => {
    if (!payment_file) return <div></div>;
    if (isPDF(payment_file)) return <PdfPreview url={payment_file} />;
    if (isPicture(payment_file)) return <PicturePreview url={payment_file} />;
  };

  return (
    <div>
      <ProFormItem label="申请凭证：">
        {preview(props.record.payment_voucher_file)}
      </ProFormItem>
      <ProFormItem label="收款凭证：">
        {preview(props.record.payment_file)}
      </ProFormItem>
    </div>
  );
};

const PaymentRecordPage: React.FC = () => {
  const hashArray = history.location.hash.split('#')[1];
  const id = parseInt(hashArray[0]);
  const [items, setItems] = useState<CollapseProps['items']>([]);
  const { run: runGetRecords } = useRequest(getRecords, {
    manual: true,
    onSuccess: (result: any) => {
      const date_text =
        history.location.state.is_pay === 'true' ? '付款日期：' : '收款日期：';
      const cost_text =
        history.location.state.is_pay === 'true' ? '付款金额：' : '收款金额：';
      const i = _.map(result.data, (value: any, key: any) => {
        const apply_date = new Date(value.created_at);
        const apply_date_string = `${apply_date.getFullYear()}-${apply_date.getMonth()}-${apply_date.getDate()}`;
        return {
          key: key.toString(),
          label: `申请提交日期：${apply_date_string}    ${date_text} ${value.assessment_date}    ${cost_text} ${value.assessment} `,
          children: <PaymentRecordCardChildren record={value} />,
        };
      });
      setItems(i);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runGetPlan } = useRequest(getPlan, {
    manual: true,
    onSuccess: (result: any) => {
      console.log('result:', result);
    },
    onError: () => {
      message.error('未找到该条计划，返回监控页面...');
      history.push('/paymentMonitor');
    },
  });

  useEffect(() => {
    runGetPlan(id);
    runGetRecords(id);
  }, []);

  return (
    <PageContainer
      ghost
      header={{
        title:
          history.location.state.is_pay === 'true' ? '付款记录' : '收款记录',
      }}
    >
      <Divider orientation="left">
        {history.location.state.contract_name}
      </Divider>
      <Row style={{ marginBottom: '40px' }} gutter={16}>
        <Col span={6}>职能科室：{history.location.state.department}</Col>
        <Col span={6}>合作商户：{history.location.state.company}</Col>
        <Col span={4}>类型：{history.location.state.category}</Col>
        <Col span={8}>合同签订日期：{history.location.state.contract_date}</Col>
      </Row>
      <Collapse accordion items={items} />
    </PageContainer>
  );
};

export default PaymentRecordPage;
