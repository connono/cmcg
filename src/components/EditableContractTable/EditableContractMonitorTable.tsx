import { SERVER_HOST } from '@/constants';
import type { ProColumns } from '@ant-design/pro-components';
import { ActionType, EditableProTable } from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import { Popconfirm, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

const getPlans = async (contract_id: string) => {
  return await axios({
    method: 'GET',
    url: `${SERVER_HOST}/payment/contracts/plans/${contract_id}`,
  });
};

const createPlan = async (
  department: string,
  company: string,
  category: string,
  is_pay: string,
  payment_file: string,
  contract_date: string,
  finish_date: string,
  contract_id: string,
) => {
  const form = new FormData();
  form.append('contract_name', 'x');
  form.append('department', department);
  form.append('company', company);
  form.append('category', category);
  form.append('is_pay', is_pay);
  form.append('payment_file', payment_file);
  form.append('contract_date', contract_date);
  form.append('finish_date', finish_date);
  form.append('contract_id', contract_id);

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/plans/store`,
  });
};

const deletePlan = async (contract_id: number, plan_id: number) => {
  return await axios.delete(
    `${SERVER_HOST}/payment/contracts/plans/delete/${contract_id}?plan_id=${plan_id}`,
  );
};

const stopPlan = async (id: number) => {
  return await axios.get(`${SERVER_HOST}/payment/plans/stop/${id}`);
};

interface EditableContractMonitorTableProps {
  contract: any;
}

const EditableContractMonitorTable: React.FC<
  EditableContractMonitorTableProps
> = (props) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState([]);
  const { initialState } = useModel('@@initialState');
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState(true);

  const { run: runCreatePlan } = useRequest(createPlan, {
    manual: true,
    onSuccess: () => {
      message.success('提交计划成功');
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

  const { run: runGetPlans } = useRequest(getPlans, {
    manual: true,
    onSuccess: () => {
      setLoading(false);
    },
    onError: () => {
      //message.error(error.message);
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
      title: '类型',
      dataIndex: 'category',
    },
    {
      title: '收款/付款',
      dataIndex: 'is_pay',
      valueType: 'select',
      valueEnum: {
        true: { text: '付款' },
        false: { text: '收款' },
      },
    },
    {
      title: '合同签订日期',
      dataIndex: 'contract_date',
      valueType: 'date',
    },
    {
      title: '合同结束时间',
      dataIndex: 'finish_date',
      valueType: 'date',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        wait: { text: '待设置下次时间', status: 'Default' },
        apply: { text: '待申请', status: 'Processing' },
        dean_audit: { text: '待审核', status: 'Processing' },
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
            await runDeletePlan(props.contract.id, record.id);
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
            await runStopPlan(record.id);
            action.reload();
          }}
          okText="确定"
          cancelText="取消"
        >
          <a key="stop">中止</a>
        </Popconfirm>,
      ],
    },
  ];

  useEffect(() => {
    runGetPlans(props.contract.id);
  }, [props.contract]);

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
            const contract_name = `${props.contract.contract_name}${props.contract.series_number}-${id}`;
            return {
              id,
              contract_name,
              department: initialState?.department,
              company: props.contract.contractor,
            };
          },
        }}
        loading={loading}
        columns={columns}
        // request={() => {
        //   return runGetPlans(props.contract.id);
        // }}
        value={dataSource}
        actionRef={actionRef}
        onChange={setDataSource}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);
            await runCreatePlan(
              initialState?.department,
              props.contract.contractor,
              data.category,
              data.is_pay,
              props.contract.contract_file,
              data.contract_date,
              data.finish_date,
              props.contract.id,
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

export default EditableContractMonitorTable;
