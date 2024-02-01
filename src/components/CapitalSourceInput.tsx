import type { RadioChangeEvent } from 'antd';
import { Input, Radio, Space } from 'antd';
import React, { useState } from 'react';

type CapitalSourceType =
  | '自筹资金'
  | '财政拨款'
  | '专项资金'
  | '学科经费'
  | '名医工作室'
  | '更多';

interface CapitalSourceValue {
  type: CapitalSourceType;
  more?: string;
}

interface CapitalSourceInputProps {
  value?: CapitalSourceValue;
  onChange?: (value: CapitalSourceValue) => void;
}

const CapitalSourceInput: React.FC<CapitalSourceInputProps> = ({
  value = {},
  onChange,
}) => {
  const [type, setType] = useState<CapitalSourceType>('');
  const [more, setMore] = useState<string>('');

  const triggerChange = (changedValue: {
    type?: CapitalSourceType;
    more?: string;
  }) => {
    onChange?.({ type, more, ...value, ...changedValue });
  };

  const onTypeChange = (e: RadioChangeEvent) => {
    setType(e.target.value);
    triggerChange({ type: e.target.value });
  };

  const onMoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMore(e.target.value);
    triggerChange({ more: e.target.value });
  };

  return (
    <Radio.Group onChange={onTypeChange} value={value.type || type}>
      <Space direction="horizontal">
        <Radio value="自筹资金">自筹资金</Radio>
        <Radio value="财政拨款">财政拨款</Radio>
        <Radio value="专项资金">专项资金</Radio>
        <Radio value="学科经费">学科经费</Radio>
        <Radio value="名医工作室">名医工作室</Radio>
        <Radio value="更多">
          更多
          {type === '更多' ? (
            <Input
              onChange={onMoreChange}
              value={value.more || more}
              style={{ width: 100, marginLeft: 10 }}
            />
          ) : null}
        </Radio>
      </Space>
    </Radio.Group>
  );
};

export default CapitalSourceInput;
