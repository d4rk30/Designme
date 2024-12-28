import React, { useState } from 'react';
import { Card, Table, Button, Space, Form, Input, Modal, Popconfirm, message, Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

const { TextArea } = Input;
const { Title } = Typography;

interface Asset {
  id: string;
  groupId: string;
  type: 'ip';
  value: string;
  port?: string;
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
  const [modalType, setModalType] = useState<'ip'>('ip');
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  // 模拟数据
  const data: (Asset & { key: string })[] = [
    {
      key: '1',
      id: '1',
      groupId: groupId || '',
      type: 'ip',
      value: '192.168.1.1/24',
      port: '80,443,8080',
      createTime: '2023-12-17 10:00:00',
      remark: '核心交换机网段'
    }
  ];

  const showModal = (type: 'ip', asset?: Asset) => {
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
      title: 'IP/IP段',
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
            onClick={() => showModal('ip', record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该资产吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger>
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
    <Card
      title={
        <Space split={
          <span style={{
            margin: '0 8px',
            color: 'rgba(0, 0, 0, 0.45)',
            fontWeight: 'normal',
            opacity: 1,
            display: 'inline-block'
          }}>
            |
          </span>
        }
          align="center"
        >
          <Button
            type="link"
            onClick={() => navigate('/asset-management')}
            style={{
              padding: '4px 8px',
              height: 'auto',
              lineHeight: 'inherit'
            }}
          >
            返回
          </Button>
          <Title
            level={5}
            style={{
              margin: 0,
              lineHeight: 'inherit'
            }}
          >
            核心业务资产组
          </Title>
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Form
          form={filterForm}
          onFinish={handleFilter}
          layout="inline"
          style={{ marginBottom: 16 }}
        >
          <Form.Item
            name="ipValue"
            label="IP/IP段"
            style={{ minWidth: 300 }}
          >
            <Input placeholder="请输入IP/IP段" />
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
          <Button type="primary" onClick={() => showModal('ip')}>
            添加IP/IP段
          </Button>
          <Button>
            导入
          </Button>
          {selectedRowKeys.length > 0 && (
            <React.Fragment key="selected-actions">
              <Button>
                导出
              </Button>
              <Popconfirm
                title="确定要删除选中的资产吗？"
                onConfirm={() => {
                  console.log('批量删除：', selectedRowKeys);
                  message.success('删除成功');
                  setSelectedRowKeys([]);
                }}
                okText="确定"
                cancelText="取消"
              >
                <Button danger>
                  批量删除
                </Button>
              </Popconfirm>
            </React.Fragment>
          )}
        </Space>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{
            total: data.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Space>

      <Modal
        title={editingAsset ? "编辑资产" : `添加${modalType === 'ip' ? 'IP/IP段' : '域名'}`}
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
              placeholder={modalType === 'ip'
                ? '192.168.1.1 或 192.168.1.0/24'
                : 'example.com 或 www.example.com 或 *.example.com'
              }
              disabled={!!editingAsset}
            />
          </Form.Item>

          {modalType === 'ip' && (
            <Form.Item
              name="port"
              label="端口"
            >
              <Input
                placeholder="80 或 80-8080 或 0代表全端口"
                disabled={!!editingAsset}
              />
            </Form.Item>
          )}

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
