import { SERVER_HOST } from '@/constants';
import { PageContainer, ProFormInstance, ProFormItem} from '@ant-design/pro-components';
import { useAccess, useRequest, history } from '@umijs/max';
import { Collapse, message, Image, Button, Divider, Row, Col } from 'antd';
import type { CollapseProps } from 'antd';
import PdfPreview from '@/components/PdfPreview';
import PicturePreview from '@/components/PicturePreview';
import { isPDF, isPicture } from '@/utils/file-uploader';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';

const getRecords = async (id: number) => {
  return await axios.get(`${SERVER_HOST}/payment/records/index/${id}`);
}

const getPlan = async (id: number) => {
  return await axios.get(`${SERVER_HOST}/payment/plans/getItem?id=${id}`);
}

const deleteRecord = async (id: number) => {
  return await axios.delete(`${SERVER_HOST}/payment/records/delete/${id}`);
}

const PaymentRecordCardChildren: React.FC = (props: any) => {
  
  const preview = (payment_file: any) => {
    if(!payment_file) return <div></div>;
    if (isPDF(payment_file)) return <PdfPreview url={payment_file} />
    if(isPicture(payment_file)) return <PicturePreview url={payment_file} />
  }

  return (
    <div>
      <ProFormItem
        label="申请凭证："
      >
        {
          preview(props.record.payment_voucher_file)
        }
      </ProFormItem>
      <ProFormItem
        label="收款凭证："
      >
        {
          preview(props.record.payment_file)
        }
      </ProFormItem>
      </div>
    )
}

const PaymentRecordPage: React.FC = () => {
  const access = useAccess();
  const hashArray = history.location.hash.split('#')[1];
  const id = parseInt(hashArray[0]);
  const [items, setItems] = useState<CollapseProps['items']>([]);
  const [department, setDepartment] = useState<string>();
  const [company, setCompany] = useState<string>();
  const formRef = useRef<ProFormInstance>();
  const { run : runGetRecords } = useRequest(getRecords,{
    manual: true,
    onSuccess: (result: any, params: any) => {
      const i = _.map(result.data, (value: any, key: any)=>{
        console.log('value:', value);
        const apply_date = new Date(value.created_at);
        const apply_date_string = `${apply_date.getFullYear()}-${apply_date.getMonth()}-${apply_date.getDate()}`;
        return {
          key: key.toString(),
          label: `申请提交日期：${apply_date_string}    ${value.is_pay? '付款日期：' : '收款日期：'} ${value.assessment_date}    ${value.is_pay ? '付款金额：' : '收款金额：'} ${value.assessment} `,
          children: (
            <PaymentRecordCardChildren record={value} />
          ),
        }
      });
      setItems(i);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run : runGetPlan } = useRequest(getPlan, {
    manual: true,
    onSuccess: (result: any, params: any) => {
      setDepartment(result.data.department);
      setCompany(result.data.company);
    },
    onError: (error: any) => {
      message.error('未找到该条计划，返回监控页面...');
      history.push('/paymentMonitor');
    },
  });

  const { run : runDeleteRecords } = useRequest(deleteRecord,{
    manual: true,
    onSuccess: async (result: any, params: any) => {
      message.success('删除成功!');
      await runGetRecords(id);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  useEffect(()=>{
    runGetPlan(id);
    runGetRecords(id);
  },[]);

  return (
    <PageContainer
      ghost
      header={{
        title: '付款记录',
      }}
    >
      <Divider orientation="left">{history.location.state.contract_name}</Divider>
      <Row style={{marginBottom: '40px'}} gutter={16}>
        <Col span={6}>
          职能科室：{history.location.state.department}
        </Col>
        <Col span={6}>
          合作商户：{history.location.state.company}
        </Col>
        <Col span={4}>
          类型：{history.location.state.category}
        </Col>
        <Col span={8}>
          合同签订日期：{history.location.state.contract_date}
        </Col>
      </Row>
      <Collapse accordion items={items} />
    </PageContainer>
  );
};

export default PaymentRecordPage;
