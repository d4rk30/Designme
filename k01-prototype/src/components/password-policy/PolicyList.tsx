import { Table, Button, Space, Switch, Row, Col, message, Modal } from 'antd';
import { useState } from 'react';
import { ReloadOutlined, PlusOutlined, ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import AddPolicyModal from './AddPolicyModal';

interface PolicyData {
  key: string;
  policyName: string;
  assetGroup: string;
  detectionLevel: string;
  action: string;
  description: string;
  status: boolean;
  effectiveTime?: [string, string];
  weekDays?: string[];
}

const PolicyList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<PolicyData | null>(null);
  const [data, setData] = useState<PolicyData[]>([
    {
      key: '1',
      policyName: '默认弱口令策略',
      assetGroup: '所有资产',
      detectionLevel: '高',
      action: '阻断',
      description: '系统默认的弱口令检测策略',
      status: false,
      effectiveTime: ['00:00', '23:59'],
      weekDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    },
    {
      key: '2',
      policyName: '测试环境策略',
      assetGroup: '测试服务器组',
      detectionLevel: '中',
      action: '监控',
      description: '测试环境的弱口令监控',
      status: false,
      effectiveTime: ['09:00', '18:00'],
      weekDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    },
    {
      key: '3',
      policyName: '开发环境策略',
      assetGroup: '开发服务器组',
      detectionLevel: '低',
      action: '监控',
      description: '开发环境的弱口令监控',
      status: false,
      effectiveTime: ['09:00', '18:00'],
      weekDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    },
  ]);

  const handleStatusChange = (checked: boolean, record: PolicyData) => {
    const newData = data.map(item => {
      if (item.key === record.key) {
        return { ...item, status: checked };
      }
      return item;
    });
    setData(newData);
    if (checked) {
      message.success(`${record.policyName}已启用`);
    } else {
      message.warning(`${record.policyName}已禁用`);
    }
  };

  const showModal = () => {
    setEditingPolicy(null);
    setIsModalVisible(true);
  };

  const showEditModal = (record: PolicyData) => {
    setEditingPolicy(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingPolicy(null);
  };

  const handleDelete = (record: PolicyData) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除策略"${record.policyName}"吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        const newData = data.filter(item => item.key !== record.key);
        setData(newData);
        message.success('删除成功');
      },
    });
  };

  const handleAdd = (values: any) => {
    const assetGroupLabel = assetGroupOptions.find(option => option.value === values.assetGroup)?.label || '';
    const detectionLevelLabel = detectionLevelOptions.find(option => option.value === values.detectionLevel)?.label || '';
    const actionLabel = actionOptions.find(option => option.value === values.action)?.label || '';

    if (editingPolicy) {
      // 编辑模式
      const newData = data.map(item => {
        if (item.key === editingPolicy.key) {
          return {
            ...item,
            policyName: values.policyName,
            assetGroup: assetGroupLabel,
            detectionLevel: detectionLevelLabel,
            action: actionLabel,
            description: values.description || '',
            effectiveTime: values.effectiveTime,
            weekDays: values.weekDays,
          };
        }
        return item;
      });
      setData(newData);
      message.success('策略更新成功！');
    } else {
      // 添加模式
      const newPolicy = {
        key: (data.length + 1).toString(),
        policyName: values.policyName,
        assetGroup: assetGroupLabel,
        detectionLevel: detectionLevelLabel,
        action: actionLabel,
        description: values.description || '',
        status: false,
        effectiveTime: values.effectiveTime,
        weekDays: values.weekDays,
      };
      setData([...data, newPolicy]);
      message.success('策略添加成功！');
    }
    setIsModalVisible(false);
    setEditingPolicy(null);
  };

  const assetGroupOptions = [
    { label: '所有资产', value: 'all' },
    { label: '测试服务器组', value: 'test' },
    { label: '开发服务器组', value: 'dev' },
    { label: '生产服务器组', value: 'prod' },
  ];

  const detectionLevelOptions = [
    { label: '高', value: 'high' },
    { label: '中', value: 'medium' },
    { label: '低', value: 'low' },
  ];

  const actionOptions = [
    { label: '阻断', value: 'block' },
    { label: '监控', value: 'monitor' },
  ];

  const columns = [
    {
      title: '策略名称',
      dataIndex: 'policyName',
      key: 'policyName',
    },
    {
      title: '资产分组',
      dataIndex: 'assetGroup',
      key: 'assetGroup',
    },
    {
      title: '检测级别',
      dataIndex: 'detectionLevel',
      key: 'detectionLevel',
    },
    {
      title: '处理动作',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean, record: PolicyData) => (
        <Switch 
          checked={status} 
          onChange={(checked) => handleStatusChange(checked, record)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: PolicyData) => (
        <Space size="middle">
          <Button type="link" onClick={() => showEditModal(record)}>编辑</Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>删除</Button>
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

  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的策略');
      return;
    }

    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除选中的 ${selectedRowKeys.length} 条策略吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        const newData = data.filter(item => !selectedRowKeys.includes(item.key));
        setData(newData);
        setSelectedRowKeys([]);
        message.success('批量删除成功');
      },
    });
  };

  return (
    <div>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
              添加
            </Button>
            <Button icon={<ReloadOutlined />}>
              刷新
            </Button>
            {selectedRowKeys.length > 0 && (
              <Button 
                icon={<DeleteOutlined />} 
                danger
                onClick={handleBatchDelete}
              >
                删除({selectedRowKeys.length})
              </Button>
            )}
          </Space>
        </Col>
      </Row>
      <Table 
        rowSelection={rowSelection}
        columns={columns} 
        dataSource={data}
        pagination={{
          total: data.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`
        }}
      />
      <AddPolicyModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleAdd}
        initialValues={editingPolicy}
        mode={editingPolicy ? 'edit' : 'add'}
      />
    </div>
  );
};

export default PolicyList;
