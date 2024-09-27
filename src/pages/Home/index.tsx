import NotificationTab from '@/components/NotificationTab';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Tabs, notification } from 'antd';

import React, { useEffect } from 'react';

const HomePage: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    api.info({
      message: '请修改账号',
      description: (
        <div style={{ display: 'flex' }}>
          为了你的账号安全，请立刻前往修改账号密码
          <Button
            onClick={() => {
              history.push('/information/resetPassword');
              localStorage.setItem('is_password_reset', 'true');
            }}
          >
            前往
          </Button>
        </div>
      ),
    });
  };
  useEffect(() => {
    if (localStorage.getItem('is_password_reset') !== 'true') {
      openNotification();
    }
  }, []);
  const items = [
    {
      label: '系统通知',
      key: '1',
      children: <NotificationTab />,
    },
  ];

  return (
    <PageContainer ghost>
      {contextHolder}
      <Tabs defaultActiveKey="1" items={items} />
    </PageContainer>
  );
};

export default HomePage;
