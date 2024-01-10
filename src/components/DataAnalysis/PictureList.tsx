import { PICTURE_LIST } from '@/utils/chart-render';
import { Collapse } from 'antd';
import _ from 'lodash';
import React from 'react';
import '../../../node_modules/react-grid-layout/css/styles.css';
import '../../../node_modules/react-resizable/css/styles.css';
import PictureCard from './PictureCard';

const PictureList: React.FC = () => {
  const Group_By_TYPE_PICTURE_LIST = _.groupBy(PICTURE_LIST, 'type');
  const PICTURE_ITEMS = _.map(
    Group_By_TYPE_PICTURE_LIST,
    (value: any, key: any) => {
      const pictures = _.map(value, (v: any) => {
        //@ts-ignore
        return <PictureCard key={v.name} label={v.label} name={v.name} />;
      });
      if (key === 'Card') {
        return {
          key,
          label: '指标卡',
          children: (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>{pictures}</div>
          ),
        };
      } else if (key === 'Line') {
        return {
          key,
          label: '折线图/曲线图',
          children: (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>{pictures}</div>
          ),
        };
      } else if (key === 'Area') {
        return {
          key,
          label: '面积图',
          children: (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>{pictures}</div>
          ),
        };
      } else if (key === 'Column') {
        return {
          key,
          label: '柱状图',
          children: (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>{pictures}</div>
          ),
        };
      } else if (key === 'Bar') {
        return {
          key,
          label: '条形图',
          children: (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>{pictures}</div>
          ),
        };
      } else if (key === 'Pie') {
        return {
          key,
          label: '饼图/环图',
          children: (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>{pictures}</div>
          ),
        };
      } else if (key === 'Process') {
        return {
          key,
          label: '进度图',
          children: (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>{pictures}</div>
          ),
        };
      } else if (key === 'Scatter') {
        return {
          key,
          label: '散点图/气泡图',
          children: (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>{pictures}</div>
          ),
        };
      } else if (key === 'Rose') {
        return {
          key,
          label: '玫瑰图',
          children: (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>{pictures}</div>
          ),
        };
      } else if (key === 'Connection') {
        return {
          key,
          label: '关系图',
          children: (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>{pictures}</div>
          ),
        };
      } else if (key === 'Heatmap') {
        return {
          key,
          label: '热力图/色块图',
          children: (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>{pictures}</div>
          ),
        };
      }
    },
  );
  return <Collapse accordion items={PICTURE_ITEMS} />;
};

export default PictureList;
