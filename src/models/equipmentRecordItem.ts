// 全局共享数据示例
import { useState } from 'react';
import { DEFAULT_EQUIPMENT_RECORD_ITEM } from '@/constants';

const useEquipmentItem = () => {
  //@ts-ignore
  const [equipmentItem, setEquipmentItem] = useState<API.EquipmentRecordInfo>(DEFAULT_EQUIPMENT_RECORD_ITEM);
  return {
    equipmentItem,
    setEquipmentItem,
  }
}

export default useEquipmentItem ;
