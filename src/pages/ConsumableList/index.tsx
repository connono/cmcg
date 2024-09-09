import { SERVER_HOST } from '@/constants';
import {
  ActionType,
  LightFilter,
  PageContainer,
  ProDescriptionsItemProps,
  ProFormCheckbox,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { history, useAccess, useRequest } from '@umijs/max';
import { Button, Divider, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

const deleteMaintainItem = async (id?: number) => {
  return await axios.delete(`${SERVER_HOST}/maintain/delete/${id}`);
};

const getAllDepartments = async () => {
  return await axios.get(`${SERVER_HOST}/department/index`);
};

const ConsumableListPage: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();
  const [data, setData] = useState<any>([]);
  const [filter, setFilter] = useState<any>({});
  const access = useAccess();

  const getConsumableList = async (params: any) => {
    const data = await axios({
      method: 'GET',
      params: {
        ...filter,
        isPaginate: true,
      },
      url: `${SERVER_HOST}/consumable/directory/index?page=${params.current}`,
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

  const { run: runGetAllDepartments } = useRequest(getAllDepartments, {
    manual: true,
    onSuccess: () => {},
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runDeleteMaintainItem } = useRequest(deleteMaintainItem, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
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
        4: { text: '终止' },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, record, _, action) => (
        <>
          <a
            onClick={() => {
              history.push(
                `/consumable/list/index/detail#update&${record.consumable_apply_id}`,
              );
            }}
          >
            录入
          </a>
          <Divider type="vertical" />
          <a
            onClick={async () => {
              if (!access.canDeleteEquipment) {
                message.error('你无权进行此操作');
              } else {
                const id = record.id;
                await runDeleteMaintainItem(id);
                action?.reload();
              }
            }}
          >
            删除
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              history.push(
                `/consumable/list/index/history#${record.consumable_apply_id}`,
                record,
              );
            }}
          >
            查看动态详情
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
                  name: _.isUndefined(value.name) ? filter.name : value.name,
                  equipment: _.isUndefined(value.equipment)
                    ? filter.equipment
                    : value.equipment,
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
                  isAdvance: !_.isUndefined(value.isAdvance)
                    ? value.isAdvance
                      ? 'true'
                      : 'false'
                    : filter.isAdvance,
                });
              }}
            >
              <ProFormText name="name" label="维修项目" />
              <ProFormText name="equipment" label="设备名称" />
              <ProFormSelect
                name="department"
                label="申请科室"
                request={departments}
              />
              <ProFormSelect
                name="status"
                label="状态"
                valueEnum={{
                  0: { text: '申请', status: '0' },
                  1: { text: '安装验收', status: '1' },
                  2: { text: '医工科审核', status: '2' },
                  3: { text: '完成', status: '3' },
                  all: { text: '全部', status: 'all' },
                }}
              />
              <ProFormCheckbox label="是否垫付" name="isAdvance" />
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
