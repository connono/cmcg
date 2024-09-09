import { PageContainer, ProFormDigit } from '@ant-design/pro-components';
//@ts-ignore
import PreviewListModal from '@/components/PreviewListModal';
import { SERVER_HOST } from '@/constants';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProCard,
  ProFormDatePicker,
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
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import {
  fileListToString,
  fileStringToAntdFileList,
  upload,
} from '../../../utils/file-uploader';

const formatDate = (date: any) => {
  if (_.isString(date)) return date;
  if (!date.$isDayjsObject) return null;
  return date.format('YYYY-MM-DD');
};

const getItem = async (id: string) => {
  return await axios.get(`${SERVER_HOST}/comsumable/tempory/getItem?id=${id}`);
};

const getSerialNumber = async () => {
  return await axios.get(`${SERVER_HOST}/consumable/tempory/serialNumber`);
};

const getAllDepartments = async () => {
  return await axios.get(`${SERVER_HOST}/department/index?is_functional=0`);
};

const backTemporyConsumableItem = async (id: any) => {
  return await axios.post(`${SERVER_HOST}/consumable/tempory/back/${id}`);
};

const apply = async (
  serial_number: number,
  consumable: string,
  model: string,
  department: string,
  budget: number,
  count: number,
  manufacturer: string,
  telephone: number,
  registration_num: string,
  apply_date: string,
  reason: string,
  apply_type: string,
  apply_file: string,
) => {
  const form = new FormData();
  form.append('serial_number', serial_number.toString());
  form.append('consumable', consumable);
  form.append('model', model);
  form.append('department', department);
  form.append('budget', budget.toString());
  form.append('count', count.toString());
  form.append('manufacturer', manufacturer);
  form.append('telephone', telephone.toString());
  form.append('registration_num', registration_num);
  form.append('apply_date', formatDate(apply_date));
  form.append('reason', reason);
  form.append('apply_type', apply_type);
  form.append('apply_file', fileListToString(apply_file));

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/consumable/tempory/store`,
  });
};

const purchase = async (
  id: string,
  product_id: string,
  arrive_date: string,
  arrive_price: number,
  company: string,
  telephone2: number,
  accept_file: string,
) => {
  const form = new FormData();
  form.append('method', 'buy');
  form.append('product_id', product_id);
  form.append('arrive_date', formatDate(arrive_date));
  form.append('arrive_price', arrive_price.toString());
  form.append('company', company);
  form.append('telephone2', telephone2.toString());
  form.append('accept_file', fileListToString(accept_file));

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/consumable/tempory/update/${id}`,
  });
};

const approve = async (id: string) => {
  const form = new FormData();
  form.append('method', 'vertify');
  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/consumable/tempory/update/${id}`,
  });
};

const TemporyConsumableDetailPage: React.FC = () => {
  const [temporyConsumableItem, setTemporyConsumableItem] = useState<any>({});
  const hashArray = history.location.hash.split('#')[1].split('&');
  const method = hashArray[0];
  const id = hashArray[1];
  const [modal, contextHolder] = Modal.useModal();
  const formRef = useRef<ProFormInstance>();
  const [current, setCurrent] = useState<number>(0);
  const access = useAccess();
  const { run: runGetItem } = useRequest(getItem, {
    manual: true,
    onSuccess: (result: any) => {
      setTemporyConsumableItem({
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
      setTemporyConsumableItem({
        ...temporyConsumableItem,
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
  const { run: runPurchase } = useRequest(purchase, {
    manual: true,
    onSuccess: () => {
      message.success('增加采购记录成功，正在返回耗材列表...');
      history.push('/consumable/tempory/apply');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runApprove } = useRequest(approve, {
    manual: true,
    onSuccess: () => {
      message.success('审核成功，正在返回设备列表...');
      history.push('/consumable/tempory/apply');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runBackTemporyConsumableItem } = useRequest(
    backTemporyConsumableItem,
    {
      manual: true,
      onSuccess: () => {
        message.success('回退成功');
      },
      onError: (error: any) => {
        message.error(error.message);
      },
    },
  );

  const confirm = () => {
    modal.confirm({
      content: `你这次创建的序列号为${temporyConsumableItem.serial_number}。确认进入下一个创建页面，取消则进入临时耗材列表。`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        formRef.current?.resetFields();
        await runGetSerialNumber();
      },
      onCancel: () => {
        history.push('/consumable/tempory/apply');
      },
    });
  };

  const onStepChange = (current: number) => {
    if (!temporyConsumableItem.status) return;
    if (temporyConsumableItem.status < current) return;
    setCurrent(current);
    if (current === 2 && temporyConsumableItem.status === 3) {
      setTimeout(() => {
        const isAdvance =
          temporyConsumableItem.isAdvance === 'true' ? true : false;
        formRef.current?.setFieldValue('audit', true);
        formRef.current?.setFieldValue('isAdvance', isAdvance);
      }, 0);
    } else {
      _.forEach(temporyConsumableItem, (key: any, value: any) => {
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
    }
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
        value: value.label,
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
      history.push('/consumable/tempory/apply');
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
                temporyConsumableItem.status < key
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
                  disabled={temporyConsumableItem.status > current}
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
              if (!access.canApplyTemporyConsumableRecord) {
                message.error('你无权进行此操作');
                return;
              }
              const values = formRef.current?.getFieldsValue();
              if (
                formRef.current?.getFieldValue('apply_file')[0].status ===
                'done'
              ) {
                await runApply(
                  temporyConsumableItem.serial_number,
                  values.consumable,
                  values.model,
                  values.department,
                  values.budget,
                  values.count,
                  values.manufacturer,
                  values.telephone,
                  values.registration_num,
                  values.apply_date,
                  values.reason,
                  values.apply_type,
                  values.apply_file,
                );
              } else if (
                formRef.current?.getFieldValue('apply_file')[0].status ===
                'error'
              ) {
                message.error('文件上传失败！');
              } else {
                message.error('文件上传中，请等待...');
              }
              confirm();
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
              name="consumable"
              label="耗材名称："
              width="md"
              disabled={current < temporyConsumableItem.status}
              rules={[{ required: true }]}
            />
            <ProFormText
              name="model"
              label="规格型号："
              width="md"
              disabled={current < temporyConsumableItem.status}
              rules={[{ required: true }]}
            />
            <ProFormSelect
              label="申请科室"
              request={departments}
              name="department"
              disabled={current < temporyConsumableItem.status}
              rules={[{ required: true }]}
            />
            <ProFormMoney
              name="budget"
              label="预估单价："
              width="md"
              disabled={current < temporyConsumableItem.status}
              rules={[{ required: true }]}
            />
            <ProFormDigit
              name="count"
              label="数量："
              width="sm"
              disabled={current < temporyConsumableItem.status}
              rules={[{ required: true }]}
            />
            <ProFormText
              name="manufacturer"
              label="生产厂家："
              width="md"
              disabled={current < temporyConsumableItem.status}
            />
            <ProFormDigit
              name="telephone"
              label="联系电话："
              width="sm"
              disabled={current < temporyConsumableItem.status}
            />
            <ProFormText
              name="registration_num"
              label="注册证号："
              width="md"
              disabled={current < temporyConsumableItem.status}
              rules={[{ required: true }]}
            />

            <ProFormDatePicker
              name="apply_date"
              label="申请日期"
              width="sm"
              disabled={current < temporyConsumableItem.status}
              rules={[{ required: true }]}
            />
            <ProFormTextArea
              width="md"
              name="reason"
              label="申请理由"
              disabled={current < temporyConsumableItem.status}
              placeholder="请输申请理由"
            />
            <ProFormSelect
              label="采购方式："
              name="apply_type"
              valueEnum={{
                0: { text: '中标采购' },
                1: { text: '阳光采购' },
                2: { text: '自行采购' },
                3: { text: '线下采购' },
                4: { text: '带量采购' },
              }}
              disabled={current < temporyConsumableItem.status}
              rules={[{ required: true }]}
            />
            <ProFormUploadButton
              label="申请单附件："
              name="apply_file"
              extra={
                temporyConsumableItem.status > current ? (
                  <PreviewListModal
                    fileListString={temporyConsumableItem.apply_file}
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
                      'apply_file',
                      options.file.uid,
                    ),
                  );
                },
              }}
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="ys"
            title="采购"
            onFinish={async () => {
              if (!access.canPurchaseTemporyConsumableRecord) {
                message.error('你无权进行此操作');
                return;
              }
              const values = formRef.current?.getFieldsValue();
              if (
                values.accept_file === undefined ||
                (values.accept_file && values.accept_file.length) === 0 ||
                formRef.current?.getFieldValue('accept_file')[0].status ===
                  'done'
              ) {
                await runPurchase(
                  id,
                  values.product_id,
                  values.arrive_date,
                  values.arrive_price,
                  values.company,
                  values.telephone2,
                  values.accept_file,
                );
              } else if (
                formRef.current?.getFieldValue('accept_file')[0].status ===
                'error'
              ) {
                message.error('文件上传失败！');
              } else {
                message.error('文件上传中，请等待...');
              }
            }}
          >
            <ProFormText
              name="product_id"
              label="平台产品ID："
              width="md"
              disabled={current < temporyConsumableItem.status}
              rules={[{ required: true }]}
            />
            <ProFormDatePicker
              name="arrive_date"
              label="采购日期"
              width="sm"
              disabled={current < temporyConsumableItem.status}
              rules={[{ required: true }]}
            />
            <ProFormMoney
              name="arrive_price"
              label="采购价格："
              width="md"
              disabled={current < temporyConsumableItem.status}
              rules={[{ required: true }]}
            />
            <ProFormText
              name="company"
              label="供应商："
              width="md"
              disabled={current < temporyConsumableItem.status}
              rules={[{ required: true }]}
            />
            <ProFormDigit
              name="telephone2"
              label="联系电话："
              width="sm"
              disabled={current < temporyConsumableItem.status}
              rules={[{ required: true }]}
            />
            <ProFormUploadButton
              label="验收单附件："
              name="accept_file"
              extra={
                temporyConsumableItem.status > current ? (
                  <PreviewListModal
                    fileListString={temporyConsumableItem.accept_file}
                  />
                ) : null
              }
              fieldProps={{
                customRequest: (options) => {
                  upload(options.file, (isSuccess: boolean, filename: string) =>
                    handleUpload(
                      isSuccess,
                      filename,
                      'accept_file',
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
            title="审核"
            onFinish={async () => {
              if (!access.canApproveTemporyConsumableRecord) {
                message.error('你无权进行此操作');
                return;
              }
              const values = formRef.current?.getFieldsValue();
              if (values.audit) await runApprove(id);
              else await runBackTemporyConsumableItem(id);
            }}
          >
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
        </StepsForm>
        {contextHolder}
      </ProCard>
    </PageContainer>
  );
};

export default TemporyConsumableDetailPage;
