import { PageContainer } from '@ant-design/pro-components';
//@ts-ignore
import PreviewListModal from '@/components/PreviewListModal';
import { SERVER_HOST } from '@/constants';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProCard,
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

const getTrendItem = async (serial_number: string) => {
  return await axios.get(
    `${SERVER_HOST}/consumable/trends/getFirstItem?serial_number=${serial_number}`,
  );
};

const getItem = async (serial_number: string) => {
  return await axios.get(
    `${SERVER_HOST}/consumable/apply/getItem?serial_number=${serial_number}`,
  );
};

const getSerialNumber = async () => {
  return await axios.get(`${SERVER_HOST}/consumable/apply/serialNumber`);
};

const getAllDepartments = async () => {
  return await axios.get(`${SERVER_HOST}/department/index?is_functional=0`);
};

const apply = async (
  serial_number: number,
  platform_id: string,
  consumable: string,
  department: string,
  model: string,
  price: number,
  apply_date: string,
  count_year: number,
  registration_num: string,
  company: string,
  manufacturer: string,
  category_zj: string,
  parent_directory: string,
  child_directory: string,
  apply_type: string,
  pre_assessment: string,
  final: string,
  in_drugstore: string,
  apply_file: string,
) => {
  const form = new FormData();
  form.append('serial_number', serial_number.toString());
  form.append('platform_id', platform_id);
  form.append('consumable', consumable);
  form.append('department', department);
  form.append('model', model);
  form.append('price', price.toString());
  form.append('apply_date', formatDate(apply_date));
  form.append('count_year', count_year.toString());
  form.append('registration_num', registration_num);
  form.append('company', company);
  form.append('manufacturer', manufacturer);
  form.append('category_zj', category_zj);
  form.append('parent_directory', parent_directory);
  form.append('child_directory', child_directory);
  form.append('apply_type', apply_type);
  form.append('pre_assessment', pre_assessment);
  form.append('final', final);
  form.append('in_drugstore', in_drugstore);
  form.append('apply_file', fileListToString(apply_file));

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/consumable/apply/store`,
  });
};

const purchase = async (
  serial_number: string,
  platform_id: string,
  consumable: string,
  model: string,
  price: number,
  department: string,
  registration_num: string,
  category_zj: string,
  parent_directory: string,
  child_directory: string,
  company: string,
  manufacturer: string,
  apply_type: string,
  is_need: string,
  reason: string,
  start_date: string,
  contract_file: string,
) => {
  const form = new FormData();

  form.append('consumable_apply_id', serial_number);
  form.append('platform_id', platform_id);
  form.append('consumable', consumable);
  form.append('model', model);
  form.append('price', price.toString());
  form.append('department', department);
  form.append('registration_num', registration_num);
  form.append('category_zj', category_zj);
  form.append('parent_directory', parent_directory);
  form.append('child_directory', child_directory);
  form.append('company', company);
  form.append('manufacturer', manufacturer);
  form.append('apply_type', apply_type);
  form.append('is_need', is_need);
  form.append('reason', reason ? reason : '');
  form.append('start_date', formatDate(start_date));
  form.append('contract_file', fileListToString(contract_file));
  form.append('method', 'apply');

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/consumable/trends/store`,
  });
};

const approve = async (id: string, approve: number) => {
  const form = new FormData();
  form.append('method', 'approve');
  form.append('approve', approve.toString());

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/consumable/apply/update/${id}`,
  });
};

const engineerApprove = async (
  id: string,
  platform_id: string,
  department: string,
  consumable: string,
  model: string,
  price: number,
  start_date: string,
  exp_date: string,
  registration_num: string,
  company: string,
  manufacturer: string,
  category_zj: string,
  parent_directory: string,
  child_directory: string,
  apply_type: string,
  in_drugstore: string,
  vertify: number,
) => {
  const form = new FormData();
  form.append('consumable_apply_id', id);
  form.append('platform_id', platform_id);
  form.append('department', department);
  form.append('consumable', consumable);
  form.append('model', model);
  form.append('price', price.toString());
  form.append('start_date', start_date);
  form.append('exp_date', formatDate(exp_date));
  form.append('registration_num', registration_num);
  form.append('company', company);
  form.append('manufacturer', manufacturer);
  form.append('category_zj', category_zj);
  form.append('parent_directory', parent_directory);
  form.append('child_directory', child_directory);
  form.append('apply_type', apply_type);
  form.append('in_drugstore', in_drugstore);
  form.append('vertify', vertify.toString());

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/consumable/directory/store`,
  });
};

// const engineerApprove = async (id: string, approve: number) => {
//   const form = new FormData();
//   form.append('method', 'engineer_approve');
//   form.append('approve', approve.toString());

//   return await axios({
//     method: 'POST',
//     data: form,
//     url: `${SERVER_HOST}/consumable/apply/update/${id}`,
//   });
// };

const ConsumableApplyDetailPage: React.FC = () => {
  const [consumableApplyItem, setConsumableApplyItem] = useState<any>({});
  const [consumableTrendItem, setConsumableTrendItem] = useState<any>({});
  const hashArray = history.location.hash.split('#')[1].split('&');
  const method = hashArray[0];
  const id = hashArray[1];
  const [modal, contextHolder] = Modal.useModal();
  const formRef = useRef<ProFormInstance>();
  const [current, setCurrent] = useState<number>(0);
  const access = useAccess();

  const isPurchase = (data: any) => {
    if (data.status === '0') return false;
    if (data.final === '1') return false;
    if (data.in_drugstore === '0') return false;
    if (data.apply_type === '0' || data.apply_type === '4') return false;
    return true;
  };

  const onStepChange = (current: number) => {
    if (_.isNull(consumableApplyItem.status)) return;
    if (consumableApplyItem.status < current - 1) return;
    if (
      !isPurchase(consumableApplyItem) &&
      consumableApplyItem.status !== '0' &&
      current === 1
    )
      message.info('本次申请不经过询价');
    setCurrent(current);
    if (current === 0) {
      _.forEach(consumableApplyItem, (key: any, value: any) => {
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
    } else if (current === 1) {
      setTimeout(
        () =>
          formRef.current?.setFieldValue(
            'serial_number',
            consumableApplyItem.serial_number,
          ),
        0,
      );
      setTimeout(
        () =>
          formRef.current?.setFieldValue(
            'platform_id',
            consumableApplyItem.platform_id,
          ),
        0,
      );
      setTimeout(
        () =>
          formRef.current?.setFieldValue(
            'department',
            consumableApplyItem.department,
          ),
        0,
      );
      _.forEach(consumableTrendItem, (key: any, value: any) => {
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
    } else {
      if (consumableApplyItem.status > 1) {
        setTimeout(() => formRef.current?.setFieldValue('approve', 1), 0);
      }
      if (consumableApplyItem.status > 2) {
        setTimeout(() => formRef.current?.setFieldValue('vertify', 1), 0);
      }
    }
  };

  const { run: runGetTrendItem } = useRequest(getTrendItem, {
    manual: true,
    onSuccess: (result: any) => {
      setConsumableTrendItem({
        ...result.data,
        status: parseInt(result.data.status),
      });
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runGetItem } = useRequest(getItem, {
    manual: true,
    onSuccess: (result: any) => {
      if (isPurchase(result.data)) {
        runGetTrendItem(result.data.serial_number);
      }
      setConsumableApplyItem({
        ...result.data,
        status: parseInt(result.data.status),
      });
      onStepChange(result.data.status);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runGetSerialNumber } = useRequest(getSerialNumber, {
    manual: true,
    onSuccess: (result: any) => {
      setConsumableApplyItem({
        ...consumableApplyItem,
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
      message.success('增加询价记录成功，正在返回耗材列表...');
      history.push('/consumable/list/apply');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runApprove } = useRequest(approve, {
    manual: true,
    onSuccess: () => {
      message.success('审核成功，正在返回耗材列表...');
      history.push('/consumable/list/apply');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runEngineerApprove } = useRequest(engineerApprove, {
    manual: true,
    onSuccess: () => {
      message.success('审核成功，正在返回耗材列表...');
      history.push('/consumable/list/apply');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const confirm = () => {
    modal.confirm({
      content: `你这次创建的序列号为${consumableApplyItem.serial_number}。确认进入下一个创建页面，取消则进入耗材列表。`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        formRef.current?.resetFields();
        await runGetSerialNumber();
      },
      onCancel: () => {
        history.push('/consumable/list/apply');
      },
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
      history.push('/consumable/list/apply');
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
                consumableApplyItem.status < key
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
                  disabled={consumableApplyItem.status > current}
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
              if (!access.canApplyConsumableRecord) {
                message.error('你无权进行此操作');
                return;
              }
              const values = formRef.current?.getFieldsValue();
              await runApply(
                consumableApplyItem.serial_number,
                values.platform_id,
                values.consumable,
                values.department,
                values.model,
                values.price,
                values.apply_date,
                values.count_year,
                values.registration_num,
                values.company,
                values.manufacturer,
                values.category_zj,
                values.parent_directory,
                values.child_directory,
                values.apply_type,
                values.pre_assessment,
                values.final,
                values.in_drugstore,
                values.apply_file,
              );
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
              name="platform_id"
              label="平台ID"
              width="md"
              disabled={
                method !== 'create' && current < consumableApplyItem.status + 1
              }
              rules={[{ required: true }]}
            />
            <ProFormText
              name="consumable"
              label="耗材名称"
              width="md"
              disabled={
                method !== 'create' && current < consumableApplyItem.status + 1
              }
              rules={[{ required: true }]}
            />
            <ProFormSelect
              label="申请科室"
              request={departments}
              name="department"
              disabled={
                method !== 'create' && current < consumableApplyItem.status + 1
              }
              rules={[{ required: true }]}
            />
            <ProFormText
              name="model"
              label="规格型号"
              width="md"
              disabled={
                method !== 'create' && current < consumableApplyItem.status + 1
              }
              rules={[{ required: true }]}
            />
            <ProFormMoney
              name="price"
              label="单价"
              width="md"
              disabled={
                method !== 'create' && current < consumableApplyItem.status + 1
              }
              rules={[{ required: true }]}
            />
            <ProFormDatePicker
              name="apply_date"
              label="申请日期："
              width="sm"
              disabled={
                method !== 'create' && current < consumableApplyItem.status + 1
              }
              rules={[{ required: true }]}
            />
            <ProFormDigit
              name="count_year"
              label="年用量"
              width="md"
              disabled={
                method !== 'create' && current < consumableApplyItem.status + 1
              }
              rules={[{ required: true }]}
            />
            <ProFormText
              name="registration_num"
              label="注册证号"
              width="md"
              disabled={
                method !== 'create' && current < consumableApplyItem.status + 1
              }
              rules={[{ required: true }]}
            />
            <ProFormText
              name="company"
              label="供应商"
              width="md"
              disabled={
                method !== 'create' && current < consumableApplyItem.status + 1
              }
              rules={[{ required: true }]}
            />
            <ProFormText
              name="manufacturer"
              label="生产厂家"
              width="md"
              disabled={
                method !== 'create' && current < consumableApplyItem.status + 1
              }
              rules={[{ required: true }]}
            />
            <ProFormText
              name="category_zj"
              label="浙江分类"
              width="md"
              disabled={
                method !== 'create' && current < consumableApplyItem.status + 1
              }
              rules={[{ required: true }]}
            />
            <ProFormText
              name="parent_directory"
              label="一级目录"
              width="md"
              disabled={
                method !== 'create' && current < consumableApplyItem.status + 1
              }
              rules={[{ required: true }]}
            />
            <ProFormText
              name="child_directory"
              label="二级目录"
              width="md"
              disabled={
                method !== 'create' && current < consumableApplyItem.status + 1
              }
              rules={[{ required: true }]}
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
              disabled={
                method !== 'create' && current < consumableApplyItem.status + 1
              }
              rules={[{ required: true }]}
            />
            <ProFormTextArea
              width="md"
              name="pre_assessment"
              label="初评意见"
              disabled={
                method !== 'create' && current < consumableApplyItem.status + 1
              }
              placeholder="请输入初评意见 "
            />
            <ProFormRadio.Group
              name="final"
              label="终评结论"
              width="sm"
              disabled={
                method !== 'create' && current < consumableApplyItem.status + 1
              }
              valueEnum={{
                0: { text: '同意引进' },
                1: { text: '不同意引进' },
              }}
              rules={[{ required: true }]}
            />
            <ProFormRadio.Group
              name="in_drugstore"
              label="是否为便民药房"
              disabled={
                method !== 'create' && current < consumableApplyItem.status + 1
              }
              width="sm"
              valueEnum={{
                0: { text: '是' },
                1: { text: '否' },
              }}
              rules={[{ required: true }]}
            />
            <ProFormUploadButton
              label="申请单附件："
              name="apply_file"
              extra={
                method !== 'create' &&
                consumableApplyItem.status + 1 > current ? (
                  <PreviewListModal
                    fileListString={consumableApplyItem.apply_file}
                  />
                ) : null
              }
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
            title="询价"
            onFinish={async () => {
              if (!access.canPurchaseConsumableRecord) {
                message.error('你无权进行此操作');
                return;
              }
              const values = formRef.current?.getFieldsValue();
              if (
                values.contract_file === undefined ||
                (values.contract_file && values.contract_file.length) === 0 ||
                formRef.current?.getFieldValue('contract_file')[0].status ===
                  'done'
              ) {
                await runPurchase(
                  values.serial_number,
                  values.platform_id,
                  values.consumable,
                  values.model,
                  values.price,
                  values.department,
                  values.registration_num,
                  values.category_zj,
                  values.parent_directory,
                  values.child_directory,
                  values.company,
                  values.manufacturer,
                  values.apply_type,
                  values.is_need,
                  values.reason,
                  values.start_date,
                  values.contract_file,
                );
              } else if (
                formRef.current?.getFieldValue('contract_file')[0].status ===
                'error'
              ) {
                message.error('文件上传失败！');
              } else {
                message.error('文件上传中，请等待...');
              }
            }}
          >
            <ProFormText
              name="serial_number"
              label="申请单号"
              width="md"
              disabled
            />
            <ProFormText
              name="platform_id"
              label="平台ID"
              width="md"
              disabled={current < consumableApplyItem.status + 1}
              rules={[{ required: true }]}
            />
            <ProFormText
              name="consumable"
              label="耗材名称"
              width="md"
              disabled={current < consumableApplyItem.status + 1}
              rules={[{ required: true }]}
            />
            <ProFormText
              name="model"
              label="规格型号"
              width="md"
              disabled={current < consumableApplyItem.status + 1}
              rules={[{ required: true }]}
            />
            <ProFormMoney
              name="price"
              label="单价"
              width="md"
              disabled={current < consumableApplyItem.status + 1}
              rules={[{ required: true }]}
            />
            <ProFormText label="申请科室" name="department" disabled />
            <ProFormText
              name="registration_num"
              label="注册证号"
              width="md"
              disabled={current < consumableApplyItem.status + 1}
              rules={[{ required: true }]}
            />
            <ProFormText
              name="category_zj"
              label="浙江分类"
              width="md"
              disabled={current < consumableApplyItem.status + 1}
              rules={[{ required: true }]}
            />
            <ProFormText
              name="parent_directory"
              label="一级目录"
              width="md"
              disabled={current < consumableApplyItem.status + 1}
              rules={[{ required: true }]}
            />
            <ProFormText
              name="child_directory"
              label="二级目录"
              width="md"
              disabled={current < consumableApplyItem.status + 1}
              rules={[{ required: true }]}
            />
            <ProFormText
              name="company"
              label="供应商"
              width="md"
              disabled={current < consumableApplyItem.status + 1}
              rules={[{ required: true }]}
            />
            <ProFormText
              name="manufacturer"
              label="生产厂家"
              width="md"
              disabled={current < consumableApplyItem.status + 1}
              rules={[{ required: true }]}
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
              disabled={current < consumableApplyItem.status + 1}
              rules={[{ required: true }]}
            />
            <ProFormRadio.Group
              name="is_need"
              label="是否询价"
              width="sm"
              disabled={current < consumableApplyItem.status + 1}
              valueEnum={{
                0: { text: '不执行采购' },
                1: { text: '执行采购' },
              }}
              rules={[{ required: true }]}
            />
            <ProFormText
              name="reason"
              label="不询价理由"
              width="md"
              disabled={current < consumableApplyItem.status + 1}
            />
            <ProFormDatePicker
              name="start_date"
              label="合同日期："
              width="sm"
              disabled={current < consumableApplyItem.status + 1}
              rules={[{ required: true }]}
            />
            <ProFormUploadButton
              label="合同附件："
              name="contract_file"
              extra={
                consumableApplyItem.status > current ? (
                  <PreviewListModal
                    fileListString={consumableApplyItem.contract_file}
                  />
                ) : null
              }
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
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="sh"
            title="分管院长审核"
            onFinish={async () => {
              if (!access.canApproveConsumableRecord) {
                message.error('你无权进行此操作');
                return;
              }
              const values = formRef.current?.getFieldsValue();
              await runApprove(consumableApplyItem.id, values.approve);
            }}
          >
            <ProFormRadio.Group
              name="approve"
              label="审核结果："
              rules={[{ required: true }]}
              disabled={current < consumableApplyItem.status}
              options={[
                {
                  label: '审核通过',
                  value: 1,
                },
                {
                  label: '审核不通过',
                  value: 0,
                },
              ]}
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="yg"
            title="医工科审核"
            onFinish={async () => {
              if (!access.canEngineerApproveConsumableRecord) {
                message.error('你无权进行此操作');
                return;
              }
              const values = formRef.current?.getFieldsValue();
              await runEngineerApprove(
                id,
                consumableApplyItem.platform_id,
                consumableApplyItem.department,
                consumableApplyItem.consumable,
                consumableApplyItem.model,
                consumableApplyItem.price,
                consumableTrendItem.start_date,
                values.exp_date,
                consumableApplyItem.registration_num,
                consumableApplyItem.company,
                consumableApplyItem.manufacturer,
                consumableApplyItem.category_zj,
                consumableApplyItem.parent_directory,
                consumableApplyItem.child_directory,
                consumableApplyItem.apply_type,
                consumableApplyItem.in_drugstore,
                values.vertify,
              );
            }}
          >
            <ProFormDatePicker
              name="exp_date"
              label="失效日期："
              width="sm"
              disabled={current < consumableApplyItem.status + 1}
              rules={[{ required: true }]}
            />
            <ProFormRadio.Group
              name="vertify"
              label="审核结果："
              rules={[{ required: true }]}
              disabled={current < consumableApplyItem.status}
              options={[
                {
                  label: '审核通过',
                  value: 1,
                },
                {
                  label: '审核不通过',
                  value: 0,
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

export default ConsumableApplyDetailPage;
