import { SERVER_HOST } from '@/constants';
import {
  PageContainer,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Col, Row, message } from 'antd';
import axios from 'axios';
import React from 'react';
import './index.less';

const login = async (username: string, password: string) => {
  return await axios({
    method: 'POST',
    data: {
      name: username,
      password,
    },
    url: `${SERVER_HOST}/authorizations`,
  });
};

const LoginPage: React.FC = () => {
  const { run: runLogin } = useRequest(login, {
    manual: true,
    onSuccess: async (result: any) => {
      if (result.access_token) {
        localStorage.setItem('access_token', result.access_token);
        message.success('登录成功！正在跳转~');
        window.location.replace('http://10.10.0.27/#/');
        window.location.reload();
      } else {
        message.error('用户名或密码错误，请重试');
      }
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  return (
    <PageContainer className="page-container" ghost>
      <div className="absolute-container">
        <div className="relative-container">
          <Row className="login-row">
            <Col span={7}></Col>
            <Col span={10}>
              <div className="login-container">
                <div className="login-title">合同管理系统</div>
                <div className="login-form">
                  <ProForm
                    name="login"
                    submitter={{
                      resetButtonProps: {
                        style: {
                          display: 'none',
                        },
                      },
                      submitButtonProps: {
                        style: {
                          width: '200px',
                        },
                      },
                    }}
                    onFinish={(values) =>
                      runLogin(values.username, values.password)
                    }
                  >
                    <ProFormText name="username" width="sm" label="用户名" />
                    <ProFormText.Password
                      name="password"
                      width="sm"
                      label="密码"
                    />
                  </ProForm>
                </div>
              </div>
            </Col>
            <Col span={7}></Col>
          </Row>
        </div>
      </div>
      <div className="version">版本：2.4.4beta</div>
    </PageContainer>
  );
};

export default LoginPage;
