import axios from 'axios';

export const generateWord = async (contractInformation) => {
  const data = new FormData();
  data.append('contract_name', contractInformation.contract_name);
  data.append('isComplement', contractInformation.isComplement);
  data.append('series_number', contractInformation.series_number);
  data.append('contractor', contractInformation.contractor);
  data.append('category', contractInformation.category);
  data.append('source', contractInformation.source);
  data.append('price', contractInformation.price);
  data.append('isImportant', contractInformation.isImportant);
  data.append('comment', contractInformation.comment);

  return await axios({
    method: 'POST',
    data: data,
    url: 'http://localhost:3000/generateDocument',
  });
};
