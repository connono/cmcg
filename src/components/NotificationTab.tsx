import { SERVER_HOST } from '@/constants';
import { useModel, useRequest } from '@umijs/max';
import { Badge, Tabs, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import ApplyNotificationTab from './ApplyNotificationTab';
import ConsumableNotificationTab from './ConsumableNotificationTab';
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

const ignoreNotification = async (id: string) => {
  return await axios.get(`${SERVER_HOST}/notifications/ignore/${id}`);
};

const NotificationTab: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [notificationData, setNotificationData] = useState([]);
  const { run: runGetNotificationsList } = useRequest(getNotificationsList, {
    manual: true,
    onSuccess: (result: any) => {
      const notificaitions = _.map(result, (value: any) => {
        const data = JSON.parse(value.body);
        return {
          notification_id: value.id,
          user_id: value.user_id,
          title: value.title,
          data,
          link: value.link,
          permission: value.permission,
          category: value.category,
          n_category: value.n_category,
          type: value.type,
        };
      });
      setNotificationData(notificaitions);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runIgnoreNotification } = useRequest(ignoreNotification, {
    manual: true,
    onSuccess: () => {
      message.success('通知已忽略');
      runGetNotificationsList(initialState?.id);
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const applyRecordData = _.filter(notificationData, ['category', 'apply']);

  const paymentMonitorData = _.filter(notificationData, [
    'category',
    'purchaseMonitor',
  ]);

  const consumableData = _.filter(notificationData, ['category', 'consumable']);

  const items = [
    {
      label: <Badge count={applyRecordData.length}>设备申请列表</Badge>,
      key: '1',
      children: (
        <ApplyNotificationTab
          data={applyRecordData}
          ignore={runIgnoreNotification}
        />
      ),
    },
    {
      label: <Badge count={paymentMonitorData.length}>付款流程监控</Badge>,
      key: '2',
      children: (
        <PurchaseNotificationTab
          data={paymentMonitorData}
          ignore={runIgnoreNotification}
        />
      ),
    },
    {
      label: <Badge count={consumableData.length}>耗材管理</Badge>,
      key: '3',
      children: (
        <ConsumableNotificationTab
          data={consumableData}
          ignore={runIgnoreNotification}
        />
      ),
    },
  ];

  useEffect(() => {
    runGetNotificationsList(initialState?.id);
  }, []);

  return <Tabs defaultActiveKey="1" items={items} />;
};

export default NotificationTab;
