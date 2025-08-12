import { CheckCircleFilled } from '@ant-design/icons';
import { Card, Typography, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER_HOST } from '@/constants';
import _ from 'lodash';

interface ApprovalCardProps {
    approveModel: string;
    approveStatus: string;
    approveModelId: string;
    otherInformation?: any;
}

const getApprovalInformation = async (
    approveModel: string,
    approveStatus: string,
    approveModelId: string,
) => {
    return await axios({
        method: 'GET',
        params: {
            'approve_model': approveModel,
            'approve_status': approveStatus,
            'approve_model_id': approveModelId,
        },
        url: `${SERVER_HOST}/approval/record/getItem`,
    })
}

const ApprovalCard : React.FC<ApprovalCardProps> = (props) => {
    const [approvalInformation, setApprovalInformation] = useState<any>(null);
    useEffect(() => {
        getApprovalInformation(props.approveModel, props.approveStatus, props.approveModelId)
            .then((res) => {
                console.log(res.data);
                setApprovalInformation(res.data.data);
            })
    },[props.approveModel, props.approveStatus, props.approveModelId]);
    const texts = _.map(props.otherInformation, (item: any) => (
        <Typography.Text strong>{item.title}：{item.value}</Typography.Text>
    ))
    return (
        <Card 
        style={{ 
            minWidth: 600,
            minHeight: 400,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}
        >
        <Space direction="vertical" align="center" size="large">
            {/* 通过图标 */}
            <CheckCircleFilled 
                style={{ 
                    fontSize: 64,
                    color: '#52c41a' 
                }} 
            />
            
            {/* 审批结果标题 */}
            <Typography.Title level={3}>审核通过</Typography.Title>
            
            {/* 审批信息 */}
            <Space direction="vertical" align="center" size="small">
                {
                    texts.length > 0 ?
                    texts:
                    null
                }
                <Typography.Text strong>审批人：{_.get(approvalInformation, "user_name", "未知")}</Typography.Text>
                <Typography.Text type="secondary">
                    审核时间：{_.get(approvalInformation,"approve_date", "未知")}
                </Typography.Text>
            </Space>
        </Space>
        </Card>
    );
};

export default ApprovalCard