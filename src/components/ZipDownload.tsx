import { retrieveGetNewURL } from '@/utils/file-uploader';
import { DownloadOutlined } from '@ant-design/icons';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';

interface Props {
  url?: string;
}

const ZipDownload: React.FC<Props> = (props) => {
  const [newURL, setNewURL] = useState<string>('');

  const onDownload = () => {
    fetch(newURL)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.download = _.split(props.url, '/')[1];
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        link.remove();
      });
  };

  useEffect(() => {
    retrieveGetNewURL(props.url, setNewURL);
  }, []);
  if (!props.url) return <div>url无效</div>;
  return (
    <div style={{ cursor: 'pointer' }} onClick={onDownload}>
      点此下载
      <DownloadOutlined />
    </div>
  );
};

export default ZipDownload;
