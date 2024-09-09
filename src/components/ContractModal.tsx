import { SERVER_HOST } from '@/constants';
import { generateWord } from '@/utils/contract-word';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { history, useRequest } from '@umijs/max';
import { Button, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import CapitalSourceInput from './CapitalSourceInput';

interface ContractModalProps {
  callback?: (formRef: any) => void;
}

const deleteNotification = async (id: string) => {
  return await axios.delete(`${SERVER_HOST}/notifications/delete?id=${id}`);
};

const createContract = async (
  contract_name: string,
  type: string,
  complement_code: string,
  department_source: string,
  category: string,
  purchase_type: string,
  contractor: string,
  source: any,
  price: number,
  dean_type: string,
  law_advice: string,
  isImportant: string,
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
  form.append('type', type);
  form.append('complement_code', complement_code);
  form.append('department_source', department_source);
  form.append('category', category);
  form.append('contractor', contractor);
  form.append('price', price.toString());
  form.append('dean_type', dean_type);
  form.append('law_advice', law_advice);
  form.append('isImportant', isImportant);
  form.append('purchase_type', purchase_type);
  form.append('comment', comment ? comment : '无');
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
  const hashArray = history.location.hash
    ? history.location.hash.split('#')[1].split('&')
    : [];
  console.log(hashArray);
  const { run: runStoreDocx } = useRequest(storeDocx, {
    manual: true,
    onSuccess: () => {
      message.success('存入备案文档成功');
      if (hashArray[1]) {
        console.log(hashArray[1]);
        deleteNotification(hashArray[1]);
      }
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

  const initialModal = () => {
    const data = history.location.state;
    _.mapKeys(data, (value: any, key: string) => {
      if (key === 'complement_code') {
        if (value && value !== 'undefined') {
          formRef.current?.setFieldValue(key, value);
        } else {
          formRef.current?.setFieldValue(key, '');
        }
      } else if (key === 'source') {
        formRef.current?.setFieldValue(key, {
          type: value,
        });
      } else {
        formRef.current?.setFieldValue(key, value);
      }
    });
  };

  useEffect(() => {
    if (hashArray[0] === 'create') {
      setModalVisible(true);
      setTimeout(() => {
        initialModal();
      }, 100);
    }
  }, []);

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
            values.type,
            values.complement_code,
            values.department_source,
            values.category,
            values.purchase_type,
            values.contractor,
            values.source,
            values.price,
            values.dean_type,
            values.law_advice,
            values.isImportant,
            values.comment ? values.comment : '',
            values.isComplement,
            values.payment_terms ? values.payment_terms : '',
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
        <ProFormRadio.Group
          name="type"
          label="请选择"
          width="sm"
          valueEnum={{
            create: { text: '新签' },
            update: { text: '变更' },
          }}
          rules={[{ required: true }]}
        />
        <ProFormText
          label="变更合同编码"
          width="md"
          name="complement_code"
          placeholder="请输入合同编码"
        />
        <ProFormSelect
          label="归口码"
          name="department_source"
          width="md"
          valueEnum={{
            ZW: { text: '总务归口' },
            YJ: { text: '药剂归口' },
            XX: { text: '信息归口' },
            YH: { text: '医患协商' },
            CW: { text: '财务归口' },
            YW: { text: '医务归口' },
            CG: { text: '采购归口' },
            YG: { text: '医工归口' },
            DZ: { text: '党政归口' },
            RS: { text: '人事归口' },
            KJ: { text: '科教归口' },
            HL: { text: '护理归口' },
            BW: { text: '保卫归口' },
            GW: { text: '公卫归口' },
          }}
          rules={[{ required: true }]}
        />
        <ProFormSelect
          label="类型"
          name="category"
          width="md"
          valueEnum={{
            JJXM: { text: '基建项目' },
            YPCG: { text: '药品采购' },
            XXCG: { text: '信息采购' },
            QXCG: { text: '器械采购' },
            QRHZ: { text: '金融合作' },
            WZCG: { text: '物资采购' },
            YLHZ: { text: '医疗合作' },
            YLXS: { text: '医疗协商' },
            DSFFW: { text: '第三方服务' },
            QT: { text: '其他' },
          }}
          rules={[{ required: true }]}
        />
        <ProFormSelect
          label="采购类型"
          name="purchase_type"
          width="md"
          valueEnum={{
            GKZB: { text: '公开招标' },
            DYLYCG: { text: '单一来源采购' },
            JZXCS: { text: '竞争性磋商' },
            YQZB: { text: '邀请招标' },
            XQ: { text: '续签' },
            JZXTP: { text: '竞争性谈判' },
            ZFZB: { text: '政府招标采购目录内服务商' },
            XJ: { text: '询价' },
            QT: { text: '其他' },
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
        <ProFormRadio.Group
          name="dean_type"
          label="签署人"
          width="sm"
          valueEnum={{
            charge_dean: { text: '分管院长' },
            dean: { text: '院长' },
          }}
          rules={[{ required: true }]}
        />
        <ProFormRadio.Group
          name="law_advice"
          label="法律意见"
          width="sm"
          valueEnum={{
            written_request: { text: '书面征询' },
            oral_inquiry: { text: '口头征询' },
            none: { text: '无' },
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
