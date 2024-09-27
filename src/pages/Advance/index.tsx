import AdvancePaybackModal from '@/components/AdvancePaybackModal';
import AdvanceTransferModal from '@/components/AdvanceTransfer';
import { SERVER_HOST } from '@/constants';
import {
  ActionType,
  LightFilter,
  PageContainer,
  ProDescriptionsItemProps,
  ProFormDigit,
  ProFormSelect,
  ProTable,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Button, Divider, InputNumber, Popconfirm, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';

const getAdvanceBudget = async () => {
  return await axios.get(`${SERVER_HOST}/advance/budget/index`);
};

const deleteAdvanceItem = async (id?: number) => {
  return await axios.delete(`${SERVER_HOST}/advance/records/delete/${id}`);
};

const getAdvanceEquipmentList = async () => {
  return await axios({
    method: 'GET',
    params: {
      isAdvance: true,
    },
    url: `${SERVER_HOST}/equipment/index`,
  });
};

const getAdvanceInstrumentList = async () => {
  return await axios({
    method: 'GET',
    params: {
      isAdvance: true,
    },
    url: `${SERVER_HOST}/instrument/index`,
  });
};

const getAdvanceMaintainList = async () => {
  return await axios({
    method: 'GET',
    params: {
      isAdvance: true,
    },
    url: `${SERVER_HOST}/maintain/index`,
  });
};

const storeAdvanceBudget = async (advance_budget: number) => {
  const form = new FormData();
  form.append('advance_budget', advance_budget.toString());
  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/advance/budget/store`,
  });
};

const approveAdvanceRecord = async (id?: number) => {
  if (!id) return [];
  const form = new FormData();
  form.append('method', 'approve');
  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/advance/records/update/${id}`,
  });
};

const paybackAdvanceRecord = async (id?: number) => {
  if (!id) return [];
  const form = new FormData();
  form.append('method', 'purchase');
  form.append('payback_date', moment().format('YYYY-MM-DD'));
  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/advance/records/update/${id}`,
  });
};

const initialTreeData = [
  { key: 'equipment', title: '设备', disableCheckbox: true },
  { key: 'instrument', title: '医疗用品', disableCheckbox: true },
  { key: 'maintain', title: '维修', disableCheckbox: true },
];

const AdvancePage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [data, setData] = useState<any>([]);
  const [filter, setFilter] = useState<any>({});
  const [paybackOpen, setPaybackOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const [transferOpen, setTransferOpen] = useState<boolean>(false);
  const [budget, setBudget] = useState<number>(0);
  const [serverBudget, setServerBudget] = useState<any>({});
  const [isChange, setIsChange] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<any>(initialTreeData);

  const getAdvanceList = async (params: any) => {
    const pageCurrent = isChange ? 1 : params.current;
    const data = await axios({
      method: 'GET',
      params: {
        ...filter,
        isPaginate: true,
      },
      url: `${SERVER_HOST}/advance/records/index?page=${pageCurrent}`,
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

  const { run: runGetAdvanceBudget } = useRequest(getAdvanceBudget, {
    manual: true,
    onSuccess: (result: any) => {
      setServerBudget(result);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runStoreAdvanceBudget } = useRequest(storeAdvanceBudget, {
    manual: true,
    onSuccess: () => {
      message.success(`预算设置成功:${budget}元`);
      runGetAdvanceBudget();
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runDeleteAdvanceItem } = useRequest(deleteAdvanceItem, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runGetAdvanceEquipmentList } = useRequest(
    getAdvanceEquipmentList,
    {
      manual: true,
      onSuccess: (result: any) => {
        const newEquipmentTreeData = _.chain(result.data)
          .filter((item: any) => item.advance_status === '0')
          .map((item: any) => {
            return {
              key: item.serial_number + 'E',
              id: item.id,
              title: `设备-${item.serial_number}-${item.equipment}-${item.price}元`,
              price: item.price,
            };
          })
          .value();
        setTreeData(
          _.map(treeData, (item: any) => {
            if (item.key === 'equipment') {
              return {
                key: 'equipment',
                title: '设备',
                children: newEquipmentTreeData,
                disableCheckbox: true,
              };
            } else {
              return item;
            }
          }),
        );
      },
      onError: (error: any) => {
        message.error(error.message);
      },
    },
  );

  const { run: runGetAdvanceInstrumentList } = useRequest(
    getAdvanceInstrumentList,
    {
      manual: true,
      onSuccess: (result: any) => {
        const newInstrumentTreeData = _.chain(result.data)
          .filter((item) => item.advance_status === '0')
          .map((item) => {
            return {
              key: item.serial_number + 'I',
              id: item.id,
              title: `医疗用品-${item.serial_number}-${item.instrument}-${item.price}元`,
              price: item.price,
            };
          })
          .value();
        setTreeData(
          _.map(treeData, (item) => {
            if (item.key === 'instrument') {
              return {
                key: 'instrument',
                title: '医疗用品',
                children: newInstrumentTreeData,
                disableCheckbox: true,
              };
            } else {
              return item;
            }
          }),
        );
      },
      onError: (error: any) => {
        message.error(error.message);
      },
    },
  );

  const { run: runGetAdvanceMaintainList } = useRequest(
    getAdvanceMaintainList,
    {
      manual: true,
      onSuccess: (result: any) => {
        const newMaintainTreeData = _.chain(result.data)
          .filter((item: any) => item.advance_status === '0')
          .map((item: any) => {
            return {
              id: item.id,
              key: item.serial_number + 'M',
              title: `维修-${item.serial_number}-${item.equipment}-${item.name}-${item.price}元`,
              price: item.price,
            };
          })
          .value();
        setTreeData(
          _.map(treeData, (item: any) => {
            if (item.key === 'maintain') {
              return {
                key: 'maintain',
                title: '维修',
                children: newMaintainTreeData,
                disableCheckbox: true,
              };
            } else {
              return item;
            }
          }),
        );
      },
      onError: (error: any) => {
        message.error(error.message);
      },
    },
  );

  const { run: runApproveAdvanceRecord } = useRequest(approveAdvanceRecord, {
    manual: true,
    onSuccess: (result: any) => {
      console.log(result);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runPaybackAdvanceRecord } = useRequest(paybackAdvanceRecord, {
    manual: true,
    onSuccess: (result: any) => {
      console.log(result);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const approveOk = async (id: number) => {
    await runApproveAdvanceRecord(id);
    message.success('已通过审核');
    setPaybackOpen(false);
    actionRef.current?.reload();
  };

  const approveCancel = async (id: number) => {
    await runDeleteAdvanceItem(id);
    await runGetAdvanceBudget();
    await runGetAdvanceEquipmentList();
    await runGetAdvanceInstrumentList();
    await runGetAdvanceMaintainList();
    message.success('已驳回');
    setPaybackOpen(false);
    actionRef.current?.reload();
  };

  const payBackOk = async (id: number) => {
    await runPaybackAdvanceRecord(id);
    await runGetAdvanceBudget();
    message.success('已确认回款');
    setPaybackOpen(false);
    actionRef.current?.reload();
  };

  const closeModal = () => {
    setPaybackOpen(false);
  };

  const STATUS = [
    {
      optionText: '制单',
      onOk: closeModal,
      okText: '确认',
      onCancel: closeModal,
      cancelText: '取消',
    },
    {
      optionText: '审核通过',
      onOk: approveOk,
      okText: '审核通过',
      onCancel: approveCancel,
      cancelText: '审核不通过',
    },
    {
      optionText: '确认回款',
      onOk: payBackOk,
      okText: '确认回款',
      onCancel: closeModal,
      cancelText: '取消',
    },
    {
      optionText: '查看记录',
      onOk: closeModal,
      okText: '确认',
      onCancel: closeModal,
      cancelText: '取消',
    },
  ];

  const columns: ProDescriptionsItemProps[] = [
    {
      title: '制单编号',
      dataIndex: 'id',
    },
    {
      title: '制单日期',
      dataIndex: 'create_date',
    },
    {
      title: '总金额',
      dataIndex: 'all_price',
    },
    {
      title: '回款状态',
      dataIndex: 'status',
      valueEnum: {
        0: { text: '待制单', status: '0' },
        1: { text: '待审核', status: '1' },
        2: { text: '待回款', status: '2' },
        3: { text: '已回款', status: '3' },
      },
    },
    {
      title: '回款日期',
      dataIndex: 'payback_date',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, record, _, action) => (
        <>
          <a
            onClick={() => {
              setSelectedRecord(record);
              setPaybackOpen(true);
            }}
          >
            {STATUS[parseInt(record.status)].optionText}
          </a>
          <Divider type="vertical" />
          <a
            onClick={async () => {
              const id = record.id;
              await runDeleteAdvanceItem(id);
              await runGetAdvanceBudget();
              await runGetAdvanceEquipmentList();
              await runGetAdvanceInstrumentList();
              await runGetAdvanceMaintainList();
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

  useEffect(() => {
    runGetAdvanceBudget();
    runGetAdvanceEquipmentList();
    runGetAdvanceInstrumentList();
    runGetAdvanceMaintainList();
  }, []);

  return (
    <PageContainer
      header={{
        title: '垫付款管理',
      }}
    >
      <ProTable
        columns={columns}
        cardBordered
        actionRef={actionRef}
        // @ts-ignore
        request={getAdvanceList}
        rowKey="id"
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
        headerTitle="垫付款管理"
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
                  id: _.isUndefined(value.id) ? filter.id : value.id,
                  status: value.status
                    ? value.status === 'all'
                      ? null
                      : value.status
                    : filter.status,
                });
                setIsChange(true);
              }}
            >
              <ProFormDigit name="id" label="制单编号" />
              <ProFormSelect
                name="status"
                label="状态"
                valueEnum={{
                  1: { text: '待审核', status: '1' },
                  2: { text: '待回款', status: '2' },
                  3: { text: '已回款', status: '3' },
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
              {
                key: 'prices',
                label: <div>共计{_.sumBy(data, 'all_price')}元</div>,
              },
            ],
          },
          actions: [
            <Popconfirm
              title="设定预算"
              key="advance"
              description={
                <InputNumber
                  onChange={(props: any) => {
                    setBudget(props);
                  }}
                />
              }
              onConfirm={() => runStoreAdvanceBudget(budget)}
            >
              <Button type="primary">设定预算</Button>
            </Popconfirm>,
            <Button
              key="button"
              onClick={() => {
                setTransferOpen(true);
              }}
              type="primary"
            >
              新建
            </Button>,
          ],
        }}
      />
      <AdvanceTransferModal
        open={transferOpen}
        treeData={treeData}
        serverBudget={serverBudget}
        finish={() => {
          setTransferOpen(false);
          actionRef.current?.reload();
          runGetAdvanceBudget();
          runGetAdvanceEquipmentList();
          runGetAdvanceInstrumentList();
          runGetAdvanceMaintainList();
        }}
        cancel={() => setTransferOpen(false)}
      />
      {selectedRecord && selectedRecord.id ? (
        <AdvancePaybackModal
          selectedId={selectedRecord.id}
          open={paybackOpen}
          // @ts-ignore
          onOk={STATUS[parseInt(selectedRecord.status)].onOk}
          okText={STATUS[parseInt(selectedRecord.status)].okText}
          // @ts-ignore
          onCancel={STATUS[parseInt(selectedRecord.status)].onCancel}
          cancelText={STATUS[parseInt(selectedRecord.status)].cancelText}
        />
      ) : null}
    </PageContainer>
  );
};

export default AdvancePage;
