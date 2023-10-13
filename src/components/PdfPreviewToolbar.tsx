import React from 'react';

interface Props {
  handleBack: any;
  handleForward: any;
  handleShrink: any;
  handleAlt: any;
  pageNumber: number;
  numPages: number;
}

const PdfPreviewToolbar: React.FC<Props> = (props) => {
  return (
    <div style={{ display: 'flex' }}>
      <div onClick={props.handleBack} style={{ marginRight: '10px' }}>
        前一页
      </div>
      <div onClick={props.handleForward} style={{ marginRight: '10px' }}>
        后一页
      </div>
      <p>
        当前页面： {props.pageNumber} 总页数： {props.numPages}
      </p>
      <div onClick={props.handleShrink} style={{ marginRight: '10px' }}>
        缩小
      </div>
      <div onClick={props.handleAlt} style={{ marginRight: '10px' }}>
        放大
      </div>
    </div>
  );
};

export default PdfPreviewToolbar;
