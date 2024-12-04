import { SERVER_HOST } from '@/constants';
import { UploadOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Upload, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import { useRef, useState } from 'react';

const clearDatabase = async () => {
  return axios.delete('http://10.10.0.27:3300/clearDatabase');
};

const uploadXlsx = async (options: any) => {
  const form = new FormData();
  form.append('file', options.file);
  return await axios({
    method: 'POST',
    data: form,
    url: 'http://10.10.0.27:3300/storeXlsx',
  });
};

const ConsumableNetPage: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const [isASC, setIsASC] = useState<any>();

  const getConsumableNetList = async (params: any) => {
    const data = await axios({
      method: 'GET',
      params: {
        isPaginate: true,
        isASC,
        ...params,
      },
      url: `${SERVER_HOST}/consumable/net/index?page=${params.current}`,
    })
      .then((result) => {
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

  const handleClick = () => {
    if (_.isUndefined(isASC)) setIsASC(true);
    else if (isASC === true) setIsASC(false);
    else if (isASC === false) setIsASC(true);
    actionRef.current?.reload();
  };

  const columns: ProColumns[] = [
    {
      dataIndex: 'consumable_net_id',
      title: '挂网结果id',
      align: 'center',
      ellipsis: true,
      search: false,
      width: 100,
    },
    {
      dataIndex: 'category',
      title: '分类',
      width: 100,
      align: 'center',
      ellipsis: true,
    },
    {
      dataIndex: 'parent_directory',
      title: '一级目录',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      dataIndex: 'child_directory',
      title: '二级目录',
      width: 100,
      align: 'center',
      ellipsis: true,
    },
    {
      dataIndex: 'product_id',
      title: '产品id',
      width: 100,
      align: 'center',
      ellipsis: true,
    },
    {
      dataIndex: 'consumable',
      title: '产品名称',
      width: 300,
      align: 'center',
      ellipsis: true,
    },
    {
      dataIndex: 'registration_num',
      title: '注册证号',
      width: 100,
      align: 'center',
      ellipsis: true,
    },
    {
      dataIndex: 'registration_name',
      title: '注册证名称',
      align: 'center',
      search: false,
      width: 100,
      ellipsis: true,
    },
    {
      dataIndex: 'registration_date',
      title: '注册证有效期',
      align: 'center',
      search: false,
      width: 100,
      ellipsis: true,
      render: (text, record) => {
        const date = new Date(record.registration_date);
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      },
    },
    {
      dataIndex: 'consumable_encoding',
      title: '国家27位编码',
      width: 100,
      search: false,
      align: 'center',
      ellipsis: true,
    },
    {
      dataIndex: 'specification',
      title: '规格',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      dataIndex: 'model',
      title: '型号',
      width: 100,
      align: 'center',
      ellipsis: true,
    },
    {
      dataIndex: 'units',
      title: '单位',
      search: false,
      width: 100,
      align: 'center',
      ellipsis: true,
    },
    {
      dataIndex: 'manufacturer',
      title: '生产企业',
      width: 100,
      align: 'center',
      ellipsis: true,
    },
    {
      dataIndex: 'company',
      title: '投标企业',
      align: 'center',
      search: false,
      width: 100,
      ellipsis: true,
    },
    {
      dataIndex: 'company_encoding',
      title: '投标企业社会信用编码',
      ellipsis: true,
      search: false,
      align: 'center',
      width: 100,
    },
    {
      dataIndex: 'price',
      title: <div onClick={handleClick}> 中选价 </div>,
      ellipsis: true,
      search: false,
      align: 'center',
      width: 100,
    },
    {
      dataIndex: 'tempory_price',
      title: '限价',
      search: false,
      ellipsis: true,
      align: 'center',
      width: 100,
    },
    {
      dataIndex: 'source_name',
      title: '来源名称',
      ellipsis: true,
      search: false,
      align: 'center',
      width: 100,
    },
    {
      dataIndex: 'product_remark',
      title: '产品备注',
      ellipsis: true,
      search: false,
      align: 'center',
      width: 100,
    },
    {
      dataIndex: 'net_date',
      title: '挂网时间',
      search: false,
      align: 'center',
      render: (text, record) => {
        if (record.net_date === '') return '';
        const date = new Date(record.net_date);
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      },
      ellipsis: true,
      width: 100,
    },
    {
      dataIndex: 'purchase_category',
      title: '采购类别',
      ellipsis: true,
      width: 100,
      valueEnum: {
        中标产品: { text: '中标产品' },
        阳光采购: { text: '阳光采购' },
        自行采购: { text: '自行采购' },
        带量采购非中选: { text: '带量采购非中选' },
        竞价挂网: { text: '竞价挂网' },
        国家带量采购限价: { text: '国家带量采购限价' },
        创新医疗器械: { text: '创新医疗器械' },
      },
      align: 'center',
    },
    {
      dataIndex: 'net_status',
      title: '挂网状态',
      ellipsis: true,
      width: 100,
      valueEnum: {
        未挂网: { text: '未挂网' },
        已挂网: { text: '已挂网' },
        停止执行: { text: '停止执行' },
        已撤废: { text: '已撤废' },
      },
      align: 'center',
    },
    {
      dataIndex: 'withdrawal_time',
      title: '撤废时间',
      width: 100,
      search: false,
      render: (text, record) => {
        if (record.withdrawal_time === '') return '';
        const date = new Date(record.withdrawal_time);
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      },
      align: 'center',
      ellipsis: true,
    },
  ];

  return (
    <PageContainer
      ghost
      header={{
        title: '耗材挂网目录查询',
      }}
    >
      <ProTable
        columns={columns}
        cardBordered
        actionRef={actionRef}
        request={getConsumableNetList}
        rowKey="id"
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        pagination={{
          pageSize: 50,
        }}
        scroll={{ x: 'content' }}
        dateFormatter="string"
        toolBarRender={() => [
          <Upload
            name="file"
            key="1"
            customRequest={async (options) => {
              await uploadXlsx(options);
            }}
          >
            <Button icon={<UploadOutlined />}>上传数据表</Button>
          </Upload>,
          <Button onClick={clearDatabase} key="clear">
            数据表清空
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default ConsumableNetPage;
