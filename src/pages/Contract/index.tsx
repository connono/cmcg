import ContractModal from '@/components/ContractModal';
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

const deleteContract = async (id?: number) => {
  return await axios.delete(`${SERVER_HOST}/payment/contracts/delete/${id}`);
};

const backEquipmentItem = async (id?: number) => {
  return await axios.patch(`${SERVER_HOST}/equipment/back/${id}`);
};

const ContractPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [data, setData] = useState<any>([]);
  const [filter, setFilter] = useState<any>({});

  const getContractList = async () => {
    return await axios({
      method: 'GET',
      params: {
        ...filter,
      },
      url: `${SERVER_HOST}/payment/contracts/index`,
    });
  };

  const { run: runGetContractList } = useRequest(getContractList, {
    manual: true,
    onSuccess: (result: any) => {
      setData(result.data);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runDeleteContract } = useRequest(deleteContract, {
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

  const columns: ProDescriptionsItemProps<any>[] = [
    {
      title: '申请编号',
      dataIndex: 'series_number',
    },
    {
      title: '合同名称',
      dataIndex: 'contract_name',
    },
    {
      title: '类型',
      dataIndex: 'category',
      valueEnum: {
        JJ: { text: '基建项目', status: 'JJ' },
        YP: { text: '药品采购', status: 'YP' },
        XX: { text: '信息采购', status: 'XX' },
        XS: { text: '医疗协商', status: 'XS' },
        HZ: { text: '医疗合作', status: 'HZ' },
        ZW: { text: '物资采购', status: 'ZW' },
        FW: { text: '服务项目', status: 'FW' },
        QX: { text: '器械采购', status: 'QX' },
      },
    },
    {
      title: '签订对象',
      dataIndex: 'contractor',
    },
    {
      title: '资金来源',
      dataIndex: 'source',
    },
    {
      title: '金额',
      dataIndex: 'price',
    },
    {
      title: '是否为重大项目',
      dataIndex: 'isImportant',
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
              history.push(`/purchase/contract/detail#${id}`, record);
            }}
          >
            详情
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
              await runDeleteContract(id);
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
        title: '合同管理',
      }}
    >
      <ProTable
        columns={columns}
        cardBordered
        actionRef={actionRef}
        request={runGetContractList}
        rowKey="series_number"
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
        headerTitle="合同管理列表"
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
                  contract_name: _.isUndefined(value.contract_name)
                    ? filter.contract_name
                    : value.contract_name,
                  series_number: _.isUndefined(value.series_number)
                    ? filter.series_number
                    : value.series_number,
                  category: value.category
                    ? value.category === 'all'
                      ? null
                      : value.category
                    : filter.category,
                  source: value.source
                    ? value.source === 'all'
                      ? null
                      : value.source
                    : filter.source,
                  isImportant: !_.isUndefined(value.isImportant)
                    ? value.isImportant
                      ? 'true'
                      : 'false'
                    : filter.isImportant,
                });
              }}
            >
              <ProFormText name="contract_name" label="合同名称" />
              <ProFormText name="series_number" label="合同编号" />
              <ProFormSelect
                label="类型"
                name="category"
                width="md"
                valueEnum={{
                  JJ: { text: '基建项目', status: 'JJ' },
                  YP: { text: '药品采购', status: 'YP' },
                  XX: { text: '信息采购', status: 'XX' },
                  XS: { text: '医疗协商', status: 'XS' },
                  HZ: { text: '医疗合作', status: 'HZ' },
                  ZW: { text: '物资采购', status: 'ZW' },
                  FW: { text: '服务项目', status: 'FW' },
                  QX: { text: '器械采购', status: 'QX' },
                  all: { text: '全部', status: 'all' },
                }}
              />
              <ProFormSelect
                label="资金来源"
                name="source"
                width="md"
                valueEnum={{
                  自筹资金: { text: '自筹资金', status: '自筹资金' },
                  财政拨款: { text: '财政拨款', status: '财政拨款' },
                  专项资金: { text: '专项资金', status: '专项资金' },
                  学科经费: { text: '学科经费', status: '学科经费' },
                  名医工作室: { text: '名医工作室', status: '名医工作室' },
                  更多: { text: '更多', status: '更多' },
                  all: { text: '全部', status: 'all' },
                }}
              />
              <ProFormCheckbox label="是否为重大项目" name="isImportant" />
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
            <ContractModal
              key="contract"
              callback={() => {
                actionRef.current?.reload();
              }}
            />,
          ],
        }}
      />
    </PageContainer>
  );
};

export default ContractPage;
