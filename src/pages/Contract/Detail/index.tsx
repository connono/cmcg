import EditableContractMonitorTable from '@/components/EditableContractTable/EditableContractMonitorTable';
import EditableContractProcessTable from '@/components/EditableContractTable/EditableContractProcessTable';
// import PreviewListVisible from '@/components/PreviewListVisible';
import PreviewListVisible from '@/components/PreviewListVisible';
import { SERVER_HOST } from '@/constants';
import { fileListToString, preview } from '@/utils/file-uploader';
import { DownloadOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  PageContainer,
  ProFormRadio,
  ProFormUploadButton,
  StepsForm,
} from '@ant-design/pro-components';
import { useModel, Access, history, useAccess, useRequest } from '@umijs/max';
import {
  Button,
  Divider,
  FloatButton,
  Skeleton,
  Steps,
  Tabs,
  message,
} from 'antd';
import axios from 'axios';
import * as docx from 'docx-preview';
import { saveAs } from 'file-saver';
import React, { useEffect, useRef, useState } from 'react';
import { upload } from '../../../utils/file-uploader';
import ApprovalCard from '@/components/ApprovalCard';
import _ from 'lodash';

const int_status = (status: string) => {
  switch (status) {
    case 'approve':
      return 0;
    case 'upload':
      return 1;
    case 'finish':
      return 2;
    default:
      return -1;
  }
};

const approve = async (id: string, method: string, user_id: number) => {
  const form = new FormData();
  form.append('method', method);
  form.append('user_id', user_id.toString());
  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/contracts/update/${id}`,
  });
};

const uploadFile = async (
  id: string,
  contract_file: string,
  method: string,
) => {
  const form = new FormData();
  form.append('contract_file', fileListToString(contract_file));
  form.append('method', method);
  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/contracts/update/${id}`,
  });
};

const getItem = async (id: string) => {
  return await axios.get(`${SERVER_HOST}/payment/contracts/getItem?id=${id}`);
};

const deleteItem = async (id: string) => {
  return await axios.delete(`${SERVER_HOST}/payment/contracts/delete/${id}`);
};

const ContractDetailPage: React.FC = () => {
  const hashArray = history.location.hash.split('#')[1].split('&');
  const id = hashArray[0];
  const [doc, setDoc] = useState();
  const access = useAccess();
  const [current, setCurrent] = useState<number>(0);
  const [contract, setContract] = useState<any>({});
  const formRef = useRef<ProFormInstance>();
  const [show, setShow] = useState(false);
  const { initialState } = useModel('@@initialState');

  const { run: runApprove } = useRequest(approve, {
    manual: true,
    onSuccess: () => {
      message.success('审批成功，正在返回列表...');
      history.push('/purchase/contract');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runUploadFile } = useRequest(uploadFile, {
    manual: true,
    onSuccess: () => {
      message.success('上传成功，正在返回列表...');
      history.push('/purchase/contract');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runGetItem } = useRequest(getItem, {
    manual: true,
    onSuccess: (result: any) => {
      setContract(result.data);
      if (result.data.contract_docx) {
        preview(result.data.contract_docx, (file: File) => {
          setDoc(file);
          docx.renderAsync(
            file.arrayBuffer(),
            //@ts-ignore
            document.getElementById('preview'),
          );
        });
      }
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runDeleteItem } = useRequest(deleteItem, {
    manual: true,
    onSuccess: () => {
      message.success('审批成功，正在返回列表...');
      history.push('/purchase/contract');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const onStepChange = (current: number) => {
    if (int_status(contract.status) === -1) return;
    if (int_status(contract.status) < current) return;
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
    runGetItem(id);
    setInterval(() => setShow(true), 1000);
  }, []);

  return (
    <PageContainer ghost>
      <div
        id="preview"
        style={{ height: '1200px', margin: '0 40px', overflowY: 'visible' }}
      ></div>
      <StepsForm
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
              int_status(contract.status) < key
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
                disabled={int_status(contract.status) > current}
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
        <StepsForm.StepForm
          name="approve"
          title="审核"
          onFinish={async () => {
            if (!access.canApproveContracts) {
              message.error('你无权进行此操作');
            } else {
              const values = formRef.current?.getFieldsValue();
              if (values.audit) {
                await runApprove(id, contract.status, initialState?.id);
              } else {
                await runDeleteItem(id);
              }
            }
          }}
        >
          {
              int_status(contract.status) > current ?
              <ApprovalCard approveModel="Contract" approveModelId={id} approveStatus="approve" />:
              <ProFormRadio.Group
                name="audit"
                options={[
                  {
                    label: '审核通过',
                    value: true,
                  },
                  {
                    label: '审核驳回（直接删除合同）',
                    value: false,
                  },
                ]}
              />
          }
        </StepsForm.StepForm>
        <StepsForm.StepForm
          name="upload"
          title="上传附件"
          onFinish={async () => {
            if (access.canCreatePaymentProcess) {
              const values = formRef.current?.getFieldsValue();
              if (
                formRef.current?.getFieldValue('contract_file')[0].status ===
                'done'
              ) {
                await runUploadFile(id, values.contract_file, contract.status);
              } else if (
                formRef.current?.getFieldValue('contract_file')[0].status ===
                'error'
              ) {
                message.error('文件上传失败！');
              } else {
                message.error('文件上传中，请等待...');
              }
            } else {
              message.error('你没有此权限');
            }
          }}
        >
          <ProFormUploadButton
            label="合同附件："
            name="contract_file"
            extra={
              int_status(contract.status) > current ? (
                <PreviewListVisible
                  title="已上传合同附件"
                  fileListString={contract.contract_file}
                />
              ) : null
            }
            fieldProps={{
              customRequest: (options) => {
                upload(options.file, (isSuccess: boolean, filename: string) =>
                  handleUpload(
                    isSuccess,
                    filename,
                    'contract_file',
                    options.file.uid,
                  ),
                );
              },
            }}
            rules={[{ required: true }]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm name="finish" title="完成">
          <Access
            key="can_create_payment_process"
            accessible={
              access.canCreatePaymentProcess && !access.canApproveContracts
            }
          >
            <Divider>
              <span
                style={{
                  fontSize: '22px',
                  fontWeight: 'bold',
                }}
              >
                执行列表
              </span>
            </Divider>
            {show ? (
              <Tabs>
                <Tabs.TabPane tab="服务型合同" key="1">
                  <EditableContractMonitorTable contract={contract} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="固定资产" key="2">
                  <EditableContractProcessTable contract={contract} />
                </Tabs.TabPane>
              </Tabs>
            ) : (
              <Skeleton avatar paragraph={{ rows: 4 }} />
            )}
          </Access>
        </StepsForm.StepForm>
      </StepsForm>

      <FloatButton.Group shape="square" style={{ right: 50 }}>
        <FloatButton
          icon={<DownloadOutlined />}
          tooltip={<span>下载备案表</span>}
          onClick={() => {
            saveAs(doc);
          }}
        />
      </FloatButton.Group>
    </PageContainer>
  );
};

export default ContractDetailPage;
