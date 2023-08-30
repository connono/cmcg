// 全局共享数据示例
import { DEFAULT_USER_TOKEN } from '@/constants';
import { useState } from 'react';

const useUserToken = () => {
  const [userToken, setUserToken] = useState<API.UserToken>(DEFAULT_USER_TOKEN);
  return {
    userToken,
    setUserToken,
  };
};

export default useUserToken;
