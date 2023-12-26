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
  ProFormTextArea,
  ProFormUploadButton,
  StepsForm,
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

const purchase = async (
  id: string,
  purchase_date: Date,
  arrive_date: Date,
  price: number,
  purchase_picture: string,
) => {
  const form = new FormData();
  form.append('purchase_date', formatDate(purchase_date));
  form.append('arrive_date', formatDate(arrive_date));
  form.append('price', price.toString());
  form.append('purchase_picture', fileListToString(purchase_picture));

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/equipment/update/purchase/${id}`,
  });
};

const install = async (
  id: string,
  install_date: Date,
  isAdvance: boolean,
  install_picture: string,
) => {
  const form = new FormData();
  form.append('install_date', formatDate(install_date));
  form.append('isAdvance', isAdvance.toString());
  form.append('install_picture', fileListToString(install_picture));

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/equipment/update/install/${id}`,
  });
};

const EquipmentDetailPage: React.FC = () => {
  const [equipmentItem, setEquipmentItem] = useState<any>({});
  const hashArray = history.location.hash.split('#')[1].split('&');
  const method = hashArray[0];
  const id = hashArray[1];
  const [modal, contextHolder] = Modal.useModal();
  const formRef = useRef<ProFormInstance>();
  const [current, setCurrent] = useState<number>(0);
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
  const { run: runPurchase } = useRequest(purchase, {
    manual: true,
    onSuccess: () => {
      message.success('增加合同记录成功，正在返回设备列表...');
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
              const values = formRef.current?.getFieldsValue();
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
              const values = formRef.current?.getFieldsValue();
              await runSurvey(
                id,
                values.survey_date,
                values.purchase_type,
                values.survey_record,
                values.meeting_record,
                values.survey_picture,
              );
              return true;
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
              const values = formRef.current?.getFieldsValue();
              await runApprove(
                id,
                values.approve_date,
                values.execute_date,
                values.approve_picture,
              );
              return true;
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
              const values = formRef.current?.getFieldsValue();
              await runTender(
                id,
                values.tender_date,
                values.tender_file,
                values.tender_boardcast_file,
                values.tender_out_date,
                values.bid_winning_file,
                values.send_tender_file,
              );
              return true;
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
              const values = formRef.current?.getFieldsValue();
              await runPurchase(
                id,
                values.purchase_date,
                values.arrive_date,
                values.price,
                values.purchase_picture,
              );
              return true;
            }}
          >
            <ProFormDatePicker
              name="purchase_date"
              label="合同日期："
              width="sm"
              disabled={current < equipmentItem.status}
              rules={[{ required: true }]}
            />
            <ProFormDatePicker
              name="arrive_date"
              label="合同到货日期："
              disabled={current < equipmentItem.status}
              width="sm"
              rules={[{ required: true }]}
            />
            <ProFormMoney
              name="price"
              label="合同价格"
              width="md"
              disabled={current < equipmentItem.status}
              rules={[{ required: true }]}
            />
            <ProFormUploadButton
              label="合同附件："
              name="purchase_picture"
              extra={
                equipmentItem.status > current ? (
                  <PreviewListModal
                    fileListString={equipmentItem.purchase_picture}
                  />
                ) : null
              }
              fieldProps={{
                customRequest: (options) => {
                  upload(options.file, (isSuccess: boolean, filename: string) =>
                    handleUpload(
                      isSuccess,
                      filename,
                      'purchase_picture',
                      options.file.uid,
                    ),
                  );
                },
              }}
              rules={[{ required: true }]}
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="ys"
            title="安装验收"
            onFinish={async () => {
              const values = formRef.current?.getFieldsValue();
              await runInstall(
                id,
                values.install_date,
                values.isAdvance,
                values.install_picture,
              );
              return true;
            }}
          >
            <ProFormDatePicker
              name="install_date"
              label="安装日期："
              width="sm"
              disabled={current < equipmentItem.status}
              rules={[{ required: true }]}
            />
            <ProFormCheckbox
              label="是否垫付："
              name="isAdvance"
              width="md"
              disabled={current < equipmentItem.status}
              rules={[{ required: true }]}
            />
            <ProFormUploadButton
              label="验收资料："
              name="install_picture"
              extra={
                equipmentItem.status > current ? (
                  <PreviewListModal
                    fileListString={equipmentItem.install_picture}
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

export default EquipmentDetailPage;
