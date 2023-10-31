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
    <div style={{ display: 'flex', backgroundColor: 'black' }}>
      <div
        onClick={props.handleBack}
        style={{ marginRight: '10px', lineHeight: '20px', textAlign: 'center' }}
      >
        前一页
      </div>
      <div
        onClick={props.handleForward}
        style={{ marginRight: '10px', lineHeight: '20px', textAlign: 'center' }}
      >
        后一页
      </div>
      <p style={{ lineHeight: '20px', textAlign: 'center' }}>
        当前页面： {props.pageNumber} 总页数： {props.numPages}
      </p>
      <div
        onClick={props.handleShrink}
        style={{
          marginLeft: '10px',
          marginRight: '10px',
          lineHeight: '20px',
          textAlign: 'center',
        }}
      >
        缩小
      </div>
      <div
        onClick={props.handleAlt}
        style={{ marginRight: '10px', lineHeight: '20px', textAlign: 'center' }}
      >
        放大
      </div>
    </div>
  );
};

export default PdfPreviewToolbar;
