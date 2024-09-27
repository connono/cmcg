import AmountProgress from '@/components/AmountProgress';
import PreviewListModal from '@/components/PreviewListModal';
import PreviewListVisible from '@/components/PreviewListVisible';
import { SERVER_HOST } from '@/constants';
import {
  ActionType,
  LightFilter,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { useAccess, useModel, useRequest } from '@umijs/max';
import { Popconfirm, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import styles from './index.less';

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

const getAllDepartments = async () => {
  return await axios.get(`${SERVER_HOST}/department/index?is_functional=1`);
};

const PaymentProcessPage: React.FC = () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const [data, setData] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<any>({});
  const { initialState } = useModel('@@initialState');
  const [isChange, setIsChange] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>({});

  const getProcessesList = async (params: any) => {
    const pageCurrent = isChange ? 1 : params.current;
    const data = await axios({
      method: 'GET',
      params: {
        ...filter,
        isPaginate: true,
        department: initialState?.department,
      },
      url: `${SERVER_HOST}/payment/processes/index?page=${pageCurrent}`,
    })
      .then((result) => {
        setIsChange(false);
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

  const { run: runGetAllDepartments } = useRequest(getAllDepartments, {
    manual: true,
    onSuccess: () => {},
    onError: (error: any) => {
      message.error(error.message);
    },
  });

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
            window.open(
              `/#/purchase/paymentProcessRecord#${record.id}`,
              '_blank',
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
      dataIndex: 'warehousing_date',
      title: '入库时间',
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
                  if (
                    !access.canApplyPaymentProcessRecord ||
                    initialState?.department !== record.department
                  ) {
                    message.error('你无权进行此操作');
                  } else {
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
                  window.open(
                    `/#/purchase/paymentProcess/detail#apply&${record.id}&${record.current_payment_record_id}`,
                    '_blank',
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
                  window.open(
                    `/#/purchase/paymentProcess/detail#document&${record.id}&${record.current_payment_record_id}`,
                    '_blank',
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
                  window.open(
                    `/#/purchase/paymentProcess/detail#finance_audit&${record.id}&${record.current_payment_record_id}`,
                    '_blank',
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
                  window.open(
                    `/#/purchase/paymentProcess/dean_audit#finance_audit&${record.id}&${record.current_payment_record_id}`,
                    '_blank',
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
                  window.open(
                    `/#/purchase/paymentProcess/dean_audit#process&${record.id}&${record.current_payment_record_id}`,
                    '_blank',
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
              if (
                !access.canStopPaymentRecord ||
                initialState?.department !== record.department
              ) {
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

  const departments = async () => {
    const { data: departmentsData } = await runGetAllDepartments();
    const data = _.map(departmentsData, (value: any) => {
      return {
        value: value.name,
        label: value.label,
      };
    });
    return data;
  };

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
        request={getProcessesList}
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
                  selected_department: value.selected_department
                    ? value.selected_department === 'all'
                      ? null
                      : value.selected_department
                    : filter.selected_department,
                  status: value.status
                    ? value.status === 'all'
                      ? null
                      : value.status
                    : filter.status,
                });
                setIsChange(true);
              }}
            >
              <ProFormText name="name" label="合同名称" />
              <ProFormSelect
                name="selected_department"
                label="申请科室"
                request={departments}
                fieldProps={{
                  showSearch: true,
                  filterOption: (input: any, option: any) =>
                    (option?.label ?? '').includes(input),
                }}
              />
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
        }}
      />
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
    </PageContainer>
  );
};

export default PaymentProcessPage;
