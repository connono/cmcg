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
      name: '用户列表管理',
      path: '/userList',
      component: './UserList',
      access: 'canSeeUserList',
    },
    {
      name: '设备采购管理',
      path: '/equipment',
      component: './Equipment',
      access: 'canSeeEquipment',
    },
    {
      name: '付款流程监控',
      path: '/paymentMonitor',
      component: './PaymentMonitor',
      access: 'canSeePaymentMonitor',
    },
    {
      name: '修改账号密码',
      path: '/resetPassword',
      component: './ResetPassword',
      access: 'canSeeHome',
    },
    {
      path: '/equipment/detail',
      component: './Equipment/Detail',
      access: 'canSeeEquipment',
    },
    {
      path: '/paymentRecord',
      component: './PaymentRecord',
      access: 'canSeePaymentMonitor',
    },
    {
      path: '/paymentMonitor/detail',
      component: './PaymentMonitor/Detail',
      access: 'canSeePaymentMonitor',
    },
  ],
  npmClient: 'npm',
});
