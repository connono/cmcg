export default (initialState: API.UserToken) => {
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://umijs.org/docs/max/access
  const { permissions } = initialState;
  // const canSeeAdmin = !!(
  //   initialState && initialState.name !== 'dontHaveAccess'
  // );
  const canSeeHome = permissions && permissions.has('can_see_home');
  const canSeeEquipment = permissions && permissions.has('can_see_equipment');
  const canSeeInstrument = permissions && permissions.has('can_see_instrument');
  const canSeeUserList = permissions && permissions.has('can_see_userlist');
  const canCreateUser = permissions && permissions.has('can_create_user');
  const canUpdateUser = permissions && permissions.has('can_update_user');
  const canSeePaymentMonitor =
    permissions && permissions.has('can_see_payment_monitor');
  const canCreatePaymentPlan =
    permissions && permissions.has('can_create_payment_plan');
  const canUpdatePaymentPlan =
    permissions && permissions.has('can_update_payment_plan');
  const canDeletePaymentPlan =
    permissions && permissions.has('can_delete_payment_plan');
  const canApplyPaymentRecord =
    permissions && permissions.has('can_apply_payment_record');
  const canAuditPaymentRecord =
    permissions && permissions.has('can_audit_payment_record');
  const canProcessPaymentRecord =
    permissions && permissions.has('can_process_payment_record');
  const canStopPaymentRecord =
    permissions && permissions.has('can_stop_payment_record');

  return {
    canSeeHome,
    canSeeEquipment,
    canSeeInstrument,
    canSeeUserList,
    canCreateUser,
    canUpdateUser,
    canSeePaymentMonitor,
    canCreatePaymentPlan,
    canUpdatePaymentPlan,
    canDeletePaymentPlan,
    canApplyPaymentRecord,
    canAuditPaymentRecord,
    canProcessPaymentRecord,
    canStopPaymentRecord,
  };
};
