// 全局共享数据示例
import { DEFAULT_CANVAS_DATA } from '@/constants';
import _ from 'lodash';
import { useCallback, useState } from 'react';

const useCanvasData = () => {
  const [canvasData, setCanvasData] =
    useState<API.CANVASDATA>(DEFAULT_CANVAS_DATA);
  const resetCanvas = useCallback(
    (
      name: string = DEFAULT_CANVAS_DATA.name,
      width: number = DEFAULT_CANVAS_DATA.width,
      height: number = DEFAULT_CANVAS_DATA.height,
      color: string = DEFAULT_CANVAS_DATA.color,
    ) => {
      setCanvasData((pre) => {
        return {
          ...pre,
          name: name,
          width: width,
          height: height,
          color: color,
        };
      });
    },
    [],
  );
  const addChart = useCallback((name: string, label: string) => {
    console.log('name', name);
    setCanvasData((pre) => {
      const chartList = _.concat(pre.chartList, {
        name: name + Date.now(),
        label,
        component: name,
      });
      return {
        ...pre,
        chartList,
      };
    });
  }, []);
  const deleteChart = useCallback((name: string) => {
    setCanvasData((pre) => {
      let chartList = _.clone(pre.chartList);
      _.remove(chartList, (chart: any) => chart.name === name);
      return {
        ...pre,
        chartList,
      };
    });
  }, []);
  return {
    canvasData,
    setCanvasData,
    resetCanvas,
    addChart,
    deleteChart,
  };
};

export default useCanvasData;
