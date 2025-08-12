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
import ConsumableUploadExcelTable from '@/components/ConsumableUploadExcelTable';

const formatDate = (date: any) => {
  if (_.isString(date)) return date;
  if (!date.$isDayjsObject) return null;
  return date.format('YYYY-MM-DD');
};

const getItem = async (id: string, consumable_id: string) => {
  return await axios.get(
    `${SERVER_HOST}/consumables/${consumable_id}/snapshot/${id}`,
  );
};

const getAllDepartments = async () => {
  return await axios.get(`${SERVER_HOST}/department/index?is_functional=0`);
};

const apply = async (
  platform_id: string,
  consumable: string,
  department: string,
  model: string,
  price: number,
  manufacturer: string,
  company: string, 
  in_drugstore: boolean,
  apply_type: string,
  apply_date: string,
  count_year: number,
  need_selection: boolean,
  medical_approval_file: string,
  registration_num: string,
  category_zj: string,
  parent_directory: string,
  child_directory: string
) => {
  const data = {
    platform_id,
    department,
    consumable,
    model,
    price,
    manufacturer,
    company,
    in_drugstore,
    apply_type,
    apply_date: formatDate(apply_date),
    count_year,
    need_selection,
    medical_approval_file: fileListToString(medical_approval_file),
    registration_num,
    category_zj,
    parent_directory,
    child_directory,
  };

  return await axios.post(
    `${SERVER_HOST}/consumables`,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

const bulkInsert = async (data: any, serial_number: string) => {
  const remappedData = data.map((item: any) => {
    return {...item, consumable_apply_id: serial_number};
  });

  return await axios({
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    data: {
      items: remappedData,
    },
    url: `${SERVER_HOST}/consumable/select/net/bulkInsert`,
  });
}

const approve = async (id: string, approve: number) => {
  return await axios({
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      approved: approve.toString(),
    },
    url: `${SERVER_HOST}/consumables/${id}`,
  });
};

const ConsumableApplyDetailPage: React.FC = () => {
  const [consumable, setConsumable] = useState<any>({});
  const hashArray = history.location.hash.split('#')[1].split('&');
  const method = hashArray[0];
  const id = hashArray[1];
  const consumable_id = hashArray[2];
  const [modal, contextHolder] = Modal.useModal();
  const formRef = useRef<ProFormInstance>();
  const [current, setCurrent] = useState<number>(0);
  const access = useAccess();
  const [data, setData] = useState<any>([]);

  const onStepChange = (currentStep: number) => {
    setCurrent(currentStep);
  
    if (currentStep === 0 && Object.keys(consumable).length > 0) {
      // 第一步：申请表单初始化
      formRef.current?.setFieldsValue({
        platform_id: consumable.platform_id,
        department: consumable.department,
        consumable: consumable.consumable,
        model: consumable.model,
        price: parseFloat(consumable.price || 0),
        manufacturer: consumable.manufacturer,
        company: consumable.company,
        in_drugstore: Boolean(consumable.in_drugstore).toString(),
        apply_type: consumable.apply_type,
        apply_date: consumable.apply_date,
        count_year: consumable.count_year,
        need_selection: Boolean(consumable.need_selection).toString(),
        registration_num: consumable.registration_num,
        category_zj: consumable.category_zj,
        parent_directory: consumable.parent_directory,
        child_directory: consumable.child_directory,
        medical_approval_file: fileStringToAntdFileList(consumable.medical_approval_file)
      });
    }
  
    if (currentStep === 1) {
      // 第二步：审核表单初始化
      // 可在此添加审核字段逻辑
    }
  };

  const { run: runGetItem } = useRequest(getItem, {
    manual: true,
    onSuccess: (result: any) => {
      const data = result.snapshot;
  
      setConsumable({
        ...data,
      });
  
      // onStepChange(data.status);
  
      // 初始化表单字段（可选）
      // formRef.current?.setFieldsValue({
      //   platform_id: data.platform_id,
      //   department: data.department,
      //   consumable: data.consumable,
      //   model: data.model,
      //   price: parseFloat(data.price || 0),
      //   manufacturer: data.manufacturer,
      //   company: data.company,
      //   in_drugstore: Boolean(data.in_drugstore),
      //   apply_type: data.apply_type,
      //   apply_date: data.apply_date,
      //   count_year: data.count_year,
      //   need_selection: Boolean(data.need_selection),
      //   registration_num: data.registration_num,
      //   category_zj: data.category_zj,
      //   parent_directory: data.parent_directory,
      //   child_directory: data.child_directory,
      //   medical_approval_file: fileStringToAntdFileList(data.medical_approval_file)
      // });
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });


  // const {run: runBulkInsert} = useRequest(bulkInsert, {
  //   manual: true,
  //   onSuccess: () => {
  //     message.success('插入成功');
  //   },
  //   onError: (error: any) => {
  //     message.error(error.message);
  //   },
  // });

  const { run: runApply } = useRequest(apply, {
    manual: true,
    onSuccess: async () => {
      // await runBulkInsert(data, consumable.serial_number);
      message.success('创建成功');
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

  const { run: runGetAllDepartments } = useRequest(getAllDepartments, {
    manual: true,
    onSuccess: () => {},
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const confirm = () => {
    history.push('/consumable/list/apply');
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
      setCurrent(0); // 默认进入第一步
    } else if (method === 'update' && id) {
      runGetItem(id, consumable_id).then(() => {
        // 设置当前步骤为 1（审核步骤）
        setCurrent(1);
      });
    } else {
      history.push('/consumable/list/apply');
    }
  }, []);

  useEffect(() => {
    if (current === 0 && Object.keys(consumable).length > 0 && formRef.current) {
      formRef.current.setFieldsValue({
        platform_id: consumable.platform_id,
        department: consumable.department,
        consumable: consumable.consumable,
        model: consumable.model,
        price: parseFloat(consumable.price || 0),
        manufacturer: consumable.manufacturer,
        company: consumable.company,
        in_drugstore: Boolean(consumable.in_drugstore).toString(),
        apply_type: consumable.apply_type,
        apply_date: consumable.apply_date,
        count_year: consumable.count_year,
        need_selection: Boolean(consumable.need_selection).toString(),
        registration_num: consumable.registration_num,
        category_zj: consumable.category_zj,
        parent_directory: consumable.parent_directory,
        child_directory: consumable.child_directory,
        medical_approval_file: fileStringToAntdFileList(consumable.medical_approval_file)
      });
    }
  }, [consumable, current]);
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
            const items = steps.map((value, key) => {
              let status = 'finish';
              if (key === current) {
                status = 'process';
              } else if (key < current) {
                status = 'finish';
              } else {
                status = 'wait';
              }
          
              return {
                ...value,
                status,
                title: value.title,
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
                  disabled={consumable.status > current}
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
              // if (!access.canApplyConsumableRecord) {
              //   message.error('你无权进行此操作');
              //   return;
              // }
              const values = formRef.current?.getFieldsValue();

              await runApply(
                values.platform_id,
                values.consumable,
                values.department,
                values.model,
                values.price,
                values.manufacturer,
                values.company,
                Boolean(values.in_drugstore),
                values.apply_type,
                values.apply_date,
                values.count_year,
                Boolean(values.need_selection),
                values.medical_approval_file,
                values.registration_num, 
                values.category_zj,
                values.parent_directory,
                values.child_directory
              );
              confirm();
            }}
          >
            
            <ProFormText
              name="platform_id"
              label="平台ID"
              width="md"
              disabled={
                method !== 'create' || current < consumable.status
              }
              rules={[{ required: true }]}
            />
            <ProFormText
              name="consumable"
              label="耗材名称"
              width="md"
              disabled={
                method !== 'create' || current < consumable.status
              }
              rules={[{ required: true }]}
            />
            <ProFormSelect
              label="申请科室"
              fieldProps={{
                showSearch: true,
                filterOption: (input: any, option: any) =>
                  (option?.label ?? '').includes(input),
              }}
              request={departments}
              name="department"
              disabled={
                method !== 'create' || current < consumable.status
              }
              rules={[{ required: true }]}
            />
            <ProFormText
              name="model"
              label="规格型号"
              width="md"
              disabled={
                method !== 'create' || current < consumable.status
              }
              rules={[{ required: true }]}
            />
            <ProFormMoney
              name="price"
              label="单价"
              width="md"
              disabled={
                method !== 'create' || current < consumable.status
              }
              rules={[{ required: true }]}
            />
            <ProFormDatePicker
              name="apply_date"
              label="申请日期"
              width="sm"
              disabled={
                method !== 'create' || current < consumable.status
              }
              rules={[{ required: true }]}
            />
            <ProFormDigit
              name="count_year"
              label="年使用量"
              width="sm"
              disabled={
                method !== 'create' || current < consumable.status
              }
              rules={[{ required: true, type: 'integer', min: 0 }]}
            />
            <ProFormText
              name="registration_num"
              label="注册证号"
              width="md"
              disabled={
                method !== 'create' || current < consumable.status
              }
              rules={[{ required: true }]}
            />
            <ProFormText
              name="company"
              label="供应商"
              width="md"
              disabled={
                method !== 'create' || current < consumable.status
              }
              rules={[{ required: true }]}
            />
            <ProFormText
              name="manufacturer"
              label="生产厂家"
              width="md"
              disabled={
                method !== 'create' || current < consumable.status
              }
              rules={[{ required: true }]}
            />
            <ProFormText
              name="category_zj"
              label="浙江分类"
              width="md"
              disabled={
                method !== 'create' || current < consumable.status
              }
              rules={[{ required: true }]}
            />
            <ProFormText
              name="parent_directory"
              label="一级目录"
              width="md"
              disabled={
                method !== 'create' || current < consumable.status
              }
              rules={[{ required: true }]}
            />
            <ProFormText
              name="child_directory"
              label="二级目录"
              width="md"
              disabled={
                method !== 'create' || current < consumable.status
              }
              rules={[{ required: true }]}
            />
            <ProFormSelect
              label="采购方式："
              name="apply_type"
              valueEnum={{
                'bid_product': { text: '中标采购' },
                'sunshine_purchase': { text: '阳光采购' },
                'self_purchase': { text: '自行采购' },
                'offline_purchase': { text: '线下采购' },
                'volume_purchase': { text: '带量采购' },
              }}
              disabled={
                method !== 'create' || current < consumable.status
              }
              rules={[{ required: true }]}
            />
            <ProFormRadio.Group
              name="need_selection"
              label="是否需要遴选"
              width="sm"
              disabled={
                method !== 'create' || current < consumable.status
              }
              valueEnum={{
                "true": { text: '是' },
                "false": { text: '否' },
              }}
              rules={[{ required: true }]}
            />
            <ProFormRadio.Group
              name="in_drugstore"
              label="是否为便民药房"
              disabled={
                method !== 'create' || current < consumable.status
              }
              width="sm"
              valueEnum={{
                "true": { text: '是' },
                "false": { text: '否' },
              }}
              rules={[{ required: true }]}
            />
            <ProFormUploadButton
              label="医疗审批单附件："
              name="medical_approval_file"
              extra={
                method !== 'create' || current < consumable.status ? (
                  <PreviewListModal
                    fileListString={consumable.medical_approval_file}
                  />
                ) : null
              }
              fieldProps={{
                customRequest: (options) => {
                  upload(options.file, (isSuccess: boolean, filename: string) =>
                    handleUpload(
                      isSuccess,
                      filename,
                      'medical_approval_file',
                      options.file.uid,
                    ),
                  );
                },
              }}
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="sh"
            title="分管院长审核"
            onFinish={async () => {
              // if (!access.canApproveConsumableRecord) {
              //   message.error('你无权进行此操作');
              //   return;
              // }
              const values = formRef.current?.getFieldsValue();
              await runApprove(consumable.id, values.approve);
            }}
          >
            <ProFormRadio.Group
              name="approve"
              label="审核结果："
              rules={[{ required: true }]}
              disabled={current < consumable.status}
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
        {/* <div style={{width: '100%'}}>
          <div style={{width: '800px', margin: '0 auto'}}>
              <ConsumableUploadExcelTable
                consumable_apply_id={serialNumber}
                data = {data}
                setData = {setData}
                isUpload={false}
              />
          </div>
        </div> */}
      </ProCard>
    </PageContainer>
  );
};

export default ConsumableApplyDetailPage;
