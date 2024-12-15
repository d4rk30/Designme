import React, { useState } from 'react';
import { Card, Table, Button, Space } from 'antd';
import { AttackTrendChart } from '../components/AttackTrendChart';
import { IntelTypeChart } from '../components/IntelTypeChart';

const AttackLogs: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  // 表格列定义
  const columns = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '攻击IP',
      dataIndex: 'attackIp',
      key: 'attackIp',
    },
    {
      title: '归属地',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '被攻击IP',
      dataIndex: 'targetIp',
      key: 'targetIp',
    },
    {
      title: '被攻击端口',
      dataIndex: 'targetPort',
      key: 'targetPort',
    },
    {
      title: '情报类型',
      dataIndex: 'intelType',
      key: 'intelType',
    },
    {
      title: '威胁等级',
      dataIndex: 'threatLevel',
      key: 'threatLevel',
      render: (text: string) => {
        const colors = {
          '高危': 'red',
          '中危': 'orange',
          '低危': 'blue',
        };
        return <span style={{ color: colors[text as keyof typeof colors] }}>{text}</span>;
      },
    },
    {
      title: '处理动作',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: '命中情报源',
      dataIndex: 'intelSource',
      key: 'intelSource',
    },
    {
      title: '最近攻击单位',
      dataIndex: 'lastAttackUnit',
      key: 'lastAttackUnit',
    },
    {
      title: '操作',
      key: 'operation',
      render: () => (
        <Space>
          <Button type="link">详情</Button>
          <Button type="link">误报加白</Button>
        </Space>
      ),
    },
  ];

  // 模拟数据
  const data = [
    {
      key: '1',
      time: '2024-12-15 21:00:00',
      attackIp: '192.168.1.1',
      location: '中国',
      targetIp: '192.168.1.2',
      targetPort: '80',
      intelType: '僵尸网络',
      threatLevel: '高危',
      action: '阻断',
      intelSource: '公有情报源',
      lastAttackUnit: '1小时前',
    },
    // 添加更多模拟数据...
  ];

  return (
    <>
      <Card style={{ marginBottom: '24px', backgroundColor: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '48%' }}>
            <AttackTrendChart />
          </div>
          <div style={{ width: '48%' }}>
            <IntelTypeChart />
          </div>
        </div>
      </Card>
      <Card style={{ backgroundColor: 'white' }}>
        <Space style={{ marginBottom: '16px' }}>
          {selectedRows.length > 0 && (
            <>
              <Button type="primary">导出</Button>
              <Button onClick={() => setSelectedRows([])}>清空</Button>
            </>
          )}
          <Button onClick={() => {/* 刷新逻辑 */}}>刷新</Button>
        </Space>
        <Table
          columns={columns}
          dataSource={data}
          rowSelection={{
            selectedRowKeys: selectedRows.map(row => row.key),
            onChange: (_, rows) => setSelectedRows(rows),
          }}
        />
      </Card>
    </>
  );
};

export default AttackLogs;
