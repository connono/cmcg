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
import { Access, history, useAccess, useRequest } from '@umijs/max';
import { Button, Divider, Popconfirm, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

const deleteConsumableApplyItem = async (id?: number) => {
  return await axios.delete(`${SERVER_HOST}/maintain/delete/${id}`);
};

const backConsumableApplyItem = async (id?: number) => {
  return await axios.patch(`${SERVER_HOST}/maintain/back/${id}`);
};

const getAllDepartments = async () => {
  return await axios.get(`${SERVER_HOST}/department/index`);
};

const ConsumableApplyPage: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();
  const [data, setData] = useState<any>([]);
  const [filter, setFilter] = useState<any>({});
  const access = useAccess();

  const getConsumableApplyList = async (params: any) => {
    const data = await axios({
      method: 'GET',
      params: {
        ...filter,
        isPaginate: true,
      },
      url: `${SERVER_HOST}/consumable/apply/index?page=${params.current}`,
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

  const { run: runDeleteConsumableApplyItem } = useRequest(
    deleteConsumableApplyItem,
    {
      manual: true,
      onSuccess: () => {
        message.success('删除成功');
      },
      onError: (error: any) => {
        message.error(error.message);
      },
    },
  );
  const { run: runBackConsumableApplyItem } = useRequest(
    backConsumableApplyItem,
    {
      manual: true,
      onSuccess: () => {
        message.success('回退成功');
      },
      onError: (error: any) => {
        message.error(error.message);
      },
    },
  );

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
      render: (text, record, _, action) => (
        <>
          <a
            onClick={() => {
              history.push(
                `/consumable/list/apply/detail#update&${record.serial_number}`,
              );
            }}
          >
            录入
          </a>
          <Divider type="vertical" />
          <Popconfirm
            key="back"
            placement="topLeft"
            title="确定要回退吗？"
            onConfirm={async () => {
              if (!access.canBackRepair) {
                message.error('你无权进行此操作');
              } else {
                const id = record.id;
                await runBackConsumableApplyItem(id);
                action?.reload();
              }
            }}
            okText="确定"
            cancelText="取消"
          >
            <a key="back">回退</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a
            onClick={async () => {
              if (!access.canDeleteEquipment) {
                message.error('你无权进行此操作');
              } else {
                const id = record.id;
                await runDeleteConsumableApplyItem(id);
                action?.reload();
              }
            }}
          >
            删除
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
