import axios from 'axios';

export const generateXlsx = async (d, images) => {
  const data = new FormData();
  const dataString = JSON.stringify(d);
  const imageString = images.join('&');
  data.append('data', dataString);
  data.append('images', imageString);
  console.log('dataString', dataString);
  console.log('imageString', imageString);

  return await axios({
    method: 'POST',
    data: data,
    url: 'http://10.10.0.27:3300/generateXlsx',
  });
};

export const branchXlsx = async (excel_url, signature, position) => {
  const data = new FormData();
  data.append('excel_url', excel_url);
  data.append('signature', signature);
  data.append('position', position);
  return axios({
    method: 'POST',
    data: data,
    url: 'http://10.10.0.27:3300/branchXlsx',
  });
};
