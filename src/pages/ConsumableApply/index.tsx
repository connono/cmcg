import { SERVER_HOST } from '@/constants';
import {
  ActionType,
  LightFilter,
  PageContainer,
  ProFormSelect,
  ProFormText,
  ProTable,
  ProColumns,
} from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useRequest } from '@umijs/max';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';

const getAllDepartments = async () => {
  return await axios.get(`${SERVER_HOST}/department/index`);
};

const statusEnum = {
  applied: { text: '已申请', status: 'Default' },
  selection_input: { text: '申请审核', status: 'Processing' },
};

const columns: ProColumns<any>[] = [
  {
    title: '平台ID',
    render: (_: any, record: any) => (
      <div style={{ width: '100px' }}>{record.platform_id}</div>
    ),
  },
  {
    title: '申请科室',
    dataIndex: 'department',
  },
  {
    title: '耗材名称',
    dataIndex: 'consumable',
  },
  {
    title: '型号',
    dataIndex: 'model',
  },
  {
    title: '采购单价',
    dataIndex: 'price',
  },
  {
    title: '申请日期',
    dataIndex: 'apply_date',
  },
  {
    title: '年用量',
    dataIndex: 'count_year',
  },
  {
    title: '注册证号',
    dataIndex: 'registration_num',
  },
  {
    title: '供应商',
    dataIndex: 'company',
  },
  {
    title: '生产厂家',
    dataIndex: 'manufacturer',
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
      'bid_product': { text: '中标产品' },
      'sunshine_purchase': { text: '阳光采购' },
      'self_purchase': { text: '自行采购' },
      'offline_purchase': { text: '线下采购' },
      'volume_purchase': { text: '带量采购' },
    },
  },
  {
    title: '便民药房',
    dataIndex: 'in_drugstore',
    valueEnum: {
      true: { text: '便民药房' },
      false: { text: '非便民药房' },
    },
  },
  {
    title: '状态',
    dataIndex: 'to_state',
    render: (_, record) => {
      const state = record?.to_state;
      if (state === 'applied') {
        return (
          <span className="ant-status-processing">
            待准入分管领导审核
          </span>
        );
      } else {
        return (
          <span className="ant-status-success">
            申请通过
          </span>
        );
      }
    },
  },  
  {
    title: '操作',
    valueType: 'option',
    render: (_: any, record: any) => (
      <>
        <a
          onClick={() => {
            window.open(
              `/#/consumable/list/apply/detail#update&${record.id}&${record.consumable_id}`,
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

const ConsumableApplyPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [filter, setFilter] = useState<any>({});
  const [isChange, setIsChange] = useState<boolean>(false);

  useEffect(() => {
    actionRef.current?.reload();
  }, [filter]);

  const getConsumableApplyList = async (params: any) => {
    try {
      const pageCurrent = isChange ? 1 : params.current;
      const response = await axios.get(`${SERVER_HOST}/consumables/history`, {
        params: {
          ...filter,
          isPaginate: true,
          page: pageCurrent,
          event_type: 'snapshot:application',
          states: 'applied,applied_finish',
        },
      });
  
      // 数据映射：将 attributes 字段提升到顶层
      const mappedData = response.data.data.map((item: any) => ({
        ...item,
        ...item.attributes,
        id: item.id,
        serial_number: item.id,
      }));
  
      setIsChange(false);
      return {
        data: mappedData,
        success: true,
        total: response.data.total,
      };
    } catch (err: any) {
      message.error(err.message || '获取数据失败');
      return { data: [], success: false, total: 0 };
    }
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

  return (
    <PageContainer header={{ title: '耗材申请' }}>
      <ProTable
        columns={columns}
        cardBordered
        actionRef={actionRef}
        request={getConsumableApplyList}
        rowKey="serial_number"
        search={false}
        options={false}
        pagination={{ pageSize: 15 }}
        dateFormatter="string"
        headerTitle="耗材申请"
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
                setFilter((prev: any) => {
                  return {
                    ...prev,
                    ...value,
                  };
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
                  filterOption: (input: string, option: any) =>
                    (option?.label ?? '').includes(input),
                }}
                request={departments}
              />
              <ProFormText name="company" label="供应商" />
              <ProFormSelect
                name="apply_type"
                label="采购类型"
                valueEnum={{
                  'bid_product': { text: '中标产品' },
                  'sunshine_purchase': { text: '阳光采购' },
                  'self_purchase': { text: '自行采购' },
                  'offline_purchase': { text: '线下采购' },
                  'volume_purchase': { text: '带量采购' },
                  all: { text: '全部', status: 'all' },
                }}
              />
              <ProFormSelect
                name="status"
                label="状态"
                valueEnum={{
                  applied: { text: '已申请' },
                  selection_input: { text: '申请审核' },
                  all: { text: '全部', status: 'all' },
                }}
              />
            </LightFilter>
          ),
          actions: [
            <Button
              key="button"
              type="primary"
              onClick={() => {
                window.open('/#/consumable/list/apply/detail#create', '_blank');
              }}
            >
              新建
            </Button>,
          ],
        }}
      />
    </PageContainer>
  );
};

export default ConsumableApplyPage;
