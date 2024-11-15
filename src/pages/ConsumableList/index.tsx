import { SERVER_HOST } from '@/constants';
import {
  ActionType,
  LightFilter,
  PageContainer,
  ProDescriptionsItemProps,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { history, useAccess, useRequest } from '@umijs/max';
import { Button, Divider, Input, Popconfirm, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';

const getAllDepartments = async () => {
  return await axios.get(`${SERVER_HOST}/department/index`);
};

const stopConsumableItem = async (id: any, stop_reason: string) => {
  const form = new FormData();
  form.append('stop_reason', stop_reason);
  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/consumable/directory/stop/${id}`,
  });
};

const ConsumableListPage: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();
  const [data, setData] = useState<any>([]);
  const [filter, setFilter] = useState<any>({});
  const [stopReason, setStopReason] = useState<string>('');
  const [isChange, setIsChange] = useState<boolean>(false);
  const access = useAccess();

  const getConsumableList = async (params: any) => {
    const pageCurrent = isChange ? 1 : params.current;
    const data = await axios({
      method: 'GET',
      params: {
        ...filter,
        isPaginate: true,
      },
      url: `${SERVER_HOST}/consumable/directory/index?page=${pageCurrent}`,
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

  const { run: runGetAllDepartments } = useRequest(getAllDepartments, {
    manual: true,
    onSuccess: () => {},
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runStopConsumableItem } = useRequest(stopConsumableItem, {
    manual: true,
    onSuccess: () => {
      message.success('中止成功');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

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

  //@ts-ignore
  const columns: ProDescriptionsItemProps = [
    {
      title: '申请编号',
      width: 100,
      dataIndex: 'consumable_apply_id',
    },
    {
      title: '平台ID',
      render: (text, record) => (
        <div style={{ width: '100px' }}>{record.platform_id}</div>
      ),
    },
    {
      title: '申请科室',
      dataIndex: 'department',
      width: 80,
    },
    {
      title: '耗材名称',
      dataIndex: 'consumable',
      width: 100,
    },
    {
      title: '型号',
      dataIndex: 'model',
      width: 100,
    },
    {
      title: '采购单价',
      dataIndex: 'price',
      width: 50,
    },
    {
      title: '合同日期',
      dataIndex: 'start_date',
      width: 60,
    },
    {
      title: '失效日期',
      dataIndex: 'exp_date',
    },
    {
      title: '注册证号',
      dataIndex: 'registration_num',
    },
    {
      title: '供应商',
      dataIndex: 'company',
      width: 100,
    },
    {
      title: '生产厂家',
      dataIndex: 'manufacturer',
      width: 100,
    },
    {
      title: '浙江分类',
      dataIndex: 'category_zj',
    },
    {
      title: '一级目录',
      dataIndex: 'parent_directory',
    },
    {
      title: '二级目录',
      dataIndex: 'child_directory',
    },
    {
      title: '采购类型',
      dataIndex: 'apply_type',
      valueEnum: {
        0: { text: '中标产品' },
        1: { text: '阳光采购' },
        2: { text: '自行采购' },
        3: { text: '线下采购' },
        4: { text: '带量采购' },
      },
    },
    {
      title: '是否为便民药房',
      dataIndex: 'in_drugstore',
      valueEnum: {
        0: { text: '便民药房' },
        1: { text: '非便民药房' },
      },
    },
    {
      title: '停用日期',
      dataIndex: 'stop_date',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        0: { text: '启用' },
        1: { text: '待重新采购' },
        2: { text: '待审批' },
        3: { text: '待医工科审核' },
        4: { text: '中止' },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, record, _, action) => (
        <>
          {record.status === '0' ? null : (
            <a
              onClick={() => {
                window.open(
                  `/#/consumable/list/index/detail#update&${record.consumable_apply_id}`,
                  '_blank',
                );
              }}
            >
              录入
            </a>
          )}
          <Divider type="vertical" />
          <a
            onClick={() => {
              history.push(
                `/#/consumable/list/index/history#${record.consumable_apply_id}`,
                record,
              );
            }}
          >
            查看动态详情
          </a>
          <Divider type="vertical" />
          {record.status === '4' ? null : (
            <Popconfirm
              key="back"
              placement="topLeft"
              title={
                <div>
                  <p>确定要中止吗？</p>
                  <Input
                    value={stopReason}
                    onChange={(e: any) => {
                      setStopReason(e.target.value);
                    }}
                    placeholder="请输入中止原因"
                  />
                </div>
              }
              onConfirm={async () => {
                const id = record.id;
                if (access.canStopConsumableList) {
                  await runStopConsumableItem(id, stopReason);
                  action?.reload();
                }
              }}
              okText="确定"
              cancelText="取消"
            >
              <a key="back">中止</a>
            </Popconfirm>
          )}
        </>
      ),
    },
  ];

  useEffect(() => {
    actionRef.current?.reload();
  }, [filter]);

  return (
    <PageContainer
      header={{
        title: '耗材目录列表',
      }}
    >
      <ProTable
        columns={columns}
        cardBordered
        actionRef={actionRef}
        // @ts-ignore
        request={getConsumableList}
        rowKey="serial_number"
        search={false}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        pagination={{
          pageSize: 15,
        }}
        dateFormatter="string"
        headerTitle="耗材目录列表"
        toolbar={{
          filter: (
            <LightFilter
              collapse={true}
              footerRender={() => {
                return (
                  <Button
                    type="primary"
                    onClick={() => {
                      setFilter({});
                    }}
                  >
                    重置
                  </Button>
                );
              }}
              onValuesChange={(value) => {
                setFilter({
                  serial_number: _.isUndefined(value.serial_number)
                    ? filter.serial_number
                    : value.serial_number,
                  platform_id: _.isUndefined(value.platform_id)
                    ? filter.platform_id
                    : value.platform_id,
                  consumable: _.isUndefined(value.consumable)
                    ? filter.consumable
                    : value.consumable,
                  company: _.isUndefined(value.company)
                    ? filter.company
                    : value.company,
                  apply_type: value.apply_type
                    ? value.apply_type === 'all'
                      ? null
                      : value.apply_type
                    : filter.apply_type,
                  status: value.status
                    ? value.status === 'all'
                      ? null
                      : value.status
                    : filter.status,
                  department: value.department
                    ? value.department === 'all'
                      ? null
                      : value.department
                    : filter.department,
                });
                setIsChange(true);
              }}
            >
              <ProFormText name="serial_number" label="申请编号" />
              <ProFormText name="platform_id" label="平台id" />
              <ProFormText name="consumable" label="耗材名称" />
              <ProFormSelect
                name="department"
                label="申请科室"
                fieldProps={{
                  showSearch: true,
                  filterOption: (input: any, option: any) =>
                    (option?.label ?? '').includes(input),
                }}
                request={departments}
              />
              <ProFormText name="company" label="供应商" />
              <ProFormSelect
                name="apply_type"
                label="采购类型"
                valueEnum={{
                  0: { text: '中标产品' },
                  1: { text: '阳光采购' },
                  2: { text: '自行采购' },
                  3: { text: '线下采购' },
                  4: { text: '带量采购' },
                  all: { text: '全部', status: 'all' },
                }}
              />
              <ProFormSelect
                name="status"
                label="状态"
                valueEnum={{
                  0: { text: '待询价' },
                  1: { text: '待分管院长审批' },
                  2: { text: '待医工科审核' },
                  3: { text: '完成' },
                  all: { text: '全部', status: 'all' },
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
    </PageContainer>
  );
};

export default ConsumableListPage;
