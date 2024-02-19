import { SERVER_HOST } from '@/constants';
import type { ProColumns } from '@ant-design/pro-components';
import { ActionType, EditableProTable } from '@ant-design/pro-components';
import { history, useModel, useRequest } from '@umijs/max';
import { Popconfirm, message } from 'antd';
import axios from 'axios';
import React, { useRef, useState } from 'react';

const getProcesses = async (contract_id: string) => {
  return await axios({
    method: 'GET',
    url: `${SERVER_HOST}/payment/contracts/processes/${contract_id}`,
  });
};

const createProcess = async (
  department: string,
  company: string,
  target_amount: number,
  payment_file: string,
  contract_date: string,
  contract_id: string,
) => {
  const form = new FormData();
  form.append('contract_name', 'x');
  form.append('department', department);
  form.append('company', company);
  form.append('category', '采购费用');
  form.append('is_pay', 'true');
  form.append('target_amount', target_amount.toString());
  form.append('payment_file', payment_file);
  form.append('contract_date', contract_date);
  form.append('contract_id', contract_id);

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/processes/store`,
  });
};

const deleteProcess = async (contract_id: number, process_id: number) => {
  return await axios.delete(
    `${SERVER_HOST}/payment/contracts/processes/delete/${contract_id}?process_id=${process_id}`,
  );
};

const stopProcess = async (id: number) => {
  return await axios.get(`${SERVER_HOST}/payment/processes/stop/${id}`);
};

const EditableContractProcessTable: React.FC = () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>([]);
  const { initialState } = useModel('@@initialState');
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState(true);

  const { run: runCreateProcess } = useRequest(createProcess, {
    manual: true,
    onSuccess: () => {
      message.success('提交计划成功');
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

  const { run: runGetProcesses } = useRequest(getProcesses, {
    manual: true,
    onSuccess: (res) => {
      console.log('res:', res);
      setLoading(false);
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

  const columns: ProColumns[] = [
    {
      title: 'id',
      dataIndex: 'id',
      readonly: true,
    },
    {
      title: '合同名称',
      dataIndex: 'contract_name',
      readonly: true,
    },
    {
      title: '科室',
      dataIndex: 'department',
      readonly: true,
    },
    {
      title: '合作商户',
      dataIndex: 'company',
      readonly: true,
    },
    {
      title: '目标金额（元）',
      dataIndex: 'target_amount',
      valueType: 'digit',
    },
    {
      title: '合同签订日期',
      dataIndex: 'contract_date',
      valueType: 'date',
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
      readonly: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="delete"
          onClick={async () => {
            await runDeleteProcess(history.location.state.id, record.id);
            setDataSource(dataSource.filter((item) => item.id !== record.id));
          }}
        >
          删除
        </a>,
        <Popconfirm
          key="stop"
          placement="topLeft"
          title="确定要中止吗？"
          onConfirm={async () => {
            await runStopProcess(record.id);
            action?.reload();
          }}
          okText="确定"
          cancelText="取消"
        >
          <a key="stop">中止</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <>
      <EditableProTable
        rowKey="id"
        maxLength={5}
        scroll={{
          x: 960,
        }}
        recordCreatorProps={{
          position: 'bottom',
          record: () => {
            const id = (Math.random() * 1000000).toFixed(0);
            const contract_name = `${history.location.state.contract_name}${history.location.state.series_number}-${id}`;
            return {
              id,
              contract_name,
              department: initialState?.department,
              company: history.location.state.contractor,
            };
          },
        }}
        loading={loading}
        columns={columns}
        request={async () => {
          return await runGetProcesses(history.location.state.id);
        }}
        value={dataSource}
        actionRef={actionRef}
        onChange={setDataSource}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);
            await runCreateProcess(
              initialState?.department,
              history.location.state.contractor,
              data.target_amount,
              history.location.state.contract_file,
              data.contract_date,
              history.location.state.id,
            ).then(() => {
              actionRef.current?.reload();
            });
          },
          onChange: setEditableRowKeys,
        }}
      />
    </>
  );
};

export default EditableContractProcessTable;
