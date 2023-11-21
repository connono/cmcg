import PreviewListModal from '@/components/PreviewListModal';
import { SERVER_HOST } from '@/constants';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormDigit,
  ProFormItem,
  ProFormRadio,
  ProFormText,
  ProFormUploadDragger,
  StepsForm,
} from '@ant-design/pro-components';
import { history, useAccess, useRequest } from '@umijs/max';
import { Button, Modal, Steps, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { upload } from '../../../utils/file-uploader';

const int_status = (status: string) => {
  switch (status) {
    case 'apply':
      return 0;
    case 'audit':
      return 1;
    case 'process':
      return 2;
    default:
      return -1;
  }
};

const getItem = async (id: string) => {
  return await axios.get(`${SERVER_HOST}/payment/records/getItem?id=${id}`);
};

const apply = async (
  process_id: string,
  record_id: string,
  assessment: string,
  payment_voucher_file: string,
) => {
  const form = new FormData();
  form.append('method', 'apply');
  form.append('process_id', process_id);
  form.append('assessment', assessment);
  form.append('payment_voucher_file', payment_voucher_file);
  form.append('type', 'process');

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/records/update/${record_id}`,
  });
};

const audit = async (process_id: string, record_id: string) => {
  const form = new FormData();
  form.append('method', 'audit');
  form.append('process_id', process_id);
  form.append('type', 'process');
  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/records/update/${record_id}`,
  });
};

const process = async (
  process_id: string,
  record_id: string,
  assessment_date: string,
  payment_file: string,
) => {
  const form = new FormData();
  form.append('method', 'process');
  form.append('process_id', process_id);
  form.append('assessment_date', assessment_date);
  form.append('payment_file', payment_file);
  form.append('type', 'process');

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/records/update/${record_id}`,
  });
};

const back = async (process_id: string, record_id: string) => {
  return await axios({
    method: 'PATCH',
    data: { process_id, type: 'process' },
    url: `${SERVER_HOST}/payment/records/back/${record_id}`,
  });
};

const PaymentRecordDetailPage: React.FC = () => {
  const [paymentRecord, setPaymentRecord] = useState({});
  const hashArray = history.location.hash.split('#')[1].split('&');
  const method = history.location.state.status;
  const process_id = hashArray[1];
  const id = hashArray[2];
  const [modal, contextHolder] = Modal.useModal(); // eslint-disable-line
  const formRef = useRef<ProFormInstance>();
  const [current, setCurrent] = useState<number>(0);
  const access = useAccess();

  const { run: runGetItem } = useRequest(getItem, {
    manual: true,
    onSuccess: (result: any) => {
      if (int_status(method) !== -1) {
        setCurrent(int_status(method));
      } else {
        history.push('/paymentProcess');
        message.info('该计划正处于等待或关闭阶段，无法编辑，跳转到计划界面');
      }
      setPaymentRecord(result.data);
      _.forEach(result.data, (key: any, value: any) => {
        const length = value.split('_').length;
        const extension = value.split('_')[length - 1];
        if (extension === 'picture' || extension === 'file') {
          const length = key ? key.split('/').length : 0;
          const name = key ? key.split('/')[length - 1] : '';
          if (name) {
            formRef.current?.setFieldValue(value, [
              {
                uid: '0',
                name,
                status: 'done',
                url: key,
              },
            ]);
          }
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
  const { run: runApply } = useRequest(apply, {
    manual: true,
    onSuccess: () => {
      message.success('申请付款成功，正在返回计划列表...');
      history.push('/paymentProcess');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runAudit } = useRequest(audit, {
    manual: true,
    onSuccess: () => {
      message.success('审核成功，正在返回计划列表...');
      history.push('/paymentProcess');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runBack } = useRequest(back, {
    manual: true,
    onSuccess: () => {
      message.success('已驳回，正在返回计划列表...');
      history.push('/paymentProcess');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runProcess } = useRequest(process, {
    manual: true,
    onSuccess: () => {
      message.success('增加记录成功，正在返回计划列表...');
      history.push('/paymentProcess');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const onStepChange = (current: number) => {
    if (int_status(method) === -1) return;
    if (int_status(method) < current) return;
    _.forEach(paymentRecord, (key: any, value: any) => {
      const length = value.split('_').length;
      const extension = value.split('_')[length - 1];
      if (extension === 'picture' || extension === 'file') {
        const length = key ? key.split('/').length : 0;
        const name = key ? key.split('/')[length - 1] : '';
        if (name) {
          formRef.current?.setFieldValue(value, [
            {
              uid: '0',
              name,
              status: 'done',
              url: key,
            },
          ]);
        }
      } else if (extension === 'date') {
        formRef.current?.setFieldValue(value, key);
      } else if (value === 'assessment') {
        const percent = _.floor(
          _.divide(key, history.location.state.target_amount) * 100,
          2,
        );
        formRef.current?.setFieldsValue({
          assessment: key,
          assessment_percent: percent,
        });
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
  ) => {
    const current_payment_file = formRef.current?.getFieldValue(field)[0];
    if (isSuccess) {
      formRef.current?.setFieldValue(field, [
        {
          ...current_payment_file,
          status: 'done',
          percent: 100,
          filename,
        },
      ]);
    } else {
      formRef.current?.setFieldValue(field, [
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
      runGetItem(id);
    } else {
      history.push('/paymentProcess');
    }
  }, []);
  return (
    <PageContainer
      ghost
      header={{
        title: '物资型付款流程监控',
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
                int_status(method) < key
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
                  disabled={int_status(method) > current}
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
            onValuesChange={(value) => {
              const global_assessment =
                history.location.state.target_amount -
                history.location.state.assessments_count;
              const global_percent = _.floor(
                _.divide(
                  global_assessment,
                  history.location.state.target_amount,
                ) * 100,
                2,
              );
              if (value.assessment) {
                const percent = _.floor(
                  _.divide(
                    value.assessment,
                    history.location.state.target_amount,
                  ) * 100,
                  2,
                );
                if (
                  percent !==
                  formRef.current?.getFieldValue('assessment_percent')
                ) {
                  formRef.current?.setFieldValue('assessment_percent', percent);
                }
                if (value.assessment === global_assessment) {
                  formRef.current?.setFieldValue('is_all_assessment', true);
                } else {
                  formRef.current?.setFieldValue('is_all_assessment', false);
                }
              }
              if (value.assessment_percent) {
                const assessment = _.divide(
                  _.multiply(
                    value.assessment_percent,
                    history.location.state.target_amount,
                  ),
                  100,
                );
                if (
                  assessment !== formRef.current?.getFieldValue('assessment')
                ) {
                  formRef.current?.setFieldValue('assessment', assessment);
                }
                if (value.assessment_percent === global_percent) {
                  formRef.current?.setFieldValue('is_all_assessment', true);
                } else {
                  formRef.current?.setFieldValue('is_all_assessment', false);
                }
              }
              if (value.is_all_assessment) {
                if (
                  global_assessment !==
                  formRef.current?.getFieldValue('assessment')
                ) {
                  formRef.current?.setFieldValue(
                    'assessment',
                    global_assessment,
                  );
                }
                if (
                  global_percent !==
                  formRef.current?.getFieldValue('assessment_percent')
                ) {
                  formRef.current?.setFieldValue(
                    'assessment_percent',
                    global_percent,
                  );
                }
              }
            }}
            onFinish={async () => {
              if (!access.canApplyPaymentRecord) {
                message.error('你无权进行此操作');
              } else {
                const values = formRef.current?.getFieldsValue();
                if (
                  formRef.current?.getFieldValue('payment_voucher_file')[0]
                    .status === 'done'
                ) {
                  await runApply(
                    process_id,
                    id,
                    values.assessment,
                    values.payment_voucher_file[0].filename,
                  );
                } else if (
                  formRef.current?.getFieldValue('payment_voucher_file')[0]
                    .status === 'error'
                ) {
                  message.error('文件上传失败');
                } else {
                  message.error('文件上传中，请等待');
                }
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
            <ProFormText name="company" label="合作商" width="md" disabled />
            <ProForm.Group>
              <ProFormDigit
                name="assessment"
                label={`${
                  history.location.state.is_pay === 'true'
                    ? '应付款金额'
                    : '应收款金额'
                }(项目余款${
                  history.location.state.target_amount -
                  history.location.state.assessments_count
                }元)`}
                min={1}
                max={
                  history.location.state.target_amount -
                  history.location.state.assessments_count
                }
                rules={[{ required: true }]}
              />
              <ProFormDigit
                name="assessment_percent"
                label={`${
                  history.location.state.is_pay === 'true'
                    ? '应付款金额百分比'
                    : '应收款金额百分比'
                }(项目余款百分比${_.floor(
                  _.divide(
                    history.location.state.target_amount -
                      history.location.state.assessments_count,
                    history.location.state.target_amount,
                  ) * 100,
                  2,
                )}%)`}
                min={0}
                max={_.floor(
                  _.divide(
                    history.location.state.target_amount -
                      history.location.state.assessments_count,
                    history.location.state.target_amount,
                  ) * 100,
                  2,
                )}
                rules={[{ required: true }]}
              />
              <ProFormCheckbox name="is_all_assessment" label="是否全额付款" />
            </ProForm.Group>

            <ProFormUploadDragger
              name="payment_voucher_file"
              label={
                history.location.state.is_pay === 'true'
                  ? '付款凭证'
                  : '收款凭证'
              }
              rules={[{ required: true }]}
              fieldProps={{
                customRequest: (options) => {
                  upload(options.file, (isSuccess: boolean, filename: string) =>
                    handleUpload(isSuccess, filename, 'payment_voucher_file'),
                  );
                },
              }}
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
                if (values.audit) await runAudit(process_id, id);
                else await runBack(process_id, id);
                return true;
              }
            }}
          >
            <ProFormItem label="合同附件：">
              <PreviewListModal
                fileListString={history.location.state.payment_file}
              />
            </ProFormItem>
            <ProFormItem
              label={
                history.location.state.is_pay === 'true'
                  ? '付款凭证：'
                  : '收款凭证：'
              }
            >
              {
                // @ts-ignore
                paymentRecord?.payment_voucher_file ? (
                  <PreviewListModal
                    fileListString={paymentRecord.payment_voucher_file}
                  />
                ) : (
                  <span>找不到该文件</span>
                )
              }
            </ProFormItem>
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
                if (
                  formRef.current?.getFieldValue('payment_file')[0].status ===
                  'done'
                ) {
                  await runProcess(
                    process_id,
                    id,
                    values.assessment_date.format('YYYY-MM-DD'),
                    values.payment_file[0].filename,
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
              label={
                history.location.state.is_pay === 'true'
                  ? '付款日期：'
                  : '收款日期：'
              }
              width="sm"
              rules={[{ required: true }]}
            />
            <ProFormUploadDragger
              label={
                history.location.state.is_pay === 'true'
                  ? '付款收据：'
                  : '收款收据：'
              }
              name="payment_file"
              max={1}
              fieldProps={{
                customRequest: (options) => {
                  upload(options.file, (isSuccess: boolean, filename: string) =>
                    handleUpload(isSuccess, filename, 'payment_file'),
                  );
                },
              }}
              rules={[{ required: true }]}
            />
          </StepsForm.StepForm>
        </StepsForm>
        {contextHolder}
      </ProCard>
    </PageContainer>
  );
};

export default PaymentRecordDetailPage;
