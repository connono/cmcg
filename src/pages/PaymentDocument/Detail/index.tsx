import ApprovalCard from '@/components/ApprovalCard';
import ApprovalList from '@/components/ApprovalList';
import PreviewListModal from '@/components/PreviewListModal';
import PreviewListVisible from '@/components/PreviewListVisible';
import { SERVER_HOST } from '@/constants';
import { fileListToString, preview, upload } from '@/utils/file-uploader';
import { DownloadOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  PageContainer,
  ProCard,
  ProFormRadio,
  ProFormUploadButton,
  StepsForm,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { history, useAccess, useModel, useRequest } from '@umijs/max';
import { Button, FloatButton, Steps, Table, message } from 'antd';
import axios from 'axios';
import { saveAs } from 'file-saver';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';

const int_status = (status: string) => {
  switch (status) {
    case 'dean_audit':
      return 0;
    case 'audit':
      return 1;
    case 'finance_audit':
      return 2;
    case 'finance_dean_audit':
      return 3;
    case 'upload':
      return 4;
    case 'finish':
      return 5;
    default:
      return -1;
  }
};

const getItem = async (id: string) => {
  return await axios.get(`${SERVER_HOST}/payment/document/records/item/${id}`);
};

const getDocumentItem = async (id: string) => {
  return await axios.get(
    `${SERVER_HOST}/payment/document/records/getItem/${id}`,
  );
};

const audit = async (record_id: string, user_id: number) => {
  const form = new FormData();
  form.append('user_id', user_id.toString());
  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/document/records/update/${record_id}`,
  });
};

const uploadDocument = async (
  record_id: string,
  payment_document_file: string,
) => {
  const form = new FormData();
  form.append('payment_document_file', fileListToString(payment_document_file));
  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/document/records/update/${record_id}`,
  });
};

const reject = async (
  record_id: string,
  user_id: number,
  reject_reason: string,
) => {
  const form = new FormData();
  form.append('user_id', user_id.toString());
  form.append('reject_reason', reject_reason);
  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/document/record/reject/${record_id}`,
  });
}

const PaymentDocumentDetailPage: React.FC = () => {
  console.log(history.location.state);
  // const [paymentRecord, setPaymentRecord] = useState({});
  const hashArray = history.location.hash.split('#')[1].split('&');
  // const process_id = hashArray[1];
  const id = hashArray[1];
  // const [modal, contextHolder] = Modal.useModal(); // eslint-disable-line
  const formRef = useRef<ProFormInstance>();
  const [current, setCurrent] = useState<number>(0);
  const [dataSource, setDataSource] = useState<any>();
  const [paymentDocumentItem, setPaymentDocumentItem] = useState({});
  const access = useAccess();
  const [xlsx, setXlsx] = useState();
  const {initialState} = useModel('@@initialState')

  const { run: runGetItem } = useRequest(getItem, {
    manual: true,
    onSuccess: (result: any) => {
      setDataSource(result.data);
      if (paymentDocumentItem.excel_url) {
        preview(paymentDocumentItem.excel_url, (file: File) => {
          setXlsx(file);
        });
      }
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runGetDocumentItem } = useRequest(getDocumentItem, {
    manual: true,
    onSuccess: (result: any) => {
      setPaymentDocumentItem(result.data);
      runGetItem(id);
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

  const { run: runReject } = useRequest(reject, {
    manual: true,
    onSuccess: () => {
      message.success('审批成功，正在返回列表...');
      history.push('/purchase/paymentDocument');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runUploadDocument } = useRequest(uploadDocument, {
    manual: true,
    onSuccess: () => {
      message.success('上传成功，正在返回列表...');
      history.push('/purchase/paymentDocument');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const onStepChange = (current: number) => {
    if (int_status(paymentDocumentItem.status) === -1) return;
    if (int_status(paymentDocumentItem.status) < current) return;
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
      title: '合同附件',
      key: 'contract_file',
      render: (record: any) => {
        return <PreviewListModal fileListString={record.contract_file} />;
      },
    },
    {
      title: '验收附件',
      key: 'install_picture',
      render: (record: any) => {
        return <PreviewListModal fileListString={record.install_picture} />;
      },
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
      runGetDocumentItem(id);
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
      { paymentDocumentItem.payment_document_file ? (
        <div>
          <ApprovalList 
            approveModel='PaymentDocument'
            approveModelId={id}
            statusList={['申请', '分管院长审批', '财务会计复核', '财务科长审批', '财务院长审批']}
          />
          <PreviewListVisible
            title="制单附件"
            fileListString={paymentDocumentItem.payment_document_file}
            open={true}
          />  
        </div>
        
      ) : (
        <div>
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
                    int_status(paymentDocumentItem.status) < key
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
                      disabled={
                        int_status(paymentDocumentItem.status) > current
                      }
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
                name="0"
                title="分管院长审批"
                onFinish={async () => {
                  if (!access.canDeanAuditPaymentDocument) {
                    message.error('你无权进行此操作');
                  } else {
                    const values = formRef.current?.getFieldsValue();
                    if(values.audit){
                      await runAudit(id, initialState?.id);
                    }else{
                      await runReject(id, initialState?.id, values.reject_reason)
                    }
                  }
                }}
              >
                {
                  int_status(paymentDocumentItem.status) > current ?
                  <ApprovalCard
                    approveModel="paymentDocument" 
                    approveStatus="dean_audit"
                    approveModelId={id} 
                  />:
                  (
                    <div>
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
                      <ProFormTextArea
                        name="reject_reason"
                        label="拒绝理由"
                        placeholder="请输入拒绝理由"
                      />     
                    </div>
                  )
                }
                
              </StepsForm.StepForm>
              <StepsForm.StepForm<{
                name: string;
              }>
                name="1"
                title="财务会计复核"
                onFinish={async () => {
                  if (!access.canAuditPaymentDocument) {
                    message.error('你无权进行此操作');
                  } else {
                    const values = formRef.current?.getFieldsValue();
                    if(values.audit){
                      await runAudit(id, initialState?.id);
                    }else{
                      await runReject(id, initialState?.id, values.reject_reason)
                    }
                  }
                }}
              >
                {
                  int_status(paymentDocumentItem.status) > current ?
                  <ApprovalCard
                    approveModel="paymentDocument" 
                    approveStatus="audit"
                    approveModelId={id} 
                  />:
                  (
                    <div>
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
                      <ProFormTextArea
                        name="reject_reason"
                        label="拒绝理由"
                        placeholder="请输入拒绝理由"
                      />     
                    </div>
                  )
                }
              </StepsForm.StepForm>
              <StepsForm.StepForm<{
                name: string;
              }>
                name="2"
                title="财务科长审批"
                onFinish={async () => {
                  if (!access.canFinanceAuditPaymentDocument) {
                    message.error('你无权进行此操作');
                  } else {
                    const values = formRef.current?.getFieldsValue();
                    if(values.audit){
                      await runAudit(id, initialState?.id);
                    }else{
                      await runReject(id, initialState?.id, values.reject_reason)
                    }
                  }
                }}
              >
                {
                  int_status(paymentDocumentItem.status) > current ?
                  <ApprovalCard
                    approveModel="paymentDocument" 
                    approveStatus="finance_audit"
                    approveModelId={id} 
                  />:
                  (
                    <div>
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
                      <ProFormTextArea
                        name="reject_reason"
                        label="拒绝理由"
                        placeholder="请输入拒绝理由"
                      />     
                    </div>
                  )
                }
              </StepsForm.StepForm>
              <StepsForm.StepForm<{
                name: string;
              }>
                name="3"
                title="财务院长审批"
                onFinish={async () => {
                  if (!access.canFinanceDeanAuditPaymentDocument) {
                    message.error('你无权进行此操作');
                  } else {
                    const values = formRef.current?.getFieldsValue();
                    if(values.audit){
                      await runAudit(id, initialState?.id);
                    }else{
                      await runReject(id, initialState?.id, values.reject_reason)
                    }
                  }
                }}
              >
                {
                  int_status(paymentDocumentItem.status) > current ?
                  <ApprovalCard
                    approveModel="paymentDocument" 
                    approveStatus="finance_dean_audit"
                    approveModelId={id} 
                  />:
                  (
                    <div>
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
                      <ProFormTextArea
                        name="reject_reason"
                        label="拒绝理由"
                        placeholder="请输入拒绝理由"
                      />     
                    </div>
                  )
                }
              </StepsForm.StepForm>
              <StepsForm.StepForm
                name="upload"
                title="上传制单表"
                onFinish={async () => {
                  if (!access.canUploadPaymentDocument) {
                    message.error('你无权进行此操作');
                    return;
                  }
                  // if (!access.canInstallEquipment) {
                  //   message.error('你无权进行此操作');
                  // } else {
                  const values = formRef.current?.getFieldsValue();
                  if (
                    formRef.current?.getFieldValue('payment_document_file')[0]
                      .status === 'done'
                  ) {
                    await runUploadDocument(id, values.payment_document_file);
                  } else if (
                    formRef.current?.getFieldValue('payment_document_file')[0]
                      .status === 'error'
                  ) {
                    message.error('文件上传失败！');
                  } else {
                    message.error('文件上传中，请等待...');
                  }
                  // }
                }}
              >
                <ProFormUploadButton
                  label="制单表："
                  name="payment_document_file"
                  fieldProps={{
                    customRequest: (options) => {
                      upload(
                        options.file,
                        (isSuccess: boolean, filename: string) =>
                          handleUpload(
                            isSuccess,
                            filename,
                            'payment_document_file',
                            options.file.uid,
                          ),
                      );
                    },
                  }}
                  // extra={
                  //   equipmentItem.status > current ? (
                  //     <PreviewListModal
                  //       fileListString={equipmentItem.install_picture}
                  //     />
                  //   ) : null
                  // }
                  rules={[{ required: true }]}
                />
              </StepsForm.StepForm>
            </StepsForm>
          </ProCard>
          <FloatButton.Group shape="square" style={{ right: 50 }}>
            <FloatButton
              icon={<DownloadOutlined />}
              tooltip={<span>下载备案表</span>}
              onClick={() => {
                saveAs(xlsx);
              }}
            />
          </FloatButton.Group>
        </div>
      )}
    </PageContainer>
  );
};

export default PaymentDocumentDetailPage;
