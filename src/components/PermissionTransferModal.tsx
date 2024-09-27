import type { TransferProps } from 'antd';
import { Modal, Transfer } from 'antd';
import _ from 'lodash';
import React, { useState } from 'react';

interface PermissionTransferModalProps {
  visible: boolean;
  onLeave: any;
  selectedPermissions: any;
  restPermissions: any;
  allPermissions: any;
  handleUpdate: any;
}

const PermissionTransferModal: React.FC<PermissionTransferModalProps> = (
  props,
) => {
  const initialTargetKeys = props.selectedPermissions.map(
    (item: any) => item.key,
  );

  const [targetKeys, setTargetKeys] =
    useState<TransferProps['targetKeys']>(initialTargetKeys);
  const [selectedKeys, setSelectedKeys] = useState<TransferProps['targetKeys']>(
    [],
  );
  // console.log('props',props);
  const onChange: TransferProps['onChange'] = (nextTargetKeys: any) => {
    // console.log('targetKeys:', nextTargetKeys);
    // console.log('direction:', direction);
    // console.log('moveKeys:', moveKeys);
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange: TransferProps['onSelectChange'] = (
    sourceSelectedKeys,
    targetSelectedKeys,
  ) => {
    // console.log('sourceSelectedKeys:', sourceSelectedKeys);
    // console.log('targetSelectedKeys:', targetSelectedKeys);
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onOk = async () => {
    const permissions = _.map(targetKeys, (item: any) => {
      return _.find(props.allPermissions, (p: any) => {
        return p.key === item;
      });
    });
    const permissions_array = _.map(permissions, (item: any) => {
      return item.title;
    });

    const permissions_text = permissions_array.join('&');

    await props.handleUpdate(permissions_text);

    props.onLeave();
  };

  return (
    <Modal
      title="权限分配"
      open={props.visible}
      onCancel={props.onLeave}
      onOk={onOk}
      width={1000}
    >
      <Transfer
        dataSource={props.allPermissions}
        titles={['未授权', '已授权']}
        targetKeys={targetKeys}
        selectedKeys={selectedKeys}
        onChange={onChange}
        onSelectChange={onSelectChange}
        render={(item) => item.title}
        listStyle={{
          height: 400,
          width: 1600,
        }}
      />
    </Modal>
  );
};

export default PermissionTransferModal;
