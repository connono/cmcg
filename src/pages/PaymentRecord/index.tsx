import { SERVER_HOST } from '@/constants';
import { PageContainer, ProFormInstance} from '@ant-design/pro-components';
import { useAccess, useRequest, history } from '@umijs/max';
import { Collapse, message, Image, Button } from 'antd';
import type { CollapseProps } from 'antd';
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

const PaymentRecordPage: React.FC = () => {
  const access = useAccess();
  const hashArray = history.location.hash.split('#')[1];
  const id = parseInt(hashArray[0]);
  const [items, setItems] = useState<CollapseProps['items']>([]);
  const [department, setDepartment] = useState<string>();
  const [company, setCompany] = useState<string>();
  const formRef = useRef<ProFormInstance>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const deleteButton = (record_id: number) => (
    <Button 
      size='small' 
      type='link' 
      onClick={async (event)=>{
        event.stopPropagation();
        await runDeleteRecords(record_id);
      }}>
      删除
    </Button>
  )
  const { run : runGetRecords } = useRequest(getRecords,{
    manual: true,
    onSuccess: (result: any, params: any) => {
      const i = _.map(result.data, (value: any, key: any)=>{
        return {
          key: key.toString(),
          label: `${value.department} => ${value.company}  ${value.assessment_date}`,
          children: (<Image src={value.payment_file} />),
          extra: deleteButton(value.id),
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
      <Collapse accordion items={items} />
    </PageContainer>
  );
};

export default PaymentRecordPage;
