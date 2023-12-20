import { SERVER_HOST } from '@/constants';
import { useRequest } from '@umijs/max';
import type { CollapseProps } from 'antd';
import { Collapse, List, Modal, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import PreviewListVisible from './PreviewListVisible';

interface Props {
  open: boolean;
  selectedId?: number;
  finish: () => void;
  cancel: () => void;
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

const paybackAdvanceRecord = async (id?: number) => {
  if (!id) return [];
  const form = new FormData();
  form.append('payback_date', moment().format('YYYY-MM-DD'));
  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/advance/records/update/${id}`,
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
                <PreviewListVisible fileListString={item.purchase_picture} />
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
                <PreviewListVisible fileListString={item.purchase_picture} />
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
                <PreviewListVisible fileListString={item.install_file} />
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
      console.log(result);
      setAdvanceRecord(result.data[0]);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runPaybackAdvanceRecord } = useRequest(paybackAdvanceRecord, {
    manual: true,
    onSuccess: (result: any) => {
      console.log(result);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  useEffect(() => {
    runGetAdvanceRecord(props.selectedId);
  }, [props.selectedId]);

  return (
    <Modal
      title="回款"
      open={props.open}
      onOk={() => {
        runPaybackAdvanceRecord(props.selectedId);
        message.success('已确认回款');
        props.finish();
      }}
      okButtonProps={{
        disabled: !(advanceRecord && advanceRecord === '1'),
      }}
      okText="确认回款"
      onCancel={props.cancel}
      width={1000}
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
