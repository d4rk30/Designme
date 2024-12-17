import React, { useState } from 'react';
import { Card, Table, Button, Space, Form, Input, Modal, Popconfirm, message, Select, Row, Col, Typography } from 'antd';
import { PlusOutlined, ReloadOutlined, EditOutlined, DeleteOutlined, ImportOutlined, ExportOutlined, LeftOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

interface Asset {
  id: string;
  groupId: string;
  type: 'ip' | 'domain';
  value: string;
  createTime: string;
  remark?: string;
}

const AssetList: React.FC = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'ip' | 'domain'>('ip');
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  // 模拟数据
  const data: Asset[] = [
    {
      id: '1',
      groupId: groupId || '',
      type: 'ip',
      value: '192.168.1.1/24',
      createTime: '2023-12-17 10:00:00',
      remark: '核心交换机网段'
    },
    {
      id: '2',
      groupId: groupId || '',
      type: 'domain',
      value: 'example.com',
      createTime: '2023-12-17 11:00:00',
      remark: '示例域名'
    }
  ];

  const showModal = (type: 'ip' | 'domain', asset?: Asset) => {
    setModalType(type);
    setEditingAsset(asset || null);
    if (asset) {
      form.setFieldsValue(asset);
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      console.log('提交数据：', values);
      form.resetFields();
      setIsModalVisible(false);
      setEditingAsset(null);
      message.success(editingAsset ? '编辑成功' : '添加成功');
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
    setEditingAsset(null);
  };

  const handleDelete = (record: Asset) => {
    console.log('删除资产：', record);
    message.success('删除成功');
  };

  const handleFilter = (values: any) => {
    console.log('筛选条件：', values);
  };

  const handleReset = () => {
    filterForm.resetFields();
  };

  const columns: TableColumnsType<Asset> = [
    {
      title: '资产类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => type === 'ip' ? 'IP/IP段' : '域名'
    },
    {
      title: 'IP/域名',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => showModal(record.type, record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该资产吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button icon={<LeftOutlined />} onClick={() => navigate('/asset-management')}>
                返回
              </Button>
              <Title level={5} style={{ margin: 0 }}>资产组：核心业务资产组</Title>
            </Space>
          </Col>
        </Row>

        <Form
          form={filterForm}
          onFinish={handleFilter}
          layout="inline"
        >
          <Form.Item name="type" label="资产类型">
            <Select style={{ width: 120 }} placeholder="请选择类型">
              <Option value="">全部</Option>
              <Option value="ip">IP/IP段</Option>
              <Option value="domain">域名</Option>
            </Select>
          </Form.Item>
          <Form.Item name="value" label="IP/域名">
            <Input placeholder="请输入IP/域名" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                筛选
              </Button>
              <Button onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal('ip')}>
            添加IP/IP段
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal('domain')}>
            添加域名
          </Button>
          <Button icon={<ImportOutlined />}>
            导入
          </Button>
          <Button icon={<ExportOutlined />}>
            导出
          </Button>
          <Button icon={<ReloadOutlined />}>
            刷新
          </Button>
          <Popconfirm
            title="确定要删除选中的资产吗？"
            disabled={selectedRowKeys.length === 0}
            onConfirm={() => {
              console.log('批量删除：', selectedRowKeys);
              message.success('删除成功');
              setSelectedRowKeys([]);
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button danger disabled={selectedRowKeys.length === 0}>
              删除
            </Button>
          </Popconfirm>
        </Space>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
        />
      </Space>

      <Modal
        title={editingAsset ? "编辑资产" : `添加${modalType === 'ip' ? 'IP/IP段' : '域名'}资产`}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="value"
            label={modalType === 'ip' ? 'IP/IP段' : '域名'}
            rules={[{ required: true, message: `请输入${modalType === 'ip' ? 'IP/IP段' : '域名'}` }]}
          >
            <Input 
              placeholder={`请输入${modalType === 'ip' ? 'IP/IP段' : '域名'}`} 
              disabled={!!editingAsset}
            />
          </Form.Item>

          <Form.Item
            name="remark"
            label="备注"
          >
            <TextArea rows={4} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AssetList;
