import { Button } from 'antd';
import React, { useState } from 'react';
import PreviewList from './PreviewList';

interface Props {
  title?: string;
  fileListString: string;
}

const PreviewListVisible: React.FC<Props> = (props) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <div>
      {props.title}：
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
