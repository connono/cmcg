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
import { history, useRequest } from '@umijs/max';
import { Button, Divider, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

const deleteMaintainItem = async (id?: number) => {
  return await axios.delete(`${SERVER_HOST}/maintain/delete/${id}`);
};

const backMaintainItem = async (id?: number) => {
  return await axios.patch(`${SERVER_HOST}/maintain/back/${id}`);
};

const getAllDepartments = async () => {
  return await axios.get(`${SERVER_HOST}/department/index`);
};

const MaintainPage: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();
  const [data, setData] = useState<any>([]);
  const [filter, setFilter] = useState<any>({});

  const getMaintainList = async () => {
    return await axios({
      method: 'GET',
      params: {
        ...filter,
      },
      url: `${SERVER_HOST}/maintain/index`,
    });
  };

  const { run: runGetAllDepartments } = useRequest(getAllDepartments, {
    manual: true,
    onSuccess: () => {},
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runGetMaintainList } = useRequest(getMaintainList, {
    manual: true,
    onSuccess: (result: any) => {
      setData(result.data);
    },
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
  const { run: runBackMaintainItem } = useRequest(backMaintainItem, {
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

  const columns: ProDescriptionsItemProps<API.RepairApplyRecordInfo>[] = [
    {
      title: '申请编号',
      dataIndex: 'serial_number',
    },
    {
      title: '维修项目',
      dataIndex: 'name',
    },
    {
      title: '设备名称',
      dataIndex: 'equipment',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        0: { text: '申请', status: '0' },
        1: { text: '安装验收', status: '1' },
        2: { text: '完成', status: '2' },
      },
    },
    {
      title: '申请科室',
      dataIndex: 'department',
    },
    {
      title: '最高报价',
      dataIndex: 'budget',
    },
    {
      title: '发票金额',
      dataIndex: 'price',
    },
    {
      title: '是否垫付',
      dataIndex: 'isAdvance',
      valueEnum: {
        true: { text: '是' },
        false: { text: '否' },
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
              history.push(`/apply/maintain/detail#update&${id}`);
            }}
          >
            录入
          </a>
          <Divider type="vertical" />
          <a
            onClick={async () => {
              const id = record.id;
              await runBackMaintainItem(id);
              action?.reload();
            }}
          >
            回退
          </a>
          <Divider type="vertical" />
          <a
            onClick={async () => {
              const id = record.id;
              await runDeleteMaintainItem(id);
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
        title: '设备维修保养管理',
      }}
    >
      <ProTable<API.RepairApplyRecordInfo>
        columns={columns}
        cardBordered
        actionRef={actionRef}
        request={runGetMaintainList}
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
                  2: { text: '完成', status: '2' },
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
            <Button
              key="button"
              onClick={async () => {
                history.push('/apply/maintain/detail#create');
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

export default MaintainPage;
