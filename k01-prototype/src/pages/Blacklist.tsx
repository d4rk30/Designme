import React, { useState } from 'react';
import { Card, Form, Row, Col, Input, Select, DatePicker, Button, Table, Space, Popconfirm, Modal, Radio, InputNumber } from 'antd';
import type { TableColumnsType } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface IPBlacklistItem {
  key: string;
  ip: string;
  type: string;
  expireTime: string;
  createTime: string;
  remark: string;
}

interface AddIPBlacklistFormData {
  type: 'source' | 'target';
  ip: string;
  expireValue: number;
  expireUnit: 'minute' | 'hour' | 'day' | 'month' | 'forever';
  remark: string;
}

const tabList = [
  { key: 'ip-blacklist', tab: 'IP黑名单' },
  { key: 'ip-whitelist', tab: 'IP白名单' },
  { key: 'url-blacklist', tab: 'URL黑名单' },
  { key: 'url-whitelist', tab: 'URL白名单' },
  { key: 'config', tab: '黑白名单配置' },
];

const Blacklist: React.FC = () => {
  const [activeTabKey, setActiveTabKey] = useState<string>('ip-blacklist');
  const [form] = Form.useForm();
  const [addForm] = Form.useForm<AddIPBlacklistFormData>();
  const [editForm] = Form.useForm<AddIPBlacklistFormData>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // 模拟数据
  const data: IPBlacklistItem[] = [
    {
      key: '1',
      ip: '192.168.1.1/24',
      type: '源地址',
      expireTime: '30天',
      createTime: '2023-12-17 12:00:00',
      remark: '测试IP'
    },
  ];

  const handleFilter = (values: any) => {
    console.log('Filter values:', values);
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleEdit = (record: IPBlacklistItem) => {
    editForm.setFieldsValue({
      type: record.type === '源地址' ? 'source' : 'target',
      ip: record.ip,
      expireValue: parseInt(record.expireTime),
      expireUnit: 'day',
      remark: record.remark
    });
    setIsEditModalVisible(true);
  };

  const handleDelete = (record: IPBlacklistItem) => {
    console.log('Delete record:', record);
  };

  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const handleAddOk = () => {
    addForm.validateFields().then((values) => {
      console.log('添加IP黑名单：', values);
      addForm.resetFields();
      setIsAddModalVisible(false);
    });
  };

  const handleAddCancel = () => {
    addForm.resetFields();
    setIsAddModalVisible(false);
  };

  const handleEditOk = () => {
    editForm.validateFields().then((values) => {
      console.log('编辑IP黑名单：', values);
      editForm.resetFields();
      setIsEditModalVisible(false);
    });
  };

  const handleEditCancel = () => {
    editForm.resetFields();
    setIsEditModalVisible(false);
  };

  const columns: TableColumnsType<IPBlacklistItem> = [
    {
      title: 'IP/IP段',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '过期时长',
      dataIndex: 'expireTime',
      key: 'expireTime',
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
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除吗？"
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

  const contentList: Record<string, React.ReactNode> = {
    'ip-blacklist': (
      <div>
        <Form
          form={form}
          onFinish={handleFilter}
          style={{ marginBottom: '16px' }}
        >
          <Row gutter={16} align="middle">
            <Col flex="1">
              <Form.Item name="dateRange" label="时间" style={{ marginBottom: 0 }}>
                <RangePicker locale={locale} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col flex="1">
              <Form.Item name="type" label="类型" style={{ marginBottom: 0 }}>
                <Select placeholder="请选择类型" style={{ width: '100%' }}>
                  <Select.Option value="all">全部</Select.Option>
                  <Select.Option value="source">源地址</Select.Option>
                  <Select.Option value="target">目标地址</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col flex="1">
              <Form.Item name="ip" label="IP/IP段" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入IP或IP段" />
              </Form.Item>
            </Col>
            <Col flex="1">
              <Form.Item name="remark" label="备注" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入备注" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item style={{ marginBottom: 0 }}>
                <Space>
                  <Button type="primary" htmlType="submit">
                    筛选
                  </Button>
                  <Button onClick={handleReset}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginTop: '16px' }}>
            <Col span={24}>
              <Space>
                <Button type="primary" onClick={showAddModal}>
                  添加
                </Button>
                <Button>
                  导入
                </Button>
                {selectedRowKeys.length > 0 && (
                  <>
                    <Button>
                      导出
                    </Button>
                    <Popconfirm
                      title="确定要删除选中的记录吗？"
                      onConfirm={() => {
                        console.log('批量删除', selectedRowKeys);
                        setSelectedRowKeys([]);
                      }}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button danger>
                        批量删除
                      </Button>
                    </Popconfirm>
                  </>
                )}
              </Space>
            </Col>
          </Row>
        </Form>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          pagination={{
            total: data.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </div>
    ),
    'ip-whitelist': <div>IP白名单内容</div>,
    'url-blacklist': <div>URL黑名单内容</div>,
    'url-whitelist': <div>URL白名单内容</div>,
    'config': <div>黑白名单配置内容</div>,
  };

  const onTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  return (
    <div>
      <Card
        tabList={tabList}
        activeTabKey={activeTabKey}
        onTabChange={onTabChange}
        className="blacklist-card"
      >
        {contentList[activeTabKey]}
      </Card>

      <Modal
        title="添加IP黑名单"
        open={isAddModalVisible}
        onOk={handleAddOk}
        onCancel={handleAddCancel}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={addForm}
          layout="vertical"
        >
          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}
            initialValue="source"
          >
            <Radio.Group>
              <Radio value="source">源地址</Radio>
              <Radio value="target">目标地址</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="ip"
            label="IP/IP段"
            rules={[{ required: true, message: '请输入IP或IP段' }]}
          >
            <Input placeholder="192.168.1.1 或 192.168.1.0/24 或 192.168.1.1-192.168.1.255" />
          </Form.Item>

          <Form.Item label="过期时长">
            <Row gutter={8}>
              <Col flex="auto">
                <Form.Item
                  name="expireValue"
                  rules={[{ required: true, message: '请输入过期时长' }]}
                  style={{ marginBottom: 0 }}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={1}
                    placeholder="请输入数字"
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name="expireUnit"
                  rules={[{ required: true, message: '请选择时间单位' }]}
                  style={{ marginBottom: 0 }}
                  initialValue="minute"
                >
                  <Radio.Group buttonStyle="solid">
                    <Radio.Button value="minute">分</Radio.Button>
                    <Radio.Button value="hour">时</Radio.Button>
                    <Radio.Button value="day">天</Radio.Button>
                    <Radio.Button value="month">月</Radio.Button>
                    <Radio.Button value="forever">永久</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            name="remark"
            label="备注"
          >
            <TextArea rows={4} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑IP黑名单"
        open={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={editForm}
          layout="vertical"
        >
          <Form.Item
            name="type"
            label="类型"
          >
            <Radio.Group disabled>
              <Radio value="source">源地址</Radio>
              <Radio value="target">目标地址</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="ip"
            label="IP/IP段"
          >
            <Input
              placeholder="192.168.1.1 或 192.168.1.0/24 或 192.168.1.1-192.168.1.255"
              disabled
            />
          </Form.Item>

          <Form.Item label="过期时长">
            <Row gutter={8}>
              <Col flex="auto">
                <Form.Item
                  name="expireValue"
                  rules={[{ required: true, message: '请输入过期时长' }]}
                  style={{ marginBottom: 0 }}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={1}
                    placeholder="请输入数字"
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name="expireUnit"
                  rules={[{ required: true, message: '请选择时间单位' }]}
                  style={{ marginBottom: 0 }}
                  initialValue="minute"
                >
                  <Radio.Group buttonStyle="solid">
                    <Radio.Button value="minute">分</Radio.Button>
                    <Radio.Button value="hour">时</Radio.Button>
                    <Radio.Button value="day">天</Radio.Button>
                    <Radio.Button value="month">月</Radio.Button>
                    <Radio.Button value="forever">永久</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            name="remark"
            label="备注"
          >
            <TextArea rows={4} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Blacklist;
