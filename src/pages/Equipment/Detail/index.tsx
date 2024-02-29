import { PageContainer } from '@ant-design/pro-components';
//@ts-ignore
import CapitalSourceInput from '@/components/CapitalSourceInput';
import PreviewListModal from '@/components/PreviewListModal';
import PreviewListVisible from '@/components/PreviewListVisible';
import { SERVER_HOST } from '@/constants';
import { generateWord } from '@/utils/contract-word';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProCard,
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormMoney,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
  StepsForm,
} from '@ant-design/pro-components';
import { history, useAccess, useRequest } from '@umijs/max';
import { Button, Modal, Steps, message } from 'antd';
import axios from 'axios';
import * as docx from 'docx-preview';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import {
  fileListToString,
  fileStringToAntdFileList,
  preview,
  upload,
} from '../../../utils/file-uploader';

const applyOptions = [
  {
    value: '0',
    label: '年度采购',
  },
  {
    value: '1',
    label: '经费采购',
  },
  {
    value: '2',
    label: '临时采购',
  },
];

const formatDate = (date: any) => {
  if (_.isString(date)) return date;
  if (!date.$isDayjsObject) return null;
  return date.format('YYYY-MM-DD');
};

const purchaseOptions = [
  {
    value: '0',
    label: '展会采购',
  },
  {
    value: '1',
    label: '招标',
  },
  {
    value: '2',
    label: '自行采购',
  },
];

const getItem = async (id: string) => {
  return await axios.get(`${SERVER_HOST}/equipment/item?id=${id}`);
};

const getSerialNumber = async () => {
  return await axios.get(`${SERVER_HOST}/equipment/serialNumber`);
};

const getAllDepartments = async () => {
  return await axios.get(`${SERVER_HOST}/department/index`);
};

const getContract = async (id: string) => {
  return await axios.get(`${SERVER_HOST}/payment/contracts/getItem?id=${id}`);
};

const apply = async (
  serial_number: number,
  equipment: string,
  department: string,
  count: number,
  budget: number,
  apply_type: number,
  apply_picture: string,
) => {
  const form = new FormData();
  form.append('serial_number', serial_number.toString());
  form.append('equipment', equipment);
  form.append('department', department);
  form.append('count', count.toString());
  form.append('budget', budget.toString());
  form.append('apply_type', apply_type.toString());
  form.append('apply_picture', fileListToString(apply_picture));

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/equipment/store`,
  });
};

const survey = async (
  id: string,
  survey_date: Date,
  purchase_type: number,
  survey_record: string,
  meeting_record: string,
  survey_picture: string,
) => {
  const form = new FormData();
  form.append('survey_date', formatDate(survey_date));
  form.append('purchase_type', purchase_type.toString());
  form.append('survey_record', survey_record);
  form.append('meeting_record', meeting_record);
  form.append('survey_picture', fileListToString(survey_picture));

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/equipment/update/survey/${id}`,
  });
};

const approve = async (
  id: string,
  approve_date: Date,
  execute_date: Date,
  approve_picture: string,
) => {
  const form = new FormData();
  form.append('approve_date', formatDate(approve_date));
  form.append('execute_date', formatDate(execute_date));
  form.append('approve_picture', fileListToString(approve_picture));

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/equipment/update/approve/${id}`,
  });
};

const tender = async (
  id: string,
  tender_date: Date,
  tender_file: string,
  tender_boardcast_file: string,
  tender_out_date: Date,
  bid_winning_file: string,
  send_tender_file: string,
) => {
  const form = new FormData();
  form.append('tender_date', formatDate(tender_date));
  form.append('tender_file', fileListToString(tender_file));
  form.append('tender_boardcast_file', fileListToString(tender_boardcast_file));
  form.append('tender_out_date', formatDate(tender_out_date));
  form.append('bid_winning_file', fileListToString(bid_winning_file));
  form.append('send_tender_file', fileListToString(send_tender_file));

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/equipment/update/tender/${id}`,
  });
};

const createContract = async (
  equipment_apply_record_id: string,
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
  form.append('equipment_apply_record_id', equipment_apply_record_id);
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
  install_date: Date,
  install_picture: string,
) => {
  const form = new FormData();
  form.append('install_date', formatDate(install_date));
  form.append('install_picture', fileListToString(install_picture));

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/equipment/update/install/${id}`,
  });
};

const engineerApprove = async (id: string, isAdvance: boolean) => {
  const form = new FormData();
  form.append('isAdvance', isAdvance.toString());

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/equipment/update/engineer_approve/${id}`,
  });
};

const warehouse = async (id: string, warehousing_date: Date) => {
  const form = new FormData();
  form.append('warehousing_date', formatDate(warehousing_date));

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/equipment/update/warehouse/${id}`,
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

const backEquipmentItem = async (id: any) => {
  return await axios.patch(`${SERVER_HOST}/equipment/back/${id}`);
};

const EquipmentDetailPage: React.FC = () => {
  const [equipmentItem, setEquipmentItem] = useState<any>({});
  const hashArray = history.location.hash.split('#')[1].split('&');
  const method = hashArray[0];
  const id = hashArray[1];
  const [modal, contextHolder] = Modal.useModal();
  const formRef = useRef<ProFormInstance>();
  const [current, setCurrent] = useState<number>(0);
  const access = useAccess();

  const { run: runGetContract } = useRequest(getContract, {
    manual: true,
    onSuccess: (result: any) => {
      if (result.data.contract_docx) {
        preview(result.data.contract_docx, (file: File) => {
          docx.renderAsync(
            file.arrayBuffer(),
            //@ts-ignore
            document.getElementById('preview'),
          );
        });
      }
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runGetItem } = useRequest(getItem, {
    manual: true,
    onSuccess: (result: any) => {
      setEquipmentItem({
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
      setEquipmentItem({
        ...equipmentItem,
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
      history.push('/apply/equipment');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runApprove } = useRequest(approve, {
    manual: true,
    onSuccess: () => {
      message.success('增加政府审批记录成功，正在返回设备列表...');
      history.push('/apply/equipment');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runTender } = useRequest(tender, {
    manual: true,
    onSuccess: () => {
      message.success('增加投标记录成功，正在返回设备列表...');
      history.push('/apply/equipment');
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
      history.push('/apply/equipment');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runInstall } = useRequest(install, {
    manual: true,
    onSuccess: () => {
      message.success('增加安装验收记录成功，正在返回设备列表...');
      history.push('/apply/equipment');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runEngineerApprove } = useRequest(engineerApprove, {
    manual: true,
    onSuccess: () => {
      message.success('审核成功，正在返回设备列表...');
      history.push('/apply/equipment');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runWarehouse } = useRequest(warehouse, {
    manual: true,
    onSuccess: () => {
      message.success('增加入库记录成功，正在返回设备列表...');
      history.push('/apply/equipment');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runBackEquipmentItem } = useRequest(backEquipmentItem, {
    manual: true,
    onSuccess: () => {
      message.success('回退成功');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const confirm = () => {
    modal.confirm({
      content: `你这次创建的序列号为${equipmentItem.serial_number}。确认进入下一个创建页面，取消则进入设备列表。`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        runGetSerialNumber();
      },
      onCancel: () => {
        history.push('/apply/equipment');
      },
    });
  };

  const onStepChange = (current: number) => {
    if (!equipmentItem.status) return;
    if (equipmentItem.status < current) return;
    if (
      current === 3 &&
      equipmentItem.purchase_type &&
      parseInt(equipmentItem.purchase_type) !== 1
    )
      return;
    if (current === 4) runGetContract(equipmentItem.contract_id);
    setCurrent(current);
    _.forEach(equipmentItem, (key: any, value: any) => {
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
      history.push('/apply/equipment');
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
              if (key === 3 && equipmentItem.purchase_type !== '1') {
                return {
                  ...value,
                  status: 'error',
                };
              } else {
                const status =
                  equipmentItem.status < key
                    ? 'wait'
                    : current === key
                    ? 'process'
                    : 'finish';
                return {
                  ...value,
                  status,
                };
              }
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
                  disabled={equipmentItem.status > current}
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
              if (!access.canApplyEquipment) {
                message.error('你无权进行此操作');
              } else {
                const values = formRef.current?.getFieldsValue();
                if (
                  formRef.current?.getFieldValue('apply_picture')[0].status ===
                  'done'
                ) {
                  confirm();
                  await runApply(
                    equipmentItem.serial_number,
                    values.equipment,
                    values.department,
                    values.count,
                    values.budget,
                    values.apply_type,
                    values.apply_picture,
                  );
                } else if (
                  formRef.current?.getFieldValue('apply_picture')[0].status ===
                  'error'
                ) {
                  message.error('文件上传失败！');
                } else {
                  message.error('文件上传中，请等待...');
                }
              }
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
              name="equipment"
              label="设备名称"
              width="md"
              disabled={current < equipmentItem.status}
              rules={[{ required: true }]}
            />
            <ProFormSelect
              label="申请科室"
              request={departments}
              name="department"
              disabled={current < equipmentItem.status}
              rules={[{ required: true }]}
            />
            <ProFormText
              name="count"
              label="数量"
              width="md"
              disabled={current < equipmentItem.status}
              rules={[{ required: true }]}
            />
            <ProFormMoney
              name="budget"
              label="总预算"
              width="md"
              disabled={current < equipmentItem.status}
              rules={[{ required: true }]}
            />
            <ProFormSelect
              label="申请方式："
              name="apply_type"
              disabled={current < equipmentItem.status}
              options={applyOptions}
              rules={[{ required: true }]}
            />
            <ProFormUploadButton
              label="申请文件："
              name="apply_picture"
              extra={
                equipmentItem.status > current ? (
                  <PreviewListModal
                    fileListString={equipmentItem.apply_picture}
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
              if (!access.canSurveyEquipment) {
                message.error('你无权进行此操作');
              } else {
                const values = formRef.current?.getFieldsValue();
                if (
                  formRef.current?.getFieldValue('survey_picture')[0].status ===
                  'done'
                ) {
                  await runSurvey(
                    id,
                    values.survey_date,
                    values.purchase_type,
                    values.survey_record,
                    values.meeting_record,
                    values.survey_picture,
                  );
                } else if (
                  formRef.current?.getFieldValue('survey_picture')[0].status ===
                  'error'
                ) {
                  message.error('文件上传失败！');
                } else {
                  message.error('文件上传中，请等待...');
                }
              }
            }}
          >
            <ProFormDatePicker
              name="survey_date"
              label="调研日期："
              width="sm"
              disabled={current < equipmentItem.status}
              rules={[{ required: true }]}
            />
            <ProFormSelect
              label="采购方式："
              name="purchase_type"
              options={purchaseOptions}
              disabled={current < equipmentItem.status}
              rules={[{ required: true }]}
            />
            <ProFormTextArea
              name="survey_record"
              label="调研记录："
              disabled={current < equipmentItem.status}
              width="md"
              rules={[{ required: true }]}
            />
            <ProFormTextArea
              name="meeting_record"
              label="上会记录："
              disabled={current < equipmentItem.status}
              width="md"
              rules={[{ required: true }]}
            />
            <ProFormUploadButton
              label="执行单附件："
              name="survey_picture"
              extra={
                equipmentItem.status > current ? (
                  <PreviewListModal
                    fileListString={equipmentItem.survey_picture}
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
          <StepsForm.StepForm<{
            checkbox: string;
          }>
            name="tender"
            title="政府审批"
            onFinish={async () => {
              if (!access.canApproveEquipment) {
                message.error('你无权进行此操作');
              } else {
                const values = formRef.current?.getFieldsValue();
                if (
                  formRef.current?.getFieldValue('approve_picture')[0]
                    .status === 'done'
                ) {
                  await runApprove(
                    id,
                    values.approve_date,
                    values.execute_date,
                    values.approve_picture,
                  );
                } else if (
                  formRef.current?.getFieldValue('approve_picture')[0]
                    .status === 'error'
                ) {
                  message.error('文件上传失败！');
                } else {
                  message.error('文件上传中，请等待...');
                }
              }
            }}
          >
            <ProFormDatePicker
              name="approve_date"
              label="政府审批日期："
              disabled={current < equipmentItem.status}
              width="sm"
              rules={[{ required: true }]}
            />
            <ProFormDatePicker
              name="execute_date"
              label="预算执行单日期："
              width="sm"
              disabled={current < equipmentItem.status}
              rules={[{ required: true }]}
            />
            <ProFormUploadButton
              label="执行单附件："
              name="approve_picture"
              extra={
                equipmentItem.status > current ? (
                  <PreviewListModal
                    fileListString={equipmentItem.approve_picture}
                  />
                ) : null
              }
              fieldProps={{
                customRequest: (options) => {
                  upload(options.file, (isSuccess: boolean, filename: string) =>
                    handleUpload(
                      isSuccess,
                      filename,
                      'approve_picture',
                      options.file.uid,
                    ),
                  );
                },
              }}
              rules={[{ required: true }]}
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm<{
            checkbox: string;
          }>
            name="checkbox"
            title="招标"
            onFinish={async () => {
              if (!access.canTenderEquipment) {
                message.error('你无权进行此操作');
              } else {
                const values = formRef.current?.getFieldsValue();
                if (
                  formRef.current?.getFieldValue('tender_file')[0].status ===
                    'done' &&
                  formRef.current?.getFieldValue('tender_boardcast_file')[0]
                    .status === 'done' &&
                  formRef.current?.getFieldValue('bid_winning_file')[0]
                    .status === 'done' &&
                  formRef.current?.getFieldValue('send_tender_file')[0]
                    .status === 'done'
                ) {
                  await runTender(
                    id,
                    values.tender_date,
                    values.tender_file,
                    values.tender_boardcast_file,
                    values.tender_out_date,
                    values.bid_winning_file,
                    values.send_tender_file,
                  );
                } else if (
                  formRef.current?.getFieldValue('tender_file')[0].status ===
                    'error' &&
                  formRef.current?.getFieldValue('tender_boardcast_file')[0]
                    .status === 'error' &&
                  formRef.current?.getFieldValue('bid_winning_file')[0]
                    .status === 'error' &&
                  formRef.current?.getFieldValue('send_tender_file')[0]
                    .status === 'error'
                ) {
                  message.error('文件上传失败！');
                } else {
                  message.error('文件上传中，请等待...');
                }
              }
            }}
          >
            <ProFormDatePicker
              name="tender_date"
              label="招标书日期："
              width="sm"
              disabled={current < equipmentItem.status}
              rules={[{ required: true }]}
            />
            <ProFormDatePicker
              name="tender_out_date"
              label="招标日期："
              width="sm"
              disabled={current < equipmentItem.status}
              rules={[{ required: true }]}
            />
            <ProFormUploadButton
              label="招标书附件："
              name="tender_file"
              extra={
                equipmentItem.status > current ? (
                  <PreviewListModal
                    fileListString={equipmentItem.tender_file}
                  />
                ) : null
              }
              fieldProps={{
                customRequest: (options) => {
                  upload(options.file, (isSuccess: boolean, filename: string) =>
                    handleUpload(
                      isSuccess,
                      filename,
                      'tender_file',
                      options.file.uid,
                    ),
                  );
                },
              }}
              rules={[{ required: true }]}
            />
            <ProFormUploadButton
              label="招标公告附件："
              name="tender_boardcast_file"
              extra={
                equipmentItem.status > current ? (
                  <PreviewListModal
                    fileListString={equipmentItem.tender_boardcast_file}
                  />
                ) : null
              }
              fieldProps={{
                customRequest: (options) => {
                  upload(options.file, (isSuccess: boolean, filename: string) =>
                    handleUpload(
                      isSuccess,
                      filename,
                      'tender_boardcast_file',
                      options.file.uid,
                    ),
                  );
                },
              }}
              rules={[{ required: true }]}
            />
            <ProFormUploadButton
              label="中标通知书："
              name="bid_winning_file"
              extra={
                equipmentItem.status > current ? (
                  <PreviewListModal
                    fileListString={equipmentItem.bid_winning_file}
                  />
                ) : null
              }
              fieldProps={{
                customRequest: (options) => {
                  upload(options.file, (isSuccess: boolean, filename: string) =>
                    handleUpload(
                      isSuccess,
                      filename,
                      'bid_winning_file',
                      options.file.uid,
                    ),
                  );
                },
              }}
              rules={[{ required: true }]}
            />
            <ProFormUploadButton
              label="投标文件："
              name="send_tender_file"
              extra={
                equipmentItem.status > current ? (
                  <PreviewListModal
                    fileListString={equipmentItem.send_tender_file}
                  />
                ) : null
              }
              fieldProps={{
                customRequest: (options) => {
                  upload(options.file, (isSuccess: boolean, filename: string) =>
                    handleUpload(
                      isSuccess,
                      filename,
                      'send_tender_file',
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
              if (!access.canContractEquipment) {
                message.error('你无权进行此操作');
              } else {
                const values = formRef.current?.getFieldsValue();
                if (
                  formRef.current?.getFieldValue('contract_file')[0].status ===
                  'done'
                ) {
                  await runCreateContract(
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
                } else if (
                  formRef.current?.getFieldValue('contract_file')[0].status ===
                  'error'
                ) {
                  message.error('文件上传失败！');
                } else {
                  message.error('文件上传中，请等待...');
                }
              }
            }}
          >
            {current < equipmentItem.status ? (
              <div>
                <div
                  id="preview"
                  style={{
                    height: '1200px',
                    margin: '0 40px',
                    overflowY: 'visible',
                  }}
                ></div>
                <div style={{ margin: '0 40px' }}>
                  <PreviewListVisible
                    fileListString={equipmentItem.contract_file}
                  />
                </div>
              </div>
            ) : null}
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
              if (!access.canInstallEquipment) {
                message.error('你无权进行此操作');
              } else {
                const values = formRef.current?.getFieldsValue();
                if (
                  formRef.current?.getFieldValue('install_picture')[0]
                    .status === 'done'
                ) {
                  await runInstall(
                    id,
                    values.install_date,
                    values.install_picture,
                  );
                } else if (
                  formRef.current?.getFieldValue('install_picture')[0]
                    .status === 'error'
                ) {
                  message.error('文件上传失败！');
                } else {
                  message.error('文件上传中，请等待...');
                }
              }
            }}
          >
            <ProFormDatePicker
              name="install_date"
              label="安装日期："
              width="sm"
              disabled={current < equipmentItem.status}
              rules={[{ required: true }]}
            />
            <ProFormUploadButton
              label="验收资料："
              name="install_picture"
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
          <StepsForm.StepForm
            name="sh"
            title="医工科审核"
            onFinish={async () => {
              if (!access.canEnginnerApproveEquipment) {
                message.error('你无权进行此操作');
              } else {
                const values = formRef.current?.getFieldsValue();
                if (values.audit)
                  await runEngineerApprove(id, values.isAdvance);
                else await runBackEquipmentItem(id);
              }
            }}
          >
            <ProFormRadio.Group
              name="isAdvance"
              label="是否垫付："
              rules={[{ required: true }]}
              disabled={current < equipmentItem.status}
              options={[
                {
                  label: '是',
                  value: true,
                },
                {
                  label: '否',
                  value: false,
                },
              ]}
            />
            <ProFormRadio.Group
              name="audit"
              options={[
                {
                  label: '审核通过',
                  value: true,
                },
                {
                  label: '审核驳回',
                  value: false,
                },
              ]}
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="rk"
            title="入库"
            onFinish={async () => {
              if (!access.canWarehouseEquipment) {
                message.error('你无权进行此操作');
              } else {
                const values = formRef.current?.getFieldsValue();
                await runWarehouse(id, values.warehousing_date);
              }
            }}
          >
            <ProFormDatePicker
              name="warehousing_date"
              label="入库日期："
              width="sm"
              disabled={current < equipmentItem.status}
              rules={[{ required: true }]}
            />
          </StepsForm.StepForm>
        </StepsForm>
        {contextHolder}
      </ProCard>
    </PageContainer>
  );
};

export default EquipmentDetailPage;
