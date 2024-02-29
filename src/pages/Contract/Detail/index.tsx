import EditableContractMonitorTable from '@/components/EditableContractTable/EditableContractMonitorTable';
import EditableContractProcessTable from '@/components/EditableContractTable/EditableContractProcessTable';
import PreviewListVisible from '@/components/PreviewListVisible';
import { SERVER_HOST } from '@/constants';
import { preview } from '@/utils/file-uploader';
import { DownloadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Access, history, useAccess, useRequest } from '@umijs/max';
import { Divider, FloatButton, Tabs, TabsProps, message } from 'antd';
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
  const access = useAccess();

  const { run: runGetItem } = useRequest(getItem, {
    manual: true,
    onSuccess: (result: any) => {
      if (result.data.contract_docx) {
        preview(result.data.contract_docx, (file: File) => {
          setDoc(file);
          docx.renderAsync(
            file.arrayBuffer(),
            //@ts-ignore
            document.getElementById('preview'),
          );
        });
      }
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '服务型合同',
      children: <EditableContractMonitorTable />,
    },
    {
      key: '2',
      label: '固定资产',
      children: <EditableContractProcessTable />,
    },
  ];

  useEffect(() => {
    runGetItem(id);
  }, []);

  return (
    <PageContainer ghost>
      <div
        id="preview"
        style={{ height: '1200px', margin: '0 40px', overflowY: 'visible' }}
      ></div>
      <div style={{ margin: '0 40px' }}>
        <PreviewListVisible
          fileListString={history.location.state.contract_file}
        />
      </div>
      <Access
        key="can_create_contract_process"
        accessible={access.canCreateContractProcess}
      >
        <Divider>
          <span
            style={{
              fontSize: '22px',
              fontWeight: 'bold',
            }}
          >
            执行列表
          </span>
        </Divider>
        <Tabs defaultActiveKey="1" items={items} />
      </Access>

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
