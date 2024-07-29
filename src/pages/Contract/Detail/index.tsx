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
import { Access, history, useAccess, useRequest } from '@umijs/max';
import {
  Button,
  Divider,
  FloatButton,
  Steps,
  Tabs,
  TabsProps,
  message,
} from 'antd';
import axios from 'axios';
import * as docx from 'docx-preview';
import { saveAs } from 'file-saver';
import React, { useEffect, useRef, useState } from 'react';
import { upload } from '../../../utils/file-uploader';

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

const approve = async (id: string, method: string) => {
  const form = new FormData();
  form.append('method', method);
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

const ContractDetailPage: React.FC = () => {
  const hashArray = history.location.hash.split('#')[1].split('&');
  const id = hashArray[0];
  const method = history.location.state.status;
  const [doc, setDoc] = useState();
  const access = useAccess();
  const [current, setCurrent] = useState<number>(0);
  const formRef = useRef<ProFormInstance>();

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

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '服务型合同',
      children: <EditableContractMonitorTable />,
    },
    {
      key: '2',
      label: '固定资产',
      children: <EditableContractProcessTable />,
    },
  ];

  const onStepChange = (current: number) => {
    if (int_status(method) === -1) return;
    if (int_status(method) < current) return;
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
  }, []);

  return (
    <PageContainer ghost>
      <div
        id="preview"
        style={{ height: '1200px', margin: '0 40px', overflowY: 'visible' }}
      ></div>
      {/* <div style={{ margin: '0 40px' }}>
        <PreviewListVisible
          title="合同附件"
          fileListString={history.location.state.contract_file}
        />
      </div> */}
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
        <StepsForm.StepForm
          name="approve"
          title="审核"
          onFinish={async () => {
            if (!access.canApproveContracts) {
              message.error('你无权进行此操作');
            } else {
              await runApprove(id, method);
            }
          }}
        >
          <ProFormRadio.Group
            name="audit"
            options={[
              {
                label: '审核通过',
                value: true,
              },
            ]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm
          name="upload"
          title="上传附件"
          onFinish={async () => {
            if (!access.canCreateContractProcess) {
              const values = formRef.current?.getFieldsValue();
              if (
                formRef.current?.getFieldValue('contract_file')[0].status ===
                'done'
              ) {
                await runUploadFile(id, values.contract_file, method);
              } else if (
                formRef.current?.getFieldValue('contract_file')[0].status ===
                'error'
              ) {
                message.error('文件上传失败！');
              } else {
                message.error('文件上传中，请等待...');
              }
            }
          }}
        >
          <ProFormUploadButton
            label="合同附件："
            name="contract_file"
            extra={
              int_status(history.location.state.status) > current ? (
                <PreviewListVisible
                  title="已上传合同附件"
                  fileListString={history.location.state.contract_file}
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
            accessible={access.canCreatePaymentProcess}
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
            <Tabs defaultActiveKey="1" items={items} />
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
