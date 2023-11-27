import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import PreviewList from './PreviewList';

interface Props {
  fileListString: string;
}

const PreviewListModal: React.FC<Props> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div>
      <Button type="link" onClick={() => setIsModalOpen(true)}>
        点此查看
      </Button>
      <Modal
        width={1100}
        title="文件查看"
        maskClosable={true}
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={(_, { OkBtn }) => <OkBtn />}
      >
        <PreviewList fileListString={props.fileListString} />
      </Modal>
    </div>
  );
};

export default PreviewListModal;
