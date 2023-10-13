// 全局共享数据示例
import { DEFAULT_EQUIPMENT_RECORD_ITEM } from '@/constants';
import { useState } from 'react';

const useEquipmentItem = () => {
  //@ts-ignore
  const [equipmentItem, setEquipmentItem] = useState<API.EquipmentRecordInfo>(
    DEFAULT_EQUIPMENT_RECORD_ITEM,
  );
  return {
    equipmentItem,
    setEquipmentItem,
  };
};

export default useEquipmentItem;
