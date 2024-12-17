import React, { useState } from 'react';
import { Drawer, Tabs, Typography, Card, Space, Empty, Table, Tag, Button, Modal, InputNumber, Segmented, message } from 'antd';
import type { TabsProps } from 'antd';
import { BlockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import ExternalConnectionPathVisual from './ExternalConnectionPathVisual';

const { Title } = Typography;

interface TimeUnit {
  label: string;
  value: string;
  multiplier: number;
}

const timeUnits: TimeUnit[] = [
  { label: '分钟', value: 'minute', multiplier: 60 },
  { label: '小时', value: 'hour', multiplier: 3600 },
  { label: '天', value: 'day', multiplier: 86400 },
  { label: '月', value: 'month', multiplier: 2592000 },
  { label: '永久', value: 'forever', multiplier: -1 }
];

interface RequestInfo {
  params: Record<string, string>;
  headers: Record<string, string>;
  body: any;
  protocol?: string;
  url?: string;
  dnsName?: string;
}

interface ExternalConnectionDetailProps {
  open: boolean;
  onClose: () => void;
  data: {
    id: string;
    time: string;
    attackIp: string;
    location: string;
    targetIp: string;
    targetPort: string;
    intelType: string;
    action: string;
    intelSource: string;
    rule?: string;
    assetGroup?: string;
    requestInfo?: RequestInfo;
  }
}

const ExternalConnectionDetail: React.FC<ExternalConnectionDetailProps> = ({
  open,
  onClose,
  data
}) => {
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [listType, setListType] = useState<'black' | 'white'>('black');
  const [duration, setDuration] = useState<number>(1);
  const [timeUnit, setTimeUnit] = useState<string>('hour');

  // 获取协议标签的颜色
  const getProtocolColor = (protocol: string) => {
    const colors: Record<string, string> = {
      'http': 'blue',
      'https': 'green',
      'dns': 'orange',
      'ftp': 'purple',
      'smtp': 'cyan',
    };
    return colors[protocol?.toLowerCase()] || 'default';
  };

  // 处理请求头表格数据
  const requestHeadersData = React.useMemo(() => {
    if (!data?.requestInfo?.headers) return [];
    return Object.entries(data.requestInfo.headers).map(([key, value], index) => ({
      key: index,
      name: key,
      value: value
    }));
  }, [data?.requestInfo?.headers]);

  const requestTabs: TabsProps['items'] = [
    {
      key: 'headers',
      label: '请求头',
      children: (
        <Table
          columns={[
            { title: '名称', dataIndex: 'name', key: 'name' , width: '30%'},
            { title: '值', dataIndex: 'value', key: 'value' , width: '70%'},
          ]}
          dataSource={requestHeadersData}
          pagination={false}
          size="small"
        />
      ),
    },
    {
      key: 'body',
      label: '请求体',
      children: (
        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {data?.requestInfo?.body ? JSON.stringify(data.requestInfo.body, null, 2) : ''}
        </pre>
      ),
    },
    {
      key: 'params',
      label: '请求参数',
      children: <Empty description="暂无数据" />,
    },
  ];

  const items: TabsProps['items'] = [
    {
      key: 'logInfo',
      label: '日志信息',
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Card 
            title="告警信息详情"
          >
            <ExternalConnectionPathVisual
              attackerInfo={{
                ip: data?.attackIp || '',
              }}
              victimInfo={{
                ip: data?.targetIp || '',
              }}
              protocol={data?.requestInfo?.protocol || 'HTTP'}
              url={data?.requestInfo?.url || ''}
            />
          </Card>

          {data?.requestInfo && (
            <Card title="请求信息">
              <Tabs items={requestTabs} />
            </Card>
          )}
        </Space>
      ),
    },
    {
      key: 'ipTrace',
      label: '外联溯源',
      children: <Empty description="暂无数据" />,
    },
  ];

  // 处理打开时间设置对话框
  const handleOpenTimeModal = (type: 'black' | 'white') => {
    setListType(type);
    setTimeModalVisible(true);
  };

  // 处理确认添加到名单
  const handleConfirmAddToList = () => {
    const selectedUnit = timeUnits.find(unit => unit.value === timeUnit);
    let totalSeconds = 0;
    
    if (selectedUnit?.value === 'forever') {
      totalSeconds = -1;
    } else if (selectedUnit) {
      totalSeconds = duration * selectedUnit.multiplier;
    }

    message.success(`已将IP ${data.attackIp} 添加到${listType === 'black' ? '黑' : '白'}名单，时长：${
      totalSeconds === -1 ? '永久' : `${duration}${selectedUnit?.label}`
    }`);
    
    setTimeModalVisible(false);
  };

  return (
    <>
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', height: '32px' }}>
            <Title level={4} style={{ margin: 0, fontSize: '18px' }}>外联检测详情</Title>
          </div>
        }
        placement="right"
        width="clamp(800px, 50%, 100%)"
        onClose={onClose}
        open={open}
      >
        <Tabs defaultActiveKey="logInfo" items={items} />
      </Drawer>

      <Modal
        title={`添加到${listType === 'black' ? '黑' : '白'}名单`}
        open={timeModalVisible}
        onOk={handleConfirmAddToList}
        onCancel={() => setTimeModalVisible(false)}
        okText="确认"
        cancelText="取消"
        centered
        style={{ top: '20px' }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Typography.Text>IP地址：{data?.attackIp}</Typography.Text>
          </div>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <InputNumber
                min={1}
                value={duration}
                onChange={(value) => setDuration(value || 1)}
                style={{ width: 120 }}
                disabled={timeUnit === 'forever'}
              />
              <Segmented
                value={timeUnit}
                onChange={(value) => {
                  setTimeUnit(value.toString());
                  if (value === 'forever') {
                    setDuration(1);
                  }
                }}
                options={timeUnits.map(unit => ({
                  label: unit.label,
                  value: unit.value
                }))}
                style={{
                  backgroundColor: 'white',
                  width: 'fit-content'
                }}
                className="custom-segmented"
              />
            </div>
          </Space>
        </Space>
      </Modal>

      <style>
        {`
          .custom-segmented .ant-segmented-item-selected {
            background-color: #1677ff !important;
            color: white !important;
          }
          .custom-segmented {
            padding: 2px;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
          }
          .custom-segmented .ant-segmented-item {
            min-width: unset;
            padding: 0 12px;
          }
        `}
      </style>
    </>
  );
};

export default ExternalConnectionDetail;
