import { Typography, Space, Steps } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { SERVER_HOST } from '@/constants';
const { Step } = Steps


interface ApprovalListProps {
    approveModel: string;
    approveModelId: string;
    statusList: string[];
}

const getApprovalList = async (
    approveModel: string,
    approveModelId: string,
) => {
    return await axios({
        method: 'GET',
        params: {
            'approve_model': approveModel,
            'approve_model_id': approveModelId,
        },
        url: `${SERVER_HOST}/approval/record/getList`,
    })
}


const getStepStatus = (item: any) => {
  const status = _.get(item, "approve_status");
  if (status === "reject") return "error";
  // if (status === "approve") return "finish";
  return "wait";
};

const ApprovalList: React.FC<ApprovalListProps> = (props) => {
    const [approvalList, setApprovalList] = useState<any>([]);
    useEffect(() => {
        getApprovalList(props.approveModel, props.approveModelId)
            .then((res) => {
                console.log(res.data);
                setApprovalList(res.data.data);
            })
    },[props.approveModel, props.approveModelId]);
    return (
      <Steps direction="horizontal" current={approvalList.length}>
        {approvalList.map((item: any, index: number) => (
          <Step
            key={index}
            title={props.statusList[index] || `审批环节 ${index + 1}`}
            status={getStepStatus(item)}
            description={
              <Space direction="vertical" size={4}>
                <div>审批人：{_.get(item, "user_name", "待审批")}</div>
                <div>时间：{_.get(item, "approve_date", "-")}</div>
                {_.get(item, "reject_reason") && (
                  <Typography.Text type="danger">
                    驳回原因：{item.reject_reason}
                  </Typography.Text>
                )}
              </Space>
            }
          />
        ))}
      </Steps>
    )
};

export default ApprovalList;