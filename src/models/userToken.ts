// 全局共享数据示例
import { DEFAULT_USER_TOKEN } from '@/constants';
import { useState } from 'react';

interface UserToken {
  username: string;
  access_token: string;
}

const useUserToken = () => {
  const [userToken, setUserToken] = useState<UserToken>(DEFAULT_USER_TOKEN);
  return {
    userToken,
    setUserToken,
  };
};

export default useUserToken;
