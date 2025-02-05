import ContractModal from '@/components/ContractModal';
import { SERVER_HOST } from '@/constants';
import {
  ActionType,
  LightFilter,
  PageContainer,
  ProDescriptionsItemProps,
  ProFormCheckbox,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';

const ContractPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [data, setData] = useState<any>([]);
  const [filter, setFilter] = useState<any>({});
  const { initialState } = useModel('@@initialState');
  const [isChange, setIsChange] = useState<boolean>(false);
  const [equipmentApplyRecordData, setEquipmentApplyRecordData] = useState([]);

  const getEquipmentList = async () => {
    await axios({
      method: 'GET',
      url: `${SERVER_HOST}/equipment/index`,
    })
      .then((result) => {
        setEquipmentApplyRecordData(result.data.data);
      })
      .catch((err) => {
        message.error(err);
      });
  };

  const getContractList = async (params: any) => {
    const pageCurrent = isChange ? 1 : params.current;
    const data = await axios({
      method: 'GET',
      params: {
        ...filter,
        isPaginate: true,
        user_id: initialState.id,
      },
      url: `${SERVER_HOST}/payment/contracts/index?page=${pageCurrent}`,
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

  const equipmentApplyRecordcolumns: ProDescriptionsItemProps[] = [
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
      render: (text, record) => {
        const statusArray = [
          '申请',
          '调研',
          '政府审批',
          '投标',
          '合同',
          '安装验收',
          '医工科审核',
          '入库',
          '完成',
        ];
        if (record.is_stop === 'true') return '已终止';
        else return statusArray[parseInt(record.status)];
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
      render: (text, record) => (
        <>
          <a
            onClick={() => {
              const id = record.id;
              window.open(`/#/apply/equipment/detail#update&${id}`, '_blank');
            }}
          >
            {record.is_stop === 'true' ? '已终止' : '录入'}
          </a>
        </>
      ),
    },
  ];

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
      title: '签订对象',
      dataIndex: 'contractor',
    },
    {
      title: '类型',
      dataIndex: 'category',
      valueEnum: {
        JJ: { text: '基建项目' },
        YP: { text: '药品采购' },
        XX: { text: '信息采购' },
        XS: { text: '医疗协商' },
        HZ: { text: '医疗合作' },
        ZW: { text: '物资采购' },
        FW: { text: '服务项目' },
        QX: { text: '器械采购' },
        JJXM: { text: '基建项目' },
        YPCG: { text: '药品采购' },
        XXCG: { text: '信息采购' },
        QXCG: { text: '器械采购' },
        QRHZ: { text: '金融合作' },
        WZCG: { text: '物资采购' },
        YLHZ: { text: '医疗合作' },
        YLXS: { text: '医疗协商' },
        DSFFW: { text: '第三方服务' },
        QT: { text: '其他' },
      },
    },
    {
      title: '采购方式',
      dataIndex: 'purchase_type',
      valueEnum: {
        GKZB: { text: '公开招标' },
        DYLYCG: { text: '单一来源采购' },
        JZXCS: { text: '竞争性磋商' },
        YQZB: { text: '邀请招标' },
        XQ: { text: '续签' },
        JZXTP: { text: '竞争性谈判' },
        ZFZB: { text: '政府招标采购目录内服务商' },
        XJ: { text: '询价' },
        QT: { text: '其他' },
      },
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
      title: '创建日期',
      dataIndex: 'created_at',
      render: (_, record) => {
        const date = new Date(record.created_at);
        return (
          <span>{`${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()}`}</span>
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'comment',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, record) => {
        let update;
        if (record.status === 'approve') {
          update = (
            <a
              onClick={() => {
                window.open(
                  `/#/purchase/contract/detail#${record.id}`,
                  '_blank',
                );
              }}
            >
              待审核
            </a>
          );
        } else if (record.status === 'upload') {
          update = (
            <a
              onClick={() => {
                window.open(
                  `/#/purchase/contract/detail#${record.id}`,
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
                  `/#/purchase/contract/detail#${record.id}`,
                  '_blank',
                );
              }}
            >
              查看详情
            </a>
          );
        }
        return <>{update}</>;
      },
    },
  ];

  useEffect(() => {
    actionRef.current?.reload();
    getEquipmentList();
  }, [filter]);

  const expandedRowRender = (record) => {
    const filteredData = equipmentApplyRecordData.filter(
      (value: any) => value.contract_id === record.id,
    );
    return (
      <ProTable
        columns={equipmentApplyRecordcolumns}
        headerTitle={false}
        search={false}
        options={false}
        dataSource={filteredData}
        pagination={false}
      />
    );
  };

  // const expandedRowRender = () => {
  //   const data = [];
  //   for (let i = 0; i < 3; i += 1) {
  //     data.push({
  //       key: i,
  //       date: '2014-12-24 23:12:00',
  //       name: 'This is production name',
  //       upgradeNum: 'Upgraded: 56',
  //     });
  //   }
  //   return (
  //     <ProTable
  //       columns={[
  //         { title: 'Date', dataIndex: 'date', key: 'date' },
  //         { title: 'Name', dataIndex: 'name', key: 'name' },

  //         { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
  //         {
  //           title: 'Action',
  //           dataIndex: 'operation',
  //           key: 'operation',
  //           valueType: 'option',
  //           render: () => [<a key="Pause">Pause</a>, <a key="Stop">Stop</a>],
  //         },
  //       ]}
  //       headerTitle={false}
  //       search={false}
  //       options={false}
  //       dataSource={data}
  //       pagination={false}
  //     />
  //   );
  // };

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
        //@ts-ignore
        request={getContractList}
        rowKey="series_number"
        search={false}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        pagination={{
          pageSize: 15,
        }}
        expandable={{ expandedRowRender }}
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
                  status: value.status
                    ? value.status === 'all'
                      ? null
                      : value.status
                    : filter.status,
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
                  department_source: value.department_source
                    ? value.department_source === 'all'
                      ? null
                      : value.department_source
                    : filter.department_source,
                  isImportant: !_.isUndefined(value.isImportant)
                    ? value.isImportant
                      ? 'true'
                      : 'false'
                    : filter.isImportant,
                  created_at: _.isUndefined(value.created_at)
                    ? filter.created_at
                    : value.created_at,
                });
                setIsChange(true);
              }}
            >
              <ProFormText name="contract_name" label="合同名称" />
              <ProFormText name="series_number" label="合同编号" />
              <ProFormSelect
                label="状态"
                name="status"
                width="md"
                valueEnum={{
                  approve: { text: '待审核' },
                  upload: { text: '待上传' },
                  finish: { text: '已完成' },
                  all: { text: '全部' },
                }}
              />
              <ProFormSelect
                label="类型"
                name="category"
                width="md"
                valueEnum={{
                  JJXM: { text: '基建项目' },
                  YPCG: { text: '药品采购' },
                  XXCG: { text: '信息采购' },
                  QXCG: { text: '器械采购' },
                  QRHZ: { text: '金融合作' },
                  WZCG: { text: '物资采购' },
                  YLHZ: { text: '医疗合作' },
                  YLXS: { text: '医疗协商' },
                  DSFFW: { text: '第三方服务' },
                  QT: { text: '其他' },
                  all: { text: '全部' },
                }}
              />
              <ProFormSelect
                label="归口选择"
                name="department_source"
                width="md"
                valueEnum={{
                  ZW: { text: '总务归口' },
                  YJ: { text: '药剂归口' },
                  XX: { text: '信息归口' },
                  YH: { text: '医患协商' },
                  CW: { text: '财务归口' },
                  YW: { text: '医务归口' },
                  CG: { text: '采购归口' },
                  YG: { text: '医工归口' },
                  DZ: { text: '党政归口' },
                  RS: { text: '人事归口' },
                  KJ: { text: '科教归口' },
                  HL: { text: '护理归口' },
                  BW: { text: '保卫归口' },
                  GW: { text: '公卫归口' },
                  TJ: { text: '体检归口' },
                  all: { text: '全部' },
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
              <ProFormDateRangePicker label="合同创建日期" name="created_at" />
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
