import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { Badge, Button, message } from 'antd';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { history, useModel, useRequest } from '@umijs/max';
import axios from 'axios';
import { SERVER_HOST } from '@/constants';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';

const getNotificationsList = async (id?: string) => {
  return await axios({
    method: 'GET',
    url: `${SERVER_HOST}/notifications/index/${id}`
  }).then((response) => {
    return response.data;
  }).catch((err) => {
    message.error(err);
  });
}

const NotificationCard: React.FC = (props: any) => {
  if (!props.data) return (<div></div>);
  const listTitleMap = new Map([
    ["can_audit_payment_record", "待审核"],
    ["can_process_payment_record", "待收款"],
    ["can_apply_payment_record", "待申请"],
  ]);
  const procardlists = _.map(props.data, (value: any, key: any) => {
    const procardlist = _.map(value, (v: any, k: any) => {
      let assessmentVisible = true;
      if(!listTitleMap.has(key)) assessmentVisible = false;
      return (<ProCard 
        key={k}
        title={<span>{v.title}<span>的{v.data.category}</span>{assessmentVisible ? <span>{v.data.assessment}元</span> : null }</span>}
        extra={<Button size='small' type="primary" onClick={()=>history.push(v.link, v.data)}>去处理</Button>}>
      </ProCard>);
    });
    return (<ProCard 
        layout='center'
        direction='column' 
        title={<div style={{display: 'inline-block'}}>
          {listTitleMap.has(key) ? listTitleMap.get(key) : "待设置下次时间"}
          <Badge count={procardlist.length} title={'还有' + procardlist.length + '条任务等待处理'} />
        </div>}
        ghost
        key={key}
        gutter={8}
        collapsible
        bordered
      >
        {procardlist}
    </ProCard>)
  })
  return (<>
      {procardlists}
  </>)
}

const HomePage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { userToken } = useModel('userToken');
  const [notificationData, setNotificationData] = useState([]);
  const { run : runGetNotificationsList } = useRequest(getNotificationsList, {
    manual: true,
    onSuccess: (result: any, params: any) => {
      const notificaitons = _.map(result, (value: any, key: any)=>{
        const data =  JSON.parse(value.body);
        return {
          notification_id : value.id,
          title: value.title,
          data,
          link: value.link,
          permission: value.permission,
        };
      });
      const group_notificaitons = _.groupBy(notificaitons,  'permission');
      setNotificationData(group_notificaitons);
    },
    onError: (error: any) => {
      message.error(error.message);
    }
  });
  useEffect(()=>{
    runGetNotificationsList(initialState?.id);
  },[]);
  return (
    <PageContainer ghost>
      <NotificationCard data={notificationData} />
    </PageContainer>
  );
};

export default HomePage;
