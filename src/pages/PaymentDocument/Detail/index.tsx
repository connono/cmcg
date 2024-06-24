import { SERVER_HOST } from '@/constants';
import { branchXlsx } from '@/utils/xlsx';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  PageContainer,
  ProCard,
  ProFormRadio,
  StepsForm,
} from '@ant-design/pro-components';
import { history, useRequest } from '@umijs/max';
import { Button, Steps, Table, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';

const int_status = (status: string) => {
  switch (status) {
    case 'finance_audit':
      return 0;
    case 'dean_audit':
      return 1;
    case 'finance_dean_audit':
      return 2;
    default:
      return -1;
  }
};

const getItem = async (id: string) => {
  return await axios.get(`${SERVER_HOST}/payment/document/records/item/${id}`);
};

const audit = async (record_id: string, position: number) => {
  const result = await axios({
    method: 'POST',
    url: `${SERVER_HOST}/payment/document/records/update/${record_id}`,
  });

  console.log('res:', result);
  branchXlsx(result.data.excel_url, result.data.signature, position);
};

const PaymentDocumentDetailPage: React.FC = () => {
  console.log(history.location.state);
  // const [paymentRecord, setPaymentRecord] = useState({});
  const hashArray = history.location.hash.split('#')[1].split('&');
  const method = history.location.state.status;
  // const process_id = hashArray[1];
  const id = hashArray[1];
  // const [modal, contextHolder] = Modal.useModal(); // eslint-disable-line
  const formRef = useRef<ProFormInstance>();
  const [current, setCurrent] = useState<number>(0);
  const [dataSource, setDataSource] = useState<any>();

  const { run: runGetItem } = useRequest(getItem, {
    manual: true,
    onSuccess: (result: any) => {
      console.log(result);
      setDataSource(result.data);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runAudit } = useRequest(audit, {
    manual: true,
    onSuccess: () => {
      message.success('审批成功，正在返回列表...');
      history.push('/purchase/paymentDocument');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  // const { run: runDocument } = useRequest(document, {
  //   manual: true,
  //   onSuccess: () => {
  //     message.success('申请制单成功，正在返回计划列表...');
  //     history.push('/purchase/paymentProcess');
  //   },
  //   onError: (error: any) => {
  //     message.error(error.message);
  //   },
  // });
  // const { run: runFinanceAudit } = useRequest(financeAudit, {
  //   manual: true,
  //   onSuccess: () => {
  //     message.success('审核成功，正在返回计划列表...');
  //     history.push('/purchase/paymentProcess');
  //   },
  //   onError: (error: any) => {
  //     message.error(error.message);
  //   },
  // });
  // const { run: runDeanAudit } = useRequest(deanAudit, {
  //   manual: true,
  //   onSuccess: () => {
  //     message.success('审核成功，正在返回计划列表...');
  //     history.push('/purchase/paymentProcess');
  //   },
  //   onError: (error: any) => {
  //     message.error(error.message);
  //   },
  // });
  // const { run: runBack } = useRequest(back, {
  //   manual: true,
  //   onSuccess: () => {
  //     message.success('已驳回，正在返回计划列表...');
  //     history.push('/purchase/paymentProcess');
  //   },
  //   onError: (error: any) => {
  //     message.error(error.message);
  //   },
  // });
  // const { run: runProcess } = useRequest(process, {
  //   manual: true,
  //   onSuccess: () => {
  //     message.success('增加记录成功，正在返回计划列表...');
  //     history.push('/purchase/paymentProcess');
  //   },
  //   onError: (error: any) => {
  //     message.error(error.message);
  //   },
  // });

  const onStepChange = (current: number) => {
    if (int_status(method) === -1) return;
    if (int_status(method) < current) return;
    // _.forEach(paymentRecord, (key: any, value: any) => {
    //   const length = value.split('_').length;
    //   const extension = value.split('_')[length - 1];
    //   if (extension === 'picture' || extension === 'file') {
    //     formRef.current?.setFieldValue(value, fileStringToAntdFileList(key));
    //   } else if (extension === 'date') {
    //     formRef.current?.setFieldValue(value, key);
    //   } else if (value === 'assessment') {
    //     const percent = _.floor(
    //       _.divide(key, history.location.state.target_amount) * 100,
    //       2,
    //     );
    //     formRef.current?.setFieldsValue({
    //       assessment: key,
    //       assessment_percent: percent,
    //     });
    //   } else {
    //     formRef.current?.setFieldValue(value, key);
    //   }
    // });
    setCurrent(current);
  };

  // const handleUpload = (
  //   isSuccess: boolean,
  //   filename: string,
  //   field: string,
  //   uid: string,
  // ) => {
  //   const payment_file = formRef.current?.getFieldValue(field);
  //   const current_payment_file = _.find(payment_file, (file) => {
  //     return file.uid === uid;
  //   });
  //   const other_payment_files = _.filter(payment_file, (file) => {
  //     return file.uid !== uid;
  //   });
  //   if (isSuccess) {
  //     formRef.current?.setFieldValue(field, [
  //       ...other_payment_files,
  //       {
  //         ...current_payment_file,
  //         status: 'done',
  //         percent: 100,
  //         filename,
  //       },
  //     ]);
  //   } else {
  //     formRef.current?.setFieldValue(field, [
  //       ...other_payment_files,
  //       {
  //         ...current_payment_file,
  //         status: 'error',
  //         percent: 100,
  //         filename,
  //       },
  //     ]);
  //   }
  // };

  const columns = [
    {
      title: '应付款单位',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: '设备名称',
      dataIndex: 'equipment',
      key: 'equipment',
    },
    {
      title: '合同金额',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '款项',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '已支付情况',
      children: [
        {
          title: '支付时间',
          dataIndex: 'last_pay_date',
          key: 'last_pay_date',
        },
        {
          title: '支付金额',
          dataIndex: 'assessment_count',
          key: 'assessment_count',
        },
      ],
    },
    {
      title: '本期支付金额',
      dataIndex: 'assessment',
      key: 'assessment',
    },
    {
      title: '未支付金额',
      dataIndex: 'rest_money',
      key: 'rest_money',
    },
    {
      title: '本期合同支付条件',
      dataIndex: 'payment_terms_now',
      key: 'payment_terms_now',
    },
    {
      title: '合同支付条件',
      dataIndex: 'payment_terms',
      key: 'payment_terms',
    },
  ];

  useEffect(() => {
    if (id) {
      runGetItem(id);
    } else {
      history.push('/purchase/paymentProcess');
    }
  }, []);
  return (
    <PageContainer
      ghost
      header={{
        title: '制单管理',
      }}
    >
      <Table dataSource={dataSource} columns={columns} />
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
            name="1"
            title="财务科长审批"
            onFinish={async () => {
              await runAudit(id, 2);
            }}
          >
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
            name: string;
          }>
            name="2"
            title="分管院长审批"
            onFinish={async () => {
              await runAudit(id, 3);
            }}
          >
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
            name: string;
          }>
            name="3"
            title="财务院长审批"
            onFinish={async () => {
              await runAudit(id, 3);
            }}
          >
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
          {/* <StepsForm.StepForm<{
            name: string;
          }>
            name="2"
            title="分管院长审批"
            onFinish={async () => {
              const values = formRef.current?.getFieldsValue();
              await runApply(process_id, id, values.assessment, values.payment_terms);
            }}
          >
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
            name: string;
          }>
            name="3"
            title="财务院长审批"
            onFinish={async () => {
              const values = formRef.current?.getFieldsValue();
              await runApply(process_id, id, values.assessment, values.payment_terms);
            }}
          >
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
          </StepsForm.StepForm> */}
          {/* <StepsForm.StepForm
            name="document"
            title="制单"
            onFinish={async () => {
              if (!access.canDocumentPaymentProcessRecord) {
                message.error('你无权进行此操作');
              } else {
                const values = formRef.current?.getFieldsValue();
                if (
                  formRef.current?.getFieldValue('payment_voucher_file')[0]
                    .status === 'done'
                ) {
                  await runDocument(
                    process_id,
                    id,
                    values.payment_voucher_file,
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
            <ProFormItem label="合同附件：">
              <PreviewListModal
                fileListString={history.location.state.payment_file}
              />
            </ProFormItem>
            <ProFormItem label="验收资料：">
              <PreviewListModal
                fileListString={history.location.state.install_picture}
              />
            </ProFormItem>
            <ProFormUploadButton
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
                    handleUpload(
                      isSuccess,
                      filename,
                      'payment_voucher_file',
                      options.file.uid,
                    ),
                  );
                },
              }}
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="finance_audit"
            title="财务科审核"
            onFinish={async () => {
              if (!access.canAuditPaymentRecord) {
                message.error('你无权进行此操作');
              } else {
                const values = formRef.current?.getFieldsValue();
                if (values.audit) await runFinanceAudit(process_id, id);
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
            <ProFormItem label="验收资料：">
              <PreviewListModal
                fileListString={history.location.state.install_picture}
              />
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
          <StepsForm.StepForm
            name="dean_audit"
            title="副院长审核"
            onFinish={async () => {
              if (!access.canDeanAuditPaymentProcessRecord) {
                message.error('你无权进行此操作');
              } else {
                const values = formRef.current?.getFieldsValue();
                if (values.audit) await runDeanAudit(process_id, id);
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
            <ProFormItem label="验收资料：">
              <PreviewListModal
                fileListString={history.location.state.install_picture}
              />
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
                    values.payment_file,
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
            <ProFormUploadButton
              label={
                history.location.state.is_pay === 'true'
                  ? '付款收据：'
                  : '收款收据：'
              }
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
              rules={[{ required: true }]}
            />
          </StepsForm.StepForm>*/}
        </StepsForm>
        {/* {contextHolder} */}
      </ProCard>
    </PageContainer>
  );
};

export default PaymentDocumentDetailPage;
