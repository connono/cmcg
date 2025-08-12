import { SERVER_HOST } from '@/constants';
import { useRequest } from '@umijs/max';
import type { CollapseProps } from 'antd';
import { Button, Collapse, List, Modal, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import PreviewListVisible from './PreviewListVisible';

// 导入 file-saver，使用 any 类型避免类型错误
const { saveAs } = require('file-saver') as any;

interface Props {
  open: boolean;
  selectedId: number;
  onOk: (id?: number) => void;
  okText: string;
  onCancel: (id?: number) => void;
  cancelText: string;
  onReject: (id?: number) => void;
  rejectText: string;
}

interface AdvancePaybackCollapseProps {
  equipment_apply_records: any;
  instrument_apply_records: any;
  repair_apply_records: any;
}

const getAdvanceRecord = async (id?: number) => {
  if (!id) return [];
  return await axios({
    method: 'GET',
    url: `${SERVER_HOST}/advance/records/getItem?id=${id}`,
  });
};

const AdvancePaybackCollapse: React.FC<AdvancePaybackCollapseProps> = (
  props,
) => {
  const equipmentList = props.equipment_apply_records ? (
    <List
      itemLayout="horizontal"
      dataSource={props.equipment_apply_records}
      renderItem={(item: any) => (
        <List.Item>
          <List.Item.Meta
            title={item.equipment}
            description={
              <div>
                <span>{`科室：${item.department} 合同价格：${item.price}`}</span>
                <PreviewListVisible
                  title="合同信息"
                  fileListString={item.purchase_picture}
                />
                <PreviewListVisible
                  title="验收资料"
                  fileListString={item.install_picture}
                />
              </div>
            }
          />
        </List.Item>
      )}
    />
  ) : (
    <div>暂无记录</div>
  );

  const instrumentList = props.instrument_apply_records ? (
    <List
      itemLayout="horizontal"
      dataSource={props.instrument_apply_records}
      renderItem={(item: any) => (
        <List.Item>
          <List.Item.Meta
            title={item.instrument}
            description={
              <div>
                <span>{`科室：${item.department} 合同价格：${item.price}`}</span>
                <PreviewListVisible
                  title="合同信息"
                  fileListString={item.purchase_picture}
                />
                <PreviewListVisible
                  title="验收资料"
                  fileListString={item.install_picture}
                />
              </div>
            }
          />
        </List.Item>
      )}
    />
  ) : (
    <div>暂无记录</div>
  );

  const maintainList = props.repair_apply_records ? (
    <List
      itemLayout="horizontal"
      dataSource={props.repair_apply_records}
      renderItem={(item: any) => (
        <List.Item>
          <List.Item.Meta
            title={item.name}
            description={
              <div>
                <span>{`设备：${item.equipment} 科室：${item.department} 合同价格：${item.price}`}</span>
                <PreviewListVisible
                  title="验收资料"
                  fileListString={item.install_file}
                />
              </div>
            }
          />
        </List.Item>
      )}
    />
  ) : (
    <div>暂无记录</div>
  );

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: '设备列表',
      children: equipmentList,
    },
    {
      key: '2',
      label: '器械医疗用品列表',
      children: instrumentList,
    },
    {
      key: '3',
      label: '设备维修列表',
      children: maintainList,
    },
  ];

  return <Collapse items={items} defaultActiveKey={['1']} />;
};

const AdvancePaybackModal: React.FC<Props> = (props) => {
  const [advanceRecord, setAdvanceRecord] = useState<any>();

  const { run: runGetAdvanceRecord } = useRequest(getAdvanceRecord, {
    manual: true,
    onSuccess: (result: any) => {
      if (result.data) {
        const data = _.find(result.data, ['id', props.selectedId]);
        setAdvanceRecord(data);
      } else {
        setAdvanceRecord([]);
      }
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  useEffect(() => {
    runGetAdvanceRecord(props.selectedId);
  }, [props.selectedId]);

  // 生成CSV内容
  const generateCSV = (data: any[], headers: string[], fields: string[], currentDate: string, totalPrice: number) => {
    const csvContent = [
      headers.join(','),
      // 添加数据行
      ...data.map((item) => 
        fields.map(field => {
          const value = _.get(item, field, '');
          // 处理包含逗号的内容，用双引号包围
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      ),
      // 添加总计和日期行，放在同一行
      ['', currentDate, '', '', totalPrice.toFixed(2)].join(',')
    ].join('\n');
    
    return csvContent;
  };

  // 导出Excel功能
  const handleExport = async () => {
    if (!advanceRecord) {
      message.warning('暂无数据可导出');
      return;
    }

    try {
      // 准备所有数据
      const allData: any[] = [];
      let totalPrice = 0;
      
      // 添加设备申请记录
      if (advanceRecord.equipment_apply_records && advanceRecord.equipment_apply_records.length > 0) {
        advanceRecord.equipment_apply_records.forEach((item: any) => {
          const price = parseFloat(item.price) || 0;
          totalPrice += price;
          allData.push({
            type: item.type || '',
            name: item.equipment || '',
            equipment: '', // 设备申请记录没有单独的equipment字段
            department: item.department || '',
            price: price,
          });
        });
      }

      // 添加器械医疗用品申请记录
      if (advanceRecord.instrument_apply_records && advanceRecord.instrument_apply_records.length > 0) {
        advanceRecord.instrument_apply_records.forEach((item: any) => {
          const price = parseFloat(item.price) || 0;
          totalPrice += price;
          allData.push({
            type: item.type || '',
            name: item.instrument || '',
            equipment: '', // 器械申请记录没有单独的equipment字段
            department: item.department || '',
            price: price,
          });
        });
      }

      // 添加设备维修申请记录
      if (advanceRecord.repair_apply_records && advanceRecord.repair_apply_records.length > 0) {
        advanceRecord.repair_apply_records.forEach((item: any) => {
          const price = parseFloat(item.price) || 0;
          totalPrice += price;
          allData.push({
            type: item.type || '维修配件',
            name: item.name || '',
            equipment: item.equipment || '',
            department: item.department || '',
            price: price,
          });
        });
      }

      if (allData.length === 0) {
        message.warning('暂无数据可导出');
        return;
      }

      // 生成CSV内容
      const headers = ['类型', '名称', '设备', '科室', '合同价格'];
      const fields = ['type', 'name', 'equipment', 'department', 'price'];
      const currentDate = new Date().toISOString().split('T')[0];
      
      const csvContent = generateCSV(allData, headers, fields, currentDate, totalPrice);
      
      // 添加BOM以确保Excel正确识别中文
      const BOM = new Uint8Array([0xEF, 0xBB, 0xBF]);
      const blob = new Blob([BOM, csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      // 下载文件
      const fileName = `回款记录_${currentDate}.csv`;
      saveAs(blob, fileName);
      message.success('导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败，请重试');
    }
  };

  return (
    <Modal
      title="回款"
      open={props.open}
      width={1000}
      onCancel={() => props.onCancel(props.selectedId)}
      footer={(
        <>
          <Button type="primary" onClick={() => props.onOk(props.selectedId)}>
            {props.okText}
          </Button>
          {
            props.rejectText && (
              <Button type="primary" onClick={() => props.onReject(props.selectedId)}>
                {props.rejectText}
              </Button>
            )
          }
          <Button type="primary" onClick={handleExport} style={{ marginRight: 8 }}>
            导出Excel
          </Button>
          <Button type="primary" onClick={() => props.onCancel(props.selectedId)}>
            {props.cancelText}
          </Button>
        </>
      )}
    >
      <AdvancePaybackCollapse
        equipment_apply_records={
          advanceRecord && advanceRecord.equipment_apply_records
            ? advanceRecord.equipment_apply_records
            : null
        }
        instrument_apply_records={
          advanceRecord && advanceRecord.instrument_apply_records
            ? advanceRecord.instrument_apply_records
            : null
        }
        repair_apply_records={
          advanceRecord && advanceRecord.repair_apply_records
            ? advanceRecord.repair_apply_records
            : null
        }
      />
    </Modal>
  );
};

export default AdvancePaybackModal;
