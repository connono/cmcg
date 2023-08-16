import React from 'react';
import axios from 'axios';
import { message } from 'antd';
import { PageContainer, ProForm, ProFormText } from '@ant-design/pro-components';
import { useRequest, useModel, history } from '@umijs/max';
import { SERVER_HOST } from '@/constants';

const loginRequest = (username: string, password: string) => {
  return  axios.post(`${SERVER_HOST}/authorizations`,{
    name: username,
    password,
})
}

const LoginPage: React.FC = () => {
  const { userToken, setUserToken } = useModel('userToken');
  const { data, error, loading, run } = useRequest(loginRequest,{
    manual: true,
    onSuccess: (result, params) => {
      if(result.access_token){
        message.success('登录成功！正在跳转~');
        setUserToken({username: params[0], access_token: result.access_token});
        history.push('/home');
      } else {
        message.error('用户名或密码错误，请重试');
      }
    },
    onError: (error) => {
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
                    onValuesChange={(_, values) => {
                      console.log(values);
                    }}
                    onFinish={(values)=>run(values.username, values.password)}
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