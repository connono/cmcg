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
import { Button, Divider, Popconfirm, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

const stopTemporyConsumableItem = async (id: any) => {
  return await axios.post(`${SERVER_HOST}/consumable/tempory/stop/${id}`);
};

const getAllDepartments = async () => {
  return await axios.get(`${SERVER_HOST}/department/index`);
};

const TemporyConsumablePage: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();
  const [data, setData] = useState<any>([]);
  const [filter, setFilter] = useState<any>({});
  const access = useAccess();

  const getTemporyConsumableList = async (params: any) => {
    const data = await axios({
      method: 'GET',
      params: {
        ...filter,
        isPaginate: true,
      },
      url: `${SERVER_HOST}/consumable/tempory/index?page=${params.current}`,
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

  const { run: runStopTemporyConsumableItem } = useRequest(
    stopTemporyConsumableItem,
    {
      manual: true,
      onSuccess: () => {
        message.success('中止成功');
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
      dataIndex: 'serial_number',
    },
    {
      title: '耗材名称',
      dataIndex: 'consumable',
      width: 100,
    },
    {
      title: '规格型号',
      dataIndex: 'model',
      width: 200,
    },
    {
      title: '生产厂家',
      dataIndex: 'manufacturer',
      width: 150,
    },
    {
      title: '申请科室',
      dataIndex: 'department',
      width: 80,
    },
    {
      title: '预估单价（元）',
      dataIndex: 'budget',
      width: 50,
    },
    {
      title: '数量',
      dataIndex: 'count',
      width: 50,
    },
    {
      title: '注册证号',
      dataIndex: 'registration_num',
    },
    {
      title: '采购类型',
      dataIndex: 'apply_type',
      valueEnum: {
        0: { text: '中标采购' },
        1: { text: '阳光采购' },
        2: { text: '自行采购' },
        3: { text: '线下采购' },
        4: { text: '带量采购' },
      },
    },
    {
      title: '平台产品ID',
      dataIndex: 'product_id',
    },
    {
      title: '供应商',
      dataIndex: 'company',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        0: { text: '申请' },
        1: { text: '采购' },
        2: { text: '待审核' },
        3: { text: '完成' },
        4: { text: '中止' },
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
              const id = record.id;
              history.push(`/consumable/tempory/apply/detail#update&${id}`);
            }}
          >
            录入
          </a>
          <Divider type="vertical" />
          <Popconfirm
            key="back"
            placement="topLeft"
            title="确定要中止吗？"
            onConfirm={async () => {
              const id = record.id;
              await runStopTemporyConsumableItem(id);
              action?.reload();
            }}
            okText="确定"
            cancelText="取消"
          >
            <a key="back">中止</a>
          </Popconfirm>
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
        title: '临时耗材申请',
      }}
    >
      <ProTable
        columns={columns}
        cardBordered
        actionRef={actionRef}
        // @ts-ignore
        request={getTemporyConsumableList}
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
        headerTitle="设备维修保养管理"
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
                  consumable: _.isUndefined(value.consumable)
                    ? filter.consumable
                    : value.consumable,
                  product_id: _.isUndefined(value.product_id)
                    ? filter.product_id
                    : value.product_id,
                  company: _.isUndefined(value.company)
                    ? filter.company
                    : value.company,
                  status: value.status
                    ? value.status === 'all'
                      ? null
                      : value.status
                    : filter.status,
                  apply_type: value.apply_type
                    ? value.apply_type === 'all'
                      ? null
                      : value.apply_type
                    : filter.apply_type,
                  department: value.department
                    ? value.department === 'all'
                      ? null
                      : value.department
                    : filter.department,
                });
              }}
            >
              <ProFormText name="serial_number" label="申请编号" />
              <ProFormText name="consumable" label="耗材名称" />
              <ProFormText name="manufacturer" label="生产厂家" />
              <ProFormSelect
                name="status"
                label="状态"
                valueEnum={{
                  1: { text: '采购', status: '1' },
                  2: { text: '待审核', status: '2' },
                  3: { text: '完成', status: '3' },
                  4: { text: '中止' },
                  all: { text: '全部', status: 'all' },
                }}
              />
              <ProFormSelect
                label="采购方式："
                name="apply_type"
                valueEnum={{
                  0: { text: '中标采购' },
                  1: { text: '阳光采购' },
                  2: { text: '自行采购' },
                  3: { text: '线下采购' },
                  4: { text: '带量采购' },
                  all: { text: '全部' },
                }}
              />
              <ProFormSelect
                name="department"
                label="申请科室"
                request={departments}
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
                  history.push('/consumable/tempory/apply/detail#create');
                }}
                type="primary"
              >
                申请
              </Button>
            </Access>,
          ],
        }}
      />
    </PageContainer>
  );
};

export default TemporyConsumablePage;
