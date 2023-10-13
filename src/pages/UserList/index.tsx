import { SERVER_HOST } from '@/constants';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Access, useAccess, useRequest } from '@umijs/max';
import { Button, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import { useRef, useState } from 'react';

enum MODE {
  CREATE,
  UPDATE,
}

type UserInfo = {
  id: number;
  name: string;
  phone_number: number;
  department: string;
};

export const departmentData = [
  {
    value: 'bf013',
    label: '外一科',
  },
  {
    value: 'bf012',
    label: '外二科',
  },
  {
    value: 'bf010',
    label: '骨二科',
  },
  {
    value: 'bf006',
    label: 'ICU病区',
  },
];

const getUserList = async () => {
  return await axios.get(`${SERVER_HOST}/users/index`);
};

const getAllRoles = async () => {
  return await axios.get(`${SERVER_HOST}/allRoles`);
};

const getAllDepartments = async () => {
  return await axios.get(`${SERVER_HOST}/department/index`);
};

const deleteUser = async (id: number) => {
  return await axios.delete(`${SERVER_HOST}/users/${id}`);
};

const createUser = async (
  name: string,
  phone_number: number,
  department: string,
  roles: string[],
) => {
  return await axios({
    method: 'POST',
    data: {
      name,
      department,
      phone_number,
      roles,
    },
    url: `${SERVER_HOST}/users`,
  });
};

const updateUser = async (
  id: number,
  phone_number: number,
  department: string,
  roles: string[],
) => {
  return await axios({
    method: 'PATCH',
    data: {
      phone_number,
      department,
      roles,
    },
    url: `${SERVER_HOST}/users/${id}`,
  });
};

const initialPassword = async (id: number) => {
  return await axios({
    method: 'PATCH',
    data: {
      password: '123456',
    },
    url: `${SERVER_HOST}/users/reset/${id}`,
  });
};

const UserListPage: React.FC = () => {
  const access = useAccess();
  const formRef = useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [mode, setMode] = useState<MODE>(MODE.CREATE);
  const [selectedId, setSelectedId] = useState<number>(0);

  const { run: runGetUserList } = useRequest(getUserList, {
    manual: true,
    onSuccess: (result: any) => {
      console.log('result:', result);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runGetAllRoles } = useRequest(getAllRoles, {
    manual: true,
    onSuccess: () => {},
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runGetAllDepartments } = useRequest(getAllDepartments, {
    manual: true,
    onSuccess: () => {},
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runCreateUser } = useRequest(createUser, {
    manual: true,
    onSuccess: () => {
      message.success('提交成功');
      setModalVisible(false);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runUpdateUser } = useRequest(updateUser, {
    manual: true,
    onSuccess: () => {
      message.success('提交成功');
      setModalVisible(false);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runDeleteUser } = useRequest(deleteUser, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runInitialPassword } = useRequest(initialPassword, {
    manual: true,
    onSuccess: () => {
      message.success('重置密码成功');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const roles = async () => {
    const rolesData = await runGetAllRoles();
    const data = _.map(rolesData, (value: any) => {
      return {
        value: value,
        label: value,
      };
    });
    return data;
  };

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

  const columns: ProColumns<UserInfo>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'name',
      title: '用户名',
    },
    {
      dataIndex: 'department',
      title: '所属科室',
    },
    {
      dataIndex: 'phone_number',
      title: '手机号码',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a
          key="patch"
          onClick={() => {
            if (!access.canUpdateUser) {
              message.error('你没有权限进行操作');
            } else {
              setSelectedId(record.id);
              setMode(MODE.UPDATE);
              setModalVisible(true);
              setTimeout(() => {
                formRef.current?.setFieldsValue(record);
              }, 1000);
            }
          }}
        >
          编辑
        </a>,
        <a
          key="password_reset"
          onClick={async () => {
            if (!access.canUpdateUser) {
              message.error('你没有权限进行操作');
            } else {
              await runInitialPassword(record.id);
              action?.reload();
            }
          }}
        >
          密码重置
        </a>,
        <a
          key="delete"
          onClick={async () => {
            if (!access.canUpdateUser) {
              message.error('你没有权限进行操作');
            } else {
              await runDeleteUser(record.id);
              action?.reload();
            }
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <PageContainer
      ghost
      header={{
        title: '用户列表管理',
      }}
    >
      <ProTable<UserInfo>
        columns={columns}
        cardBordered
        actionRef={actionRef}
        request={runGetUserList}
        rowKey="id"
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
        toolBarRender={(action) => [
          <Access key="can_create_user" accessible={access.canCreateUser}>
            <Button
              key="button"
              onClick={() => {
                setModalVisible(true);
                setMode(MODE.CREATE);
                action?.reload();
              }}
              type="primary"
            >
              新建
            </Button>
          </Access>,
        ]}
      />
      <ModalForm<{
        name: string;
        company: string;
      }>
        title={mode === MODE.CREATE ? '新建用户' : '更新用户'}
        formRef={formRef}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => setModalVisible(false),
        }}
        open={modalVisible}
        submitTimeout={2000}
        onFinish={async (values: any) => {
          if (mode === MODE.CREATE) {
            await runCreateUser(
              values.name,
              values.phone_number,
              values.department,
              values.roles,
            );
          } else {
            await runUpdateUser(
              selectedId,
              values.phone_number,
              values.department,
              values.roles,
            );
          }
          actionRef.current?.reload();
        }}
      >
        <ProFormText
          width="md"
          name="name"
          label="用户名称"
          placeholder="请输入用户名称"
          rules={[{ required: true }]}
        />

        <ProFormDigit
          width="md"
          name="phone_number"
          label="手机号码"
          placeholder="请输入手机号码"
          rules={[{ required: true }]}
        />
        <ProFormSelect
          label="所属科室"
          name="department"
          request={departments}
          rules={[{ required: true }]}
        />
        <ProFormSelect
          request={roles}
          mode="multiple"
          allowClear
          name="roles"
          label="权限设置"
          rules={[{ required: true }]}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default UserListPage;
