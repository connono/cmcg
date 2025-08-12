import PreviewListModal from '@/components/PreviewListModal';
import { SERVER_HOST } from '@/constants';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  PageContainer,
  ProCard,
  ProFormDatePicker,
  ProFormDigit,
  ProFormItem,
  ProFormRadio,
  ProFormText,
  ProFormUploadButton,
  StepsForm,
} from '@ant-design/pro-components';
import { history, useAccess, useModel, useRequest } from '@umijs/max';
import { Button, Modal, Steps, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import {
  fileListToString,
  fileStringToAntdFileList,
  upload,
} from '../../../utils/file-uploader';
import ApprovalCard from '@/components/ApprovalCard';

const int_status = (status: string) => {
  switch (status) {
    case 'apply':
      return 0;
    case 'dean_audit':
      return 1;
    case 'audit':
      return 2;
    case 'finance_dean_audit':
      return 3;
    case 'process':
      return 4;
    default:
      return -1;
  }
};

const getItem = async (id: string) => {
  return await axios.get(`${SERVER_HOST}/payment/records/getItem?id=${id}`);
};

const getPlan = async (plan_id: string) => {
  return await axios.get(`${SERVER_HOST}/payment/plans/getItem/${plan_id}`);
};

const apply = async (
  plan_id: string,
  record_id: string,
  assessment: string,
  payment_voucher_file: string,
  user_id: number,
) => {
  const form = new FormData();
  form.append('method', 'apply');
  form.append('plan_id', plan_id);
  form.append('assessment', assessment);
  form.append('payment_voucher_file', fileListToString(payment_voucher_file));
  form.append('type', 'plan');
  form.append('user_id', user_id.toString());

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/records/update/${record_id}`,
  });
};

const dean_audit = async (plan_id: string, record_id: string, user_id: number) => {
  const form = new FormData();
  form.append('method', 'dean_audit');
  form.append('plan_id', plan_id);
  form.append('type', 'plan');
  form.append('user_id', user_id.toString());

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/records/update/${record_id}`,
  });
};

const audit = async (plan_id: string, record_id: string, user_id: number) => {
  const form = new FormData();
  form.append('method', 'audit');
  form.append('plan_id', plan_id);
  form.append('type', 'plan');
  form.append('user_id', user_id.toString());

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/records/update/${record_id}`,
  });
};

const finance_dean_audit = async (plan_id: string, record_id: string, user_id: number) => {
  const form = new FormData();
  form.append('method', 'finance_dean_audit');
  form.append('plan_id', plan_id);
  form.append('type', 'plan');
  form.append('user_id', user_id.toString());

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/records/update/${record_id}`,
  });
};

const process = async (
  plan_id: string,
  record_id: string,
  assessment_date: string,
  payment_file: string,
  user_id: number
) => {
  const form = new FormData();
  form.append('method', 'process');
  form.append('plan_id', plan_id);
  form.append('assessment_date', assessment_date);
  form.append('payment_file', fileListToString(payment_file));
  form.append('type', 'plan');
  form.append('user_id', user_id.toString());


  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/records/update/${record_id}`,
  });
};

const back = async (plan_id: string, record_id: string) => {
  return await axios({
    method: 'PATCH',
    data: { plan_id, type: 'plan' },
    url: `${SERVER_HOST}/payment/records/back/${record_id}`,
  });
};

const PaymentRecordDetailPage: React.FC = () => {
  const [paymentRecord, setPaymentRecord] = useState({});
  const hashArray = history.location.hash.split('#')[1].split('&');
  const plan_id = hashArray[1];
  const id = hashArray[2];
  const [modal, contextHolder] = Modal.useModal(); // eslint-disable-line
  const formRef = useRef<ProFormInstance>();
  const [current, setCurrent] = useState<number>(0);
  const access = useAccess();
  const { initialState } = useModel('@@initialState');
  const [plan, setPlan] = useState<any>({});

  const { run: runGetItem } = useRequest(getItem, {
    manual: true,
    onSuccess: (result: any) => {
      setPaymentRecord(result.data);
      _.forEach(result.data, (key: any, value: any) => {
        const length = value.split('_').length;
        const extension = value.split('_')[length - 1];
        if (extension === 'picture' || extension === 'file') {
          formRef.current?.setFieldValue(value, fileStringToAntdFileList(key));
        } else if (extension === 'date') {
          formRef.current?.setFieldValue(value, key);
        } else {
          formRef.current?.setFieldValue(value, key);
        }
      });
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runGetPlan } = useRequest(getPlan, {
    manual: true,
    onSuccess: (result: any) => {
      if (int_status(result.data.status) !== -1) {
        setCurrent(int_status(result.data.status));
      } else {
        history.push('/purchase/paymentMonitor');
        message.info('该计划正处于等待或关闭阶段，无法编辑，跳转到计划界面');
      }
      setPlan(result.data);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runApply } = useRequest(apply, {
    manual: true,
    onSuccess: () => {
      message.success('申请付款成功，正在返回计划列表...');
      history.push('/purchase/paymentMonitor');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runDeanAudit } = useRequest(dean_audit, {
    manual: true,
    onSuccess: () => {
      message.success('审核成功，正在返回计划列表...');
      history.push('/purchase/paymentMonitor');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runAudit } = useRequest(audit, {
    manual: true,
    onSuccess: () => {
      message.success('审核成功，正在返回计划列表...');
      history.push('/purchase/paymentMonitor');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runFinanceDeanAudit } = useRequest(finance_dean_audit, {
    manual: true,
    onSuccess: () => {
      message.success('审核成功，正在返回计划列表...');
      history.push('/purchase/paymentMonitor');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runBack } = useRequest(back, {
    manual: true,
    onSuccess: () => {
      message.success('已驳回，正在返回计划列表...');
      history.push('/purchase/paymentMonitor');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runProcess } = useRequest(process, {
    manual: true,
    onSuccess: () => {
      message.success('增加记录成功，正在返回计划列表...');
      history.push('/purchase/paymentMonitor');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const onStepChange = (current: number) => {
    if (int_status(plan.status) === -1) return;
    if (int_status(plan.status) < current) return;
    _.forEach(paymentRecord, (key: any, value: any) => {
      const length = value.split('_').length;
      const extension = value.split('_')[length - 1];
      if (extension === 'picture' || extension === 'file') {
        formRef.current?.setFieldValue(value, fileStringToAntdFileList(key));
      } else if (extension === 'date') {
        formRef.current?.setFieldValue(value, key);
      } else {
        formRef.current?.setFieldValue(value, key);
      }
    });
    setCurrent(current);
  };

  const handleUpload = (
    isSuccess: boolean,
    filename: string,
    field: string,
    uid: string,
  ) => {
    const payment_file = formRef.current?.getFieldValue(field);
    const current_payment_file = _.find(payment_file, (file: any) => {
      return file.uid === uid;
    });
    const other_payment_files = _.filter(payment_file, (file: any) => {
      return file.uid !== uid;
    });
    if (isSuccess) {
      formRef.current?.setFieldValue(field, [
        ...other_payment_files,
        {
          ...current_payment_file,
          status: 'done',
          percent: 100,
          filename,
        },
      ]);
    } else {
      formRef.current?.setFieldValue(field, [
        ...other_payment_files,
        {
          ...current_payment_file,
          status: 'error',
          percent: 100,
          filename,
        },
      ]);
    }
  };

  useEffect(() => {
    if (id) {
      runGetPlan(plan_id);
      runGetItem(id);
    } else {
      history.push('/purchase/paymentMonitor');
    }
  }, []);
  return (
    <PageContainer
      ghost
      header={{
        title: '服务型收付款流程记录',
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
          stepsRender={(steps) => {
            const items = _.map(steps, (value: any, key: any) => {
              const status =
                int_status(plan.status) < key
                  ? 'wait'
                  : current === key
                  ? 'process'
                  : 'finish';
              return {
                ...value,
                status,
              };
            });
            return (
              <Steps
                type="navigation"
                current={current}
                items={items}
                onChange={onStepChange}
              />
            );
          }}
          submitter={{
            render: (props: any) => {
              return [
                <Button
                  disabled={int_status(plan.status) > current}
                  htmlType="button"
                  type="primary"
                  onClick={props.onSubmit}
                  key="submit"
                >
                  提交
                </Button>,
              ];
            },
          }}
        >
          <StepsForm.StepForm<{
            name: string;
          }>
            name="apply"
            title="申请"
            onFinish={async () => {
              if (
                !access.canApplyPaymentRecord ||
                initialState?.department !== plan.department
              ) {
                message.error('你无权进行此操作');
              } else {
                const values = formRef.current?.getFieldsValue();
                if (
                  formRef.current?.getFieldValue('payment_voucher_file')[0]
                    .status === 'done'
                ) {
                  await runApply(
                    plan_id,
                    id,
                    values.assessment,
                    values.payment_voucher_file,
                    initialState?.id
                  );
                } else if (
                  formRef.current?.getFieldValue('payment_voucher_file')[0]
                    .status === 'error'
                ) {
                  message.error('文件上传失败！');
                } else {
                  message.error('文件上传中，请等待...');
                }
              }
            }}
          >
            <ProFormItem label="合同附件：">
              <PreviewListModal fileListString={plan.payment_file} />
            </ProFormItem>
            <ProFormItem
              label={plan.is_pay === 'true' ? '付款记录：' : '收款记录：'}
            >
              <a
                key="history"
                onClick={() => {
                  window.open(
                    `/#/purchase/paymentRecord#plan&${plan_id}`,
                    '_blank',
                  );
                }}
              >
                点此查看
              </a>
            </ProFormItem>
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
            <ProFormText name="company" label="合作商" width="md" disabled />
            <ProFormDigit
              name="assessment"
              label={plan.is_pay === 'true' ? '应付款金额' : '应收款金额'}
              width="md"
              rules={[{ required: true }]}
            />
            <ProFormUploadButton
              name="payment_voucher_file"
              label={plan.is_pay === 'true' ? '付款凭证' : '收款凭证'}
              rules={[{ required: true }]}
              fieldProps={{
                customRequest: (options) => {
                  upload(options.file, (isSuccess: boolean, filename: string) =>
                    handleUpload(
                      isSuccess,
                      filename,
                      'payment_voucher_file',
                      options.file.uid,
                    ),
                  );
                },
              }}
              extra={
                paymentRecord.payment_voucher_file ? (
                  <PreviewListModal
                    fileListString={paymentRecord.payment_voucher_file}
                  />
                ) : null
              }
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="dean_audit"
            title="分管院长审核"
            onFinish={async () => {
              if (!access.canDeanAuditPaymentRecord) {
                message.error('你无权进行此操作');
              } else {
                const values = formRef.current?.getFieldsValue();
                if (values.audit) await runDeanAudit(plan_id, id, initialState?.id);
                else await runBack(plan_id, id);
                return true;
              }
            }}
          >
            {
              int_status(plan.status) > current ?
              <ApprovalCard 
                approveModel="paymentPlan" 
                approveStatus="dean_audit"
                approveModelId={id} 
              />:
              <ProFormRadio.Group
                name="audit"
                options={[
                  {
                    label: '审核通过',
                    value: true,
                  },
                  {
                    label: '审核驳回',
                    value: false,
                  },
                ]}
              />  
            }
            
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="audit"
            title="财务科审核"
            onFinish={async () => {
              if (!access.canAuditPaymentRecord) {
                message.error('你无权进行此操作');
              } else {
                const values = formRef.current?.getFieldsValue();
                if (values.audit) await runAudit(plan_id, id, initialState?.id);
                else await runBack(plan_id, id);
                return true;
              }
            }}
          >
            {
              int_status(plan.status) > current ?
              <ApprovalCard 
                approveModel="paymentPlan" 
                approveStatus="audit"
                approveModelId={id} 
              />:
              <ProFormRadio.Group
                name="audit"
                options={[
                  {
                    label: '审核通过',
                    value: true,
                  },
                  {
                    label: '审核驳回',
                    value: false,
                  },
                ]}
              />
            }
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="finance_dean_audit"
            title="财务院长审核"
            onFinish={async () => {
              if (!access.canFinanceDeanAuditPaymentRecord) {
                message.error('你无权进行此操作');
              } else {
                const values = formRef.current?.getFieldsValue();
                if (values.audit) await runFinanceDeanAudit(plan_id, id, initialState?.id);
                else await runBack(plan_id, id);
                return true;
              }
            }}
          >
            {
              int_status(plan.status) > current ?
              <ApprovalCard 
                approveModel="paymentPlan" 
                approveStatus="finance_dean_audit"
                approveModelId={id} 
              />:
              <ProFormRadio.Group
                name="audit"
                options={[
                  {
                    label: '审核通过',
                    value: true,
                  },
                  {
                    label: '审核驳回',
                    value: false,
                  },
                ]}
              />
            }
          </StepsForm.StepForm>
          <StepsForm.StepForm<{
            checkbox: string;
          }>
            name="process"
            title="收付款"
            onFinish={async () => {
              if (!access.canProcessPaymentRecord) {
                message.error('你无权进行此操作');
              } else {
                const values = formRef.current?.getFieldsValue();
                if (
                  formRef.current?.getFieldValue('payment_file')[0].status ===
                  'done'
                ) {
                  await runProcess(
                    plan_id,
                    id,
                    values.assessment_date.format('YYYY-MM-DD'),
                    values.payment_file,
                    initialState?.id
                  );
                } else if (
                  formRef.current?.getFieldValue('payment_file')[0].status ===
                  'error'
                ) {
                  message.error('文件上传失败');
                } else {
                  message.error('文件上传中，请等待');
                }
              }
            }}
          >
            <ProFormDatePicker
              name="assessment_date"
              label={plan.is_pay === 'true' ? '付款日期：' : '收款日期：'}
              width="sm"
              rules={[{ required: true }]}
            />
            <ProFormUploadButton
              label={plan.is_pay === 'true' ? '付款收据：' : '收款收据：'}
              name="payment_file"
              fieldProps={{
                customRequest: (options) => {
                  upload(options.file, (isSuccess: boolean, filename: string) =>
                    handleUpload(
                      isSuccess,
                      filename,
                      'payment_file',
                      options.file.uid,
                    ),
                  );
                },
              }}
              extra={
                paymentRecord.payment_file ? (
                  <PreviewListModal
                    fileListString={paymentRecord.payment_file}
                  />
                ) : null
              }
            />
          </StepsForm.StepForm>
        </StepsForm>
        {contextHolder}
      </ProCard>
    </PageContainer>
  );
};

export default PaymentRecordDetailPage;
