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
import { Access, useAccess, useRequest } from '@umijs/max';
import { Button, Divider, Popconfirm, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
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
  const [isChange, setIsChange] = useState<boolean>(false);
  const access = useAccess();

  const getMaintainList = async (params: any) => {
    const pageCurrent = isChange ? 1 : params.current;
    const data = await axios({
      method: 'GET',
      params: {
        ...filter,
        isPaginate: true,
      },
      url: `${SERVER_HOST}/maintain/index?page=${pageCurrent}`,
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
        2: { text: '医工科审核', status: '2' },
        3: { text: '完成', status: '3' },
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
              window.open(`/#/apply/maintain/detail#update&${id}`, '_blank');
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
                await runBackMaintainItem(id);
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
                await runDeleteMaintainItem(id);
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
        title: '设备维修保养管理',
      }}
    >
      <ProTable<API.RepairApplyRecordInfo>
        columns={columns}
        cardBordered
        actionRef={actionRef}
        // @ts-ignore
        request={getMaintainList}
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
                  serial_number: _.isUndefined(value.serial_number)
                    ? filter.serial_number
                    : value.serial_number,
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
                setIsChange(true);
              }}
            >
              <ProFormText name="serial_number" label="申请编号" />
              <ProFormText name="name" label="维修项目" />
              <ProFormText name="equipment" label="设备名称" />
              <ProFormSelect
                name="department"
                label="申请科室"
                request={departments}
                fieldProps={{
                  showSearch: true,
                  filterOption: (input: any, option: any) =>
                    (option?.label ?? '').includes(input),
                }}
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
                  window.open('/#/apply/maintain/detail#create', '_blank');
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

export default MaintainPage;
