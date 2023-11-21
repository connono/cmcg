import { fileStringToList, isPDF, isPicture } from '@/utils/file-uploader';
import { List } from 'antd';
import _ from 'lodash';
import React from 'react';
import PdfPreview from './PdfPreview';
import PicturePreview from './PicturePreview';

interface Props {
  fileListString: string;
}

const PreviewList: React.FC<Props> = (props) => {
  const fileList = fileStringToList(props.fileListString);

  return (
    <List
      itemLayout="horizontal"
      dataSource={fileList}
      renderItem={(item: string) => {
        if (isPDF(item))
          return (
            <List.Item>
              <List.Item.Meta
                title={`文件名称：${_.split(item, '/')[1]}`}
                description={<PdfPreview url={item} />}
              />
            </List.Item>
          );
        if (isPicture(item))
          return (
            <List.Item>
              <List.Item.Meta
                title={`文件名称：${_.split(item, '/')[1]}`}
                description={<PicturePreview url={item} />}
              />
            </List.Item>
          );
      }}
    />
  );
};

export default PreviewList;
