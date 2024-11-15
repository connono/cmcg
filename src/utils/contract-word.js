import axios from 'axios';

export const generateWord = async (contractInformation) => {
  const data = new FormData();
  data.append('contract_name', contractInformation.contract_name);
  data.append('type', contractInformation.type);
  data.append('isComplement', contractInformation.isComplement);
  data.append('complement_code', contractInformation.complement_code);
  data.append('series_number', contractInformation.series_number);
  data.append('contractor', contractInformation.contractor);
  data.append('category', contractInformation.category);
  data.append('purchase_type', contractInformation.purchase_type);
  data.append('source', contractInformation.source);
  data.append('price', contractInformation.price);
  data.append('isImportant', contractInformation.isImportant);
  data.append('dean_type', contractInformation.dean_type);
  data.append('law_advice', contractInformation.law_advice);
  data.append('comment', contractInformation.comment);
  data.append('is_pay', contractInformation.is_pay);

  return await axios({
    method: 'POST',
    data: data,
    url: 'http://10.10.0.27:3300/generateDocument',
  });
};
