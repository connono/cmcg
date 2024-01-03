import NotificationTab from '@/components/NotificationTab';
import { PageContainer } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import React from 'react';

const HomePage: React.FC = () => {
  const items = [
    {
      label: '系统通知',
      key: '1',
      children: <NotificationTab />,
    },
  ];

  return (
    <PageContainer ghost>
      <Tabs defaultActiveKey="1" items={items} />
    </PageContainer>
  );
};

export default HomePage;
