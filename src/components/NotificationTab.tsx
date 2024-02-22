import { SERVER_HOST } from '@/constants';
import { useModel, useRequest } from '@umijs/max';
import { Badge, Tabs, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import ApplyNotificationTab from './ApplyNotificationTab';
import PurchaseNotificationTab from './PurchaseNotificationTab';

const getNotificationsList = async (id?: string) => {
  if (!id) return [];
  return await axios({
    method: 'GET',
    url: `${SERVER_HOST}/notifications/index/${id}`,
  })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      message.error(err);
    });
};

const NotificationTab: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [notificationData, setNotificationData] = useState([]);
  const { run: runGetNotificationsList } = useRequest(getNotificationsList, {
    manual: true,
    onSuccess: (result: any) => {
      const notificaitons = _.map(result, (value: any) => {
        const data = JSON.parse(value.body);
        return {
          notification_id: value.id,
          title: value.title,
          data,
          link: value.link,
          permission: value.permission,
          category: value.category,
          n_category: value.n_category,
          type: value.type,
        };
      });
      setNotificationData(notificaitons);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const applyRecordData = _.filter(notificationData, ['category', 'apply']);

  const paymentMonitorData = _.filter(notificationData, [
    'category',
    'purchaseMonitor',
  ]);

  const items = [
    {
      label: <Badge count={applyRecordData.length}>设备申请列表</Badge>,
      key: '1',
      children: <ApplyNotificationTab data={applyRecordData} />,
    },
    {
      label: <Badge count={paymentMonitorData.length}>付款流程监控</Badge>,
      key: '2',
      children: <PurchaseNotificationTab data={paymentMonitorData} />,
    },
  ];

  useEffect(() => {
    runGetNotificationsList(initialState?.id);
  }, []);

  return <Tabs defaultActiveKey="1" items={items} />;
};

export default NotificationTab;
