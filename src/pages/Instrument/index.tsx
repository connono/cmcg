import { SERVER_HOST } from '@/constants';
import {
  ActionType,
  LightFilter,
  PageContainer,
  ProDescriptionsItemProps,
  ProFormCheckbox,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Access, history, useAccess, useRequest } from '@umijs/max';
import { Button, Divider, Popconfirm, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

const deleteInstrumentItem = async (id?: number) => {
  return await axios.delete(`${SERVER_HOST}/instrument/delete/${id}`);
};

const backInstrumentItem = async (id?: number) => {
  return await axios.patch(`${SERVER_HOST}/instrument/back/${id}`);
};

const getAllDepartments = async () => {
  return await axios.get(`${SERVER_HOST}/department/index`);
};

const InstrumentPage: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();
  const [data, setData] = useState<any>([]);
  const [filter, setFilter] = useState<any>({});
  const access = useAccess();

  const getInstrumentList = async () => {
    return await axios({
      method: 'GET',
      params: {
        ...filter,
      },
      url: `${SERVER_HOST}/instrument/index`,
    });
  };

  const { run: runGetAllDepartments } = useRequest(getAllDepartments, {
    manual: true,
    onSuccess: () => {},
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runGetInstrumentList } = useRequest(getInstrumentList, {
    manual: true,
    onSuccess: (result: any) => {
      setData(result.data);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runDeleteInstrumentItem } = useRequest(deleteInstrumentItem, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runBackInstrumentItem } = useRequest(backInstrumentItem, {
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

  const columns: ProDescriptionsItemProps<API.InstrumentRecordInfo>[] = [
    {
      title: '申请编号',
      dataIndex: 'serial_number',
    },
    {
      title: '申请设备名称',
      dataIndex: 'instrument',
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
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        0: { text: '申请', status: '0' },
        1: { text: '调研', status: '1' },
        2: { text: '合同', status: '2' },
        3: { text: '安装验收', status: '3' },
        4: { text: '医工科审核', status: '4' },
        5: { text: '完成', status: '5' },
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
              history.push(`/apply/instrument/detail#update&${id}`);
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
              if (!access.canBackInstrument) {
                message.error('你无权进行此操作');
              } else {
                const id = record.id;
                await runBackInstrumentItem(id);
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
              if (!access.canDeleteInstrument) {
                message.error('你无权进行此操作');
              } else {
                const id = record.id;
                await runDeleteInstrumentItem(id);
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
        title: '器械医疗用品采购管理',
      }}
    >
      <ProTable<API.InstrumentRecordInfo>
        columns={columns}
        cardBordered
        actionRef={actionRef}
        request={runGetInstrumentList}
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
                  instrument: _.isUndefined(value.instrument)
                    ? filter.instrument
                    : value.instrument,
                  type: value.type
                    ? value.type === 'all'
                      ? null
                      : value.type
                    : value.type,
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
                  isAdvance: !_.isUndefined(value.isAdvance)
                    ? value.isAdvance
                      ? 'true'
                      : 'false'
                    : filter.isAdvance,
                });
              }}
            >
              <ProFormText name="instrument" label="申请设备名称" />
              <ProFormSelect
                name="department"
                label="申请科室"
                request={departments}
              />
              <ProFormRadio.Group
                name="type"
                label="类型："
                options={[
                  {
                    label: '医疗用品',
                    value: '医疗用品',
                  },
                  {
                    label: '维修配件',
                    value: '维修配件',
                  },
                  {
                    label: '全部',
                    value: 'all',
                  },
                ]}
              />
              <ProFormSelect
                name="status"
                label="状态"
                valueEnum={{
                  0: { text: '申请', status: '0' },
                  1: { text: '调研', status: '1' },
                  2: { text: '合同', status: '2' },
                  3: { text: '安装验收', status: '3' },
                  4: { text: '医工科审核', status: '4' },
                  5: { text: '完成', status: '5' },
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
            <Access
              key="can_apply_instrument"
              accessible={access.canApplyInstrument}
            >
              <Button
                key="button"
                onClick={async () => {
                  history.push('/apply/instrument/detail#create');
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

export default InstrumentPage;
