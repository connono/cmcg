import { SERVER_HOST } from '@/constants';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  PageContainer,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import { message } from 'antd';
import axios from 'axios';
import { useRef } from 'react';

const resetPassword = async (id: number, password: number) => {
  return await axios({
    method: 'PATCH',
    data: {
      password,
    },
    url: `${SERVER_HOST}/users/reset/${id}`,
  });
};

const ResetPasswordPage: React.FC = () => {
  const formRef = useRef<ProFormInstance>();
  const { initialState } = useModel('@@initialState');
  const { run: runResetPassword } = useRequest(resetPassword, {
    manual: true,
    onSuccess: () => {
      formRef.current?.setFieldValue('password', '');
      message.success('重置密码成功');
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  return (
    <PageContainer
      ghost
      header={{
        title: '修改账号密码',
      }}
    >
      <ProForm
        name="reset_password"
        formRef={formRef}
        submitter={{
          resetButtonProps: {
            style: {
              display: 'none',
            },
          },
        }}
        // @ts-ignore
        onFinish={async (values) =>
          await runResetPassword(initialState?.id, values.password)
        }
      >
        <ProFormText
          name="username"
          width="sm"
          label="用户名"
          initialValue={initialState?.name}
          disabled
        />
        <ProFormText.Password name="password" width="sm" label="密码" />
      </ProForm>
    </PageContainer>
  );
};

export default ResetPasswordPage;
