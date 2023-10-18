// 全局共享数据示例
import { DEFAULT_CANVAS_DATA } from '@/constants';
import { useState } from 'react';

const useCanvasData = () => {
  const [canvasData, setCanvasData] =
    useState<API.CANVASDATA>(DEFAULT_CANVAS_DATA);
  return {
    canvasData,
    setCanvasData,
  };
};

export default useCanvasData;
