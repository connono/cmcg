import { SERVER_HOST } from '@/constants';
import {
  PageContainer,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { history, useRequest } from '@umijs/max';
import { Button, Divider, message } from 'antd';
import axios from 'axios';
import React from 'react';

const getEquipmentList = async () => {
  return await axios.get(`${SERVER_HOST}/equipment/index`);
};

const deleteEquipmentItem = async (id?: number) => {
  return await axios.delete(`${SERVER_HOST}/equipment/delete/${id}`);
};

const backEquipmentItem = async (id?: number) => {
  return await axios.patch(`${SERVER_HOST}/equipment/back/${id}`);
};

const EquipmentPage: React.FC<unknown> = () => {
  const { run: runGetEquipmentList } = useRequest(getEquipmentList, {
    manual: true,
    onSuccess: (result) => {
      if (result) {
        console.log(result);
      } else {
        message.error('错误');
      }
    },
    onError: (error) => {
      message.error(error.message);
    },
  });
  const { run: runDeleteEquipmentItem } = useRequest(deleteEquipmentItem, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
    },
    onError: (error) => {
      message.error(error.message);
    },
  });
  const { run: runBackEquipmentItem } = useRequest(backEquipmentItem, {
    manual: true,
    onSuccess: () => {
      message.success('回退成功');
    },
    onError: (error) => {
      message.error(error.message);
    },
  });
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
              history.push(`./equipment/detail#update&${id}`);
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

  return (
    <PageContainer
      header={{
        title: '设备管理',
      }}
    >
      <ProTable<API.EquipmentRecordInfo>
        columns={columns}
        cardBordered
        request={runGetEquipmentList}
        rowKey="serial_number"
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        pagination={{
          pageSize: 5,
        }}
        dateFormatter="string"
        headerTitle="设备申请记录列表"
        toolBarRender={() => [
          <Button
            key="button"
            // icon={<PlusOutlined />}
            onClick={() => {
              history.push('/equipment/detail#create');
            }}
            type="primary"
          >
            新建
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default EquipmentPage;
