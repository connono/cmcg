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
    (<div style={{display:'flex'}}>
      <div onClick={props.handleBack}>回退</div>
      <div onClick={props.handleForward}>前进</div>
      <p>
          当前页面： {props.pageNumber} 总页数： {props.numPages}
      </p>
      <div onClick={props.handleShrink}>缩小</div>
      <div onClick={props.handleAlt}>放大</div>
    </div>)
  );
};

export default PdfPreviewToolbar;
