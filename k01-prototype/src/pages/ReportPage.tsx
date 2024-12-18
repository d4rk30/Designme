import React, { useState } from 'react';
import { Card, Table, Button, Space, Progress, message, Popconfirm, Row, Col, Switch, Form, Select, DatePicker, Modal, Input, Radio, TimePicker, InputNumber } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/zh_CN';

interface ReportRecord {
  key: string;
  name: string;
  module: string;
  createTime: string;
  progress: number;
  exportType: 'manual' | 'auto';
  format: 'html' | 'pdf';
}

interface CycleConfig {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  time?: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  month?: number;
  startDate?: string;
  interval?: number;
  intervalUnit?: 'minute' | 'hour' | 'day' | 'month' | 'year';
}

interface ReportConfig {
  key: string;
  name: string;
  cycle: CycleConfig;
  modules: string[];
  format: 'excel' | 'pdf' | 'word';
  enabled: boolean;
}

// Mock数据
const mockData: ReportRecord[] = [
  {
    key: '1',
    name: '攻击监测日报',
    module: '攻击监测告警',
    createTime: '2024-01-16 08:00:00',
    progress: 100,
    exportType: 'auto',
    format: 'pdf',
  },
  {
    key: '2',
    name: '外联检测周报',
    module: '外联检测告警',
    createTime: '2024-01-15 08:00:00',
    progress: 100,
    exportType: 'auto',
    format: 'html',
  },
  {
    key: '3',
    name: '威胁情报月度分析报告',
    module: '威胁情报',
    createTime: '2024-01-01 00:00:00',
    progress: 100,
    exportType: 'manual',
    format: 'pdf',
  },
  {
    key: '4',
    name: '攻击监测日报',
    module: '攻击监测告警',
    createTime: '2024-01-17 08:00:00',
    progress: 45,
    exportType: 'manual',
    format: 'html',
  },
  {
    key: '5',
    name: '反测绘周报',
    module: '反测绘告警',
    createTime: '2024-01-15 08:00:00',
    progress: 80,
    exportType: 'auto',
    format: 'pdf',
  }
];

const mockConfigs: ReportConfig[] = [
  {
    key: '1',
    name: '攻击监测日报配置',
    cycle: { type: 'daily' },
    modules: ['攻击监测告警'],
    format: 'excel',
    enabled: true,
  },
  {
    key: '2',
    name: '外联检测周报配置',
    cycle: { type: 'weekly' },
    modules: ['外联检测告警'],
    format: 'pdf',
    enabled: true,
  },
  {
    key: '3',
    name: '威胁情报月度分析配置',
    cycle: { type: 'monthly' },
    modules: ['威胁情报'],
    format: 'word',
    enabled: false,
  },
];

const tabList = [
  {
    key: 'records',
    tab: '导出记录',
  },
  {
    key: 'config',
    tab: '自动导出配置',
  },
];

const { RangePicker } = DatePicker;

interface FilterValues {
  module?: string;
  exportType?: 'manual' | 'auto';
  format?: 'html' | 'pdf';
  dateRange?: [dayjs.Dayjs, dayjs.Dayjs];
}

interface ExportFormValues {
  name: string;
  dateRange: [dayjs.Dayjs, dayjs.Dayjs];
  modules: string[];
  format: 'html' | 'pdf';
}

// 生成预览文件名
const generatePreviewName = (name: string, cycle: CycleConfig) => {
  if (!name) return '';

  const getTimeRange = () => {
    const now = dayjs();
    switch (cycle.type) {
      case 'daily':
        return `${now.format('YYYYMMDD')}`;
      case 'weekly':
        return `${now.startOf('week').format('YYYYMMDD')}-${now.endOf('week').format('YYYYMMDD')}`;
      case 'monthly':
        return `${now.startOf('month').format('YYYYMMDD')}-${now.endOf('month').format('YYYYMMDD')}`;
      case 'yearly':
        return `${now.startOf('year').format('YYYYMMDD')}-${now.endOf('year').format('YYYYMMDD')}`;
      default:
        return '';
    }
  };

  const cycleText = {
    daily: '每日',
    weekly: '每周',
    monthly: '每月',
    yearly: '每年',
    custom: '自定义'
  }[cycle.type];

  return `${name}-${cycleText}${getTimeRange()}`;
};

const ReportPage: React.FC = () => {
  const [form] = Form.useForm();
  const [activeTabKey, setActiveTabKey] = useState<string>('records');
  const [data, setData] = useState<ReportRecord[]>(mockData);
  const [filteredData, setFilteredData] = useState<ReportRecord[]>(mockData);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<ReportRecord[]>([]);
  const [configs, setConfigs] = useState<ReportConfig[]>(mockConfigs);
  const [selectedConfigKeys, setSelectedConfigKeys] = useState<React.Key[]>([]);
  const [exportForm] = Form.useForm();
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [isConfigModalVisible, setIsConfigModalVisible] = useState(false);
  const [configForm] = Form.useForm();
  const [editingConfig, setEditingConfig] = useState<ReportConfig | null>(null);
  const [previewName, setPreviewName] = useState('');
  const [cycleType, setCycleType] = useState<CycleConfig['type']>('daily');

  const handleDownload = (record: ReportRecord) => {
    if (record.progress === 100) {
      message.success('开始下载报表');
      // 实际下载逻辑
    }
  };

  const handleDelete = (key: string) => {
    setData(data.filter(item => item.key !== key));
    message.success('删除成功');
  };

  const handleRefresh = () => {
    setData(mockData);
    message.success('刷新成功');
  };

  const handleBatchDownload = () => {
    const completedRecords = selectedRows.filter(record => record.progress === 100);
    if (completedRecords.length > 0) {
      message.success(`开始下载 ${completedRecords.length} 个报表`);
      // 实际批量下载逻辑
    }
  };

  const handleBatchDelete = () => {
    setData(data.filter(item => !selectedRowKeys.includes(item.key)));
    setSelectedRowKeys([]);
    setSelectedRows([]);
    message.success('批量删除成功');
  };

  const handleEnableChange = (key: string, enabled: boolean) => {
    setConfigs(configs.map(config =>
      config.key === key ? { ...config, enabled } : config
    ));
    message.success(`${enabled ? '启用' : '禁用'}成功`);
  };

  const handleConfigDelete = (key: string) => {
    setConfigs(configs.filter(config => config.key !== key));
    message.success('删除成功');
  };

  const handleFilter = (values: FilterValues) => {
    const filtered = data.filter(item => {
      const matchModule = !values.module || item.module === values.module;
      const matchExportType = !values.exportType || item.exportType === values.exportType;
      const matchFormat = !values.format || item.format === values.format;
      const matchDate = !values.dateRange || (
        dayjs(item.createTime).isAfter(values.dateRange[0].startOf('day')) &&
        dayjs(item.createTime).isBefore(values.dateRange[1].endOf('day'))
      );
      return matchModule && matchExportType && matchFormat && matchDate;
    });
    setFilteredData(filtered);
  };

  const handleReset = () => {
    form.resetFields();
    setFilteredData(data);
  };

  const handleExport = (values: ExportFormValues) => {
    console.log('导出参数：', values);
    message.success('开始导出报表');
    setIsExportModalVisible(false);
    exportForm.resetFields();
  };

  const handleExportCancel = () => {
    setIsExportModalVisible(false);
    exportForm.resetFields();
  };

  const handleConfigSubmit = (values: any) => {
    if (editingConfig) {
      // 编辑模式
      setConfigs(configs.map(config =>
        config.key === editingConfig.key ? { ...values, key: editingConfig.key } : config
      ));
      message.success('编辑成功');
    } else {
      // 新增模式
      setConfigs([...configs, { ...values, key: Date.now().toString() }]);
      message.success('新增成功');
    }
    setIsConfigModalVisible(false);
    configForm.resetFields();
    setEditingConfig(null);
  };

  const handleConfigCancel = () => {
    setIsConfigModalVisible(false);
    configForm.resetFields();
    setEditingConfig(null);
  };

  const showConfigModal = (config?: ReportConfig) => {
    if (config) {
      setEditingConfig(config);
      configForm.setFieldsValue(config);
    }
    setIsConfigModalVisible(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const cycle = configForm.getFieldValue('cycle') || { type: cycleType };
    setPreviewName(generatePreviewName(name, cycle));
  };

  const handleCycleTypeChange = (type: CycleConfig['type']) => {
    setCycleType(type);
    const name = configForm.getFieldValue('name');
    setPreviewName(generatePreviewName(name, { type }));
  };

  const columns: TableColumnsType<ReportRecord> = [
    {
      title: '报表名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '告警模块',
      dataIndex: 'module',
      key: 'module',
      width: 150,
    },
    {
      title: '导出方式',
      dataIndex: 'exportType',
      key: 'exportType',
      width: 100,
      render: (type: string) => type === 'auto' ? '自动' : '手动',
    },
    {
      title: '报表格式',
      dataIndex: 'format',
      key: 'format',
      width: 100,
      render: (format: string) => format.toUpperCase(),
    },
    {
      title: '报表创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 200,
      render: (progress: number) => (
        <Progress percent={progress} size="small" status={progress === 100 ? 'success' : 'active'} />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            disabled={record.progress !== 100}
            onClick={() => handleDownload(record)}
          >
            下载
          </Button>
          <Popconfirm
            title="确定要删除这条记录吗？"
            onConfirm={() => handleDelete(record.key)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const configColumns: TableColumnsType<ReportConfig> = [
    {
      title: '配置名称',
      dataIndex: 'name',
      key: 'name',
      width: 300,
    },
    {
      title: '报表格式',
      dataIndex: 'format',
      key: 'format',
      width: 200,
      render: (format: string) => format.toUpperCase(),
    },
    {
      title: '启用状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 150,
      render: (enabled: boolean, record) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleEnableChange(record.key, checked)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => showConfigModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条配置吗？"
            onConfirm={() => handleConfigDelete(record.key)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const contentList = {
    records: (
      <>
        <Form
          form={form}
          onFinish={handleFilter}
          style={{ marginBottom: '16px' }}
        >
          <Row gutter={16}>
            <Col flex="1">
              <Form.Item name="module" label="告警模块" style={{ marginBottom: 0 }}>
                <Select allowClear placeholder="请选择告警模块">
                  <Select.Option value="攻击监测告警">攻击监测告警</Select.Option>
                  <Select.Option value="外联检测告警">外联检测告警</Select.Option>
                  <Select.Option value="威胁情报">威胁情报</Select.Option>
                  <Select.Option value="反测绘告警">反测绘告警</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col flex="1">
              <Form.Item name="exportType" label="导出方式" style={{ marginBottom: 0 }}>
                <Select allowClear placeholder="请选择导出方式">
                  <Select.Option value="manual">手动</Select.Option>
                  <Select.Option value="auto">自动</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col flex="1">
              <Form.Item name="format" label="报表格式" style={{ marginBottom: 0 }}>
                <Select allowClear placeholder="请选择报表格式">
                  <Select.Option value="html">HTML</Select.Option>
                  <Select.Option value="pdf">PDF</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col flex="1">
              <Form.Item name="dateRange" label="创建时间" style={{ marginBottom: 0 }}>
                <RangePicker
                  style={{ width: '100%' }}
                  locale={locale}
                />
              </Form.Item>
            </Col>
            <Col flex="none">
              <Form.Item style={{ marginBottom: 0 }}>
                <Space>
                  <Button type="primary" htmlType="submit">筛选</Button>
                  <Button onClick={handleReset}>重置</Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Row style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Space>
              <Button
                type="primary"
                onClick={() => setIsExportModalVisible(true)}
              >
                手动导出
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
              >
                刷新
              </Button>
              {selectedRowKeys.length > 0 && (
                <>
                  <Button
                    type="primary"
                    onClick={handleBatchDownload}
                    disabled={!selectedRows.some(record => record.progress === 100)}
                  >
                    批量下载
                  </Button>
                  <Popconfirm
                    title="确定要删除选中的记录吗？"
                    onConfirm={handleBatchDelete}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button danger>批量删除</Button>
                  </Popconfirm>
                </>
              )}
            </Space>
          </Col>
        </Row>
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: (newSelectedRowKeys: React.Key[], newSelectedRows: ReportRecord[]) => {
              setSelectedRowKeys(newSelectedRowKeys);
              setSelectedRows(newSelectedRows);
            },
          }}
          columns={columns}
          dataSource={filteredData}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </>
    ),
    config: (
      <>
        <Row style={{ marginBottom: 16 }}>
          <Col>
            <Button type="primary" onClick={() => showConfigModal()}>
              新增配置
            </Button>
          </Col>
        </Row>
        <Table
          rowSelection={{
            selectedRowKeys: selectedConfigKeys,
            onChange: (newSelectedRowKeys: React.Key[]) => {
              setSelectedConfigKeys(newSelectedRowKeys);
            },
          }}
          columns={configColumns}
          dataSource={configs}
          pagination={{
            total: configs.length,
            pageSize: 10,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </>
    ),
  };

  const onTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  // 快捷时间范围选项
  const rangePresets: {
    label: string;
    value: [dayjs.Dayjs, dayjs.Dayjs];
  }[] = [
      { label: '今天', value: [dayjs().startOf('day'), dayjs().endOf('day')] },
      { label: '本周', value: [dayjs().startOf('week'), dayjs().endOf('week')] },
      { label: '当月', value: [dayjs().startOf('month'), dayjs().endOf('month')] },
    ];

  return (
    <div>
      <Card
        tabList={tabList}
        activeTabKey={activeTabKey}
        onTabChange={onTabChange}
        tabProps={{
          size: 'large',
        }}
      >
        {contentList[activeTabKey as keyof typeof contentList]}
      </Card>
      <Modal
        title="手动导出报表"
        open={isExportModalVisible}
        onCancel={handleExportCancel}
        footer={null}
        width={600}
      >
        <Form
          form={exportForm}
          onFinish={handleExport}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="报表名称"
            rules={[{ required: true, message: '请输入报表名称' }]}
          >
            <RangePicker
              style={{ width: '100%' }}
              locale={locale}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              presets={rangePresets}
            />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="报表数据范围"
            rules={[{ required: true, message: '请选择报表数据范围' }]}
          >
            <RangePicker
              style={{ width: '100%' }}
              locale={locale}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              presets={rangePresets}
            />
          </Form.Item>

          <Form.Item
            name="modules"
            label="告警模块"
            rules={[{ required: true, message: '请选择至少一个告警模块' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择告警模块"
              options={[
                { label: '攻击监测告警', value: '攻击监测告警' },
                { label: '外联检测告警', value: '外联检测告警' },
                { label: '弱口令登录告警', value: '弱口令登录告警' },
                { label: '反测绘告警', value: '反测绘告警' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="format"
            label="报表格式"
            rules={[{ required: true, message: '请选择报表格式' }]}
            initialValue="html"
          >
            <Radio.Group>
              <Radio value="html">HTML</Radio>
              <Radio value="pdf">PDF</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleExportCancel}>取消</Button>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={editingConfig ? "编辑自动导出配置" : "新增自动导出配置"}
        open={isConfigModalVisible}
        onCancel={handleConfigCancel}
        footer={null}
        width={600}
      >
        <Form
          form={configForm}
          onFinish={handleConfigSubmit}
          layout="vertical"
          initialValues={{ enabled: true }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="报表名称"
                rules={[{ required: true, message: '请输入报表名称' }]}
              >
                <Input
                  placeholder="请输入报表名称"
                  onChange={handleNameChange}
                />
              </Form.Item>
              {previewName && (
                <div style={{
                  marginTop: -20,
                  marginBottom: 24,
                  color: '#666',
                  fontSize: '14px'
                }}>
                  {previewName}.{configForm.getFieldValue('format')}
                </div>
              )}
            </Col>
          </Row>

          <Form.Item
            name={['cycle', 'type']}
            label="导出周期"
            rules={[{ required: true, message: '请选择导出周期' }]}
          >
            <Select
              placeholder="请选择导出周期"
              onChange={handleCycleTypeChange}
            >
              <Select.Option value="daily">每日</Select.Option>
              <Select.Option value="weekly">每周</Select.Option>
              <Select.Option value="monthly">每月</Select.Option>
              <Select.Option value="yearly">每年</Select.Option>
              <Select.Option value="custom">自定义</Select.Option>
            </Select>
          </Form.Item>

          {cycleType === 'daily' && (
            <Form.Item
              name={['cycle', 'time']}
              label="导出时间"
              rules={[{ required: true, message: '请选择导出时间' }]}
            >
              <TimePicker
                format="HH:mm"
                placeholder="请选择时间"
                style={{ width: '100%' }}
              />
            </Form.Item>
          )}

          {cycleType === 'weekly' && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={['cycle', 'dayOfWeek']}
                  label="每周几"
                  rules={[{ required: true, message: '请选择每周几' }]}
                >
                  <Select style={{ width: '100%' }}>
                    {[1, 2, 3, 4, 5, 6, 7].map(day => (
                      <Select.Option key={day} value={day}>
                        星期{['一', '二', '三', '四', '五', '六', '日'][day - 1]}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['cycle', 'time']}
                  label="时间"
                  rules={[{ required: true, message: '请选择时间' }]}
                >
                  <TimePicker
                    format="HH:mm"
                    placeholder="请选择时间"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          {cycleType === 'monthly' && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={['cycle', 'dayOfMonth']}
                  label="每月几号"
                  rules={[{ required: true, message: '请选择每月几号' }]}
                >
                  <Select style={{ width: '100%' }}>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <Select.Option key={day} value={day}>
                        {day}号
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['cycle', 'time']}
                  label="时间"
                  rules={[{ required: true, message: '请选择时间' }]}
                >
                  <TimePicker
                    format="HH:mm"
                    placeholder="请选择时间"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          {cycleType === 'yearly' && (
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name={['cycle', 'month']}
                  label="月份"
                  rules={[{ required: true, message: '请选择月份' }]}
                >
                  <Select style={{ width: '100%' }}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <Select.Option key={month} value={month}>
                        {month}月
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={['cycle', 'dayOfMonth']}
                  label="日期"
                  rules={[{ required: true, message: '请选择日期' }]}
                >
                  <Select style={{ width: '100%' }}>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <Select.Option key={day} value={day}>
                        {day}日
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={['cycle', 'time']}
                  label="时间"
                  rules={[{ required: true, message: '请选择时间' }]}
                >
                  <TimePicker
                    format="HH:mm"
                    placeholder="请选择时间"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          {cycleType === 'custom' && (
            <div>
              <Form.Item
                name={['cycle', 'startDate']}
                label="起始时间"
                rules={[{ required: true, message: '请选择起始时间' }]}
              >
                <DatePicker
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  style={{ width: '100%' }}
                  placeholder="请选择起始时间"
                />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name={['cycle', 'interval']}
                    label="间隔时间"
                    rules={[{ required: true, message: '请输入间隔时间' }]}
                  >
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={['cycle', 'intervalUnit']}
                    label="间隔单位"
                    rules={[{ required: true, message: '请选择间隔单位' }]}
                  >
                    <Radio.Group style={{ width: '100%' }}>
                      <Radio.Button value="minute" style={{ width: '20%', textAlign: 'center' }}>分</Radio.Button>
                      <Radio.Button value="hour" style={{ width: '20%', textAlign: 'center' }}>时</Radio.Button>
                      <Radio.Button value="day" style={{ width: '20%', textAlign: 'center' }}>天</Radio.Button>
                      <Radio.Button value="month" style={{ width: '20%', textAlign: 'center' }}>月</Radio.Button>
                      <Radio.Button value="year" style={{ width: '20%', textAlign: 'center' }}>年</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}

          <Form.Item
            name="modules"
            label="告警模块"
            rules={[{ required: true, message: '请选择至少一个告警模块' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择告警模块"
              options={[
                { label: '攻击监测告警', value: '攻击监测告警' },
                { label: '外联检测告警', value: '外联检测告警' },
                { label: '弱口令登录告警', value: '弱口令登录告警' },
                { label: '反测绘告警', value: '反测绘告警' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="format"
            label="报表格式"
            rules={[{ required: true, message: '请选择报表格式' }]}
            initialValue="html"
          >
            <Radio.Group>
              <Radio value="html">HTML</Radio>
              <Radio value="pdf">PDF</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="enabled"
            label="启用状态"
          >
            <Switch />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleConfigCancel}>取消</Button>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReportPage;