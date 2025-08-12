import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Upload, Button, Table, message, Row, Col } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { VariableSizeGrid as Grid } from 'react-window';
import type { TableProps } from 'antd';
import classNames from 'classnames';
import ResizeObserver from 'rc-resize-observer';
import { SERVER_HOST } from '@/constants';
import { useRequest } from '@umijs/max';
import _ from 'lodash';

interface Props {
    consumable_apply_id: string;
    isUpload: boolean;
    data: any;
    setData: any;
}

const getConsumableList = async (consumable_apply_id: string) => {
    return axios.get(`${SERVER_HOST}/consumable/select/net/index?consumable_apply_id=${consumable_apply_id}`);
};

const VirtualTable = <RecordType extends object>(props: TableProps<RecordType>) => {
    const { columns, scroll } = props;
    const [tableWidth, setTableWidth] = useState(0);
  
    const widthColumnCount = columns!.filter(({ width }) => !width).length;
    const mergedColumns = columns!.map(column => {
      if (column.width) {
        return column;
      }
  
      return {
        ...column,
        width: Math.floor(tableWidth / widthColumnCount),
      };
    });
  
    const gridRef = useRef<any>();
    const [connectObject] = useState<any>(() => {
      const obj = {};
      Object.defineProperty(obj, 'scrollLeft', {
        get: () => {
          if (gridRef.current) {
            return gridRef.current?.state?.scrollLeft;
          }
          return null;
        },
        set: (scrollLeft: number) => {
          if (gridRef.current) {
            gridRef.current.scrollTo({ scrollLeft });
          }
        },
      });
  
      return obj;
    });
  
    const resetVirtualGrid = () => {
      gridRef.current?.resetAfterIndices({
        columnIndex: 0,
        shouldForceUpdate: true,
      });
    };
  
    useEffect(() => resetVirtualGrid, [tableWidth]);
  
    const renderVirtualList = (rawData: object[], { scrollbarSize, ref, onScroll }: any) => {
      ref.current = connectObject;
      const totalHeight = rawData.length * 54;
  
      return (
        <Grid
          ref={gridRef}
          className="virtual-grid"
          columnCount={mergedColumns.length}
          columnWidth={(index: number) => {
            const { width } = mergedColumns[index];
            return totalHeight > scroll!.y! && index === mergedColumns.length - 1
              ? (width as number) - scrollbarSize - 1
              : (width as number);
          }}
          height={scroll!.y as number}
          rowCount={rawData.length}
          rowHeight={() => 54}
          width={tableWidth}
          onScroll={({ scrollLeft }: { scrollLeft: number }) => {
            onScroll({ scrollLeft });
          }}
        >
          {({
            columnIndex,
            rowIndex,
            style,
          }: {
            columnIndex: number;
            rowIndex: number;
            style: React.CSSProperties;
          }) => (
            <div
              className={classNames('virtual-table-cell', {
                'virtual-table-cell-last': columnIndex === mergedColumns.length - 1,
              })}
              style={style}
            >
              {(rawData[rowIndex] as any)[(mergedColumns as any)[columnIndex].dataIndex]}
            </div>
          )}
        </Grid>
      );
    };
  
    return (
      <ResizeObserver
        onResize={({ width }) => {
          setTableWidth(width);
        }}
      >
        <Table
          {...props}
          className="virtual-table"
          columns={mergedColumns}
          pagination={false}
          components={{
            body: renderVirtualList,
          }}
        />
      </ResizeObserver>
    );
  };
  

const ConsumableUploadExcelTable: React.FC<Props>= (props) => {


    const uploadXlsx = async (options: any, mode: number) => {
        const form = new FormData();
        form.append('file', options.file);
        return await axios({
          method: 'POST',
          data: form,
          url: `http://localhost:3030/storeXlsx?mode=${mode}`,
        })
        .then((result) => {
            console.log('data:', result.data.data);
            props.setData(result.data.data)
        })
        .catch((err) => {
            message.error(err);
          });
      };

    const { run: runGetConsumableList } = useRequest(getConsumableList, {
        onSuccess: (result: any) => {
            console.log(result);
            props.setData(result.data)
        },
        onError: (error: any) => {
            message.error(error.message);
        },
    });
  

    const columns = [
        {
            title: '耗材名称',
            dataIndex: 'consumable',
            width: 200,
            key: 'consumable',
        },
        {
            title: '规格型号',
            dataIndex: 'model',
            width: 100,
            key: 'model',
        },
        {
            title: '生产厂家',
            dataIndex: 'manufacturer',
            width: 150,
            key: 'manufacturer',
        },
        {
            title: '注册证号',
            width: 100,
            dataIndex: 'registration_num',
            key: 'registration_num',
        },
        {
            title: '供应商',
            width: 100,
            dataIndex: 'company',
            key: 'company',
        },
        {
            title: '单价',
            width: 100,
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '产品id',
            width: 100,
            dataIndex: 'product_id',
            key: 'product_id',
        },
        {
            title: '挂网id',
            width: 300,
            dataIndex: 'consumable_net_id',
            key: 'consumable_net_id',
        },
        {
            title: '浙江分类',
            width: 100,
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: '一级目录',
            width: 100,
            dataIndex: 'parent_directory',
            key: 'parent_directory',
        },
        {
            title: '二级目录',
            width: 100,
            dataIndex: 'child_directory',
            key: 'child_directory',
        },
    ];
    
    useEffect(() => {
        if (props.isUpload === true && props.consumable_apply_id) {
            runGetConsumableList(props.consumable_apply_id);
        }
    }, []);

    return (
        <div>
            <Row>
                <Col span={12} style={{lineHeight: '31px'}}>
                    共有{props.data.length}条数据
                </Col>
                {
                     props.isUpload === true ?
                     (<Col span={4}>
                        <Upload
                            name="downloadfile"
                            key="2"
                        >
                            <Button icon={<DownloadOutlined />}>下载耗材表</Button>
                        </Upload>
                    </Col>) : null
                }
                {
                    props.isUpload === false ? 
                    (<Col span={4}>
                        <Upload
                            name="file"
                            key="1"
                            customRequest={async (options) => {
                                await uploadXlsx(options, 2);
                            }}
                        >
                            <Button icon={<UploadOutlined />}>上传耗材表</Button>
                        </Upload>
                    </Col>) : null    
                }
                {
                    props.isUpload === true ?
                    (
                        <Col span={4}>
                            <Upload
                                name="template"
                                key="3"
                            >
                                <Button icon={<DownloadOutlined />}>下载模板</Button>
                            </Upload>
                        </Col>        
                    ) : null
                }
                
            </Row>
            
            <VirtualTable 
                columns={columns} 
                dataSource={props.data} 
                scroll={{ y: 300, x: '100vw' }}             
                pagination={{
                    current: 1,
                    pageSize: 20
                }} />
        </div>
    )
  };
  
export default ConsumableUploadExcelTable;