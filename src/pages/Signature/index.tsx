import { SERVER_HOST } from '@/constants';
import { PageContainer } from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import { Button, message } from 'antd';
import axios from 'axios';
import { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const setSignature = async (id: number, signature_picture: string) => {
  return await axios({
    method: 'POST',
    data: {
      signature_picture,
    },
    url: `${SERVER_HOST}/users/setSignature/${id}`,
  });
};

function base64ToBlob(base64Str: string) {
  const parts = base64Str.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

const SetSignaturePage: React.FC = () => {
  const sigCanvas = useRef({});
  const { initialState } = useModel('@@initialState');
  const { run: runSetSignature } = useRequest(setSignature, {
    manual: true,
    onSuccess: () => {
      message.success('设置电子标签成功');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const clearCanvas = () => {
    //@ts-ignore
    sigCanvas.current.clear();
  };

  const getCanvasImage = () => {
    //@ts-ignore
    const canvas = sigCanvas.current.getTrimmedCanvas();
    const base64Str = canvas.toDataURL();
    const originBlob = base64ToBlob(base64Str);
    const imageUrl = URL.createObjectURL(originBlob);
    const originalImage = new Image();
    originalImage.src = imageUrl;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    originalImage.onload = () => {
      canvas.setAttribute('height', 60);
      canvas.setAttribute('width', 100);
      ctx.drawImage(originalImage, 0, 0, width, height, 0, 0, 100, 60);
      const dataURL = canvas.toDataURL('image/png');
      console.log(canvas, base64Str, dataURL);
      runSetSignature(initialState?.id, dataURL);
    };
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '设置电子签名',
      }}
    >
      <div
        style={{
          border: '1px solid black',
          width: 400,
          height: 200,
          margin: '0 auto',
        }}
      >
        <SignatureCanvas
          penColor="black"
          canvasProps={{
            width: 400,
            height: 200,
            className: 'signature-canvas',
          }}
          ref={sigCanvas}
        />
      </div>
      <Button onClick={getCanvasImage}>提交签名</Button>
      <Button onClick={clearCanvas}>重新签名</Button>
    </PageContainer>
  );
};

export default SetSignaturePage;
