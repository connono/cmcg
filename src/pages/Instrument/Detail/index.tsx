import { PageContainer } from '@ant-design/pro-components';
//@ts-ignore
import PreviewListModal from '@/components/PreviewListModal';
import { SERVER_HOST } from '@/constants';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProCard,
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormMoney,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
  StepsForm,
  ProForm,
  ProFormDigit,
  ProFormRadio,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { history, useRequest } from '@umijs/max';
import { Button, Modal, Steps, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import {
  fileListToString,
  fileStringToAntdFileList,
  upload,
} from '../../../utils/file-uploader';
import { generateWord } from '@/utils/contract-word';
import CapitalSourceInput from '@/components/CapitalSourceInput';

const formatDate = (date: any) => {
  console.log('date:', date);
  if (_.isString(date)) return date;
  if (!date.$isDayjsObject) return null;
  return date.format('YYYY-MM-DD');
};

const getItem = async (id: string) => {
  return await axios.get(`${SERVER_HOST}/instrument/item?id=${id}`);
};

const getSerialNumber = async () => {
  return await axios.get(`${SERVER_HOST}/instrument/serialNumber`);
};

const getAllDepartments = async () => {
  return await axios.get(`${SERVER_HOST}/department/index`);
};

const apply = async (
  serial_number: number,
  instrument: string,
  department: string,
  count: number,
  budget: number,
  apply_picture: string,
) => {
  const form = new FormData();
  form.append('serial_number', serial_number.toString());
  form.append('instrument', instrument);
  form.append('department', department);
  form.append('count', count.toString());
  form.append('budget', budget.toString());
  form.append('apply_picture', fileListToString(apply_picture));

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/instrument/store`,
  });
};

const survey = async (
  id: string,
  survey_date: Date,
  survey_picture: string,
) => {
  const form = new FormData();
  form.append('survey_date', formatDate(survey_date));
  form.append('survey_picture', fileListToString(survey_picture));

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/instrument/update/survey/${id}`,
  });
};

const createContract = async (
  instrument_apply_record_id: string,
  contract_name: string,
  category: string,
  contractor: string,
  source: any,
  price: number,
  isImportant: string,
  contract_file: any,
  comment: string,
  isComplement: string,
) => {
  const form = new FormData();
  if (source.type === '更多') {
    form.append('source', source.more);
  } else {
    form.append('source', source.type);
  }
  form.append('instrument_apply_record_id', instrument_apply_record_id);
  form.append('contract_name', contract_name);
  form.append('category', category);
  form.append('contractor', contractor);
  form.append('price', price.toString());
  form.append('isImportant', isImportant);
  form.append('contract_file', fileListToString(contract_file));
  form.append('comment', comment);
  form.append('isComplement', isComplement);

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/payment/contracts/store`,
  });
};

const install = async (
  id: string,
  isAdvance: boolean,
  install_picture: string,
) => {
  const form = new FormData();
  form.append('install_picture', fileListToString(install_picture));
  form.append('isAdvance', isAdvance.toString());

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/instrument/update/install/${id}`,
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

const InstrumentDetailPage: React.FC = () => {
  const [instrumentItem, setInstrumentItem] = useState<any>({});
  const hashArray = history.location.hash.split('#')[1].split('&');
  const method = hashArray[0];
  const id = hashArray[1];
  const [modal, contextHolder] = Modal.useModal();
  const formRef = useRef<ProFormInstance>();
  const [current, setCurrent] = useState<number>(0);
  const { run: runGetItem } = useRequest(getItem, {
    manual: true,
    onSuccess: (result: any) => {
      setInstrumentItem({
        ...result.data,
        status: parseInt(result.data.status),
      });
      setCurrent(parseInt(result.data.status));
      _.forEach(result.data, (key: any, value: any) => {
        const length = value.split('_').length;
        const extension = value.split('_')[length - 1];
        if (extension === 'picture' || extension === 'file') {
          formRef.current?.setFieldValue(value, fileStringToAntdFileList(key));
        } else if (extension === 'date') {
          formRef.current?.setFieldValue(value, key);
        } else {
          formRef.current?.setFieldValue(value, key);
        }
      });
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runGetSerialNumber } = useRequest(getSerialNumber, {
    manual: true,
    onSuccess: (result: any) => {
      setInstrumentItem({
        ...instrumentItem,
        serial_number: result.serial_number,
        status: 0,
      });
      formRef.current?.setFieldValue('serial_number', result.serial_number);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runGetAllDepartments } = useRequest(getAllDepartments, {
    manual: true,
    onSuccess: () => {},
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runApply } = useRequest(apply, {
    manual: true,
    onSuccess: () => {
      message.success('创建成功');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runSurvey } = useRequest(survey, {
    manual: true,
    onSuccess: () => {
      message.success('增加调研记录成功，正在返回设备列表...');
      history.push('/apply/instrument');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
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
      generateWord(res.data).then((response) => {
        runStoreDocx(res.data.id, response.data);
      });
      message.success('增加合同成功，正在返回设备列表...');
      history.push('/apply/instrument');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runInstall } = useRequest(install, {
    manual: true,
    onSuccess: () => {
      message.success('增加安装验收记录成功，正在返回设备列表...');
      history.push('/apply/instrument');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const confirm = () => {
    modal.confirm({
      content: `你这次创建的序列号为${instrumentItem.serial_number}。确认进入下一个创建页面，取消则进入设备列表。`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        runGetSerialNumber();
      },
      onCancel: () => {
        history.push('/apply/instrument');
      },
    });
  };

  const onStepChange = (current: number) => {
    if (!instrumentItem.status) return;
    if (instrumentItem.status < current) return;
    setCurrent(current);
    _.forEach(instrumentItem, (key: any, value: any) => {
      const length = value.split('_').length;
      const extension = value.split('_')[length - 1];
      if (extension === 'picture' || extension === 'file') {
        setTimeout(
          () =>
            formRef.current?.setFieldValue(
              value,
              fileStringToAntdFileList(key),
            ),
          0,
        );
      } else if (extension === 'date') {
        setTimeout(() => formRef.current?.setFieldValue(value, key), 0);
      } else {
        setTimeout(() => formRef.current?.setFieldValue(value, key), 0);
      }
    });
  };

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

  const departments = async () => {
    const { data: departmentsData } = await runGetAllDepartments();
    const data = _.map(departmentsData, (value: any) => {
      return {
        value: value.name,
        label: value.label,
      };
    });
    return data;
  };

  useEffect(() => {
    if (method === 'create') {
      runGetSerialNumber();
    } else if (method === 'update' && id) {
      runGetItem(id);
    } else {
      history.push('/apply/instrument');
    }
  }, []);
  return (
    <PageContainer ghost>
      <ProCard>
        <StepsForm<{
          name: string;
        }>
          formRef={formRef}
          formProps={{
            validateMessages: {
              required: '此项为必填项',
            },
          }}
          current={current}
          stepsRender={(steps) => {
            const items = _.map(steps, (value: any, key: any) => {
              const status =
                instrumentItem.status < key
                  ? 'wait'
                  : current === key
                  ? 'process'
                  : 'finish';
              return {
                ...value,
                status,
              };
            });
            return (
              <Steps
                type="navigation"
                current={current}
                items={items}
                onChange={onStepChange}
              />
            );
          }}
          submitter={{
            render: (props: any) => {
              return [
                <Button
                  disabled={instrumentItem.status > current}
                  htmlType="button"
                  type="primary"
                  onClick={props.onSubmit}
                  key="submit"
                >
                  提交
                </Button>,
              ];
            },
          }}
        >
          <StepsForm.StepForm<{
            name: string;
          }>
            name="base"
            title="申请"
            onFinish={async () => {
              const values = formRef.current?.getFieldsValue();
              confirm();
              await runApply(
                instrumentItem.serial_number,
                values.instrument,
                values.department,
                values.count,
                values.budget,
                values.apply_picture,
              );
              return true;
            }}
          >
            <ProFormText
              name="serial_number"
              label="申请单号"
              width="md"
              disabled
              rules={[{ required: true }]}
            />
            <ProFormText
              name="instrument"
              label="器械/医疗设备名称"
              width="md"
              disabled={current < instrumentItem.status}
              rules={[{ required: true }]}
            />
            <ProFormSelect
              label="申请科室"
              request={departments}
              name="department"
              disabled={current < instrumentItem.status}
              rules={[{ required: true }]}
            />
            <ProFormText
              name="count"
              label="数量"
              width="md"
              disabled={current < instrumentItem.status}
              rules={[{ required: true }]}
            />
            <ProFormMoney
              name="budget"
              label="总预算"
              width="md"
              disabled={current < instrumentItem.status}
              rules={[{ required: true }]}
            />
            <ProFormUploadButton
              label="申请文件："
              name="apply_picture"
              extra={
                instrumentItem.status > current ? (
                  <PreviewListModal
                    fileListString={instrumentItem.apply_picture}
                  />
                ) : null
              }
              rules={[{ required: true }]}
              fieldProps={{
                customRequest: (options) => {
                  upload(options.file, (isSuccess: boolean, filename: string) =>
                    handleUpload(
                      isSuccess,
                      filename,
                      'apply_picture',
                      options.file.uid,
                    ),
                  );
                },
              }}
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="time"
            title="调研"
            onFinish={async () => {
              const values = formRef.current?.getFieldsValue();
              await runSurvey(id, values.survey_date, values.survey_picture);
              return true;
            }}
          >
            <ProFormDatePicker
              name="survey_date"
              label="调研日期："
              width="sm"
              disabled={current < instrumentItem.status}
              rules={[{ required: true }]}
            />
            <ProFormUploadButton
              label="执行单附件："
              name="survey_picture"
              extra={
                instrumentItem.status > current ? (
                  <PreviewListModal
                    fileListString={instrumentItem.survey_picture}
                  />
                ) : null
              }
              fieldProps={{
                customRequest: (options) => {
                  upload(options.file, (isSuccess: boolean, filename: string) =>
                    handleUpload(
                      isSuccess,
                      filename,
                      'survey_picture',
                      options.file.uid,
                    ),
                  );
                },
              }}
              rules={[{ required: true }]}
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="ad"
            title="合同"
            onFinish={async () => {
              const values = formRef.current?.getFieldsValue();
              runCreateContract(
                id,
                values.contract_name,
                values.category,
                values.contractor,
                values.source,
                values.price,
                values.isImportant,
                values.contract_file,
                values.comment,
                values.isComplement,
              );
              return true;
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
          name="comment"
          label="备注"
          placeholder="请输入备注"
        />
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="ys"
            title="安装验收"
            onFinish={async () => {
              const values = formRef.current?.getFieldsValue();
              await runInstall(id, values.isAdvance, values.install_picture);
              return true;
            }}
          >
            <ProFormCheckbox
              label="是否垫付："
              name="isAdvance"
              width="md"
              disabled={current < instrumentItem.status}
              rules={[{ required: true }]}
            />
            <ProFormUploadButton
              label="验收资料："
              name="install_picture"
              extra={
                instrumentItem.status > current ? (
                  <PreviewListModal
                    fileListString={instrumentItem.install_picture}
                  />
                ) : null
              }
              fieldProps={{
                customRequest: (options) => {
                  upload(options.file, (isSuccess: boolean, filename: string) =>
                    handleUpload(
                      isSuccess,
                      filename,
                      'install_picture',
                      options.file.uid,
                    ),
                  );
                },
              }}
              rules={[{ required: true }]}
            />
          </StepsForm.StepForm>
        </StepsForm>
        {contextHolder}
      </ProCard>
    </PageContainer>
  );
};

export default InstrumentDetailPage;
