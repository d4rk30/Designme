import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Form, Select, Row, Col, Cascader, Modal, message, Drawer, Typography, Tag } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import { AttackTrendChart } from '../components/AttackTrendChart';
import { IntelTypeChart } from '../components/IntelTypeChart';
import AttackLogDetail from '../components/AttackLogDetail';
import IpFavorites from '../components/IpFavorites';
import CollapsedCharts from '../components/CollapsedCharts';

interface FilterValues {
  intelType?: string;
  intelSource?: string;
  action?: string;
  attackIp?: string;
  targetIp?: string;
  location?: string[];
}

interface SavedFilter {
  id: string;
  name: string;
  conditions: FilterValues;
  createTime: string;
}

const AttackLogs: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [form] = Form.useForm();
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isIpDrawerVisible, setIsIpDrawerVisible] = useState(false);
  const [isChartsExpanded, setIsChartsExpanded] = useState(false);

  // IP收藏夹相关
  const showIpDrawer = () => {
    setIsIpDrawerVisible(true);
  };

  const closeIpDrawer = () => {
    setIsIpDrawerVisible(false);
  };

  // 添加到收藏夹
  const addToFavorites = (ip: string, type: 'attack' | 'target') => {
    const savedIps = localStorage.getItem('favoriteIps');
    const favoriteIps = savedIps ? JSON.parse(savedIps) : [];

    // 检查IP是否已存在
    if (favoriteIps.some((item: any) => item.ip === ip)) {
      message.warning('该IP已在收藏夹中');
      return;
    }

    const newFavoriteIp = {
      ip,
      type,
      key: ip,
    };

    const newFavoriteIps = [...favoriteIps, newFavoriteIp];
    localStorage.setItem('favoriteIps', JSON.stringify(newFavoriteIps));
    message.success('IP已添加到收藏夹');
  };

  // 从localStorage加载收藏的IP
  useEffect(() => {
    const savedIps = localStorage.getItem('favoriteIps');
    if (savedIps) {
      // setFavoriteIps(JSON.parse(savedIps));
    }
  }, []);

  // 归属地数据
  const locationOptions = [
    {
      value: 'world',
      label: '世界',
      children: [
        { value: 'china', label: '中国' },
        { value: 'usa', label: '美国' },
        { value: 'russia', label: '俄罗斯' },
        { value: 'japan', label: '日本' },
        { value: 'germany', label: '德国' },
        { value: 'france', label: '法国' },
        { value: 'uk', label: '英国' },
        { value: 'canada', label: '加拿大' },
        { value: 'australia', label: '澳大利亚' },
      ]
    },
    {
      value: 'china',
      label: '中国',
      children: [
        { value: 'beijing', label: '北京' },
        { value: 'shanghai', label: '上海' },
        { value: 'guangzhou', label: '广州' },
        { value: 'shenzhen', label: '深圳' },
        { value: 'hangzhou', label: '杭州' },
        { value: 'chengdu', label: '成都' },
        { value: 'wuhan', label: '武汉' },
        { value: 'xian', label: '西安' },
        { value: 'nanjing', label: '南京' },
      ]
    },
    {
      value: 'foreign',
      label: '国外',
      children: [
        { value: 'usa', label: '美国' },
        { value: 'russia', label: '俄罗斯' },
        { value: 'japan', label: '日本' },
        { value: 'germany', label: '德国' },
        { value: 'france', label: '法国' },
        { value: 'uk', label: '英国' },
        { value: 'canada', label: '加拿大' },
        { value: 'australia', label: '澳大利亚' },
      ]
    }
  ];

  // 筛选选项
  const filterOptions = {
    intelType: ['僵尸网络', '恶意软件', 'DDoS攻击', '漏洞利用', '暴力破解', '钓鱼攻击'],
    action: ['阻断', '监控'],
    intelSource: ['公有情报源', '私有情报源', '第三方情报源', '自建情报源'],
  };

  // 表格列定义
  const columns = [
    {
      title: '时间',
      dataIndex: 'time',
      width: 180,
      ellipsis: true
    },
    {
      title: '攻击IP',
      dataIndex: 'attackIp',
      width: 220,
      render: (ip: string) => (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Button
            type="link"
            style={{ padding: 0, minWidth: 32, marginRight: 8 }}
            icon={<StarOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              addToFavorites(ip, 'attack');
            }}
          />
          <Typography.Text copyable style={{ width: 160 }} ellipsis>{ip}</Typography.Text>
        </div>
      ),
    },
    {
      title: '归属地',
      dataIndex: 'location',
      width: 120,
      ellipsis: true
    },
    {
      title: '被攻击IP',
      dataIndex: 'targetIp',
      width: 220,
      ellipsis: true,
      render: (ip: string) => (
        <Typography.Text copyable style={{ width: 180 }} ellipsis>{ip}</Typography.Text>
      )
    },
    {
      title: '被攻击端口',
      dataIndex: 'targetPort',
      width: 120,
      ellipsis: true
    },
    {
      title: '情报类型',
      dataIndex: 'intelType',
      width: 150,
      ellipsis: true
    },
    {
      title: '威胁等级',
      dataIndex: 'threatLevel',
      width: 120,
      ellipsis: true,
      render: (text: string) => {
        const colors = {
          '高危': 'red',
          '中危': 'orange',
          '低危': 'blue',
        };
        return <Tag color={colors[text as keyof typeof colors]}>{text}</Tag>;
      },
    },
    {
      title: '处理动作',
      dataIndex: 'action',
      width: 120,
      ellipsis: true
    },
    {
      title: '命中情报源',
      dataIndex: 'intelSource',
      width: 150,
      ellipsis: true
    },
    {
      title: '最近攻击单位',
      dataIndex: 'lastAttackUnit',
      width: 150,
      ellipsis: true
    },
    {
      title: '规则',
      dataIndex: 'rule',
      width: 120,
      ellipsis: true
    },
    {
      title: '资产组',
      dataIndex: 'assetGroup',
      width: 120,
      ellipsis: true
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right' as const,
      width: 180,
      render: (_: any, record: any) => (
        <Space size="middle" style={{ paddingRight: 8 }}>
          <Button
            type="link"
            onClick={() => {
              setSelectedLog(record);
              setIsDetailVisible(true);
            }}
            style={{ padding: '4px 8px' }}
          >
            详情
          </Button>
          <Button
            type="link"
            style={{ padding: '4px 8px' }}
          >
            误报加白
          </Button>
        </Space>
      ),
    }
  ];

  // 模拟数据生成函数
  const generateMockData = () => {
    const locations = [
      '北京', '上海', '广州', '深圳', '杭州',  // 中国城市
      '美国', '俄罗斯', '日本', '德国', '法国'  // 国外
    ];

    return Array.from({ length: 100 }, (_, index) => ({
      key: String(index + 1),
      time: `2024-12-15 ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      attackIp: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      targetIp: `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
      targetPort: String(Math.floor(Math.random() * 65535)),
      intelType: ['僵尸网络', '恶意软件', 'DDoS攻击', '漏洞利用', '暴力破解', '钓鱼攻击'][Math.floor(Math.random() * 6)],
      threatLevel: ['高危', '中危', '低危'][Math.floor(Math.random() * 3)],
      action: ['阻断', '监控'][Math.floor(Math.random() * 2)],
      intelSource: ['公有情报源', '私有情报源', '第三方情报源', '自建情报源'][Math.floor(Math.random() * 4)],
      lastAttackUnit: [`${Math.floor(Math.random() * 24)}小时前`, `${Math.floor(Math.random() * 60)}分钟前`][Math.floor(Math.random() * 2)],
      rule: `Rule-${Math.floor(Math.random() * 1000)}`,
      assetGroup: ['核心资产', '测试资产', '开发资产', '生产资产'][Math.floor(Math.random() * 4)],
      requestInfo: {
        protocol: ['http', 'https', 'dns', 'ftp', 'smtp'][Math.floor(Math.random() * 5)],
        url: `example.com/api/endpoint/${Math.floor(Math.random() * 1000)}`,
        dnsName: `subdomain${Math.floor(Math.random() * 100)}.example.com`,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Forwarded-For': `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          'Host': 'example.com',
          'Connection': 'keep-alive',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        },
        body: {
          payload: 'Base64编码的请求内容...',
          size: Math.floor(Math.random() * 1000) + 'bytes',
          type: ['SQL注入', 'XSS攻击', '命令注入', 'WebShell'][Math.floor(Math.random() * 4)],
          timestamp: new Date().toISOString()
        }
      },
      responseInfo: {
        headers: {
          'Content-Type': 'application/json',
          'Server': 'nginx/1.18.0',
          'Date': new Date().toUTCString(),
          'Content-Length': String(Math.floor(Math.random() * 1000))
        },
        body: {
          status: [200, 400, 403, 404, 500][Math.floor(Math.random() * 5)],
          message: ['Success', 'Bad Request', 'Forbidden', 'Not Found', 'Server Error'][Math.floor(Math.random() * 5)],
          data: 'Base64编码的响应内容...'
        }
      },
      localVerification: {
        ruleName: ['SQL注入检测', 'XSS攻击检测', '命令注入检测', 'WebShell检测'][Math.floor(Math.random() * 4)],
        protocolNumber: '323-2',
        protocolType: 'HTTPS',
        attackType: ['SQL注入', 'XSS攻击', '命令注入', 'WebShell'][Math.floor(Math.random() * 4)],
        malformedPacketLength: Math.floor(Math.random() * 1000),
        attackFeatures: ['特征1：异常字符串', '特征2：恶意代码片段', '特征3：非法请求参数'][Math.floor(Math.random() * 3)]
      }
    }));
  };

  const data = generateMockData();

  // 筛选数据
  const filteredData = data.filter(item => {
    return (
      (!filterValues.intelType || item.intelType === filterValues.intelType) &&
      (!filterValues.intelSource || item.intelSource === filterValues.intelSource) &&
      (!filterValues.action || item.action === filterValues.action) &&
      (!filterValues.attackIp || item.attackIp.toLowerCase().includes(filterValues.attackIp.toLowerCase())) &&
      (!filterValues.targetIp || item.targetIp.toLowerCase().includes(filterValues.targetIp.toLowerCase())) &&
      (!filterValues.location || filterValues.location.length === 0 || (() => {
        const [category, specific] = filterValues.location;
        if (category === 'world') {
          return true;  // 世界包含所有位置
        } else if (category === 'china') {
          return item.location === specific;  // 中国城市精确匹配
        } else if (category === 'foreign') {
          return item.location === specific;  // 国外国家精确匹配
        }
        return false;
      })())
    );
  });

  // 处理筛选表单提交
  const handleFilter = (values: FilterValues) => {
    setFilterValues(values);
  };

  // 重置筛选
  const handleReset = () => {
    form.resetFields();
    setFilterValues({});
  };

  // 从 localStorage 加载保存的筛选条件
  useEffect(() => {
    const saved = localStorage.getItem('attackLogsSavedFilters');
    if (saved) {
      setSavedFilters(JSON.parse(saved));
    }
  }, []);

  // 保存筛选条件到 localStorage
  const saveToLocalStorage = (filters: SavedFilter[]) => {
    localStorage.setItem('attackLogsSavedFilters', JSON.stringify(filters));
    setSavedFilters(filters);
  };

  // 保存当前筛选条件
  const handleSaveFilter = () => {
    const currentValues = form.getFieldsValue();
    if (Object.keys(currentValues).every(key => !currentValues[key])) {
      message.warning('请至少设置一个筛选条件');
      return;
    }

    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName,
      conditions: currentValues,
      createTime: new Date().toLocaleString()
    };

    saveToLocalStorage([...savedFilters, newFilter]);
    setIsModalVisible(false);
    setFilterName('');
    message.success('筛选条件保存成功');
  };

  // 应用保存的筛选条件
  const applyFilter = (filter: SavedFilter) => {
    form.setFieldsValue(filter.conditions);
    setFilterValues(filter.conditions);
  };

  // 删除保存的筛选条件
  const deleteFilter = (id: string) => {
    const newFilters = savedFilters.filter(f => f.id !== id);
    saveToLocalStorage(newFilters);
    message.success('删除成功');
  };

  return (
    <div>
      {/* 图表区域 */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <Card style={{ marginBottom: isChartsExpanded ? '24px' : '0' }}>
          {isChartsExpanded ? (
            <>
              <Row gutter={24}>
                <Col span={16}>
                  <AttackTrendChart />
                </Col>
                <Col span={8} style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', right: 12, top: -4, zIndex: 1 }}>
                    <Button
                      type="link"
                      onClick={() => setIsChartsExpanded(!isChartsExpanded)}
                      style={{ padding: '4px 0' }}
                    >
                      收起图表
                    </Button>
                  </div>
                  <IntelTypeChart />
                </Col>
              </Row>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <CollapsedCharts
                  trendData={[
                    { date: '2024年8月7日', high: 934, medium: 1498, low: 3065 },
                    { date: '2024年8月6日', high: 856, medium: 1389, low: 2987 },
                    { date: '2024年8月5日', high: 912, medium: 1456, low: 3123 }
                  ]}
                  intelTypeData={[
                    { type: '注入攻击', count: 2345, percentage: 23.45 },
                    { type: 'XSS攻击', count: 1234, percentage: 12.34 },
                    { type: '暴力破解', count: 987, percentage: 9.87 }
                  ]}
                />
              </div>
              <Button
                type="link"
                onClick={() => setIsChartsExpanded(!isChartsExpanded)}
                style={{ padding: '4px 0', marginLeft: '16px' }}
              >
                展开图表
              </Button>
            </div>
          )}
        </Card>
      </div>
      <Card style={{ backgroundColor: 'white' }}>
        <Form
          form={form}
          style={{ marginBottom: '16px' }}
          onFinish={handleFilter}
        >
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Form.Item name="savedFilter" label="快捷搜索" style={{ marginBottom: 0 }}>
                <Select
                  placeholder="选择已保存的筛选条件"
                  allowClear
                  dropdownRender={() => (
                    <div>
                      {savedFilters.length === 0 ? (
                        <div style={{ padding: '8px', color: '#999', textAlign: 'center' }}>
                          暂无保存的筛选条件
                        </div>
                      ) : (
                        savedFilters.map(filter => (
                          <div
                            key={filter.id}
                            className="filter-item"
                            style={{
                              padding: '8px',
                              cursor: 'pointer',
                              borderBottom: '1px solid #f0f0f0'
                            }}
                            onClick={() => applyFilter(filter)}
                          >
                            <div>{filter.name}</div>
                            <div style={{ fontSize: '12px', color: '#999' }}>{filter.createTime}</div>
                            <div style={{ textAlign: 'right' }}>
                              <Button
                                type="link"
                                size="small"
                                danger
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteFilter(filter.id);
                                }}
                              >
                                删除
                              </Button>
                            </div>
                            <style>
                              {`
                                .filter-item:hover {
                                  background-color: #f5f5f5;
                                }
                              `}
                            </style>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="intelType" label="情报类型" style={{ marginBottom: 0 }}>
                <Select
                  allowClear
                  placeholder="请选择情报类型"
                  options={filterOptions.intelType.map(item => ({ label: item, value: item }))}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="intelSource" label="命中情报源" style={{ marginBottom: 0 }}>
                <Select
                  allowClear
                  placeholder="请选择情报源"
                  options={filterOptions.intelSource.map(item => ({ label: item, value: item }))}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="action" label="处理动作" style={{ marginBottom: 0 }}>
                <Select
                  allowClear
                  placeholder="请选择处理动作"
                  options={filterOptions.action.map(item => ({ label: item, value: item }))}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="attackIp" label="攻击IP" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入攻击IP" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="targetIp" label="被攻击IP" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入被攻击IP" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="location" label="归属地" style={{ marginBottom: 0 }}>
                <Cascader
                  options={locationOptions}
                  placeholder="请选择归属地"
                  allowClear
                  showSearch={{
                    filter: (inputValue, path) => {
                      return path.some(option =>
                        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
                      );
                    },
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={6} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Form.Item style={{ marginBottom: 0 }}>
                <Space>
                  <Button type="primary" htmlType="submit">
                    筛选
                  </Button>
                  <Button onClick={handleReset}>
                    重置
                  </Button>
                  <Button onClick={() => setIsModalVisible(true)}>
                    保存条件
                  </Button>
                  <Button
                    icon={<StarOutlined />}
                    onClick={showIpDrawer}
                  >
                    IP收藏夹
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Modal
          title="保存筛选条件"
          open={isModalVisible}
          onOk={handleSaveFilter}
          onCancel={() => {
            setIsModalVisible(false);
            setFilterName('');
          }}
          okText="保存"
          cancelText="取消"
        >
          <Form layout="vertical">
            <Form.Item
              label="筛选条件名称"
              required
              rules={[{ required: true, message: '请输入筛选条件名称' }]}
            >
              <Input
                placeholder="请输入名称"
                value={filterName}
                onChange={e => setFilterName(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* IP收藏夹抽屉 */}
        <Drawer
          title={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography.Title level={4} style={{ margin: 0, fontSize: '18px' }}>IP收藏夹</Typography.Title>
            </div>
          }
          placement="right"
          width="clamp(600px, 30%, 100%)"
          onClose={closeIpDrawer}
          open={isIpDrawerVisible}
        >
          <IpFavorites />
        </Drawer>

        <Space style={{ marginBottom: '16px' }}>
          {selectedRows.length > 0 && (
            <>
              <Button type="primary">导出</Button>
              <Button onClick={() => setSelectedRows([])}>清空</Button>
            </>
          )}
          <Button onClick={() => {/* 刷新逻辑 */ }}>刷新</Button>
        </Space>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowSelection={{
            selectedRowKeys: selectedRows.map(row => row.key),
            onChange: (_, rows) => setSelectedRows(rows),
          }}
          scroll={{
            x: 2000,
            scrollToFirstRowOnChange: true
          }}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          style={{
            overflow: 'auto',
            position: 'relative'
          }}
          className="custom-table"
        />
      </Card>
      <AttackLogDetail
        data={selectedLog || {
          time: '',
          attackIp: '',
          location: '',
          targetIp: '',
          targetPort: '',
          intelType: '',
          threatLevel: '',
          action: '',
          intelSource: '',
          rule: '',
          assetGroup: '',
          requestInfo: {
            protocol: '',
            url: '',
            dnsName: '',
            headers: {},
            body: ''
          },
          responseInfo: {
            headers: {},
            body: ''
          }
        }}
        open={isDetailVisible}
        onClose={() => setIsDetailVisible(false)}
      />
      <style>
        {`
          .custom-table .ant-table-cell-fix-right {
            transition: none !important;
          }
        `}
      </style>
    </div>
  );
};

export default AttackLogs;
