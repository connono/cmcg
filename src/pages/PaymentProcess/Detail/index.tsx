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
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
  StepsForm,
} from '@ant-design/pro-components';
import { history, useAccess, useModel, useRequest } from '@umijs/max';
import { Button, Modal, Steps, Table, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import {
  fileListToString,
  fileStringToAntdFileList,
  upload,
} from '../../../utils/file-uploader';

const int_status = (status: string) => {
  switch (status) {
    case 'apply':
      return 0;
    case 'process':
      return 2;
    default:
      return 1;
  }
};

const getItem = async (id: string) => {
  return await axios.get(
    `${SERVER_HOST}/payment/process/records/getItem?id=${id}`,
  );
};

const apply = async (
  process_id: string,
  record_id: string,
  assessment: string,
  payment_terms: string,
) => {
  const form = new FormData();
  form.append('method', 'apply');
  form.append('process_id', process_id);
  form.append('assessment', assessment);
  form.append('payment_terms', payment_terms);

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/process/records/update/${record_id}`,
  });
};

const getDocument = async (id: string) => {
  return await axios.get(`${SERVER_HOST}/payment/document/records/item/${id}`);
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
  form.append('payment_file', fileListToString(payment_file));

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/process/records/update/${record_id}`,
  });
};

// const back = async (process_id: string, record_id: string) => {
//   return await axios({
//     method: 'PATCH',
//     data: { process_id, type: 'process' },
//     url: `${SERVER_HOST}/payment/process/records/back/${record_id}`,
//   });
// };

const PaymentRecordDetailPage: React.FC = () => {
  const [paymentRecord, setPaymentRecord] = useState({});
  const hashArray = history.location.hash.split('#')[1].split('&');
  const method = history.location.state.status;
  const process_id = hashArray[1];
  const id = hashArray[2];
  const [modal, contextHolder] = Modal.useModal(); // eslint-disable-line
  const formRef = useRef<ProFormInstance>();
  const [current, setCurrent] = useState<number>(0);
  const [dataSource, setDataSource] = useState<any>();
  const access = useAccess();
  const { initialState } = useModel('@@initialState');

  const { run: runGetDocument } = useRequest(getDocument, {
    manual: true,
    onSuccess: (result: any) => {
      console.log(result);
      setDataSource(result.data);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runGetItem } = useRequest(getItem, {
    manual: true,
    onSuccess: (result: any) => {
      if (int_status(method) !== -1) {
        setCurrent(int_status(method));
      } else {
        history.push('/purchase/paymentProcess');
        message.info('该计划正处于等待或关闭阶段，无法编辑，跳转到计划界面');
      }
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
  const { run: runApply } = useRequest(apply, {
    manual: true,
    onSuccess: () => {
      message.success('申请付款成功，正在返回计划列表...');
      history.push('/purchase/paymentProcess');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runProcess } = useRequest(process, {
    manual: true,
    onSuccess: () => {
      message.success('增加记录成功，正在返回计划列表...');
      history.push('/purchase/paymentProcess');
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
        formRef.current?.setFieldValue(value, fileStringToAntdFileList(key));
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
    uid: string,
  ) => {
    const payment_file = formRef.current?.getFieldValue(field);
    const current_payment_file = _.find(payment_file, (file) => {
      return file.uid === uid;
    });
    const other_payment_files = _.filter(payment_file, (file) => {
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
    if (paymentRecord.payment_document_id) {
      runGetDocument(paymentRecord.payment_document_id);
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
              if (
                !access.canApplyPaymentRecord ||
                initialState?.department !== history.location.state.department
              ) {
                message.error('你无权进行此操作');
              } else {
                const values = formRef.current?.getFieldsValue();
                await runApply(
                  process_id,
                  id,
                  values.assessment,
                  values.payment_terms,
                );
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
            <ProFormTextArea
              width="md"
              name="payment_terms"
              label="合同支付条件"
              placeholder="请输入合同支付条件"
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm name="audit" title="审核">
            <Table dataSource={dataSource} columns={columns} />{' '}
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
          </StepsForm.StepForm>
        </StepsForm>
        {contextHolder}
      </ProCard>
    </PageContainer>
  );
};

export default PaymentRecordDetailPage;
