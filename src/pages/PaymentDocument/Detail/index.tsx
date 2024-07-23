import { SERVER_HOST } from '@/constants';
import { branchXlsx } from '@/utils/xlsx';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  PageContainer,
  ProCard,
  ProFormRadio,
  StepsForm,
} from '@ant-design/pro-components';
import { history, useAccess, useRequest } from '@umijs/max';
import { Button, Steps, Table, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';

const int_status = (status: string) => {
  switch (status) {
    case 'finance_audit':
      return 0;
    case 'dean_audit':
      return 1;
    case 'finance_dean_audit':
      return 2;
    default:
      return -1;
  }
};

const getItem = async (id: string) => {
  return await axios.get(`${SERVER_HOST}/payment/document/records/item/${id}`);
};

const audit = async (record_id: string, position: number) => {
  const result = await axios({
    method: 'POST',
    url: `${SERVER_HOST}/payment/document/records/update/${record_id}`,
  });
  branchXlsx(result.data.excel_url, result.data.signature, position);
};

const PaymentDocumentDetailPage: React.FC = () => {
  console.log(history.location.state);
  // const [paymentRecord, setPaymentRecord] = useState({});
  const hashArray = history.location.hash.split('#')[1].split('&');
  const method = history.location.state.status;
  // const process_id = hashArray[1];
  const id = hashArray[1];
  // const [modal, contextHolder] = Modal.useModal(); // eslint-disable-line
  const formRef = useRef<ProFormInstance>();
  const [current, setCurrent] = useState<number>(0);
  const [dataSource, setDataSource] = useState<any>();
  const access = useAccess();

  const { run: runGetItem } = useRequest(getItem, {
    manual: true,
    onSuccess: (result: any) => {
      console.log(result);
      setDataSource(result.data);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runAudit } = useRequest(audit, {
    manual: true,
    onSuccess: () => {
      message.success('审批成功，正在返回列表...');
      history.push('/purchase/paymentDocument');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const onStepChange = (current: number) => {
    if (int_status(method) === -1) return;
    if (int_status(method) < current) return;
    setCurrent(current);
  };

  const columns = [
    {
      title: '应付款单位',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: '设备名称',
      dataIndex: 'equipment',
      key: 'equipment',
    },
    {
      title: '合同金额',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '款项',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '已支付情况',
      children: [
        {
          title: '支付时间',
          dataIndex: 'last_pay_date',
          key: 'last_pay_date',
        },
        {
          title: '支付金额',
          dataIndex: 'assessment_count',
          key: 'assessment_count',
        },
      ],
    },
    {
      title: '本期支付金额',
      dataIndex: 'assessment',
      key: 'assessment',
    },
    {
      title: '未支付金额',
      dataIndex: 'rest_money',
      key: 'rest_money',
    },
    {
      title: '本期合同支付条件',
      dataIndex: 'payment_terms_now',
      key: 'payment_terms_now',
    },
    {
      title: '合同支付条件',
      dataIndex: 'payment_terms',
      key: 'payment_terms',
    },
  ];

  useEffect(() => {
    if (id) {
      runGetItem(id);
    } else {
      history.push('/purchase/paymentProcess');
    }
  }, []);
  return (
    <PageContainer
      ghost
      header={{
        title: '制单管理',
      }}
    >
      <Table dataSource={dataSource} columns={columns} />
      <ProCard>
        <StepsForm<{
          name: string;
        }>
          formRef={formRef}
          formProps={{
            validateMessages: {
              required: '此项为必填项',
            },
          }}
          current={current}
          stepsRender={(steps) => {
            const items = _.map(steps, (value: any, key: any) => {
              const status =
                int_status(method) < key
                  ? 'wait'
                  : current === key
                  ? 'process'
                  : 'finish';
              return {
                ...value,
                status,
              };
            });
            return (
              <Steps
                type="navigation"
                current={current}
                items={items}
                onChange={onStepChange}
              />
            );
          }}
          submitter={{
            render: (props: any) => {
              return [
                <Button
                  disabled={int_status(method) > current}
                  htmlType="button"
                  type="primary"
                  onClick={props.onSubmit}
                  key="submit"
                >
                  提交
                </Button>,
              ];
            },
          }}
        >
          <StepsForm.StepForm<{
            name: string;
          }>
            name="1"
            title="财务科长审批"
            onFinish={async () => {
              if (!access.canFinanceAuditPaymentDocument) {
                message.error('你无权进行此操作');
              } else {
                await runAudit(id, 2);
              }
            }}
          >
            <ProFormRadio.Group
              name="audit"
              options={[
                {
                  label: '审核通过',
                  value: true,
                },
                {
                  label: '审核驳回',
                  value: false,
                },
              ]}
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm<{
            name: string;
          }>
            name="2"
            title="分管院长审批"
            onFinish={async () => {
              if (!access.canDeanAuditPaymentDocument) {
                message.error('你无权进行此操作');
              } else {
                await runAudit(id, 3);
              }
            }}
          >
            <ProFormRadio.Group
              name="audit"
              options={[
                {
                  label: '审核通过',
                  value: true,
                },
                {
                  label: '审核驳回',
                  value: false,
                },
              ]}
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm<{
            name: string;
          }>
            name="3"
            title="财务院长审批"
            onFinish={async () => {
              if (!access.canFinanceDeanAuditPaymentDocument) {
                message.error('你无权进行此操作');
              } else {
                await runAudit(id, 4);
              }
            }}
          >
            <ProFormRadio.Group
              name="audit"
              options={[
                {
                  label: '审核通过',
                  value: true,
                },
                {
                  label: '审核驳回',
                  value: false,
                },
              ]}
            />
          </StepsForm.StepForm>
        </StepsForm>
      </ProCard>
    </PageContainer>
  );
};

export default PaymentDocumentDetailPage;
