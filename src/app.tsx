// 运行时配置
import { APPLICATION_HOST, SERVER_HOST } from '@/constants';
import { RunTimeLayoutConfig } from '@umijs/max';
import { message, notification } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import { RequestConfig, history } from 'umi';

const getUser = async (token: string) => {
  return await axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    url: `${SERVER_HOST}/user`,
  })
    .then((response) => {
      return response.data.data;
    })
    .catch((err) => {
      message.error(err);
    });
};

const getPermissions = async (id: number) => {
  return await axios({
    method: 'GET',
    url: `${SERVER_HOST}/permissions/${id}`,
  })
    .then((response) => {
      if (response.data.length !== 0) {
        const permissions = new Set();
        _.forEach(response.data, (value: any) => {
          return permissions.add(value.name);
        });
        return permissions;
      } else {
        return new Set();
      }
    })
    .catch((err) => {
      message.error(err);
    });
};

const getAllRoles = async () => {
  return await axios({
    method: 'GET',
    url: `${SERVER_HOST}/allRoles`,
  })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      message.error(err);
    });
};

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{
  id: number;
  name: string;
  department: string;
  permissions: Set<string>;
  allRoles: string[];
}> {
  if (history.location.pathname === '/login') {
    return {
      id: -1,
      name: '',
      department: '',
      permissions: new Set(),
      allRoles: [],
    };
  } else if (localStorage.getItem('access_token')) {
    const access_token = localStorage.getItem('access_token');
    let data, permissions, allRoles;
    try {
      // @ts-ignore
      data = await getUser(access_token);
      permissions = await getPermissions(data.id);
      allRoles = await getAllRoles();
      return {
        id: data.id,
        name: data.name,
        department: data.department,
        permissions: permissions ? permissions : new Set(),
        allRoles: allRoles,
      };
    } catch (error) {
      localStorage.removeItem('access_token');
      message.error('登录已过期，请重新登录！');
      history.push('/login');
      return {
        id: -1,
        name: '',
        department: '',
        permissions: new Set(),
        allRoles: [],
      };
    }
  } else {
    message.error('请先登录再访问');
    history.push('./login');
    return {
      id: -1,
      name: '',
      department: '',
      permissions: new Set(),
      allRoles: [],
    };
  }
}

export const layout: RunTimeLayoutConfig = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    logout: () => {
      localStorage.removeItem('access_token');
      message.success('已退出登录');
      window.location.replace(`${APPLICATION_HOST}/login`);
    },
  };
};

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

// 运行时配置
export const request: RequestConfig = {
  // 统一的请求设定
  timeout: 1000,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },

  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res: ResponseStructure) => {
      const { success, data, errorCode, errorMessage, showType } = res;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warning(errorMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage);
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              message.error(errorMessage);
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        message.error(`Response status:${error.response.status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: any) => {
      // 拦截请求配置，进行个性化处理。
      const url = config.url.concat('?token = 123');
      return { ...config, url };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response;
      // @ts-ignore
      if (!data.success) {
        message.error('请求失败！');
      }
      return response;
    },
  ],
};
