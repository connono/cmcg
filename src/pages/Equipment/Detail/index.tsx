import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useRequest, history } from '@umijs/max';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProCard,
  ProForm,
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  ProFormMoney,
  ProFormTextArea,
  ProFormUploadDragger,
  StepsForm,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { useRef } from 'react';
import axios from 'axios';
import { SERVER_HOST } from '@/constants';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

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

const survey = async (id: string, survey_date: Date, survey_record: string, meeting_record: string) => {
  return await axios.patch(`${SERVER_HOST}/equipment/update/survey/${id}`,{
    survey_date,
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
  const id = history.location.hash.replace('#',' ').trim();
  const formRef = useRef<ProFormInstance>();
  const { run: runApply } = useRequest(apply,{
    manual: true,
    onSuccess: (result, params) => {
      console.log('result', result)
    },
    onError: (error) => {
      message.error(error.message);
    },
  })
  const { run: runSurvey } = useRequest(survey,{
    manual: true,
    onSuccess: (result, params) => {
      console.log('result', result)
    },
    onError: (error) => {
      message.error(error.message);
    },
  })
  const { run: runApprove } = useRequest(approve,{
    manual: true,
    onSuccess: (result, params) => {
      console.log('result', result)
    },
    onError: (error) => {
      message.error(error.message);
    },
  })
  const { run: runPurchase } = useRequest(purchase,{
    manual: true,
    onSuccess: (result, params) => {
      console.log('result', result)
    },
    onError: (error) => {
      message.error(error.message);
    },
  })
  const { run: runInstall } = useRequest(install,{
    manual: true,
    onSuccess: (result, params) => {
      console.log('result', result)
    },
    onError: (error) => {
      message.error(error.message);
    },
  })
  const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };
  return (
    <PageContainer ghost>
      <ProCard>
        <StepsForm<{
          name: string;
        }>
          formRef={formRef}
          onFinish={async () => {
            await waitTime(1000);
            message.success('提交成功');
          }}
          formProps={{
            validateMessages: {
              required: '此项为必填项',
            },
          }}
          current={4}
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
              await runApply(values.serial_number, values.equipment, values.department, values.count, values.budget, values.apply_type);
              return true;
            }}
          >
            <ProFormText
              name="serial_number"
              label="申请单号"
              width="md"
              rules={[{ required: true }]}
            />
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
              await runSurvey(id, values.survey_date, values.survey_record, values.meeting_record);
              return true;
            }}
          >
            <ProFormDatePicker
              name="survey_date"
              label="调研日期："
              width="sm"
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
      </ProCard>
    </PageContainer>
  );
};

export default EquipmentDetailPage;