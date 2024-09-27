import { SERVER_HOST } from '@/constants';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormRadio,
  ProFormSelect,
  ProTable,
} from '@ant-design/pro-components';
import { Access, useAccess, useRequest } from '@umijs/max';
import { Button, Tag, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import { useRef, useState } from 'react';

type LeaderInfo = {
  id: number;
  name: string;
};

const getUserList = async () => {
  return await axios.get(`${SERVER_HOST}/users/index?`);
};

const getLeaderList = async (params: any) => {
  const data = await axios({
    method: 'GET',
    params: {
      isPaginate: true,
    },
    url: `${SERVER_HOST}/leaders/index?page=${params.current}`,
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

const getAllDepartments = async () => {
  return await axios.get(`${SERVER_HOST}/department/index?is_functional=1`);
};

const deleteLeader = async (id: number) => {
  return await axios.delete(`${SERVER_HOST}/leaders/${id}`);
};

const createLeader = async (user_id: string, type: string) => {
  const form = new FormData();
  form.append('user_id', user_id);
  form.append('type', type);
  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/leaders`,
  });
};

const updateLeader = async (id: number, department_id?: string[]) => {
  const form = new FormData();
  const departmentString = department_id ? department_id.join('&') : '';
  form.append('department_id', departmentString);
  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/leaders/${id}`,
  });
};

const LeaderListPage: React.FC = () => {
  const access = useAccess();
  const createFormRef = useRef<ProFormInstance>();
  const updateFormRef = useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  const { run: runGetUserList } = useRequest(getUserList, {
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

  const { run: runCreateLeader } = useRequest(createLeader, {
    manual: true,
    onSuccess: () => {
      message.success('提交成功');
      setCreateModalVisible(false);
      actionRef.current?.reload();
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runUpdateLeader } = useRequest(updateLeader, {
    manual: true,
    onSuccess: () => {
      message.success('更新成功');
      setUpdateModalVisible(false);
      actionRef.current?.reload();
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runDeleteLeader } = useRequest(deleteLeader, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
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

  const users = async () => {
    const usersData = await runGetUserList();
    const filteredUsersData = _.filter(
      usersData.data,
      (value: any) => !value.leader_id,
    );
    const data = _.map(filteredUsersData, (value: any) => {
      return {
        value: value.id,
        label: value.name,
      };
    });
    return data;
  };

  const columns: ProColumns<LeaderInfo>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'name',
      title: '用户名',
    },
    {
      dataIndex: 'type',
      title: '职位',
      valueEnum: {
        chief_leader: { text: '科长' },
        leader: { text: '院长' },
      },
    },
    {
      dataIndex: 'departments',
      title: '分配科室',
      render: (text, record: any) => {
        const departments = record.departments
          .split('&')
          .filter((department: any) => department);
        const departmentTags = _.map(departments, (department: string) => {
          return <Tag>{department}</Tag>;
        });
        return <div>{departmentTags}</div>;
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a
          key="patch"
          onClick={() => {
            if (!access.canAddDepartmentToLeader) {
              message.error('你没有权限进行操作');
            } else {
              setUpdateModalVisible(true);
              setSelectedId(record.id);
            }
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={async () => {
            if (!access.canCreateLeader) {
              message.error('你没有权限进行操作');
            } else {
              await runDeleteLeader(record.id);
              await runGetUserList();
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
        title: '审批用户管理',
      }}
    >
      <ProTable
        search={false}
        columns={columns}
        cardBordered
        actionRef={actionRef}
        //@ts-ignore
        request={getLeaderList}
        rowKey="id"
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        pagination={{
          pageSize: 15,
        }}
        dateFormatter="string"
        toolBarRender={() => [
          <Access key="can_create_leader" accessible={access.canCreateLeader}>
            <Button
              key="button"
              onClick={() => {
                setCreateModalVisible(true);
              }}
              type="primary"
            >
              新建
            </Button>
          </Access>,
        ]}
      />
      {createModalVisible ? (
        <ModalForm
          title="新建工程师"
          formRef={createFormRef}
          open={createModalVisible}
          submitTimeout={2000}
          modalProps={{
            destroyOnClose: true,
            onCancel: () => setCreateModalVisible(false),
          }}
          onFinish={async (values: any) => {
            await runCreateLeader(values.user_id, values.type);
          }}
        >
          <ProFormSelect
            request={users}
            name="user_id"
            label="选择用户"
            rules={[{ required: true }]}
          />
          <ProFormRadio.Group
            name="type"
            label="职位"
            width="sm"
            valueEnum={{
              leader: { text: '院长' },
              chief_leader: { text: '科长' },
            }}
            rules={[{ required: true }]}
          />
        </ModalForm>
      ) : null}
      {updateModalVisible ? (
        <ModalForm
          title="分配科室"
          formRef={updateFormRef}
          open={updateModalVisible}
          submitTimeout={2000}
          modalProps={{
            destroyOnClose: true,
            onCancel: () => setUpdateModalVisible(false),
          }}
          onFinish={async (values: any) => {
            runUpdateLeader(selectedId, values.department_id);
          }}
        >
          <ProFormSelect
            mode="tags"
            request={departments}
            name="department_id"
            fieldProps={{
              showSearch: true,
              filterOption: (input: any, option: any) =>
                (option?.label ?? '').includes(input),
            }}
            label="选择科室"
          />
        </ModalForm>
      ) : null}
    </PageContainer>
  );
};

export default LeaderListPage;
