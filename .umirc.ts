import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  jsMinifier: 'esbuild',
  esbuildMinifyIIFE: true,
  plugins: ['umi-plugin-circular-check'],
  history: { type: 'hash' },
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
      name: '器械医疗用品采购管理',
      path: '/instrument',
      component: './Instrument',
      access: 'canSeeEquipment',
    },
    {
      name: '设备维修保养管理',
      path: '/maintain',
      component: './Maintain',
      access: 'canSeeEquipment',
    },
    {
      name: '服务型付款流程监控',
      path: '/paymentMonitor',
      component: './PaymentMonitor',
      access: 'canSeePaymentMonitor',
    },
    {
      name: '物资型付款流程监控',
      path: '/paymentProcess',
      component: './PaymentProcess',
      access: 'canSeePaymentProcess',
    },
    {
      name: '修改账号密码',
      path: '/resetPassword',
      component: './ResetPassword',
      access: 'canSeeHome',
    },
    {
      name: '数据分析',
      path: '/dataAnalysis',
      component: './DataAnalysis',
      access: 'canSeeHome',
    },
    {
      path: '/equipment/detail',
      component: './Equipment/Detail',
      access: 'canSeeEquipment',
    },
    {
      path: '/instrument/detail',
      component: './Instrument/Detail',
      access: 'canSeeEquipment',
    },
    {
      path: '/maintain/detail',
      component: './Maintain/Detail',
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
    {
      path: '/paymentProcess/detail',
      component: './PaymentProcess/Detail',
      access: 'canSeePaymentProcess',
    },
  ],
  npmClient: 'npm',
});
