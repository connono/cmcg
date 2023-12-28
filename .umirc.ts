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
      name: '采购申请管理',
      path: '/apply',
      routes: [
        {
          name: '设备采购',
          path: '/apply/equipment',
          component: './Equipment',
          access: 'canSeeEquipment',
        },
        {
          name: '器械医疗用品采购',
          path: '/apply/instrument',
          component: './Instrument',
          access: 'canSeeEquipment',
        },
        {
          name: '设备维修',
          path: '/apply/maintain',
          component: './Maintain',
          access: 'canSeeEquipment',
        },
        {
          path: '/apply/equipment/detail',
          component: './Equipment/Detail',
          name: '设备采购管理-详情',
          hideInMenu: true,
          access: 'canSeeEquipment',
        },
        {
          path: '/apply/instrument/detail',
          component: './Instrument/Detail',
          name: '器械医疗用品采购管理-详情',
          hideInMenu: true,
          access: 'canSeeEquipment',
        },
        {
          path: '/apply/maintain/detail',
          component: './Maintain/Detail',
          name: '设备维修保养管理-详情',
          hideInMenu: true,
          access: 'canSeeEquipment',
        },
      ],
    },
    {
      name: '合同管理',
      path: '/purchase',
      routes: [
        {
          name: '服务型合同',
          path: '/purchase/paymentMonitor',
          component: './PaymentMonitor',
          access: 'canSeePaymentMonitor',
        },
        {
          name: '物资型合同',
          path: '/purchase/paymentProcess',
          component: './PaymentProcess',
          access: 'canSeePaymentProcess',
        },
        {
          name: '垫付款管理',
          path: '/purchase/advance',
          component: './Advance',
          access: 'canSeeEquipment',
        },
        {
          path: '/purchase/paymentRecord',
          component: './PaymentRecord',
          name: '付款记录列表',
          hideInMenu: true,
          access: 'canSeePaymentMonitor',
        },
        {
          path: '/purchase/paymentMonitor/detail',
          component: './PaymentMonitor/Detail',
          name: '服务型付款流程监控-详情',
          hideInMenu: true,
          access: 'canSeePaymentMonitor',
        },
        {
          path: '/purchase/paymentProcess/detail',
          component: './PaymentProcess/Detail',
          name: '物资型付款流程监控-详情',
          hideInMenu: true,
          access: 'canSeePaymentProcess',
        },
      ],
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
  ],
  npmClient: 'npm',
});
