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
import { Access, history, useAccess, useRequest } from '@umijs/max';
import { Button, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';

const getAllDepartments = async () => {
  return await axios.get(`${SERVER_HOST}/department/index`);
};

const ConsumableApplyPage: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();
  const [data, setData] = useState<any>([]);
  const [filter, setFilter] = useState<any>({});
  const [isChange, setIsChange] = useState<boolean>(false);
  const access = useAccess();

  const getConsumableApplyList = async (params: any) => {
    const pageCurrent = isChange ? 1 : params.current;
    const data = await axios({
      method: 'GET',
      params: {
        ...filter,
        isPaginate: true,
      },
      url: `${SERVER_HOST}/consumable/apply/index?page=${pageCurrent}`,
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
      dataIndex: 'serial_number',
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
      title: '申请日期',
      dataIndex: 'apply_date',
      width: 60,
    },
    {
      title: '年用量',
      dataIndex: 'count_year',
      width: 50,
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
      title: '便民药房',
      dataIndex: 'in_drugstore',
      valueEnum: {
        0: { text: '便民药房' },
        1: { text: '非便民药房' },
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        0: { text: '待询价' },
        1: { text: '待分管院长审批' },
        2: { text: '待医工科审核' },
        3: { text: '完成' },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, record) => (
        <>
          <a
            onClick={() => {
              window.open(
                `/#/consumable/list/apply/detail#update&${record.serial_number}`,
                '_blank',
              );
            }}
          >
            录入
          </a>
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
        title: '申请列表',
      }}
    >
      <ProTable
        columns={columns}
        cardBordered
        actionRef={actionRef}
        // @ts-ignore
        request={getConsumableApplyList}
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
        headerTitle="申请列表"
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
          actions: [
            <Access key="can_apply_repair" accessible={access.canApplyRepair}>
              <Button
                key="button"
                onClick={async () => {
                  history.push('/consumable/list/apply/detail#create');
                }}
                type="primary"
              >
                新建
              </Button>
            </Access>,
          ],
        }}
      />
    </PageContainer>
  );
};

export default ConsumableApplyPage;
