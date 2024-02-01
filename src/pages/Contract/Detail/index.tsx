import { SERVER_HOST } from '@/constants';
import { preview } from '@/utils/file-uploader';
import { DownloadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, useRequest } from '@umijs/max';
import { FloatButton, message } from 'antd';
import axios from 'axios';
import * as docx from 'docx-preview';
import { saveAs } from 'file-saver';
import React, { useEffect, useState } from 'react';

const getItem = async (id: string) => {
  return await axios.get(`${SERVER_HOST}/payment/contracts/getItem?id=${id}`);
};

const ContractDetailPage: React.FC = () => {
  const hashArray = history.location.hash.split('#')[1].split('&');
  const id = hashArray[0];
  const [doc, setDoc] = useState();

  const { run: runGetItem } = useRequest(getItem, {
    manual: true,
    onSuccess: (result: any) => {
      if (result.data.contract_docx) {
        preview(result.data.contract_docx, (file: File) => {
          setDoc(file);
          //@ts-ignore
          docx.renderAsync(
            file.arrayBuffer(),
            document.getElementById('preview'),
          );
        });
      }
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  useEffect(() => {
    runGetItem(id);
  }, []);

  return (
    <PageContainer ghost>
      <div
        id="preview"
        style={{ height: '1200px', margin: '0 40px', overflowY: 'visible' }}
      ></div>
      <FloatButton.Group shape="square" style={{ right: 50 }}>
        <FloatButton
          icon={<DownloadOutlined />}
          tooltip={<span>下载备案表</span>}
          onClick={() => {
            saveAs(doc);
          }}
        />
      </FloatButton.Group>
    </PageContainer>
  );
};

export default ContractDetailPage;
