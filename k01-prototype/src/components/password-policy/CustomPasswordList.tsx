import { Table, Button, Space, Input } from 'antd';
import { useState } from 'react';

const CustomPasswordList = () => {
  const [data] = useState([
    {
      key: '1',
      password: '123456',
      addTime: '2024-01-16 10:00:00',
    },
    // Add more custom passwords as needed
  ]);

  const columns = [
    {
      title: '口令',
      dataIndex: 'password',
      key: 'password',
    },
    {
      title: '添加时间',
      dataIndex: 'addTime',
      key: 'addTime',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Button type="link" danger>删除</Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <Input placeholder="请输入自定义口令" style={{ width: 200 }} />
        <Button type="primary">添加</Button>
        <Button>批量导入</Button>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default CustomPasswordList;
