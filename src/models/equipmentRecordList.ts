// 全局共享数据示例
import { useState } from 'react';

const useEquipmentList = () => {
  const [equipmentList, setEquipmentList] =
    useState<API.EquipmentRecordInfo[]>();
  return {
    equipmentList,
    setEquipmentList,
  };
};

export default useEquipmentList;
