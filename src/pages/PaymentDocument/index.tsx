import PaymentDocumentTransferModal from '@/components/PaymentDocumentTransfer';
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
import { Access, useAccess, useRequest } from '@umijs/max';
import { Button, Divider, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';

const getAllDepartments = async () => {
  return await axios.get(`${SERVER_HOST}/department/index?is_functional=1`);
};

const deletePaymentDocumentItem = async (id?: number) => {
  return await axios.delete(
    `${SERVER_HOST}/payment/document/records/delete/${id}`,
  );
};

const getPaymentProcessRecordList = async (department: string) => {
  if (_.isUndefined(department)) return [];
  console.log('department', department);
  return await axios({
    method: 'GET',
    params: {
      department,
    },
    url: `${SERVER_HOST}/payment/document/records/getDocumentRecordList`,
  });
};

const initialTreeData = [
  { key: 'payment_process', title: '固定资产', disableCheckbox: true },
  // { key: 'instrument', title: '医疗用品', disableCheckbox: true },
  // { key: 'maintain', title: '维修', disableCheckbox: true },
];

const PaymentDocumentPage: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();
  const [data, setData] = useState<any>([]);
  const [filter, setFilter] = useState<any>({});
  const [isChange, setIsChange] = useState<boolean>(false);
  const [transferOpen, setTransferOpen] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<any>(initialTreeData);
  const [selectedDepartment, setSelectedDepartment] = useState<any>();
  const access = useAccess();

  const { run: runGetAllDepartments } = useRequest(getAllDepartments, {
    manual: true,
    onSuccess: () => {},
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const getPaymentDocumentList = async (params: any) => {
    const pageCurrent = isChange ? 1 : params.current;
    const data = await axios({
      method: 'GET',
      params: {
        ...filter,
        isPaginate: true,
      },
      url: `${SERVER_HOST}/payment/document/records/index?page=${pageCurrent}`,
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

  const { run: runDeletePaymentDocumentItem } = useRequest(
    deletePaymentDocumentItem,
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

  const { run: runGetPaymentProcessRecordList } = useRequest(
    getPaymentProcessRecordList,
    {
      manual: true,
      onSuccess: (result: any) => {
        if (!_.get(result, 'data')) return;
        const newPaymentProcessRecordData = _.chain(result.data)
          .filter((item: any) => !item.payment_document_id)
          .filter((item: any) => item.assessment && item.assessment !== 0)
          .map((item: any) => {
            return {
              id: item.id,
              key: `${item.id}P`,
              title: `${item.contract_name}`,
              department: item.department,
              company: item.company,
              price: item.target_amount,
              assessment: item.assessment,
            };
          })
          .value();
        setTreeData(
          _.map(initialTreeData, (item: any) => {
            if (item.key === 'payment_process') {
              return {
                key: 'payment_process',
                title: '固定资产',
                children: newPaymentProcessRecordData,
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

  // const approveCancel = async (id: number) => {
  //   await runDeletePaymentDocumentItem(id);
  //   await runGetPaymentProcessRecordList(selectedDepartment);
  //   message.success('已驳回');
  //   setPaybackOpen(false);
  //   actionRef.current?.reload();
  // };

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
      title: '制单状态',
      dataIndex: 'status',
      valueEnum: {
        finance_audit: { text: '待财务科审核', status: 'Processing' },
        dean_audit: { text: '待分管院长审核', status: 'Processing' },
        finance_dean_audit: { text: '待财务院长审核', status: 'Processing' },
        upload: { text: '待上传', status: 'Processing' },
        finish: { text: '通过', status: 'Success' },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, record, _, action) => {
        let update;
        if (record.status === 'finance_audit') {
          update = (
            <a
              onClick={() => {
                window.open(
                  `/#/purchase/paymentDocument/detail#finance_audit&${record.id}`,
                  '_blank',
                );
              }}
            >
              待财务科审核
            </a>
          );
        } else if (record.status === 'dean_audit') {
          update = (
            <a
              onClick={() => {
                window.open(
                  `/#/purchase/paymentDocument/detail#dean_audit&${record.id}`,
                  '_blank',
                );
              }}
            >
              待分管院长审核
            </a>
          );
        } else if (record.status === 'finance_dean_audit') {
          update = (
            <a
              onClick={() => {
                window.open(
                  `/#/purchase/paymentDocument/detail#finance_dean_audit&${record.id}`,
                  '_blank',
                );
              }}
            >
              待财务院长审核
            </a>
          );
        } else if (record.status === 'upload') {
          update = (
            <a
              onClick={() => {
                window.open(
                  `/#/purchase/paymentDocument/detail#upload&${record.id}`,
                  '_blank',
                );
              }}
            >
              待上传
            </a>
          );
        } else if (record.status === 'finish') {
          update = (
            <a
              onClick={() => {
                window.open(
                  `/#/purchase/paymentDocument/detail#finish&${record.id}`,
                  '_blank',
                );
              }}
            >
              已通过
            </a>
          );
        }
        return (
          <>
            {update}
            <Divider type="vertical" />
            <a
              onClick={async () => {
                if (!access.canDeletePaymentDocument) {
                  message.error('你没有权限进行此操作');
                } else {
                  const id = record.id;
                  await runDeletePaymentDocumentItem(id);
                  await runGetPaymentProcessRecordList(selectedDepartment);
                  action?.reload();
                }
              }}
            >
              删除
            </a>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    actionRef.current?.reload();
  }, [filter]);

  useEffect(() => {
    runGetPaymentProcessRecordList(selectedDepartment);
  }, [selectedDepartment]);

  return (
    <PageContainer
      header={{
        title: '制单管理',
      }}
    >
      <ProTable
        columns={columns}
        cardBordered
        actionRef={actionRef}
        // @ts-ignore
        request={getPaymentDocumentList}
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
        headerTitle="制单管理"
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
              <ProFormText name="id" label="制单编号" />
              <ProFormSelect
                name="status"
                label="状态"
                valueEnum={{
                  finance_audit: { text: '待财务科审核', status: 'Processing' },
                  dean_audit: { text: '待分管院长审核', status: 'Processing' },
                  finance_dean_audit: {
                    text: '待财务院长审核',
                    status: 'Processing',
                  },
                  upload: { text: '待上传', status: 'Processing' },
                  finish: { text: '通过', status: 'Success' },
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
            <div key="select" style={{ marginBottom: '-25px' }}>
              <ProFormSelect
                key="select"
                onChange={(value) => {
                  setSelectedDepartment(value);
                }}
                request={departments}
                fieldProps={{
                  showSearch: true,
                  filterOption: (input: any, option: any) =>
                    (option?.label ?? '').includes(input),
                }}
                name="department_id"
                label="选择科室"
              />
            </div>,
            <Access
              key="canCreatePaymentDocument"
              accessible={access.canCreatePaymentDocument}
            >
              <Button
                key="button"
                onClick={() => {
                  setTransferOpen(true);
                }}
                type="primary"
              >
                新建
              </Button>
            </Access>,
          ],
        }}
      />
      <PaymentDocumentTransferModal
        open={transferOpen}
        treeData={treeData}
        department={selectedDepartment}
        finish={async () => {
          setTransferOpen(false);
          await runGetPaymentProcessRecordList(selectedDepartment);
          actionRef.current?.reload();
        }}
        cancel={() => setTransferOpen(false)}
      />
    </PageContainer>
  );
};

export default PaymentDocumentPage;
