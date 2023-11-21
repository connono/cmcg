import React, { useEffect, useState } from 'react';

import { retrieveGetNewURL } from '@/utils/file-uploader';

interface Props {
  url?: string;
}

const PdfPreview: React.FC<Props> = (props) => {
  const [newURL, setNewURL] = useState<string>('');

  useEffect(() => {
    retrieveGetNewURL(props.url, setNewURL);
  }, []);

  if (!props.url) return <div>url无效</div>;

  return (
    <iframe src={newURL} width="600" height="800" style={{ border: 'none' }} />
  );
};

export default PdfPreview;
