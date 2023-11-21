import { Button } from 'antd';
import React, { useState } from 'react';
import PreviewList from './PreviewList';

interface Props {
  fileListString: string;
}

const PreviewListVisible: React.FC<Props> = (props) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <div>
      合同信息：
      <Button type="link" onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? '点击收起' : '点击查看'}
      </Button>
      <div
        style={{
          display: isVisible ? 'block' : 'none',
        }}
      >
        <PreviewList fileListString={props.fileListString} />
      </div>
    </div>
  );
};

export default PreviewListVisible;
