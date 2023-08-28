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
import { message, Button, Modal, Steps } from 'antd';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { SERVER_HOST } from '@/constants';
import { useNavigate, useModel } from '@umijs/max';
import _ from 'lodash';


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

const formatDate = (date: any) => {
  return date.format('YYYY-MM-DD');
}

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

const apply = async (serial_number: number, equipment: string, department: string, count: number, budget: number, apply_type: number, apply_picture: File) => {
  const form = new FormData();
  form.append('serial_number', serial_number.toString());
  form.append('equipment', equipment);
  form.append('department', department);
  form.append('count', count.toString());
  form.append('budget', budget.toString());
  form.append('apply_type', apply_type.toString());
  form.append('apply_picture', apply_picture);
  
  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/equipment/store`
  });
}

const survey = async (id: string, survey_date: Date, purchase_type: number, survey_record: string, meeting_record: string, survey_picture: File) => {
  console.log('lodash', _);
  const form = new FormData();
  form.append('survey_date', formatDate(survey_date));
  form.append('purchase_type', purchase_type.toString());
  form.append('survey_record', survey_record);
  form.append('meeting_record', meeting_record);
  form.append('survey_picture', survey_picture);

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/equipment/update/survey/${id}`
  });
}

const approve = async (id: string, approve_date: Date, execute_date: Date, approve_picture: File) => {
  const form = new FormData();
  form.append('approve_date', formatDate(approve_date));
  form.append('execute_date', formatDate(execute_date));
  form.append('approve_picture', approve_picture);
 
  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/equipment/update/approve/${id}`
  });
}

const purchase = async (id: string, purchase_date: Date, arrive_date: Date, price: number, purchase_picture: File) => {
  const form = new FormData();
  form.append('purchase_date', formatDate(purchase_date));
  form.append('arrive_date', formatDate(arrive_date));
  form.append('price', price.toString());
  form.append('purchase_picture', purchase_picture);

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/equipment/update/purchase/${id}`
  });
}

const install = async (id: string, install_date: Date, install_picture: File) => {
  const form = new FormData();
  form.append('install_date', formatDate(install_date));
  form.append('install_picture', install_picture);
  
  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/equipment/update/install/${id}`
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
  console.log(formRef);
  const [current, setCurrent] = useState<number>(0);
  const { run : runGetItem } = useRequest(getItem,{
    manual: true,
    onSuccess: (result: any, params: any) => {
      setEquipmentItem({
        ...result.data,
        status: parseInt(result.data.status),
      });
      setCurrent(parseInt(result.data.status));
      // setApplyVisible(true);
      _.forEach(result.data, (key: any, value: any) => {
        if (value.split('_')[1]==='picture'){
          const length = key ? key.split('/').length : 0;
          const name = key? key.split('/')[length-1] : '';
          if (name) {
            formRef.current?.setFieldValue(value, [{
              uid: '0',
              name,
              status: 'done',
              url: key,
            }]);
          }
        } else if (value.split('_')[1]==='date'){
          formRef.current?.setFieldValue(value, key);
        } else {
          formRef.current?.setFieldValue(value, key);
        }
      })
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
      formRef.current?.setFieldValue('serial_number', result.serial_number);
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

  const onStepChange = (current: number) => {
    _.forEach(equipmentItem, (key: any, value: any) => {
      if (value.split('_')[1]==='picture'){
        const length = key ? key.split('/').length : 0;
        const name = key? key.split('/')[length-1] : '';
        if (name) {
          formRef.current?.setFieldValue(value, [{
            uid: '0',
            name,
            status: 'done',
            url: key,
          }]);
        }
      } else if (value.split('_')[1]==='date'){
        console.log('value:', value, 'key', key);
        formRef.current?.setFieldValue(value, key);
      } else {
        formRef.current?.setFieldValue(value, key);
      }
    })
    setCurrent(current)
  }

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
          current={current}
          stepsRender={(steps, dom) => {
            const items = _.map(steps,(value: any, key: any)=>{
              const status = equipmentItem.status < key ? 'wait' : (current === key ? 'process' : 'finish');
              return {
                ...value,
                status,
              }
            })
            return (
              <Steps
                type="navigation"
                current={current}
                items={items}
                onChange={onStepChange}
              />
            )
          }}
          // @ts-ignore
          submitter={{
            render: (props: any, doms: any) => {
              return [
                <Button disabled={equipmentItem.status>current} htmlType="button" type="primary" onClick={props.onSubmit} key="submit">
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
            disabled={current<equipmentItem.status}
            onFinish={async () => {
              const values = formRef.current?.getFieldsValue();
              console.log(values.apply_picture[0].originFileObj)
              confirm();
              //@ts-ignore
              await runApply(equipmentItem.serial_number, values.equipment, values.department, values.count, values.budget, values.apply_type, values.apply_picture[0].originFileObj);
              return true;
            }}
          >
            <ProFormText
              name="serial_number"
              label="申请单号"
              width="md"
              disabled
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
              name="apply_picture" 
              rules={[{ required: true }]} 
              max={1}
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="time"
            title="调研"
            disabled={current<equipmentItem.status}
            onFinish={async () => {
              const values = formRef.current?.getFieldsValue();
              await runSurvey(id, values.survey_date, values.purchase_type, values.survey_record, values.meeting_record, values.survey_picture[0].originFileObj);
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
              name="survey_picture" 
              max={1}
              rules={[{ required: true }]} 
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm<{
            checkbox: string;
          }>
            name="checkbox"
            title="政府审批"
            disabled={current<equipmentItem.status}
            onFinish={async () => {
              const values = formRef.current?.getFieldsValue();
              await runApprove(id, values.approve_date, values.execute_date, values.approve_picture[0].originFileObj);
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
              name="approve_picture" 
              max={1}
              rules={[{ required: true }]} 
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="ad"
            title="合同"
            disabled={current<equipmentItem.status}
            onFinish={async () => {
              const values = formRef.current?.getFieldsValue();
              await runPurchase(id, values.purchase_date, values.arrive_date, values.price, values.purchase_picture[0].originFileObj);
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
              name="purchase_picture" 
              max={1}
              rules={[{ required: true }]} 
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="ys"
            title="安装验收"
            disabled={current<equipmentItem.status}
            onFinish={async () => {
              const values = formRef.current?.getFieldsValue();
              await runInstall(id, values.install_date, values.install_picture[0].originFileObj);
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
              name="install_picture" 
              max={1}
              rules={[{ required: true }]} 
            />
          </StepsForm.StepForm>
        </StepsForm>
        { contextHolder }
      </ProCard>
    </PageContainer>
  );
};

export default EquipmentDetailPage;