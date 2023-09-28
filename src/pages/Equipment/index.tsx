import services from '@/services/demo';
//import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
  TableDropdown
} from '@ant-design/pro-components';
import { Button, Divider, Dropdown, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useRequest } from '@umijs/max';
import { SERVER_HOST } from '@/constants';
import { useModel, history } from '@umijs/max';

// const { addUser, queryUserList, deleteUser, modifyUser } =
//   services.UserController;

// /**
//  * 添加节点
//  * @param fields
//  */
// const handleAdd = async (fields: API.EquipmentRecordInfo) => {
//   const hide = message.loading('正在添加');
//   try {
//     await addUser({ ...fields });
//     hide();
//     message.success('添加成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('添加失败请重试！');
//     return false;
//   }
// };

// /**
//  * 更新节点
//  * @param fields
//  */
// const handleUpdate = async (fields: FormValueType) => {
//   const hide = message.loading('正在配置');
//   try {
//     await modifyUser(
//       {
//         userId: fields.id || '',
//       },
//       {
//         name: fields.name || '',
//         nickName: fields.nickName || '',
//         email: fields.email || '',
//       },
//     );
//     hide();

//     message.success('配置成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('配置失败请重试！');
//     return false;
//   }
// };

// /**
//  *  删除节点
//  * @param selectedRows
//  */
// const handleRemove = async (selectedRows: API.EquipmentRecordInfo[]) => {
//   const hide = message.loading('正在删除');
//   if (!selectedRows) return true;
//   try {
//     await deleteUser({
//       userId: selectedRows.find((row) => row.id)?.id || '',
//     });
//     hide();
//     message.success('删除成功，即将刷新');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('删除失败，请重试');
//     return false;
//   }
// };

const getEquipmentList = async () => {
  return await axios.get(`${SERVER_HOST}/equipment/index`);
}

const deleteEquipmentItem = async (id?: number) => {
  return await axios.delete(`${SERVER_HOST}/equipment/delete/${id}`);
}

const backEquipmentItem = async (id?: number) => {
  return await axios.patch(`${SERVER_HOST}/equipment/back/${id}`);
}

const EquipmentPage: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.EquipmentRecordInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.EquipmentRecordInfo[]>([]);
  const { equipmentList, setEquipmentList } = useModel('equipmentRecordList');
  const { run : runGetEquipmentList } = useRequest(getEquipmentList,{
    manual: true,
    onSuccess: (result, params) => {
      if(result){
        setEquipmentList(result.data);
      } else {
        message.error('错误');
      }
    },
    onError: (error) => {
      message.error(error.message);
    },
  })
  const { run : runDeleteEquipmentItem } = useRequest(deleteEquipmentItem,{
    manual: true,
    onSuccess: (result, params) => {
      message.success('删除成功');
    },
    onError: (error) => {
      message.error(error.message);
    },
  })
  const { run : runBackEquipmentItem } = useRequest(backEquipmentItem,{
    manual: true,
    onSuccess: (result, params) => {
      message.success('回退成功');
    },
    onError: (error) => {
      message.error(error.message);
    },
  })
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
      // hideInForm: true,
      valueEnum: {
        0: { text: '申请', status: '0' },
        1: { text: '调研', status: '1' },
        2: { text: '政府审批', status: '2' },
        3: { text: '投标', status: '3'},
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
        rowKey='serial_number'
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          }
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
          </Button>
        ]}
      />
    </PageContainer>
  );
};

export default EquipmentPage;
