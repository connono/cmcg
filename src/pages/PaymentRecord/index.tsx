import { SERVER_HOST } from '@/constants';
import { ModalForm, PageContainer, ProFormDatePicker, ProFormInstance, ProFormText, ProFormUploadButton, ProFormUploadDragger } from '@ant-design/pro-components';
import { Access, useAccess, useModel, useRequest, history } from '@umijs/max';
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

// const createRecord = async (department: string, company: string, assessment_date: string, payment_file: File, plan_id: number) => {
//   const form = new FormData();
//   form.append('department', department);
//   form.append('company', company);
//   form.append('assessment_date', assessment_date);
//   form.append('payment_file', payment_file);
//   form.append('plan_id', plan_id.toString());

//   return await axios({
//     method: 'POST',
//     data: form,
//     url: `${SERVER_HOST}/payment/records/store`,
//   });
// }

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

  // const { run : runCreateRecords } = useRequest(createRecord,{
  //   manual: true,
  //   onSuccess: async (result: any, params: any) => {
  //     message.success('添加成功!');
  //     await runGetRecords(id);
  //   },
  //   onError: (error: any) => {
  //     message.error(error.message);
  //   },
  // });

  // const openModal = () => {
  //   setModalVisible(true);
  //   setTimeout(()=>{
  //     formRef.current?.setFieldValue('department', department);
  //     formRef.current?.setFieldValue('company', company);
  //   },500);
  // }

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
      {/* <Button type="primary" onClick={openModal}>添加记录</Button> */}
      <Collapse accordion items={items} />
      {/* <ModalForm
        title="新建记录"
        formRef={formRef}
        modalProps={{
          destroyOnClose: false,
          onCancel: () => setModalVisible(false)
        }}
        open={modalVisible}
        submitTimeout={2000}
        onFinish={async (values: any) => {
          await runCreateRecords(values.department, values.company, values.assessment_date, values.payment_file[0].originFileObj, id);
          setModalVisible(false);
        }}
      >
        <ProFormText
          width="md"
          name="department"
          label="职能科室"
          disabled
          rules={[{ required: true }]}
        />
        <ProFormText
          width="md"
          name="company"
          label="合作商户"
          disabled
          rules={[{ required: true }]}
        />
        <ProFormDatePicker
          name="assessment_date"
          label="收款日期"
          width="md"
          rules={[{ required: true }]} 
        />
        <ProFormUploadButton
          label="收款凭证："
          name="payment_file"
          max={1}
          rules={[{ required: true }]}
        />
      </ModalForm> */}
    </PageContainer>
  );
};

export default PaymentRecordPage;
