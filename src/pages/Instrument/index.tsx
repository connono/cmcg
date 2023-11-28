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
import { history, useRequest } from '@umijs/max';
import { Button, Divider, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

const deleteEquipmentItem = async (id?: number) => {
  return await axios.delete(`${SERVER_HOST}/equipment/delete/${id}`);
};

const backEquipmentItem = async (id?: number) => {
  return await axios.patch(`${SERVER_HOST}/equipment/back/${id}`);
};

const getAllDepartments = async () => {
  return await axios.get(`${SERVER_HOST}/department/index`);
};

const EquipmentPage: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();
  const [data, setData] = useState<any>([]);
  const [filter, setFilter] = useState<any>({});

  const getEquipmentList = async () => {
    return await axios({
      method: 'GET',
      params: {
        ...filter,
      },
      url: `${SERVER_HOST}/equipment/index`,
    });
  };

  const { run: runGetAllDepartments } = useRequest(getAllDepartments, {
    manual: true,
    onSuccess: () => {},
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runGetEquipmentList } = useRequest(getEquipmentList, {
    manual: true,
    onSuccess: (result: any) => {
      setData(result.data);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runDeleteEquipmentItem } = useRequest(deleteEquipmentItem, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runBackEquipmentItem } = useRequest(backEquipmentItem, {
    manual: true,
    onSuccess: () => {
      message.success('回退成功');
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

  const columns: ProDescriptionsItemProps<API.EquipmentRecordInfo>[] = [
    {
      title: '申请编号',
      dataIndex: 'serial_number',
    },
    {
      title: '申请设备名称',
      dataIndex: 'equipment',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        0: { text: '申请', status: '0' },
        1: { text: '调研', status: '1' },
        2: { text: '政府审批', status: '2' },
        3: { text: '投标', status: '3' },
        4: { text: '合同', status: '4' },
        5: { text: '安装验收', status: '5' },
        6: { text: '完成', status: '6' },
      },
    },
    {
      title: '申请科室',
      dataIndex: 'department',
    },
    {
      title: '数量',
      dataIndex: 'count',
    },
    {
      title: '预算',
      dataIndex: 'budget',
    },
    {
      title: '申请方式',
      dataIndex: 'apply_type',
      valueEnum: {
        0: { text: '年度采购', status: '0' },
        1: { text: '经费采购', status: '1' },
        2: { text: '临时采购', status: '2' },
      },
    },
    {
      title: '采购方式',
      dataIndex: 'purchase_type',
      valueEnum: {
        0: { text: '展会采购', status: '0' },
        1: { text: '招标', status: '1' },
        2: { text: '自行采购', status: '2' },
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
              history.push(`/equipment/detail#update&${id}`);
            }}
          >
            录入
          </a>
          <Divider type="vertical" />
          <a
            onClick={async () => {
              const id = record.id;
              await runBackEquipmentItem(id);
              action?.reload();
            }}
          >
            回退
          </a>
          <Divider type="vertical" />
          <a
            onClick={async () => {
              const id = record.id;
              await runDeleteEquipmentItem(id);
              action?.reload();
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
        title: '设备管理',
      }}
    >
      <ProTable<API.EquipmentRecordInfo>
        columns={columns}
        cardBordered
        actionRef={actionRef}
        request={runGetEquipmentList}
        rowKey="serial_number"
        search={false}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        pagination={{
          pageSize: 5,
        }}
        dateFormatter="string"
        headerTitle="器械耗材采购管理"
        toolbar={{
          filter: (
            <LightFilter
              collapse={true}
              onValuesChange={(value) => {
                setFilter({
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
                  apply_type: value.apply_type
                    ? value.apply_type === 'all'
                      ? null
                      : value.apply_type
                    : filter.apply_type,
                  purchase_type: value.purchase_type
                    ? value.purchase_type === 'all'
                      ? null
                      : value.purchase_type
                    : filter.purchase_type,
                });
              }}
            >
              <ProFormText name="equipment" label="申请设备名称" />
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
                  1: { text: '调研', status: '1' },
                  2: { text: '政府审批', status: '2' },
                  3: { text: '投标', status: '3' },
                  4: { text: '合同', status: '4' },
                  5: { text: '安装验收', status: '5' },
                  6: { text: '完成', status: '6' },
                  all: { text: '全部', status: 'all' },
                }}
              />
              <ProFormSelect
                name="apply_type"
                label="申请方式"
                valueEnum={{
                  0: { text: '年度采购', status: '0' },
                  1: { text: '经费采购', status: '1' },
                  2: { text: '临时采购', status: '2' },
                  all: { text: '全部', status: 'all' },
                }}
              />
              <ProFormSelect
                name="purchase_type"
                label="采购方式"
                valueEnum={{
                  0: { text: '展会采购', status: '0' },
                  1: { text: '招标', status: '1' },
                  2: { text: '自行采购', status: '2' },
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
            <Button
              key="button"
              onClick={async () => {
                history.push('/equipment/detail#create');
              }}
              type="primary"
            >
              新建
            </Button>,
          ],
        }}
      />
    </PageContainer>
  );
};

export default EquipmentPage;
