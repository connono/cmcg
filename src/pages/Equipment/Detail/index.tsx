import { PageContainer } from '@ant-design/pro-components';
//@ts-ignore
import { useRequest, history } from '@umijs/max';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProCard,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormMoney,
  ProFormTextArea,
  ProFormUploadDragger,
  StepsForm,
} from '@ant-design/pro-components';
import { message, Button, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { SERVER_HOST } from '@/constants';
import { useNavigate, useModel } from '@umijs/max';


export const departmentData = [{
  value: 'bf013',
  label: '外一科'
},{
  value: 'bf012',
  label: '外二科'
},{
  value: 'bf010',
  label: '骨二科'
},{
  value: 'bf006',
  label: 'ICU病区'
},]

const applyOptions = [{
  value: '0',
  label: '年度采购'
},{
  value: '1',
  label: '经费采购'
},{
  value: '2',
  label: '临时采购'
}]


const purchaseOptions = [{
  value: '0',
  label: '展会采购',
},{
  value: '1',
  label: '招标',
},{
  value: '2',
  label: '自行采购',
}]

const getItem = async (id: string) => {
  return await axios.get(`${SERVER_HOST}/equipment/item?id=${id}`);
}

const getSerialNumber = async () => {
  return await axios.get(`${SERVER_HOST}/equipment/serialNumber`);
}

const apply = async (serial_number: number, equipment: string, department: string, count: number, budget: number, apply_type: number) => {
  return await axios.post(`${SERVER_HOST}/equipment/store`,{
    serial_number,
    equipment,
    department,
    count,
    budget,
    apply_type,
  });
}

const survey = async (id: string, survey_date: Date, purchase_type: number, survey_record: string, meeting_record: string) => {
  return await axios.patch(`${SERVER_HOST}/equipment/update/survey/${id}`,{
    survey_date,
    purchase_type,
    survey_record,
    meeting_record,
  });
}

const approve = async (id: string, approve_date: Date, execute_date: Date) => {
  return await axios.patch(`${SERVER_HOST}/equipment/update/approve/${id}`,{
    approve_date,
    execute_date,
  });
}

const purchase = async (id: string, purchase_date: Date, arrive_date: Date, price: number) => {
  return await axios.patch(`${SERVER_HOST}/equipment/update/purchase/${id}`,{
    purchase_date,
    arrive_date,
    price
  });
}

const install = async (id: string, install_date: Date) => {
  return await axios.patch(`${SERVER_HOST}/equipment/update/install/${id}`,{
    install_date,
  });
}


const EquipmentDetailPage: React.FC = () => {
  const { equipmentItem, setEquipmentItem } = useModel('equipmentRecordItem');
  const hashArray = history.location.hash.split('#')[1].split('&');
  const method = hashArray[0];
  const id = hashArray[1];
  const [ modal, contextHolder ] = Modal.useModal();
  const confirm  = () => {
    modal.confirm({
      content: `你这次创建的序列号为${equipmentItem.serial_number}。确认进入下一个创建页面，取消则进入设备列表。`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        runGetSerialNumber();
      },
      onCancel: () => {
        history.push('/equipment');
      }
    })
  }
  const formRef = useRef<ProFormInstance>();
  const { run : runGetItem } = useRequest(getItem,{
    manual: true,
    onSuccess: (result: any, params: any) => {
      setEquipmentItem({
        ...result.data,
        status: parseInt(result.data.status),
      });
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run : runGetSerialNumber } = useRequest(getSerialNumber,{
    manual: true,
    onSuccess: (result: any, params: any) => {
      setEquipmentItem(
        {
          ...equipmentItem,
          serial_number: result.serial_number,
          status: 0,
        }
      );
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runApply } = useRequest(apply,{
    manual: true,
    onSuccess: (result: any, params: any) => {
      message.success('创建成功');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  })
  const { run: runSurvey } = useRequest(survey,{
    manual: true,
    onSuccess: (result: any, params: any) => {
      message.success('增加调研记录成功，正在返回设备列表...');
      history.push('/equipment');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  })
  const { run: runApprove } = useRequest(approve,{
    manual: true,
    onSuccess: (result: any, params: any) => {
      message.success('增加政府审批记录成功，正在返回设备列表...');
      history.push('/equipment');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  })
  const { run: runPurchase } = useRequest(purchase,{
    manual: true,
    onSuccess: (result: any, params: any) => {
      message.success('增加合同记录成功，正在返回设备列表...');
      history.push('/equipment');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  })
  const { run: runInstall } = useRequest(install,{
    manual: true,
    onSuccess: (result: any, params: any) => {1
      message.success('增加安装验收记录成功，正在返回设备列表...');
      history.push('/equipment');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  })
  useEffect(()=>{
    if(method ==='create') {
      runGetSerialNumber();
    } else if( method === 'update' && id) {
      runGetItem(id);
    } else {
      history.push('/equipment');
    }
  },[]);
  return (
    <PageContainer ghost>
      <ProCard>
        <StepsForm<{
          name: string;
        }>
          formRef={formRef}
          formProps={{
            validateMessages: {
              required: '此项为必填项',
            },
          }}
          current={equipmentItem.status}
          // @ts-ignore
          submitter={{
            render: (props: any, doms: any) => {
              return [
                <Button htmlType="button" type="primary" onClick={props.onSubmit} key="submit">
                  提交
                </Button>
              ]
            }
          }}
        >
          <StepsForm.StepForm<{
            name: string;
          }>
            name="base"
            title="申请"
            // stepProps={{
            //   description: '这里填入的都是基本信息',
            // }}
            onFinish={async () => {
              const values = formRef.current?.getFieldsValue();
              confirm();
              //@ts-ignore
              await runApply(equipmentItem.serial_number, values.equipment, values.department, values.count, values.budget, values.apply_type);
              return true;
            }}
          >
            {/* <ProFormText
              name="serial_number"
              label="申请单号"
              width="md"
              valu
              initialValue={equipmentItem.serial_number}
              disabled
              rules={[{ required: true }]}
            /> */}
            <ProFormText
              name="equipment"
              label="设备名称"
              width="md"
              rules={[{ required: true }]}
            />
            <ProFormSelect
              label="申请科室"
              name="department"
              options={departmentData}
              rules={[{ required: true }]}
            />
            <ProFormText
              name="count"
              label="数量"
              width="md"
              rules={[{ required: true }]}
            />
            <ProFormMoney
              name="budget"
              label="总预算"
              width="md"
              rules={[{ required: true }]}
            />
            <ProFormSelect
              label="申请方式："
              name="apply_type"
              options={applyOptions}
              rules={[{ required: true }]}
            />
            <ProFormUploadDragger 
              label="上传图片：" 
              name="picture" 
              action="upload.do"
              // rules={[{ required: true }]} 
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="time"
            title="调研"
            onFinish={async () => {
              const values = formRef.current?.getFieldsValue();
              await runSurvey(id, values.survey_date, values.purchase_type, values.survey_record, values.meeting_record);
              return true;
            }}
          >
            <ProFormDatePicker
              name="survey_date"
              label="调研日期："
              width="sm"
              rules={[{ required: true }]} 
            />
            <ProFormSelect
              label="采购方式："
              name="purchase_type"
              options={purchaseOptions}
              rules={[{ required: true }]}
            />
            <ProFormTextArea
              name="survey_record"
              label="调研记录："
              width="md"
              rules={[{ required: true }]}
            />
            <ProFormTextArea
              name="meeting_record"
              label="上会记录："
              width="md"
              rules={[{ required: true }]}
            />
            <ProFormUploadDragger 
              label="执行单附件：" 
              name="file" 
              action="upload.do"
              // rules={[{ required: true }]} 
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm<{
            checkbox: string;
          }>
            name="checkbox"
            title="政府审批"
            onFinish={async () => {
              const values = formRef.current?.getFieldsValue();
              await runApprove(id, values.approve_date, values.execute_date);
              return true;
            }}
          >
            <ProFormDatePicker
              name="approve_date"
              label="政府审批日期："
              width="sm"
              rules={[{ required: true }]} 
            />
            <ProFormDatePicker
              name="execute_date"
              label="预算执行单日期："
              width="sm"
              rules={[{ required: true }]} 
            />
            <ProFormUploadDragger 
              label="执行单附件：" 
              name="file" 
              action="upload.do"
              // rules={[{ required: true }]} 
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="ad"
            title="合同"
            onFinish={async () => {
              const values = formRef.current?.getFieldsValue();
              await runPurchase(id, values.purchase_date, values.arrive_date, values.price);
              return true;
            }}
          >
            <ProFormDatePicker
              name="purchase_date"
              label="合同日期："
              width="sm"
              rules={[{ required: true }]} 
            />
            <ProFormDatePicker
              name="arrive_date"
              label="合同到货日期："
              width="sm"
              rules={[{ required: true }]} 
            />
            <ProFormMoney
              name="price"
              label="合同价格"
              width="md"
              rules={[{ required: true }]}
            />
            <ProFormUploadDragger 
              label="合同附件：" 
              name="file" 
              action="upload.do"
              // rules={[{ required: true }]} 
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="ys"
            title="安装验收"
            onFinish={async () => {
              const values = formRef.current?.getFieldsValue();
              await runInstall(id, values.install_date);
              return true;
            }}
          >
            <ProFormDatePicker
              name="install_date"
              label="安装日期："
              width="sm"
              rules={[{ required: true }]} 
            />
            <ProFormUploadDragger 
              label="验收资料：" 
              name="file" 
              action="upload.do"
              // rules={[{ required: true }]} 
            />
          </StepsForm.StepForm>
        </StepsForm>
        { contextHolder }
      </ProCard>
    </PageContainer>
  );
};

export default EquipmentDetailPage;