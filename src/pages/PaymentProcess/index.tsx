import AmountProgress from '@/components/AmountProgress';
import PreviewListModal from '@/components/PreviewListModal';
import PreviewListVisible from '@/components/PreviewListVisible';
import { SERVER_HOST } from '@/constants';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ActionType,
  LightFilter,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
  ProTable,
} from '@ant-design/pro-components';
import { Access, history, useAccess, useModel, useRequest } from '@umijs/max';
import { Button, Popconfirm, message } from 'antd';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { fileListToString, upload } from '../../utils/file-uploader';
import styles from './index.less';

enum MODE {
  CREATE,
  UPDATE,
}

const createProcess = async (
  contract_name: string,
  department: string,
  company: string,
  target_amount: number,
  payment_file: string,
  contract_date: string,
) => {
  const form = new FormData();
  form.append('contract_name', contract_name);
  form.append('department', department);
  form.append('company', company);
  form.append('category', '采购费用');
  form.append('is_pay', 'true');
  form.append('target_amount', target_amount.toString());
  form.append('payment_file', fileListToString(payment_file));
  form.append('contract_date', contract_date);

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/processes/store`,
  });
};

const stopProcess = async (id: number) => {
  return await axios.get(`${SERVER_HOST}/payment/processes/stop/${id}`);
};

const deleteProcess = async (id: number) => {
  return await axios.delete(`${SERVER_HOST}/payment/processes/delete/${id}`);
};

const createRecord = async (
  contract_name: string,
  department: string,
  company: string,
  process_id: number,
  next_date: string,
) => {
  const form = new FormData();
  form.append('contract_name', contract_name);
  form.append('department', department);
  form.append('company', company);
  form.append('next_date', next_date);
  form.append('process_id', process_id.toString());
  form.append('type', 'process');

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/process/records/store`,
  });
};

const PaymentProcessPage: React.FC = () => {
  const access = useAccess();
  const formRef = useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>();
  const [data, setData] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [mode, setMode] = useState<MODE>(MODE.CREATE);
  const [selectedRecord, setSelectedRecord] = useState<any>({});
  const { initialState } = useModel('@@initialState');
  const [filter, setFilter] = useState<any>({});

  const getProcessesList = async () => {
    return await axios({
      method: 'GET',
      params: {
        ...filter,
        department: initialState?.department,
      },
      url: `${SERVER_HOST}/payment/processes/index`,
    });
  };

  const { run: runGetProcessesList } = useRequest(getProcessesList, {
    manual: true,
    onSuccess: (result: any) => {
      setData(result.data);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runCreateProcess } = useRequest(createProcess, {
    manual: true,
    onSuccess: () => {
      message.success('提交计划成功');
      setModalVisible(false);
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const { run: runStopProcess } = useRequest(stopProcess, {
    manual: true,
    onSuccess: () => {
      message.success('中止计划成功');
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const { run: runDeleteProcess } = useRequest(deleteProcess, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const { run: runCreateRecords } = useRequest(createRecord, {
    manual: true,
    onSuccess: async () => {
      message.success('添加成功!');
      setModalVisible(false);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

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

  const columns: ProColumns<any>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'contract_name',
      title: '合同名称',
      copyable: true,
    },
    {
      dataIndex: 'department',
      title: '职能科室',
    },
    {
      dataIndex: 'company',
      title: '合作商户',
      copyable: true,
    },
    {
      dataIndex: 'category',
      title: '类型',
    },
    {
      dataIndex: 'assessment',
      title: '应缴费用/收取费用',
    },
    {
      dataIndex: 'next_date',
      title: '下次缴费/收费时间',
    },
    {
      dataIndex: 'assessments_count',
      title: '累计缴费/收费金额',
    },
    {
      dataIndex: 'records_count',
      title: '累计缴费/收费次数',
      render: (_, record) => (
        <a
          key="history"
          onClick={() => {
            history.push(
              `/purchase/paymentRecord#process&${record.id}`,
              record,
            );
          }}
        >
          {_}
        </a>
      ),
    },
    {
      dataIndex: 'target_amount',
      title: '目标金额',
    },
    {
      dataIndex: 'percent',
      title: '进度百分比',
      render: (_, record) => {
        return (
          <AmountProgress
            id={record.id}
            moment={record.assessments_count}
            target={record.target_amount}
          />
        );
      },
    },
    {
      dataIndex: 'payment_file',
      title: '合同附件',
      render: (_, record) => {
        return <PreviewListModal fileListString={record.payment_file} />;
      },
    },
    {
      dataIndex: 'contract_date',
      title: '合同签订时间',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        wait: { text: '待设置下次时间', status: 'Default' },
        apply: { text: '待申请', status: 'Processing' },
        document: { text: '待制单', status: 'Processing' },
        finance_audit: { text: '待财务科审核', status: 'Processing' },
        dean_audit: { text: '待副院长审核', status: 'Processing' },
        process: { text: '待收付款', status: 'Processing' },
        stop: { text: '已停止', status: 'Error' },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => {
        let update;
        if (record.status === 'wait') {
          if (record.next_date) {
            update = <span>已设置</span>;
          } else {
            update = (
              <a
                key="update"
                onClick={() => {
                  if (!access.canUpdatePaymentPlan) {
                    message.error('你无权进行此操作');
                  } else {
                    setMode(MODE.UPDATE);
                    setModalVisible(true);
                    setSelectedRecord(record);
                  }
                }}
              >
                设置下次时间
              </a>
            );
          }
        } else if (record.status === 'apply') {
          update = (
            <a
              key="update"
              onClick={() => {
                if (!access.canApplyPaymentRecord) {
                  message.error('你无权进行此操作');
                } else {
                  history.push(
                    `/purchase/paymentProcess/detail#apply&${record.id}&${record.current_payment_record_id}`,
                    record,
                  );
                }
              }}
            >
              待申请
            </a>
          );
        } else if (record.status === 'document') {
          update = (
            <a
              key="update"
              onClick={() => {
                if (!access.canDocumentPaymentProcessRecord) {
                  message.error('你无权进行此操作');
                } else {
                  history.push(
                    `/purchase/paymentProcess/detail#document&${record.id}&${record.current_payment_record_id}`,
                    record,
                  );
                }
              }}
            >
              待制单
            </a>
          );
        } else if (record.status === 'finance_audit') {
          update = (
            <a
              key="update"
              onClick={() => {
                if (!access.canFinanceAuditPaymentProcessRecord) {
                  message.error('你无权进行此操作');
                } else {
                  history.push(
                    `/purchase/paymentProcess/detail#finance_audit&${record.id}&${record.current_payment_record_id}`,
                    record,
                  );
                }
              }}
            >
              待财务科审核
            </a>
          );
        } else if (record.status === 'dean_audit') {
          update = (
            <a
              key="update"
              onClick={() => {
                if (!access.canDeanAuditPaymentProcessRecord) {
                  message.error('你无权进行此操作');
                } else {
                  history.push(
                    `/purchase/paymentProcess/detail#dean_audit&${record.id}&${record.current_payment_record_id}`,
                    record,
                  );
                }
              }}
            >
              待副院长审核
            </a>
          );
        } else if (record.status === 'process') {
          update = (
            <a
              key="update"
              onClick={() => {
                if (!access.canProcessPaymentRecord) {
                  message.error('你无权进行此操作');
                } else {
                  history.push(
                    `/purchase/paymentProcess/detail#process&${record.id}&${record.current_payment_record_id}`,
                    record,
                  );
                }
              }}
            >
              {record.is_pay === 'true' ? '付款' : '收款'}
            </a>
          );
        }
        return [
          update,
          <Popconfirm
            key="stop"
            placement="topLeft"
            title="确定要中止吗？"
            onConfirm={async () => {
              if (!access.canStopPaymentRecord) {
                message.error('你无权进行此操作');
              } else {
                await runStopProcess(record.id);
                action?.reload();
              }
            }}
            okText="确定"
            cancelText="取消"
          >
            <a key="stop">中止</a>
          </Popconfirm>,
          <a
            key="delete"
            onClick={async () => {
              if (!access.canDeletePaymentPlan) {
                message.error('你无权进行此操作');
              } else {
                await runDeleteProcess(record.id);
                action?.reload();
              }
            }}
          >
            删除
          </a>,
        ];
      },
    },
  ];

  useEffect(() => {
    actionRef.current?.reload();
  }, [filter]);

  return (
    <PageContainer
      ghost
      header={{
        title: '物资型付款流程监控',
      }}
    >
      <ProTable<any>
        columns={columns}
        cardBordered
        actionRef={actionRef}
        request={runGetProcessesList}
        rowKey="id"
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        search={false}
        rowClassName={(record) => {
          return record.is_pay === 'true' ? styles.payrow : styles.chargerow;
        }}
        pagination={{
          pageSize: 5,
        }}
        dateFormatter="string"
        toolbar={{
          filter: (
            <LightFilter
              onValuesChange={(value) => {
                setFilter({
                  contract_name: _.isUndefined(value.name)
                    ? filter.contract_name
                    : value.name,
                  status: value.status
                    ? value.status === 'all'
                      ? null
                      : value.status
                    : filter.status,
                });
              }}
            >
              <ProFormText name="name" label="合同名称" />
              <ProFormSelect
                name="status"
                label="状态"
                valueEnum={{
                  all: { text: '全部' },
                  wait: { text: '待设置下次时间' },
                  apply: { text: '待申请' },
                  audit: { text: '待审核' },
                  process: { text: '待收付款' },
                  stop: { text: '已停止' },
                }}
              />
            </LightFilter>
          ),
          menu: {
            type: 'inline',
            items: [
              {
                key: 'count',
                label: <div>一共有{_.size(data)}条记录</div>,
              },
            ],
          },
          actions: [
            <Access
              key="can_create_payment_plan"
              accessible={access.canCreatePaymentPlan}
            >
              <Button
                key="button"
                onClick={async () => {
                  setModalVisible(true);
                  setMode(MODE.CREATE);
                }}
                type="primary"
              >
                新建
              </Button>
            </Access>,
          ],
        }}
      />
      {mode === MODE.CREATE ? (
        <ModalForm<{
          name: string;
          company: string;
        }>
          title="新建流程"
          formRef={formRef}
          modalProps={{
            destroyOnClose: true,
            onCancel: () => setModalVisible(false),
          }}
          open={modalVisible}
          submitTimeout={2000}
          onFinish={async (values: any) => {
            if (
              formRef.current?.getFieldValue('payment_file')[0].status ===
              'done'
            ) {
              await runCreateProcess(
                values.contract_name,
                initialState.department,
                values.company,
                values.target_amount,
                values.payment_file,
                values.contract_date,
              );
              actionRef.current?.reload();
            } else if (
              formRef.current?.getFieldValue('payment_file')[0].status ===
              'error'
            ) {
              message.error('文件上传失败');
            } else {
              message.error('文件上传中，请等待');
            }
          }}
        >
          <ProFormText
            width="md"
            name="contract_name"
            label="合同名称"
            rules={[{ required: true }]}
          />

          <ProFormText
            width="md"
            name="company"
            label="合作商户"
            rules={[{ required: true }]}
          />
          <ProFormDigit
            width="md"
            name="target_amount"
            label="目标金额"
            rules={[{ required: true }]}
          />
          <ProFormDatePicker
            name="contract_date"
            label="合同签订日期"
            width="sm"
            rules={[{ required: true }]}
          />
          <ProFormUploadButton
            label="合同附件："
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
        </ModalForm>
      ) : (
        <ModalForm
          title="更新计划"
          modalProps={{
            destroyOnClose: true,
            onCancel: () => setModalVisible(false),
          }}
          open={modalVisible}
          submitTimeout={2000}
          onFinish={async (values: any) => {
            await runCreateRecords(
              selectedRecord.contract_name,
              selectedRecord.department,
              selectedRecord.company,
              selectedRecord.id,
              values.next_date,
            );
            actionRef.current?.reload();
          }}
        >
          <ProFormDatePicker
            name="next_date"
            label={
              selectedRecord.is_pay === 'true' ? '下次付款日期' : '下次收款日期'
            }
            width="sm"
            rules={[{ required: true }]}
          />
          <span>入库日期： {selectedRecord.warehousing_date}</span>
          <PreviewListVisible fileListString={selectedRecord.payment_file} />
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default PaymentProcessPage;
