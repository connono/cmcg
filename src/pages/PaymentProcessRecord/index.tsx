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

const getProcessItem = async (id: number) => {
  return await axios.get(`${SERVER_HOST}/payment/processes/getItem/${id}`);
};

const getProcessRecords = async (id: number) => {
  return await axios.get(`${SERVER_HOST}/payment/process/records/index/${id}`);
};

const PaymentRecordCardChildren: React.FC = (props: any) => {
  const preview = (payment_file: any) => {
    if (!payment_file) return <div></div>;
    if (isPDF(payment_file)) return <PdfPreview url={payment_file} />;
    if (isPicture(payment_file)) return <PicturePreview url={payment_file} />;
  };

  return (
    <div>
      <ProFormItem label="制单文件：">
        {preview(props.record.payment_document_file)}
      </ProFormItem>
      <ProFormItem
        label={props.is_pay === 'true' ? '付款记录：' : '收款凭证：'}
      >
        {preview(props.record.payment_file)}
      </ProFormItem>
    </div>
  );
};

const PaymentProcessRecordPage: React.FC = () => {
  const hashArray = history.location.hash.split('#')[1].split('&');
  const id = parseInt(hashArray[0]);
  const [PaymentProcess, setPaymentProcess] = useState<any>({ is_pay: false });
  const [items, setItems] = useState<CollapseProps['items']>([]);

  const { run: runGetProcessRecords } = useRequest(getProcessRecords, {
    manual: true,
    onSuccess: (result: any) => {
      const date_text =
        PaymentProcess.is_pay === 'true' ? '付款日期：' : '收款日期：';
      const cost_text =
        PaymentProcess.is_pay === 'true' ? '付款金额：' : '收款金额：';
      const i = _.map(result.data, (value: any, key: any) => {
        const apply_date = new Date(value.created_at);
        const apply_date_string = `${apply_date.getFullYear()}-${apply_date.getMonth()}-${apply_date.getDate()}`;
        return {
          key: key.toString(),
          label: `申请提交日期：${apply_date_string}    ${date_text} ${value.assessment_date}    ${cost_text} ${value.assessment} `,
          children: (
            <PaymentRecordCardChildren
              is_pay={PaymentProcess.is_pay}
              record={value}
            />
          ),
        };
      });
      setItems(i);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runGetProcessItem } = useRequest(getProcessItem, {
    onSuccess: (result: any) => {
      setPaymentProcess(result.data);
      runGetProcessRecords(id);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  useEffect(() => {
    runGetProcessItem(id);
  }, []);

  return (
    <PageContainer
      ghost
      header={{
        title: PaymentProcess.is_pay === 'true' ? '付款记录' : '收款记录',
      }}
    >
      <Divider orientation="left">{PaymentProcess.contract_name}</Divider>
      <Row style={{ marginBottom: '10px' }} gutter={16}>
        <Col span={6}>职能科室：{PaymentProcess.department}</Col>
        <Col span={6}>合作商户：{PaymentProcess.company}</Col>
        <Col span={4}>类型：{PaymentProcess.category}</Col>
        <Col span={8}>合同签订日期：{PaymentProcess.contract_date}</Col>
      </Row>
      <Row style={{ marginBottom: '40px' }} gutter={16}>
        <Col span={6}>{`${
          PaymentProcess.is_pay === 'true' ? '累计缴费金额:' : '累计收费金额：'
        }${PaymentProcess.assessments_count}元`}</Col>
        <Col span={6}>
          目标金额：
          {PaymentProcess.target_amount
            ? PaymentProcess.target_amount + '元'
            : '暂无'}
        </Col>
      </Row>
      <Collapse accordion items={items} />
    </PageContainer>
  );
};

export default PaymentProcessRecordPage;
