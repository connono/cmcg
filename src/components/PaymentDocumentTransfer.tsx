import { SERVER_HOST } from '@/constants';
import { generateXlsx } from '@/utils/xlsx';
import { useModel, useRequest } from '@umijs/max';
import { Modal, Transfer, Tree, message, theme } from 'antd';
import type { TransferDirection, TransferItem } from 'antd/es/transfer';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import React, { useState } from 'react';

interface TreeTransferProps {
  dataSource: any;
  targetKeys: string[];
  onChange: (
    targetKeys: string[],
    direction: TransferDirection,
    moveKeys: string[],
  ) => void;
}

interface Props {
  treeData: any;
  department: string;
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

const storeXlsx = async (url: string, id: number) => {
  const form = new FormData();
  form.append('excel_url', url);
  const data = await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/document/records/storeXlsx/${id}`,
  });
  return data;
};

const createPaymentDocument = async (
  treeData: any,
  targetKeys: string[],
  user_id: string,
  department: string,
) => {
  const form = new FormData();
  const allItems = _.chain(targetKeys)
    .map((key: string) => {
      console.log(key);
      if (_.endsWith(key, 'P')) {
        const processRecordList = _.find(treeData, ['key', 'payment_process']);
        return _.find(processRecordList.children, ['key', key]);
      }
      return null;
    })
    .value();
  console.log('allItems', allItems);
  const allPrice = _.sumBy(allItems, 'assessment');
  if (!allPrice) {
    message.error('总金额为零无法创建');
    return;
  }
  const serialProcessRecordIds = _.chain(allItems)
    .filter((item: any) => _.endsWith(item.key, 'P'))
    .map((item: any) => parseInt(item.id))
    .join('&')
    .value();
  // const serialInstrumentIds = _.chain(allItems)
  //   .filter((item: any) => _.endsWith(item.key, 'I'))
  //   .map((item: any) => item.id)
  //   .join('&')
  //   .value();
  // const serialMaintainIds = _.chain(allItems)
  //   .filter((item: any) => _.endsWith(item.key, 'M'))
  //   .map((item: any) => item.id)
  //   .join('&')
  //   .value();
  form.append('create_date', moment().format('YYYY-MM-DD'));
  if (serialProcessRecordIds)
    form.append('serial_process_record_ids', serialProcessRecordIds);
  // if (serialInstrumentIds)
  //   form.append('serial_instrument_ids', serialInstrumentIds);
  // if (serialMaintainIds) form.append('serial_maintain_ids', serialMaintainIds);
  form.append('all_price', allPrice.toString());
  form.append('user_id', user_id);
  form.append('department', department);
  const data = await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/document/records/store`,
  })
    .then((result) => {
      return result.data;
    })
    .catch((err) => {
      console.log(err);
    });
  const afterData = _.map(data.data, (object: any) => {
    return _.values(object ? object : '');
  });
  await generateXlsx(afterData)
    .then((result) => {
      storeXlsx(result.data, data.id);
    })
    .catch((err) => console.log(err));
};

const PaymentDocumentTransfer: React.FC<TreeTransferProps> = ({
  dataSource,
  targetKeys,
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

const PaymentDocumentTransferModal: React.FC<Props> = (props) => {
  const { initialState } = useModel('@@initialState');
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const onChange = (keys: string[]) => {
    setTargetKeys(keys);
    message.success('添加成功!');
  };

  const { run: runCreatePaymentDocumentRecord } = useRequest(
    createPaymentDocument,
    {
      manual: true,
      onSuccess: (result: any) => {
        setTargetKeys([]);
        console.log(result);
      },
      onError: (error: any) => {
        message.error(error.message);
      },
    },
  );

  return (
    <Modal
      title="制单"
      open={props.open}
      onOk={() => {
        runCreatePaymentDocumentRecord(
          props.treeData,
          targetKeys,
          initialState.id,
          props.department,
        );
        props.finish();
      }}
      onCancel={props.cancel}
      width={1000}
    >
      <PaymentDocumentTransfer
        dataSource={props.treeData}
        targetKeys={targetKeys}
        onChange={onChange}
      />
    </Modal>
  );
};

export default PaymentDocumentTransferModal;
