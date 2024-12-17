import React, { useState, useEffect } from 'react';
import { Input, Button, Table, Space, Popconfirm, message } from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import type { TablePaginationConfig } from 'antd/es/table';

interface IpFavorite {
  ip: string;
  type: 'attack' | 'target';  // 攻击IP 或 被攻击IP
  key: string;
}

const { Search } = Input;

const IpFavorites: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [ipList, setIpList] = useState<IpFavorite[]>([]);
  const [filteredIpList, setFilteredIpList] = useState<IpFavorite[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 从localStorage加载收藏的IP
  useEffect(() => {
    const savedIps = localStorage.getItem('favoriteIps');
    if (savedIps) {
      const parsedIps = JSON.parse(savedIps);
      const formattedIps = parsedIps.map((ip: any) => ({
        ...ip,
        key: ip.ip,
      }));
      setIpList(formattedIps);
      setFilteredIpList(formattedIps);
      setPagination(prev => ({ ...prev, total: formattedIps.length }));
    }
  }, []);

  // 搜索IP
  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = ipList.filter(item => 
      item.ip.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredIpList(filtered);
    setPagination(prev => ({ ...prev, current: 1, total: filtered.length }));
  };

  // 删除IP
  const handleDelete = (ip: string) => {
    const newIpList = ipList.filter(item => item.ip !== ip);
    setIpList(newIpList);
    setFilteredIpList(newIpList.filter(item => 
      item.ip.toLowerCase().includes(searchText.toLowerCase())
    ));
    localStorage.setItem('favoriteIps', JSON.stringify(newIpList));
    message.success('IP已从收藏夹移除');
  };

  const columns = [
    {
      title: '关注IP',
      dataIndex: 'ip',
      key: 'ip',
      width: '50%',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: '30%',
      render: (type: 'attack' | 'target') => 
        type === 'attack' ? '攻击IP' : '被攻击IP',
    },
    {
      title: '操作',
      key: 'action',
      width: '20%',
      render: (_: any, record: IpFavorite) => (
        <Popconfirm
          title="确定要删除这个IP吗？"
          onConfirm={() => handleDelete(record.ip)}
          okText="确定"
          cancelText="取消"
        >
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
          >
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Search
          placeholder="请输入IP地址"
          allowClear
          enterButton={
            <Button icon={<SearchOutlined />}>
              搜索
            </Button>
          }
          size="large"
          onSearch={handleSearch}
          style={{ width: '100%' }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredIpList}
        pagination={pagination}
        onChange={(newPagination) => setPagination(newPagination)}
      />
    </div>
  );
};

export default IpFavorites;