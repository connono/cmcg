/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！

declare namespace API {
  interface PageInfo {
    /** 
1 */
    current?: number;
    pageSize?: number;
    total?: number;
    list?: Array<Record<string, any>>;
  }

  interface PageInfo_UserInfo_ {
    /** 
1 */
    current?: number;
    pageSize?: number;
    total?: number;
    list?: Array<UserInfo>;
  }

  interface Result {
    success?: boolean;
    errorMessage?: string;
    data?: Record<string, any>;
  }

  interface Result_PageInfo_UserInfo__ {
    success?: boolean;
    errorMessage?: string;
    data?: PageInfo_UserInfo_;
  }

  interface Result_UserInfo_ {
    success?: boolean;
    errorMessage?: string;
    data?: UserInfo;
  }

  interface Result_string_ {
    success?: boolean;
    errorMessage?: string;
    data?: string;
  }

  type UserGenderEnum = 'MALE' | 'FEMALE';

  // interface UserInfo {
  //   id?: string;
  //   name?: string;
  //   /** nick */
  //   nickName?: string;
  //   /** email */
  //   email?: string;
  //   gender?: UserGenderEnum;
  // }

  // interface UserInfoVO {
  //   name?: string;
  //   /** nick */
  //   nickName?: string;
  //   /** email */
  //   email?: string;
  // }

  interface UserToken {
    id: number;
    username: string;
    permissions: Set<string>;
    access_token: string;
  }

  interface CANVASDATA {
    id: number;
    name: string;
    color: string;
    width: number;
    height: number;
    chartList: Array;
  }

  type definitions_0 = null;

  enum EquipmentApplyStep {
    APPLY, // 申请
    SURVEY, // 调研
    APPROVE, // 政府审批
    TENDER, // 投标
    CHECK, // 合同
    PURCHASE, // 安装验收
  }

  enum EquipmentApplyType {
    ANNUAL, // 年度采购
    BUDGET, // 经费采购
    TEMPORARY, // 临时采购
  }

  enum EquipmentPurchaseType {
    EXHIBITION, // 展会采购
    TENDER, // 招标
    ONESELF, // 自行采购
  }

  interface EquipmentRecordInfo {
    id?: number; // 主键
    serial_number?: string; // 设备申请记录序列号
    status?: EquipmentApplyStep; // 状态
    equipment?: string; // 申请设备名称
    department?: string; // 申请科室名称
    count?: number; // 数量
    budget?: number; // 预算
    apply_type?: EquipmentApplyType; // 申请方式
    survey_date?: Date; // 调研日期
    purchase_type?: EquipmentPurchaseType; //采购方式
    survey_record?: string; // 调研记录
    meeting_record?: string; // 会议记录
    approve_date?: Date; // 审批日期
    execute_date?: Date; // 预算执行单日期
    tender_date?: Date; // 招标书日期
    tender_file?: string; // 招标书附件
    tender_boardcast_file?: string; // 招标公告附件
    tender_out_date: Date; // 招标日期
    bid_winning_file: string; // 中标通知书
    send_tender_file: string; // 投标文件
    purchase_date?: Date; // 合同日期
    arrive_date?: Date; // 到货日期
    price?: number; // 合同价格
    install_date?: Date; // 安装日期
    create_at?: Date; // 记录创建时间
    update_at?: Date; // 记录更新时间
  }
}
