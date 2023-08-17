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
import { SERVER_HOST } from '@/constants';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';

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

const EquipmentPage: React.FC<unknown> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.EquipmentRecordInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.EquipmentRecordInfo[]>([]);
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
        3: { text: '合同', status: '3' },
        4: { text: '安装验收', status: '4' },
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
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              // handleUpdateModalVisible(true);
              // setStepFormValues(record);
            }}
          >
            配置
          </a>
          <Divider type="vertical" />
          <a href="">订阅警报</a>
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
        request={getEquipmentList}
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
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="设备申请记录列表"
        toolBarRender={() => [
          <Button
            key="button"
            // icon={<PlusOutlined />}
            onClick={() => {
              actionRef.current?.reload();
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
