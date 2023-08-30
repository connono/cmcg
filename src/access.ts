export default (initialState: API.UserToken) => {
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://umijs.org/docs/max/access
  const { id, permissions } = initialState;
  // const canSeeAdmin = !!(
  //   initialState && initialState.name !== 'dontHaveAccess'
  // );
  console.log('permissions:', permissions);
  const canSeeHome = permissions && permissions.has('can_see_home')
  const canSeeEquipment =  permissions && permissions.has('can_see_equipment')
  const canSeeUserList =  permissions && permissions.has('can_see_userlist')
  return {
    canSeeHome,
    canSeeEquipment,
    canSeeUserList,
  };
};
