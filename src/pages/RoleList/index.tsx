import PermissionTransferModal from '@/components/PermissionTransferModal';
import { SERVER_HOST } from '@/constants';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Button, Card, Col, Input, Modal, Row, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';

interface RoleCardProps {
  role: string;
  permissions: any;
  allPermissions: any;
  handleUpdate: any;
}

const getAllRoles = async () => {
  return await axios({
    method: 'GET',
    url: `${SERVER_HOST}/allRoles`,
  });
};

const getAllPermissions = async () => {
  return await axios({
    method: 'GET',
    url: `${SERVER_HOST}/allPermissions`,
  });
};

const updateRole = async (role_name: string, permissions: string[]) => {
  return await axios({
    method: 'POST',
    data: {
      role_name,
      permissions,
    },
    url: `${SERVER_HOST}/updateRole`,
  });
};

const createRole = async (name: string) => {
  return await axios({
    method: 'POST',
    data: {
      name,
    },
    url: `${SERVER_HOST}/createRole`,
  });
};

const RoleCard: React.FC<RoleCardProps> = (props: any) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const content = _.map(props.permissions, (data: any) => <p>{data.name}</p>);
  const permissions = _.map(props.permissions, (item: any) => {
    return {
      key: item.id,
      title: item.name,
      description: item.name,
    };
  });
  const restPermissions = _.xorBy(permissions, props.allPermissions, 'id');

  return (
    <Col span={8}>
      <Card
        title={props.role}
        extra={
          <div>
            <Button type="link" onClick={() => setModalVisible(true)}>
              编辑
            </Button>
            {visible ? (
              <UpOutlined onClick={() => setVisible(false)} />
            ) : (
              <DownOutlined onClick={() => setVisible(true)} />
            )}
          </div>
        }
      >
        {visible ? content : '...'}
        <PermissionTransferModal
          restPermissions={restPermissions}
          allPermissions={props.allPermissions}
          selectedPermissions={permissions}
          visible={modalVisible}
          onLeave={() => setModalVisible(false)}
          handleUpdate={props.handleUpdate}
        />
      </Card>
    </Col>
  );
};

const RoleListPage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [roleName, setRoleName] = useState('');

  const { run: runGetAllRoles } = useRequest(getAllRoles, {
    manual: true,
    onSuccess: (data: any) => {
      setRoles(data);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runGetAllPermissions } = useRequest(getAllPermissions, {
    manual: true,
    onSuccess: (data: any) => {
      const processedData = _.map(data, (item: any) => {
        return {
          key: item.id,
          title: item.name,
          description: item.name,
        };
      });
      setPermissions(processedData);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runUpdateRole } = useRequest(updateRole, {
    manual: true,
    onSuccess: () => {
      message.success('更新成功');
      runGetAllRoles();
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runCreateRole } = useRequest(createRole, {
    manual: true,
    onSuccess: () => {
      message.success('增加新角色成功');
      runGetAllRoles();
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const onOk = async () => {
    if (!roleName) {
      message.error('角色名字不能为空');
      return;
    }
    if (
      roleName &&
      _.find(roles, (item: any) => {
        return item.role === roleName;
      })
    ) {
      message.error('角色名字不能重复');
      return;
    }
    await runCreateRole(roleName);
    setModalVisible(false);
  };

  useEffect(() => {
    runGetAllRoles();
    runGetAllPermissions();
  }, []);

  return (
    <PageContainer
      ghost
      header={{
        title: '动态权限管理',
      }}
    >
      <Row gutter={24} style={{ marginBottom: '40px' }}>
        <Col span={18} />
        <Col span={6}>
          {' '}
          <Button onClick={() => setModalVisible(true)} type="primary">
            创建新角色
          </Button>{' '}
        </Col>
      </Row>
      <Row gutter={24}>
        {_.map(roles, (data: any) => {
          return (
            <RoleCard
              role={data.role}
              permissions={data.permissions}
              allPermissions={permissions}
              handleUpdate={async (permissions: string[]) => {
                await runUpdateRole(data.role, permissions);
              }}
            />
          );
        })}
      </Row>
      <Modal
        title="创建新角色"
        open={modalVisible}
        onOk={onOk}
        onCancel={() => setModalVisible(false)}
      >
        <Row>
          <Input
            addonBefore="角色名称"
            value={roleName}
            onChange={(e) => {
              setRoleName(e.target.value);
            }}
          />
        </Row>
        <Row>
          {roleName &&
          _.find(roles, (item: any) => {
            return item.role === roleName;
          }) ? (
            <span style={{ color: 'red' }}>
              当前角色名称与现有名称重复，请修改!
            </span>
          ) : null}
        </Row>
      </Modal>
    </PageContainer>
  );
};

export default RoleListPage;
