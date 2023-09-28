import React from 'react';
import axios from 'axios';
import { message } from 'antd';
import { PageContainer, ProForm, ProFormText } from '@ant-design/pro-components';
import { useRequest, history } from '@umijs/max';
import { SERVER_HOST } from '@/constants';

const login = async (username: string, password: string) => {
  return await axios({
    method: 'POST',
    data: {
      name: username,
      password,
    },
    url: `${SERVER_HOST}/authorizations`,
  })
}

const LoginPage: React.FC = () => {
  const { run : runLogin } = useRequest(login,{
    manual: true,
    onSuccess: async (result: any, params: any) => {
      if(result.access_token){
        localStorage.setItem('access_token', result.access_token);
        message.success('登录成功！正在跳转~');
        history.push('/home');
      } else {
        message.error('用户名或密码错误，请重试');
      }
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  })
    
    return (
      <PageContainer ghost>
        <div className='login-container'>
            <div className='background' />
            <div className='login-title'>医疗设备采购管理系统</div>
            <div className='login-form'>
                <ProForm
                    name="login"
                    submitter={{
                      resetButtonProps: {
                        style: {
                          display: 'none',
                        }
                      }
                    }}

                    onFinish={(values)=>runLogin(values.username, values.password)}
                >
                    <ProFormText
                      name="username"
                      width="sm"
                      label="用户名"
                    /> 
                    <ProFormText.Password
                      name="password"
                      width="sm"
                      label="密码"
                    /> 
                </ProForm>
            </div>
          </div>
      </PageContainer>
    )
}

export default LoginPage;