export const DEFAULT_USER_TOKEN = {
  id: -1,
  username: '',
  permissions: new Set(),
  access_token: '',
};

export const DEFAULT_CANVAS_DATA = {
  id: -1,
  name: '默认画布',
  color: 'white',
  height: 1123,
  width: 794,
  chartList: [],
};

export const DEFAULT_EQUIPMENT_RECORD_ITEM = {
  id: null, // 主键
  serial_number: null, // 设备申请记录序列号
  status: 0, // 状态
  equipment: null, // 申请设备名称
  department: null, // 申请科室名称
  count: null, // 数量
  budget: null, // 预算
  apply_type: null, // 申请方式
  survey_date: null, // 调研日期
  purchase_type: null, // 采购方式
  survey_record: null, // 调研记录
  meeting_record: null, // 会议记录
  approve_date: null, // 审批日期
  execute_date: null, // 预算执行单日期
  tender_date: null, // 招标书日期
  tender_file: null, // 招标书附件
  tender_boardcast_file: null, // 招标公告附件
  tender_out_date: null, // 招标日期
  bid_winning_file: null, // 中标通知书
  send_tender_file: null, // 投标文件
  purchase_date: null, // 合同日期
  arrive_date: null, // 到货日期
  price: null, // 合同价格
  install_date: null, // 安装日期
  create_at: null, // 记录创建时间
  update_at: null, // 记录更新时间
};

export const PICTURE_LIST = [
  {
    label: '折线图',
    component: 'Line',
  },
  {
    label: '柱状图',
    component: 'Column',
  },
  {
    label: '条形图',
    component: 'Bar',
  },
  {
    label: '面积图',
    component: 'Area',
  },
  {
    label: '色块图/热力图',
    component: 'Heatmap',
  },
  {
    label: '饼图',
    component: 'Pie',
  },
  {
    label: '漏斗图',
    component: 'Funnel',
  },
  {
    label: '仪表盘',
    component: 'Gauge',
  },
  {
    label: '直方图',
    component: 'Histogram',
  },
  {
    label: '瀑布图',
    component: 'Waterfall',
  },
  {
    label: '子弹图',
    component: 'Bullet',
  },
  {
    label: '水波图',
    component: 'Liquid',
  },
  {
    label: '雷达图',
    component: 'Radar',
  },
  {
    label: '散点图',
    component: 'Scatter',
  },
  {
    label: '小提琴图',
    component: 'Violin',
  },
  {
    label: '分面图',
    component: 'Facet',
  },
  {
    label: '韦恩图',
    component: 'Venn',
  },
];

export const ItemTypes = {
  PICTURECARD: 'PictureCard',
};

export const SERVER_HOST = 'http://192.168.56.56/api/v1';
export const APPLICATION_HOST = 'http://localhost:8001/#';

// export const SERVER_HOST = 'http://10.10.0.27:8000/api/v1';
// export const APPLICATION_HOST = 'http://10.10.0.27';
