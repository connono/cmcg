import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

export const DomToPng = (nodeId: string) => {
  const node = document.getElementById(nodeId);
  domtoimage.toBlob(node).then((blob: any) => {
    console.log('blob:', blob);
    saveAs(blob, nodeId + '_' + Date.now() + '.png');
  });
};
