export default (initialState: API.UserToken) => {
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://umijs.org/docs/max/access
  const { permissions } = initialState;
  // const canSeeAdmin = !!(
  //   initialState && initialState.name !== 'dontHaveAccess'
  // );
  const canSeeHome = permissions && permissions.has('can_see_home');
  const canSeeEquipment =
    permissions &&
    (permissions.has('can_dean_audit_payment_process_record') ||
      permissions.has('can_see_equipment') ||
      permissions.has('can_contract_equipment'));
  const canSeeInstrument =
    permissions &&
    (permissions.has('can_see_instrument') ||
      permissions.has('can_dean_audit_payment_process_record'));
  const canSeeMaintain = permissions && permissions.has('can_apply_repair');
  const canSeeUserList = permissions && permissions.has('can_see_userlist');
  const canCreateUser = permissions && permissions.has('can_create_user');
  const canUpdateUser = permissions && permissions.has('can_update_user');
  const canSeePaymentMonitor =
    permissions &&
    (permissions.has('can_see_payment_monitor') ||
      permissions.has('can_apply_payment_process_record'));
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
  const canSeePaymentProcess =
    permissions &&
    (permissions.has('can_install_equipment') ||
      permissions.has('can_see_payment_process'));
  const canCreatePaymentProcess =
    permissions && permissions.has('can_create_payment_process');
  const canStopPaymentProcess =
    permissions && permissions.has('can_update_payment_process');
  const canApplyEquipment =
    permissions && permissions.has('can_apply_equipment');
  const canSurveyEquipment =
    permissions && permissions.has('can_survey_equipment');
  const canApproveEquipment =
    permissions && permissions.has('can_approve_equipment');
  const canTenderEquipment =
    permissions && permissions.has('can_tender_equipment');
  const canContractEquipment =
    permissions && permissions.has('can_contract_equipment');
  const canInstallEquipment =
    permissions && permissions.has('can_install_equipment');
  const canWarehouseEquipment =
    permissions && permissions.has('can_warehouse_equipment');
  const canBackEquipment = permissions && permissions.has('can_back_equipment');
  const canDeleteEquipment =
    permissions && permissions.has('can_delete_equipment');
  const canApplyInstrument =
    permissions && permissions.has('can_apply_instrument');
  const canSurveyInstrument =
    permissions && permissions.has('can_survey_instrument');
  const canContractInstrument =
    permissions && permissions.has('can_contract_instrument');
  const canInstallInstrument =
    permissions && permissions.has('can_install_instrument');
  const canBackInstrument =
    permissions && permissions.has('can_back_instrument');
  const canDeleteInstrument =
    permissions && permissions.has('can_delete_instrument');
  const canApplyRepair = permissions && permissions.has('can_apply_repair');
  const canInstallRepair = permissions && permissions.has('can_install_repair');
  const canBackRepair = permissions && permissions.has('can_back_repair');
  const canDeleteRepair = permissions && permissions.has('can_delete_repair');
  const canApplyPaymentProcessRecord =
    permissions && permissions.has('can_apply_payment_process_record');
  const canDocumentPaymentProcessRecord =
    permissions && permissions.has('can_document_payment_process_record');
  const canFinanceAuditPaymentProcessRecord =
    permissions && permissions.has('can_finance_audit_payment_process_record');
  const canDeanAuditPaymentProcessRecord =
    permissions && permissions.has('can_dean_audit_payment_process_record');
  const canProcessPaymentProcessRecord =
    permissions && permissions.has('can_process_payment_process_record');
  const canStopPaymentProcessRecord =
    permissions && permissions.has('can_stop_payment_process_record');
  const canEnginnerApproveEquipment =
    permissions && permissions.has('can_engineer_approve_equipment');
  const canEnginnerApproveInstrument =
    permissions && permissions.has('can_engineer_approve_instrument');
  const canEnginnerApproveRepair =
    permissions && permissions.has('can_engineer_approve_repair');
  const canCreateContractProcess =
    permissions && permissions.has('can_create_contract_process');
  const doNotSeeEquipmentExceptInstall =
    permissions && permissions.has('do_not_see_equipment_except_install');
  const canStopEquipmentApplyRecord =
    permissions && permissions.has('can_stop_equipment_apply_record');
  const canCreateLeader = permissions && permissions.has('can_create_leader');
  const canAddDepartmentToLeader =
    permissions && permissions.has('can_add_department_to_leader');
  const canSeePaymentDocument =
    permissions && permissions.has('can_see_payment_document');
  const canCreatePaymentDocument =
    permissions && permissions.has('can_create_payment_document');
  const canFinanceAuditPaymentDocument =
    permissions && permissions.has('can_finance_audit_payment_document');
  const canDeanAuditPaymentDocument =
    permissions && permissions.has('can_dean_audit_payment_document');
  const canFinanceDeanAuditPaymentDocument =
    permissions && permissions.has('can_finance_dean_audit_payment_document');
  const canApproveContracts =
    permissions && permissions.has('can_approve_contracts');
  const canApplyTemporyConsumableRecord =
    permissions && permissions.has('can_apply_tempory_consumable_record');
  const canPurchaseTemporyConsumableRecord =
    permissions && permissions.has('can_purchase_tempory_consumable_record');
  const canApproveTemporyConsumableRecord =
    permissions && permissions.has('can_approve_tempory_consumable_record');
  const canStopConsumableList =
    permissions && permissions.has('can_stop_consumable_list');
  const canApplyConsumableRecord =
    permissions && permissions.has('can_apply_consumable_record');
  const canPurchaseConsumableRecord =
    permissions && permissions.has('can_purchase_consumable_record');
  const canApproveConsumableRecord =
    permissions && permissions.has('can_approve_consumable_record');
  const canEngineerApproveConsumableRecord =
    permissions && permissions.has('can_engineer_approve_consumable_record');
  const canBackConsumableRecord =
    permissions && permissions.has('can_back_consumable_record');
  const canDeleteConsumableRecord =
    permissions && permissions.has('can_delete_consumable_record');
  const canPurchaseConsumableList =
    permissions && permissions.has('can_purchase_consumable_list');
  const canApproveConsumableList =
    permissions && permissions.has('can_approve_consumable_list');
  const canEngineerApproveConsumableList =
    permissions && permissions.has('can_engineer_approve_consumable_list');
  const canDeleteConsumableList =
    permissions && permissions.has('can_delete_consumable_list');
  const canDeanAuditPaymentRecord =
    permissions && permissions.has('can_dean_audit_payment_record');
  const canFinanceDeanAuditPaymentRecord =
    permissions && permissions.has('can_finance_dean_audit_payment_record');
  const canUploadPaymentDocument =
    permissions && permissions.has('can_upload_payment_document');
  const canDeletePaymentDocument =
    permissions && permissions.has('can_delete_payment_document');
  const canSeeConsumableView =
    canApplyConsumableRecord ||
    canPurchaseConsumableRecord ||
    canApproveConsumableRecord ||
    canEngineerApproveConsumableRecord;

  return {
    canSeeHome,
    canSeeEquipment,
    canSeeInstrument,
    canSeeMaintain,
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
    canSeePaymentProcess,
    canCreatePaymentProcess,
    canStopPaymentProcess,
    canApplyEquipment,
    canSurveyEquipment,
    canApproveEquipment,
    canTenderEquipment,
    canContractEquipment,
    canInstallEquipment,
    canWarehouseEquipment,
    canBackEquipment,
    canDeleteEquipment,
    canApplyInstrument,
    canSurveyInstrument,
    canContractInstrument,
    canInstallInstrument,
    canBackInstrument,
    canDeleteInstrument,
    canApplyRepair,
    canInstallRepair,
    canBackRepair,
    canDeleteRepair,
    canApplyPaymentProcessRecord,
    canDocumentPaymentProcessRecord,
    canFinanceAuditPaymentProcessRecord,
    canDeanAuditPaymentProcessRecord,
    canProcessPaymentProcessRecord,
    canStopPaymentProcessRecord,
    canEnginnerApproveEquipment,
    canEnginnerApproveInstrument,
    canEnginnerApproveRepair,
    canCreateContractProcess,
    doNotSeeEquipmentExceptInstall,
    canStopEquipmentApplyRecord,
    canCreateLeader,
    canAddDepartmentToLeader,
    canSeePaymentDocument,
    canCreatePaymentDocument,
    canFinanceAuditPaymentDocument,
    canDeanAuditPaymentDocument,
    canFinanceDeanAuditPaymentDocument,
    canApproveContracts,
    canApplyTemporyConsumableRecord,
    canPurchaseTemporyConsumableRecord,
    canApproveTemporyConsumableRecord,
    canStopConsumableList,
    canApplyConsumableRecord,
    canPurchaseConsumableRecord,
    canApproveConsumableRecord,
    canEngineerApproveConsumableRecord,
    canBackConsumableRecord,
    canDeleteConsumableRecord,
    canPurchaseConsumableList,
    canApproveConsumableList,
    canEngineerApproveConsumableList,
    canDeleteConsumableList,
    canDeanAuditPaymentRecord,
    canFinanceDeanAuditPaymentRecord,
    canUploadPaymentDocument,
    canDeletePaymentDocument,
    canSeeConsumableView,
  };
};
