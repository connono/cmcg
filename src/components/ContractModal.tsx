import { SERVER_HOST } from '@/constants';
import { fileListToString, upload } from '@/utils/file-uploader';
import {
  ModalForm,
  ProForm,
  ProFormCheckbox,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import React from 'react';
import CapitalSourceInput from './CapitalSourceInput';

interface ContractModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  formRef: any;
  actionRef?: any;
}

const createContract = async (
  contract_name: string,
  category: string,
  contractor: string,
  source: any,
  price: number,
  isImportant: boolean,
  contract_file: any,
  comment: string,
  complementation_agreements: any,
) => {
  const form = new FormData();
  if (source.type === '更多') {
    form.append('source', source.more);
  } else {
    form.append('source', source.type);
  }
  form.append('contract_name', contract_name);
  form.append('category', category);
  form.append('contractor', contractor);
  form.append('price', price.toString());
  form.append('isImportant', isImportant.toString());
  form.append('contract_file', fileListToString(contract_file));
  form.append('comment', comment);
  form.append(
    'complementation_agreements',
    fileListToString(complementation_agreements),
  );

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/contracts/store`,
  });
};

const ContractModal: React.FC<ContractModalProps> = (props) => {
  const { run: runCreateContract } = useRequest(createContract, {
    manual: true,
    onSuccess: () => {
      message.success('创建成功');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const handleUpload = (
    isSuccess: boolean,
    filename: string,
    field: string,
    uid: string,
  ) => {
    const payment_file = props.formRef.current?.getFieldValue(field);
    const current_payment_file = _.find(payment_file, (file: any) => {
      return file.uid === uid;
    });
    const other_payment_files = _.filter(payment_file, (file: any) => {
      return file.uid !== uid;
    });
    if (isSuccess) {
      props.formRef.current?.setFieldValue(field, [
        ...other_payment_files,
        {
          ...current_payment_file,
          status: 'done',
          percent: 100,
          filename,
        },
      ]);
    } else {
      props.formRef.current?.setFieldValue(field, [
        ...other_payment_files,
        {
          ...current_payment_file,
          status: 'error',
          percent: 100,
          filename,
        },
      ]);
    }
  };

  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      title="创建合同"
      formRef={props.formRef}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.setModalVisible(false),
      }}
      open={props.modalVisible}
      submitTimeout={2000}
      onFinish={async (values: any) => {
        runCreateContract(
          values.contract_name,
          values.category,
          values.contractor,
          values.source,
          values.price,
          values.isImportant,
          values.contract_file,
          values.comment,
          values.complementation_agreements,
        );
        props.setModalVisible(false);
        if (props.actionRef) props.actionRef.current?.reload();
      }}
    >
      <ProFormText
        width="md"
        name="contract_name"
        label="合同名称"
        placeholder="请输入合同名称"
        rules={[{ required: true }]}
      />
      <ProFormSelect
        label="类型"
        name="category"
        width="md"
        valueEnum={{
          JJ: { text: '基建项目', status: 'JJ' },
          YP: { text: '药品采购', status: 'YP' },
          XX: { text: '信息采购', status: 'XX' },
          XS: { text: '医疗协商', status: 'XS' },
          HZ: { text: '医疗合作', status: 'HZ' },
          ZW: { text: '物资采购', status: 'ZW' },
          FW: { text: '服务项目', status: 'FW' },
          QX: { text: '器械采购', status: 'QX' },
        }}
        rules={[{ required: true }]}
      />
      <ProFormText
        width="md"
        name="contractor"
        label="签订对象"
        placeholder="请输入签订对象"
        rules={[{ required: true }]}
      />
      <ProForm.Item name="source" label="资金来源" rules={[{ required: true }]}>
        <CapitalSourceInput />
      </ProForm.Item>
      <ProForm.Group labelLayout="inline">
        <ProFormDigit
          width="md"
          name="price"
          label="金额"
          placeholder="请输入金额"
          rules={[{ required: true }]}
        />
        <ProFormCheckbox name="isImportant" label="是否为重大项目" width="sm" />
      </ProForm.Group>
      <ProFormUploadButton
        label="合同附件："
        name="contract_file"
        fieldProps={{
          customRequest: (options) => {
            upload(options.file, (isSuccess: boolean, filename: string) =>
              handleUpload(
                isSuccess,
                filename,
                'contract_file',
                options.file.uid,
              ),
            );
          },
        }}
        rules={[{ required: true }]}
      />
      <ProFormTextArea
        width="md"
        name="comment"
        label="备注"
        placeholder="请输入备注"
      />
      <ProFormUploadButton
        label="补充协议："
        name="complementation_agreements"
        fieldProps={{
          customRequest: (options) => {
            upload(options.file, (isSuccess: boolean, filename: string) =>
              handleUpload(
                isSuccess,
                filename,
                'complementation_agreements',
                options.file.uid,
              ),
            );
          },
        }}
      />
    </ModalForm>
  );
};

export default ContractModal;
