import { PageContainer, ProFormDigit, ProFormRadio } from '@ant-design/pro-components';
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
import { useNavigate, useModel, useAccess, Access } from '@umijs/max';
import _ from 'lodash';


const int_status = (status: string) => {
  switch (status) {
    case "apply":
      return 0;
    case "audit":
      return 1;
    case "process":
      return 2;
    default:
      return -1;
  }
}
 
const getItem = async (id: string) => {
  return await axios.get(`${SERVER_HOST}/payment/records/getItem?id=${id}`);
}

const apply = async (plan_id: string, record_id: string, assessment: string, payment_voucher_file: File) => {
  const form = new FormData();
  form.append('method', 'apply');
  form.append('plan_id', plan_id);
  form.append('assessment', assessment);
  form.append('payment_voucher_file', payment_voucher_file);
  
  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/records/update/${record_id}`,
  });
}

const audit = async (plan_id: string, record_id: string) => {
  const form = new FormData();
  form.append('method', 'audit');
  form.append('plan_id', plan_id);
  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/records/update/${record_id}`,
  });
}

const process = async (plan_id: string, record_id: string, assessment_date: string, payment_file: File) => {
  const form = new FormData();
  form.append('method', 'process');
  form.append('plan_id', plan_id);
  form.append('assessment_date', assessment_date);
  form.append('payment_file', payment_file);
 
  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/records/update/${record_id}`,
  });
}

const back = async (plan_id: string, record_id: string) => {
  return await axios({
    method: 'PATCH',
    data: {plan_id},
    url: `${SERVER_HOST}/payment/records/back/${record_id}`,
  });
}

const PaymentRecordDetailPage: React.FC = () => {
  const [ paymentRecord, setPaymentRecord ] = useState({});
  const hashArray = history.location.hash.split('#')[1].split('&');
  const method = history.location.state.status;
  const plan_id = hashArray[1];
  const id = hashArray[2];
  const [ modal, contextHolder ] = Modal.useModal();
  const formRef = useRef<ProFormInstance>();
  const [current, setCurrent] = useState<number>(0);
  const access = useAccess();
  
  const { run : runGetItem } = useRequest(getItem,{
    manual: true,
    onSuccess: (result: any, params: any) => {
      if (int_status(method) !== -1){
        setCurrent(int_status(method));
      } else {
        history.push('/paymentMonitor');
        message.info('该计划正处于等待或关闭阶段，无法编辑，跳转到计划界面');
      }
      setPaymentRecord(result.data);
      _.forEach(result.data, (key: any, value: any) => {
        const length = value.split('_').length;
        const extension = value.split('_')[length-1];
        if (extension==='picture' || extension==='file'){
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
        } else if (extension==='date') {
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
  const { run: runApply } = useRequest(apply,{
    manual: true,
    onSuccess: (result: any, params: any) => {
      message.success('申请付款成功，正在返回计划列表...');
      history.push('/paymentMonitor');
      
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  })
  const { run: runAudit } = useRequest(audit,{
    manual: true,
    onSuccess: (result: any, params: any) => {
      message.success('审核成功，正在返回计划列表...');
      history.push('/paymentMonitor');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runBack } = useRequest(back,{
    manual: true,
    onSuccess: (result: any, params: any) => {
      message.success('已驳回，正在返回计划列表...');
      history.push('/paymentMonitor');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runProcess } = useRequest(process,{
    manual: true,
    onSuccess: (result: any, params: any) => {
      message.success('增加收款记录成功，正在返回计划列表...');
      history.push('/paymentMonitor');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  })

  const onStepChange = (current: number) => {
    if(int_status(method)===-1) return;
    if(int_status(method)<current) return;
    _.forEach(paymentRecord, (key: any, value: any) => {
      const length = value.split('_').length;
      const extension = value.split('_')[length-1];
      if (extension==='picture' || extension==='file'){
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
      } else if (extension==='date'){
        formRef.current?.setFieldValue(value, key);
      } else {
        formRef.current?.setFieldValue(value, key);
      }
    })
    setCurrent(current);
  }

  useEffect(()=>{
    if(id) {
      runGetItem(id);
    } else {
      history.push('/paymentMonitor');
    }
    console.log('history,', history);

  },[]);
  return (
    <PageContainer
      ghost
      header={{
        title: '服务型付款流程记录',
      }}
    >
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
                const status = int_status(method) < key ? 'wait' : (current === key ? 'process' : 'finish');
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
          submitter={{
            render: (props: any, doms: any) => {
              return [
                <Button disabled={int_status(method)>current} htmlType="button" type="primary" onClick={props.onSubmit} key="submit">
                  提交
                </Button>
              ]
            }
          }}
        >
          <StepsForm.StepForm<{
            name: string;
          }>
            name="apply"
            title="申请"
            onFinish={async () => {
              if (!access.canApplyPaymentRecord) {
                message.error('你无权进行此操作');
              } else {
                const values = formRef.current?.getFieldsValue();
                await runApply(plan_id, id, values.assessment, values.payment_voucher_file[0].originFileObj);
                return true;
              }
              
            }}
          >
            <ProFormText
              name="contract_name"
              label="合同名称"
              width="md"
              disabled
            />
            <ProFormText
              name="department"
              label="职能科室"
              width="md"
              disabled
            />
            <ProFormText
              name="company"
              label="合作商"
              width="md"
              disabled
            />
            <ProFormDigit
              name="assessment"
              label={history.location.state.is_pay === 'true' ? '应付款金额' : '应收款金额'}
              width="md"
              rules={[{ required: true }]}
            />
            <ProFormUploadDragger
              name="payment_voucher_file"
              label={history.location.state.is_pay === 'true' ? '付款凭证' : '收款凭证'}
              rules={[{ required: true }]}
              max={1}
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="audit"
            title="审核"
            onFinish={async () => {
              if (!access.canAuditPaymentRecord) {
                message.error('你无权进行此操作');
              } else {
                const values = formRef.current?.getFieldsValue();
                if (values.audit) await runAudit(plan_id, id);
                else await runBack(plan_id, id);
                return true;
              }
              
            }}
          >
            <ProFormUploadDragger
              name="contract_file"
              label="合同附件："
              disabled
              max={1}
              initialValue={[{
                uid: '0',
                name: 'name',
                status: 'done',
                url: history.location.state.payment_file,
              }]}
            />
            <ProFormRadio.Group 
              name="audit"
              options={[{
                label: '审核通过',
                value: true,
              },{
                label: '审核驳回',
                value: false,
              }]}
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm<{
            checkbox: string;
          }>
            name="process"
            title={history.location.state.is_pay === 'true' ? '付款' : '收款'}
            onFinish={async () => {
              if (!access.canProcessPaymentRecord) {
                message.error('你无权进行此操作');
              } else {
                const values = formRef.current?.getFieldsValue();
                await runProcess(plan_id, id, values.assessment_date, values.payment_file[0].originFileObj);
                return true;
              }
            }}
          >
            <ProFormDatePicker
              name="assessment_date"
              label="收款日期："
              width="sm"
              rules={[{ required: true }]} 
            />
            <ProFormUploadDragger 
              label="付款收据：" 
              name="payment_file" 
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

export default PaymentRecordDetailPage;