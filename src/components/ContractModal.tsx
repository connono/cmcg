import { SERVER_HOST } from '@/constants';
import { generateWord } from '@/utils/contract-word';
import { fileListToString, upload } from '@/utils/file-uploader';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Button, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import React, { useRef, useState } from 'react';
import CapitalSourceInput from './CapitalSourceInput';

interface ContractModalProps {
  callback?: (formRef: any) => void;
}

const createContract = async (
  contract_name: string,
  category: string,
  contractor: string,
  source: any,
  price: number,
  isImportant: string,
  contract_file: any,
  comment: string,
  isComplement: string,
  payment_terms: string,
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
  form.append('isImportant', isImportant);
  form.append('contract_file', fileListToString(contract_file));
  form.append('comment', comment);
  form.append('isComplement', isComplement);
  form.append('payment_terms', payment_terms);

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/contracts/store`,
  });
};

const storeDocx = async (id: number, contract_docx: string) => {
  const form = new FormData();
  form.append('contract_docx', contract_docx);

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/contracts/storeDocx/${id}`,
  });
};

const ContractModal: React.FC<ContractModalProps> = (props) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const formRef = useRef<ProFormInstance>();

  const { run: runStoreDocx } = useRequest(storeDocx, {
    manual: true,
    onSuccess: () => {
      message.success('存入备案文档成功');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runCreateContract } = useRequest(createContract, {
    manual: true,
    onSuccess: (res: any) => {
      message.success('创建成功');
      generateWord(res.data).then((response) => {
        runStoreDocx(res.data.id, response.data);
      });
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
    const payment_file = formRef.current?.getFieldValue(field);
    const current_payment_file = _.find(payment_file, (file: any) => {
      return file.uid === uid;
    });
    const other_payment_files = _.filter(payment_file, (file: any) => {
      return file.uid !== uid;
    });
    if (isSuccess) {
      formRef.current?.setFieldValue(field, [
        ...other_payment_files,
        {
          ...current_payment_file,
          status: 'done',
          percent: 100,
          filename,
        },
      ]);
    } else {
      formRef.current?.setFieldValue(field, [
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
    <div key="contract">
      <Button key="button" onClick={() => setModalVisible(true)} type="primary">
        创建合同
      </Button>
      <ModalForm<{
        name: string;
        company: string;
      }>
        title="创建合同"
        formRef={formRef}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => setModalVisible(false),
        }}
        open={modalVisible}
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
            values.comment ? values.comment : '',
            values.isComplement,
            values.payment_terms,
          );
          setModalVisible(false);
          if (props.callback) props.callback(formRef);
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
        <ProForm.Item
          name="source"
          label="资金来源"
          rules={[{ required: true }]}
        >
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
          <ProFormRadio.Group
            name="isImportant"
            label="是否为重大项目"
            width="sm"
            valueEnum={{
              true: { text: '是' },
              false: { text: '否' },
            }}
            rules={[{ required: true }]}
          />
          <ProFormRadio.Group
            name="isComplement"
            label="是否为补充协议"
            width="sm"
            valueEnum={{
              true: { text: '是' },
              false: { text: '否' },
            }}
            rules={[{ required: true }]}
          />
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
          name="payment_terms"
          label="合同支付条件"
          placeholder="请输入合同支付条件"
        />
        <ProFormTextArea
          width="md"
          name="comment"
          label="备注"
          placeholder="请输入备注"
        />
      </ModalForm>
    </div>
  );
};

export default ContractModal;
