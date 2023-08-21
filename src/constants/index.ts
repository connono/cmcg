

export const DEFAULT_USER_TOKEN = {
    username: '',
    access_token: '',
}

export const DEFAULT_EQUIPMENT_RECORD_ITEM = {
    id: null,                                 // 主键
    serial_number: null,                      // 设备申请记录序列号
    status: 0,                              // 状态
    equipment: null,                          // 申请设备名称
    department: null,                         // 申请科室名称
    count: null,                               // 数量
    budget: null,                              // 预算
    apply_type: null,                         // 申请方式
    survey_date: null,                        // 调研日期
    purchase_type: null,                      // 采购方式
    survey_record: null,                      // 调研记录
    meeting_record:null,                     // 会议记录
    approve_date: null,                       // 审批日期
    execute_date: null,                       // 预算执行单日期
    purchase_date: null,                      // 合同日期
    arrive_date: null,                        // 到货日期
    price: null,                              // 合同价格
    install_date: null,                       // 安装日期
    create_at: null,                          // 记录创建时间
    update_at: null,                          // 记录更新时间
}

export const SERVER_HOST = "http://homestead.test/api/v1";