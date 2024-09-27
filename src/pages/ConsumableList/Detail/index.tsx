import { PageContainer } from '@ant-design/pro-components';
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
  ProFormUploadButton,
  StepsForm,
} from '@ant-design/pro-components';
import { history, useAccess, useRequest } from '@umijs/max';
import { Button, Steps, message } from 'antd';
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
  return await axios.get(
    `${SERVER_HOST}/consumable/directory/getItem?serial_number=${id}`,
  );
};

const getSerialNumber = async () => {
  return await axios.get(`${SERVER_HOST}/consumable/serialNumber`);
};

const getAllDepartments = async () => {
  return await axios.get(`${SERVER_HOST}/department/index?is_functional=0`);
};

const getTrendItem = async (serial_number: string) => {
  return await axios.get(
    `${SERVER_HOST}/consumable/trends/getLastItem?serial_number=${serial_number}`,
  );
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
  form.append('method', 'directory');

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/consumable/trends/store`,
  });
};

const approve = async (
  id: string,
  consumable_apply_id: string,
  approve: number,
) => {
  const form = new FormData();
  form.append('method', 'approve');
  form.append('consumable_apply_id', consumable_apply_id);
  form.append('approve', approve.toString());

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/consumable/directory/update/${id}`,
  });
};

const engineerApprove = async (
  id: string,
  consumable_apply_id: string,
  vertify: number,
) => {
  const form = new FormData();
  form.append('method', 'vertify');
  form.append('consumable_apply_id', consumable_apply_id);
  form.append('vertify', vertify.toString());

  return await axios({
    method: 'POST',
    data: form,
    url: `${SERVER_HOST}/consumable/directory/update/${id}`,
  });
};

const ConsumableDetailPage: React.FC = () => {
  const [consumableList, setConsumableItem] = useState<any>({});
  const [consumableTrendItem, setConsumableTrendItem] = useState<any>({});
  const hashArray = history.location.hash.split('#')[1].split('&');
  const method = hashArray[0];
  const id = hashArray[1];
  const formRef = useRef<ProFormInstance>();
  const [current, setCurrent] = useState<number>(0);
  const access = useAccess();

  const onStepChange = (current: number) => {
    if (_.isNull(consumableList.status)) return;
    if (consumableList.status - 1 < current) return;
    setCurrent(current);
    if (current === 0) {
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
      if (consumableList.status > 2) {
        setTimeout(() => formRef.current?.setFieldValue('approve', 1), 0);
      }
      if (consumableList.status > 3) {
        console.log(consumableTrendItem);
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
      setTimeout(
        () =>
          formRef.current?.setFieldValue(
            'consumable_apply_id',
            result.data.consumable_apply_id,
          ),
        0,
      );
      setTimeout(
        () =>
          formRef.current?.setFieldValue('department', result.data.department),
        0,
      );
      if (parseInt(result.data.status) > 0) {
        runGetTrendItem(result.data.consumable_apply_id);
      } else {
        formRef.current?.setFieldValue(
          'consumable_apply_id',
          result.data.consumable_apply_id,
        );
      }
      setConsumableItem({
        ...result.data,
        status: parseInt(result.data.status),
      });
      setCurrent(parseInt(result.data.status) - 1);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runGetSerialNumber } = useRequest(getSerialNumber, {
    manual: true,
    onSuccess: (result: any) => {
      setConsumableItem({
        ...consumableList,
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
  const { run: runPurchase } = useRequest(purchase, {
    manual: true,
    onSuccess: () => {
      message.success('创建成功，正在返回耗材目录...');
      history.push('/consumable/list/index');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runApprove } = useRequest(approve, {
    manual: true,
    onSuccess: () => {
      message.success('审核成功，正在返回耗材目录...');
      history.push('/consumable/list/index');
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const { run: runEngineerApprove } = useRequest(engineerApprove, {
    manual: true,
    onSuccess: () => {
      message.success('审核成功，正在返回耗材目录...');
      history.push('/consumable/list/index');
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
      history.push('/apply/consumable');
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
                consumableList.status < key
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
                  disabled={current < consumableList.status - 2}
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
          <StepsForm.StepForm
            name="cg"
            title="重新采购"
            onFinish={async () => {
              if (!access.canPurchaseConsumableList) {
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
                  consumableList.consumable_apply_id,
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
              name="consumable_apply_id"
              label="申请单号"
              width="md"
              disabled
            />
            <ProFormText
              name="platform_id"
              label="平台ID"
              width="md"
              disabled={current < consumableList.status - 1}
              rules={[{ required: true }]}
            />
            <ProFormText
              name="consumable"
              label="耗材名称"
              width="md"
              disabled={current < consumableList.status - 1}
              rules={[{ required: true }]}
            />
            <ProFormText
              name="model"
              label="规格型号"
              width="md"
              disabled={current < consumableList.status - 1}
              rules={[{ required: true }]}
            />
            <ProFormMoney
              name="price"
              label="单价"
              width="md"
              disabled={current < consumableList.status - 1}
              rules={[{ required: true }]}
            />
            <ProFormSelect
              label="申请科室"
              request={departments}
              fieldProps={{
                showSearch: true,
                filterOption: (input: any, option: any) =>
                  (option?.label ?? '').includes(input),
              }}
              name="department"
              disabled
            />
            <ProFormText
              name="registration_num"
              label="注册证号"
              width="md"
              disabled={current < consumableList.status - 1}
              rules={[{ required: true }]}
            />
            <ProFormText
              name="category_zj"
              label="浙江分类"
              width="md"
              disabled={current < consumableList.status - 1}
              rules={[{ required: true }]}
            />
            <ProFormText
              name="parent_directory"
              label="一级目录"
              width="md"
              disabled={current < consumableList.status - 1}
              rules={[{ required: true }]}
            />
            <ProFormText
              name="child_directory"
              label="二级目录"
              width="md"
              disabled={current < consumableList.status - 1}
              rules={[{ required: true }]}
            />
            <ProFormText
              name="company"
              label="供应商"
              width="md"
              disabled={current < consumableList.status - 1}
              rules={[{ required: true }]}
            />
            <ProFormText
              name="manufacturer"
              label="生产厂家"
              width="md"
              disabled={current < consumableList.status - 1}
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
              disabled={current < consumableList.status - 1}
              rules={[{ required: true }]}
            />
            <ProFormRadio.Group
              name="is_need"
              label="是否询价"
              width="sm"
              disabled={current < consumableList.status - 1}
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
              disabled={current < consumableList.status - 1}
            />
            <ProFormDatePicker
              name="start_date"
              label="合同日期："
              width="sm"
              disabled={current < consumableList.status - 1}
              rules={[{ required: true }]}
            />
            <ProFormUploadButton
              label="合同附件："
              name="contract_file"
              extra={
                consumableList.status - 1 > current ? (
                  <PreviewListModal
                    fileListString={consumableList.contract_file}
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
              if (!access.canApproveConsumableList) {
                message.error('你无权进行此操作');
                return;
              }
              const values = formRef.current?.getFieldsValue();
              await runApprove(consumableList.id, id, values.approve);
            }}
          >
            <ProFormRadio.Group
              name="approve"
              label="审核结果："
              rules={[{ required: true }]}
              disabled={current < consumableList.status - 2}
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
              if (!access.canEngineerApproveConsumableList) {
                message.error('你无权进行此操作');
                return;
              }
              const values = formRef.current?.getFieldsValue();
              await runEngineerApprove(consumableList.id, id, values.vertify);
            }}
          >
            <ProFormDatePicker
              name="exp_date"
              label="失效日期："
              width="sm"
              disabled={current < consumableList.status - 2}
              rules={[{ required: true }]}
            />
            <ProFormRadio.Group
              name="vertify"
              label="审核结果："
              rules={[{ required: true }]}
              disabled={current < consumableList.status - 2}
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
      </ProCard>
    </PageContainer>
  );
};

export default ConsumableDetailPage;
