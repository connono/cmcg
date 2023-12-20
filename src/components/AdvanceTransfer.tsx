import { SERVER_HOST } from '@/constants';
import { useRequest } from '@umijs/max';
import { Modal, Transfer, Tree, message, theme } from 'antd';
import type { TransferDirection, TransferItem } from 'antd/es/transfer';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import React, { useState } from 'react';

interface TreeTransferProps {
  dataSource: any;
  targetKeys: string[];
  allPrices?: number;
  advanceBudget?: number;
  onChange: (
    targetKeys: string[],
    direction: TransferDirection,
    moveKeys: string[],
  ) => void;
}

interface Props {
  treeData: any;
  serverBudget: any;
  open: boolean;
  finish: () => void;
  cancel: () => void;
}

const isChecked = (selectedKeys: React.Key[], eventKey: React.Key) =>
  selectedKeys.includes(eventKey);

const generateTree = (treeNodes: any = [], checkedKeys: string[] = []): any =>
  treeNodes.map(({ children, ...props }) => ({
    ...props,
    disabled: checkedKeys.includes(props.key as string),
    children: generateTree(children, checkedKeys),
  }));

const createAdvanceRecord = async (treeData: any, targetKeys: string[]) => {
  const form = new FormData();
  const allItems = _.chain(targetKeys)
    .map((key: string) => {
      if (_.endsWith(key, 'E')) {
        const equipmentList = _.find(treeData, ['key', 'equipment']);
        return _.find(equipmentList.children, ['key', key]);
      } else if (_.endsWith(key, 'I')) {
        const instrumentList = _.find(treeData, ['key', 'instrument']);
        return _.find(instrumentList.children, ['key', key]);
      } else if (_.endsWith(key, 'M')) {
        const maintainList = _.find(treeData, ['key', 'maintain']);
        return _.find(maintainList.children, ['key', key]);
      }
      return null;
    })
    .value();
  const allPrice = _.sumBy(allItems, 'price');
  if (!allPrice) {
    message.error('总金额为零无法创建');
    return;
  }
  const serialEquipmentIds = _.chain(allItems)
    .filter((item: any) => _.endsWith(item.key, 'E'))
    .map((item: any) => item.id)
    .join('&')
    .value();
  const serialInstrumentIds = _.chain(allItems)
    .filter((item: any) => _.endsWith(item.key, 'I'))
    .map((item: any) => item.id)
    .join('&')
    .value();
  const serialMaintainIds = _.chain(allItems)
    .filter((item: any) => _.endsWith(item.key, 'M'))
    .map((item: any) => item.id)
    .join('&')
    .value();
  form.append('create_date', moment().format('YYYY-MM-DD'));
  if (serialEquipmentIds)
    form.append('serial_equipment_ids', serialEquipmentIds);
  if (serialInstrumentIds)
    form.append('serial_instrument_ids', serialInstrumentIds);
  if (serialMaintainIds) form.append('serial_maintain_ids', serialMaintainIds);
  form.append('all_price', allPrice.toString());
  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/advance/records/store`,
  });
};

const AdvanceTransfer: React.FC<TreeTransferProps> = ({
  dataSource,
  targetKeys,
  allPrices,
  advanceBudget,
  ...restProps
}) => {
  const { token } = theme.useToken();

  const transferDataSource: TransferItem[] = [];
  function flatten(list: any = []) {
    list.forEach((item) => {
      transferDataSource.push(item as TransferItem);
      flatten(item.children);
    });
  }
  flatten(dataSource);

  return (
    <Transfer
      {...restProps}
      targetKeys={targetKeys}
      dataSource={transferDataSource}
      className="tree-transfer"
      render={(item) => item.title!}
      showSelectAll={false}
      footer={(props, info) => {
        if (info?.direction === 'right') {
          const allPrice = _.sumBy(props.dataSource, 'price');
          return (
            <div style={{ display: 'flex', width: '100%' }}>
              <div style={{ flex: 1 }}>已累计{allPrice}元</div>
              <div style={{ flex: 1 }}>
                剩余预算为
                {!_.isUndefined(advanceBudget) && !_.isUndefined(allPrices)
                  ? advanceBudget - allPrices
                  : 0}
                元
              </div>
            </div>
          );
        }
      }}
    >
      {({ direction, onItemSelect, selectedKeys }) => {
        if (direction === 'left') {
          const checkedKeys = [...selectedKeys, ...targetKeys];
          return (
            <div style={{ padding: token.paddingXS }}>
              <Tree
                blockNode
                checkable
                checkStrictly
                defaultExpandAll
                checkedKeys={checkedKeys}
                treeData={generateTree(dataSource, targetKeys)}
                onCheck={(_, { node: { key } }) => {
                  onItemSelect(key as string, !isChecked(checkedKeys, key));
                }}
                onSelect={(_, { node: { key } }) => {
                  onItemSelect(key as string, !isChecked(checkedKeys, key));
                }}
              />
            </div>
          );
        }
      }}
    </Transfer>
  );
};

const AdvanceTransferModal: React.FC<Props> = (props) => {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const onChange = (keys: string[]) => {
    const allPrice = _.chain(keys)
      .map((key: string) => {
        if (_.endsWith(key, 'E')) {
          const equipmentList = _.find(props.treeData, ['key', 'equipment']);
          return _.find(equipmentList.children, ['key', key]);
        } else if (_.endsWith(key, 'I')) {
          const instrumentList = _.find(props.treeData, ['key', 'instrument']);
          return _.find(instrumentList.children, ['key', key]);
        } else if (_.endsWith(key, 'M')) {
          const maintainList = _.find(props.treeData, ['key', 'maintain']);
          return _.find(maintainList.children, ['key', key]);
        }
        return null;
      })
      .sumBy('price')
      .value();
    const remainBudget =
      !_.isUndefined(serverBudget.advance_budget) &&
      !_.isUndefined(serverBudget.all_prices)
        ? parseFloat(serverBudget.advance_budget) -
          parseFloat(serverBudget.all_prices)
        : 0;
    if (_.gte(remainBudget, allPrice)) {
      setTargetKeys(keys);
      message.success('添加成功!');
    } else {
      message.error('超过预算，无法添加!');
    }
  };

  const { run: runCreateAdvanceRecord } = useRequest(createAdvanceRecord, {
    manual: true,
    onSuccess: (result: any) => {
      console.log(result);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  return (
    <Modal
      title="制单"
      open={props.open}
      onOk={() => {
        runCreateAdvanceRecord(props.treeData, targetKeys);
        props.finish();
      }}
      onCancel={props.cancel}
      width={1000}
    >
      <AdvanceTransfer
        dataSource={props.treeData}
        targetKeys={targetKeys}
        onChange={onChange}
        allPrices={props.serverBudget.all_prices}
        advanceBudget={props.serverBudget.advance_budget}
      />
    </Modal>
  );
};

export default AdvanceTransferModal;
