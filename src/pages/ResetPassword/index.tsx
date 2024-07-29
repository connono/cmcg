import { SERVER_HOST } from '@/constants';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  PageContainer,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import { message, theme } from 'antd';
import axios from 'axios';
import { useRef, useState } from 'react';

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
  const { token } = theme.useToken();

  const formRef = useRef<ProFormInstance>();
  const { initialState } = useModel('@@initialState');
  const [lengthCorrector, setLengthCorrector] = useState<boolean>(false);
  const [numberCorrector, setNumberCorrector] = useState<boolean>(false);
  const [lowerCaseCorrector, setLowerCaseCorrector] = useState<boolean>(false);
  const [upperCaseCorrector, setUpperCaseCorrector] = useState<boolean>(false);
  const [spaceCorrector, setSpaceCorrector] = useState<boolean>(false);
  const [samePasswordCorrector, setSamePasswordCorrector] =
    useState<boolean>(false);

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
        onFinish={async (values) => {
          if (
            lengthCorrector &&
            numberCorrector &&
            lowerCaseCorrector &&
            upperCaseCorrector &&
            spaceCorrector &&
            samePasswordCorrector
          ) {
            await runResetPassword(initialState?.id, values.password);
          } else {
            message.error('密码不符合规范，请重新输入');
          }
        }}
      >
        <ProFormText
          name="username"
          width="sm"
          label="用户名"
          initialValue={initialState?.name}
          disabled
        />
        <ProFormText.Password
          name="password"
          label="密码"
          width="md"
          fieldProps={{
            statusRender: (value) => {
              const lengthCheck = (value?: string) => {
                if (value && value.length > 6 && value.length <= 24) {
                  setLengthCorrector(true);
                  return (
                    <div style={{ color: token.colorSuccess }}>
                      长度大于6位小于等于24位
                      <CheckCircleOutlined style={{ marginLeft: '5px' }} />
                    </div>
                  );
                } else if (value && value.length > 24) {
                  setLengthCorrector(false);
                  return (
                    <div style={{ color: token.colorError }}>
                      长度大于24位
                      <CloseCircleOutlined style={{ marginLeft: '5px' }} />
                    </div>
                  );
                } else {
                  setLengthCorrector(false);
                  return (
                    <div style={{ color: token.colorError }}>
                      长度小于6位
                      <CloseCircleOutlined style={{ marginLeft: '5px' }} />
                    </div>
                  );
                }
              };
              const numberCheck = (value?: string) => {
                if (value && /\d/.test(value)) {
                  setNumberCorrector(true);
                  return (
                    <div style={{ color: token.colorSuccess }}>
                      密码中包含数字
                      <CheckCircleOutlined style={{ marginLeft: '5px' }} />
                    </div>
                  );
                } else {
                  setNumberCorrector(false);
                  return (
                    <div style={{ color: token.colorError }}>
                      密码中不包含数字
                      <CloseCircleOutlined style={{ marginLeft: '5px' }} />
                    </div>
                  );
                }
              };
              const lowerCaseCheck = (value?: string) => {
                if (value && /[a-z]/.test(value)) {
                  setLowerCaseCorrector(true);
                  return (
                    <div style={{ color: token.colorSuccess }}>
                      密码中包含小写字母
                      <CheckCircleOutlined style={{ marginLeft: '5px' }} />
                    </div>
                  );
                } else {
                  setLowerCaseCorrector(false);
                  return (
                    <div style={{ color: token.colorError }}>
                      密码中不包含小写字母
                      <CloseCircleOutlined style={{ marginLeft: '5px' }} />
                    </div>
                  );
                }
              };
              const upperCaseCheck = (value?: string) => {
                if (value && /[A-Z]/.test(value)) {
                  setUpperCaseCorrector(true);
                  return (
                    <div style={{ color: token.colorSuccess }}>
                      密码中包含大写字母
                      <CheckCircleOutlined style={{ marginLeft: '5px' }} />
                    </div>
                  );
                } else {
                  setUpperCaseCorrector(false);
                  return (
                    <div style={{ color: token.colorError }}>
                      密码中不包含大写字母
                      <CloseCircleOutlined style={{ marginLeft: '5px' }} />
                    </div>
                  );
                }
              };
              const spaceCheck = (value?: string) => {
                if (value && !value.includes(' ')) {
                  setSpaceCorrector(true);
                  return (
                    <div style={{ color: token.colorSuccess }}>
                      密码中不包含空格
                      <CheckCircleOutlined style={{ marginLeft: '5px' }} />
                    </div>
                  );
                } else if (value && value.includes(' ')) {
                  setSpaceCorrector(false);
                  return (
                    <div style={{ color: token.colorError }}>
                      密码中包含空格
                      <CloseCircleOutlined style={{ marginLeft: '5px' }} />
                    </div>
                  );
                } else {
                  setSpaceCorrector(false);
                  return (
                    <div style={{ color: token.colorSuccess }}>
                      密码中不包含空格
                      <CheckCircleOutlined style={{ marginLeft: '5px' }} />
                    </div>
                  );
                }
              };

              return (
                <div>
                  {lengthCheck(value)}
                  {numberCheck(value)}
                  {lowerCaseCheck(value)}
                  {upperCaseCheck(value)}
                  {spaceCheck(value)}
                </div>
              );
            },
          }}
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
        <ProFormText.Password
          name="check_password"
          label="确认密码"
          width="md"
          fieldProps={{
            statusRender: (value) => {
              const samePasswordCheck = (value?: string) => {
                const password = formRef.current?.getFieldValue('password');
                if (value && value === password) {
                  setSamePasswordCorrector(true);
                  return (
                    <div style={{ color: token.colorSuccess }}>
                      密码一致
                      <CheckCircleOutlined style={{ marginLeft: '5px' }} />
                    </div>
                  );
                } else {
                  setSamePasswordCorrector(false);
                  return (
                    <div style={{ color: token.colorError }}>
                      密码不一致
                      <CloseCircleOutlined style={{ marginLeft: '5px' }} />
                    </div>
                  );
                }
              };
              return <div>{samePasswordCheck(value)}</div>;
            },
          }}
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
      </ProForm>
    </PageContainer>
  );
};

export default ResetPasswordPage;
