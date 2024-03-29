import PreviewListModal from '@/components/PreviewListModal';
import { SERVER_HOST } from '@/constants';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ActionType,
  LightFilter,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormDatePicker,
  ProFormGroup,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
  ProTable,
} from '@ant-design/pro-components';
import { Access, history, useAccess, useModel, useRequest } from '@umijs/max';
import { Button, Popconfirm, message } from 'antd';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { upload } from '../../utils/file-uploader';
import styles from './index.less';

enum MODE {
  CREATE,
  UPDATE,
}

const formatBoolean = (bool: boolean) => {
  return bool ? 'true' : 'false';
};

const createPlan = async (
  contract_name: string,
  department?: string,
  company: string,
  category: string,
  is_pay: boolean,
  finish_date: string,
  payment_file: string,
  contract_date: string,
) => {
  const form = new FormData();
  form.append('contract_name', contract_name);
  form.append('department', department);
  form.append('company', company);
  form.append('category', category);
  form.append('is_pay', formatBoolean(is_pay));
  form.append('finish_date', finish_date);
  form.append('payment_file', payment_file);
  form.append('contract_date', contract_date);

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/plans/store`,
  });
};

const stopPlan = async (id: number) => {
  return await axios.get(`${SERVER_HOST}/payment/plans/stop/${id}`);
};

const deletePlan = async (id: number) => {
  return await axios.delete(`${SERVER_HOST}/payment/plans/delete/${id}`);
};

const createRecord = async (
  contract_name: string,
  department: string,
  company: string,
  plan_id: number,
  next_date: string,
) => {
  const form = new FormData();
  form.append('contract_name', contract_name);
  form.append('department', department);
  form.append('company', company);
  form.append('next_date', next_date);
  form.append('plan_id', plan_id.toString());
  form.append('type', 'plan');

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/records/store`,
  });
};

const PaymentMonitorPage: React.FC = () => {
  const access = useAccess();
  const formRef = useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [mode, setMode] = useState<MODE>(MODE.CREATE);
  const [selectedRecord, setSelectedRecord] = useState<any>({});
  const { initialState } = useModel('@@initialState');
  const [data, setData] = useState<any>([]);
  const [filter, setFilter] = useState<any>({});

  const getPlansList = async (params: any) => {
    const data = await axios({
      method: 'GET',
      params: {
        ...filter,
        isPaginate: true,
        department: initialState?.department,
      },
      url: `${SERVER_HOST}/payment/plans/index?page=${params.current}`,
    })
      .then((result) => {
        setData(result.data.data);
        return {
          data: result.data.data,
          success: true,
          total: result.data.meta.total,
        };
      })
      .catch((err) => {
        message.error(err);
      });
    return data;
  };

  const { run: runCreatePlan } = useRequest(createPlan, {
    manual: true,
    onSuccess: () => {
      message.success('提交计划成功');
      setModalVisible(false);
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const { run: runStopPlan } = useRequest(stopPlan, {
    manual: true,
    onSuccess: () => {
      message.success('中止计划成功');
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const { run: runDeletePlan } = useRequest(deletePlan, {
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
            history.push(`/purchase/paymentRecord#plan&${record.id}`, record);
          }}
        >
          {_}
        </a>
      ),
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
      dataIndex: 'finish_date',
      title: '结束时间',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        wait: { text: '待设置下次时间', status: 'Default' },
        apply: { text: '待申请', status: 'Processing' },
        audit: { text: '待审核', status: 'Processing' },
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
                  if (!access.canApplyPaymentRecord) {
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
                    `/purchase/paymentMonitor/detail#apply&${record.id}&${record.current_payment_record_id}`,
                    record,
                  );
                }
              }}
            >
              待申请
            </a>
          );
        } else if (record.status === 'audit') {
          update = (
            <a
              key="update"
              onClick={() => {
                if (!access.canAuditPaymentRecord) {
                  message.error('你无权进行此操作');
                } else {
                  history.push(
                    `/purchase/paymentMonitor/detail#audit&${record.id}&${record.current_payment_record_id}`,
                    record,
                  );
                }
              }}
            >
              待审核
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
                    `/purchase/paymentMonitor/detail#process&${record.id}&${record.current_payment_record_id}`,
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
                await runStopPlan(record.id);
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
                await runDeletePlan(record.id);
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
        title: '服务型付款流程监控',
      }}
    >
      <ProTable<any>
        columns={columns}
        cardBordered
        actionRef={actionRef}
        request={getPlansList}
        rowKey="id"
        search={false}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        rowClassName={(record) => {
          return record.is_pay === 'true' ? styles.payrow : styles.chargerow;
        }}
        pagination={{
          pageSize: 15,
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
          title="新建计划"
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
              await runCreatePlan(
                values.contract_name,
                initialState?.department,
                values.company,
                values.category,
                values.is_pay,
                values.finish_date,
                values.payment_file[0].filename,
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
          <ProFormGroup>
            <ProFormText
              width="md"
              name="category"
              label="收款/付款种类"
              rules={[{ required: true }]}
            />
            <ProFormRadio.Group
              width="md"
              name="is_pay"
              label="收款/付款"
              options={[
                {
                  label: '收款',
                  value: false,
                },
                {
                  label: '付款',
                  value: true,
                },
              ]}
              rules={[{ required: true }]}
            />
          </ProFormGroup>

          <ProFormGroup>
            <ProFormDatePicker
              name="contract_date"
              label="合同签订日期"
              width="sm"
              rules={[{ required: true }]}
            />
            <ProFormDatePicker
              name="finish_date"
              label="结束日期"
              width="sm"
              rules={[{ required: true }]}
            />
          </ProFormGroup>
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
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default PaymentMonitorPage;
