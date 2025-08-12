import { SERVER_HOST } from '@/constants';
import { PageContainer } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Button, Col, Form, Input, Row, Space, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';

const getConsumable = async (product_id: string) => {
  return axios.get(
    `${SERVER_HOST}/consumable/net/index?product_id=${product_id}`,
  );
};

const getList = async (product_id: string) => {
  return axios.get(
    `${SERVER_HOST}/consumable/net/select?product_id=${product_id}`,
  );
};

const ConsumableSelectPage: React.FC = () => {
  const [data, setData] = useState({});
  const [consumable, setConsumable] = useState({});
  const [form] = Form.useForm();
  const product_id = Form.useWatch('product_id', form);
  const department = Form.useWatch('department', form);
  const serial_id = Form.useWatch('serial_id', form);
  const count = Form.useWatch('count', form);
  const date = new Date(Date.now());

  const convertToPDF = () => {
    let domElement = document.getElementById('myElement'); // 要转换为PDF的元素的ID
    let iframe = document.getElementById('printFrame');
    let doc = iframe.contentWindow || iframe.contentDocument;
    if (doc.document) doc = doc.document; // 对于IE浏览器
    doc.body.innerHTML = domElement.innerHTML; // 设置iframe内容为特定元素的内容
    iframe.contentWindow.document.close(); // 关闭文档流以开始打印
    iframe.contentWindow.focus(); // 确保窗口获得焦点以避免弹出阻止器问题
    iframe.contentWindow.print(); // 触发打印
    // html2canvas(domElement, {scale: 2}).then((canvas) => {
    //   const imgData = canvas.toDataURL('image/png');
    //   const pdf = new jsPDF('l', 'pt', 'a4');
    //   const imgProps = pdf.getImageProperties(imgData);
    //   const pdfWidth = pdf.internal.pageSize.getWidth();
    //   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    //   let heightLeft = pdfHeight;

    //   const pageHeight = pdf.internal.pageSize.getHeight();
    //   let position = 0;

    //   pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);

    //   heightLeft -= pageHeight;

    //   while (heightLeft >= 0) {
    //     position = heightLeft - pageHeight;
    //     pdf.addPage();
    //     pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    //     heightLeft -= pageHeight;
    //   }

    //   pdf.save('download.pdf'); // 保存PDF文件
    // });
  };

  const { run: runGetList } = useRequest(getList, {
    manual: true,
    onSuccess: (res) => {
      console.log('res:', res);
      setData(res.data);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { run: runGetConsumable } = useRequest(getConsumable, {
    manual: true,
    onSuccess: (res) => {
      console.log('res:', res);
      setConsumable(res.data[0]);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  useEffect(() => {
    runGetList(product_id);
  }, [consumable]);

  return (
    <PageContainer
      ghost
      header={{
        title: '耗材遴选',
      }}
    >
      <div>
        <Form form={form}>
          <Row>
            <Col span={12} style={{ padding: '0 40px' }}>
              <Form.Item label="产品id" rules={[{ required: true }]}>
                <Space>
                  <Form.Item name="product_id" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Button
                    style={{ marginBottom: '25px' }}
                    onClick={() => runGetConsumable(product_id)}
                  >
                    搜索
                  </Button>
                </Space>
              </Form.Item>
            </Col>
            <Col span={12} style={{ padding: '0 40px' }}>
              <Form.Item
                name="department"
                label="使用科室"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12} style={{ padding: '0 40px' }}>
              <Form.Item
                name="serial_id"
                label="院内申请编号"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12} style={{ padding: '0 40px' }}>
              <Form.Item
                name="count"
                label="年采购量"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
      <div
        id="myElement"
        style={{ paddingRight: '100px', paddingLeft: '100px' }}
      >
        <h2
          style={{
            margin: '0 auto',
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          集采目录耗材动态遴选审批单
        </h2>
        <table
          style={{
            width: '960',
            margin: '0 auto',
            borderCollapse: 'collapse',
            textAlign: 'center',
          }}
          border={1}
        >
          <tr>
            <td style={{ height: '40px' }} width={60} colSpan={1}>
              使用科室
            </td>
            <td width={240} colSpan={4}>
              {department}
            </td>
            <td width={60} colSpan={1}>
              遴选日期
            </td>
            <td width={180} colSpan={3}>{`${date.getFullYear()}年${
              date.getMonth() + 1 > 9
                ? date.getMonth() + 1
                : '0' + (date.getMonth() + 1)
            }月${
              date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
            }日`}</td>
            <td width={120} colSpan={2}>
              院内目录申请编号
            </td>
            <td width={300} colSpan={5}>
              {serial_id}
            </td>
          </tr>
          <tr>
            <td style={{ height: '120px' }} width={120} colSpan={2}>
              耗材现使用情况
            </td>
            <td style={{ height: '120px' }} width={840} colSpan={14}>
              <table
                style={{
                  margin: '0 auto',
                  borderCollapse: 'collapse',
                  textAlign: 'center',
                }}
                border={1}
              >
                <tr>
                  <td style={{ height: '40px' }} width={120}>
                    平台ID
                  </td>
                  <td width={120}>耗材名称</td>
                  <td width={120}>规格型号</td>
                  <td width={120}>投标企业</td>
                  <td width={120}>平台价格</td>
                  <td width={120}>注册证号</td>
                  <td width={120}>年采购量</td>
                </tr>
                <tr>
                  <td style={{ height: '40px' }} width={120}>
                    {product_id}
                  </td>
                  <td width={120}>{consumable.consumable}</td>
                  <td width={120}>{consumable.model}</td>
                  <td width={120}>{consumable.company}</td>
                  <td width={120}>{consumable.price === 0 ? consumable.tempory_price : consumable.price}</td>
                  <td width={120}>{consumable.registration_num}</td>
                  <td width={120}>{count}</td>
                </tr>
                <tr>
                  <td style={{ height: '40px' }} width={120}></td>
                  <td width={120}></td>
                  <td width={120}></td>
                  <td width={120}></td>
                  <td width={120}></td>
                  <td width={120}></td>
                  <td width={120}></td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ height: '40px' }} width={60} colSpan={1}>
              浙江分类
            </td>
            <td width={240} colSpan={4}>
              {consumable.category}
            </td>
            <td width={60} colSpan={1}>
              一级目录
            </td>
            <td width={240} colSpan={4}>
              {consumable.parent_directory}
            </td>
            <td width={60} colSpan={1}>
              二级目录
            </td>
            <td width={300} colSpan={5}>
              {consumable.child_directory}
            </td>
          </tr>
          <tr>
            <td style={{ height: '40px' }} width={960} colSpan={16}>
              两定平台中标耗材目录内同类耗材（按厂家遴选，同个厂家型号较多，可以列出常规一个型号）
            </td>
          </tr>
          <tr>
            <td style={{ height: '40px' }} width={60} colSpan={1}>
              序号
            </td>
            <td width={240} colSpan={4}>
              投标企业
            </td>
            <td width={60} colSpan={1}>
              型号
            </td>
            <td width={120} colSpan={2}>
              规格
            </td>
            <td width={60} colSpan={1}>
              挂网价（元）
            </td>
            <td width={120} colSpan={2}>
              产品ID
            </td>
            <td width={180} colSpan={3}>
              产品名称
            </td>
            <td width={120} colSpan={2}>
              联系电话
            </td>
          </tr>
          {_.map(data, (item: any, key: number) => {
            return (
              <tr>
                <td style={{ height: '40px' }} width={60} colSpan={1}>
                  {key + 1}
                </td>
                <td width={240} colSpan={4}>
                  {item.company}
                </td>
                <td width={60} colSpan={1}>
                  {item.model}
                </td>
                <td width={120} colSpan={2}>
                  {item.specification}
                </td>
                <td width={20} colSpan={1}>
                  {item.price === 0 ? item.tempory_price : item.price}
                </td>
                <td width={120} colSpan={2}>
                  {item.product_id}
                </td>
                <td width={180} colSpan={3}>
                  {item.consumable}
                </td>
                <td width={120} colSpan={2}></td>
              </tr>
            );
          })}
          <tr>
            <td style={{ height: '120px' }} width={120} colSpan={2}>
              科室内部讨论意见（含遴选原因）
            </td>
            <td width={840} colSpan={14} style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: 10, left: 10 }}>
                科室意见：
              </div>
              <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
                科室成员（至少两人）：
              </div>
              <div style={{ position: 'absolute', bottom: 10, right: 150 }}>
                科主任：
              </div>
            </td>
          </tr>
          <tr>
            <td style={{ height: '40px' }} width={120} colSpan={2}>
              医学工程科审核
            </td>
            <td width={840} colSpan={14}></td>
          </tr>
          <tr>
            <td style={{ height: '40px' }} width={120} colSpan={2}>
              准入分管院长审核
            </td>
            <td width={840} colSpan={14}></td>
          </tr>
          <tr>
            <td style={{ height: '80px' }} width={120} colSpan={2}>
              采购询价上会结论
            </td>
            <td width={840} colSpan={14}></td>
          </tr>
          <tr>
            <td style={{ height: '40px' }} width={120} colSpan={2}>
              采购分管院长审核
            </td>
            <td width={840} colSpan={14}></td>
          </tr>
          <tr>
            <td style={{ height: '40px' }} width={120} colSpan={2}>
              院长审批意见
            </td>
            <td width={840} colSpan={14}></td>
          </tr>
        </table>
      </div>
      <Button onClick={convertToPDF}>Download PDF</Button>
      <iframe id="printFrame" style={{ display: 'none' }}></iframe>
    </PageContainer>
  );
};

export default ConsumableSelectPage;
