import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '设备管理平台',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
      access: 'canSeeHome',
    },
    {
      name: '登录',
      path: '/login',
      component: './Login',
      layout: false,
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: '设备采购管理',
      path: '/equipment',
      component: './Equipment',
      access: 'canSeeEquipment',
    },
    {
      name: '用户列表管理',
      path: '/userList',
      component: './UserList',
      access: 'canSeeUserList',
    },
    {
      path: '/equipment/detail',
      component: './Equipment/Detail',
      access: 'canSeeEquipment',
    }
  ],
  npmClient: 'npm',
});
