import { Table, Button, Space, Switch } from 'antd';
import { useState } from 'react';

const PolicyList = () => {
  const [data] = useState([
    {
      key: '1',
      policyName: '默认策略',
      status: true,
      description: '系统默认的弱口令检测策略',
    },
    // Add more policies as needed
  ]);

  const columns = [
    {
      title: '策略名称',
      dataIndex: 'policyName',
      key: 'policyName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <Switch checked={status} />
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link">编辑</Button>
          <Button type="link" danger>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary">新建策略</Button>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default PolicyList;
