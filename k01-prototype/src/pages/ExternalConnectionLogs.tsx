import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Form, Select, Row, Col, Modal, message, Tag, Typography } from 'antd';
import { AttackTrendChart } from '../components/AttackTrendChart';
import { IntelTypeChart } from '../components/IntelTypeChart';
import ExternalConnectionDetail from '../components/ExternalConnectionDetail';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import moment from 'moment';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface FilterValues {
  hitType?: string;
  action?: string;
  targetType?: string;
  controlledHost?: string;
  externalDomain?: string;
  destinationIp?: string;
  savedFilter?: string;
  threatLevel?: string;
}

interface SavedFilter {
  id: string;
  name: string;
  conditions: FilterValues;
  createTime: string;
}

// 添加日志项的接口定义
interface LogItem {
  id: string;
  time: string;
  attackIp: string;
  location: string;
  sourcePort: number;
  requestInfo: {
    protocol: string;
    url: string;
    dnsName: string;
    nextHopDns: string;
    method: string;
    headers: Record<string, string>;
    body: any;
    params: Record<string, string>;
  };
  responseInfo?: {
    headers: Record<string, string>;
    body: any;
  } | null;
  targetIp: string;
  targetPort: string;
  targetType: string;
  hitType: string;
  intelType: string;
  threatLevel: string;
  action: string;
  localVerification: any;
  intelSource: string;
  rule?: string;
  assetGroup?: string;
}

const ExternalConnectionLogs: React.FC = () => {
  // 合并状态
  const [state, setState] = useState({
    selectedRows: [] as string[],
    filterValues: {} as FilterValues,
    savedFilters: [] as SavedFilter[],
    isModalVisible: false,
    filterName: '',
    isDetailVisible: false,
    selectedLog: null as LogItem | null,
  });

  const { selectedRows, filterValues, savedFilters, isModalVisible, filterName, isDetailVisible, selectedLog } = state;

  const [form] = Form.useForm();

  // 筛选选项
  const filterOptions = {
    hitType: ['情报命中', '规则命中', 'AI检测', '行为分析'],
    action: ['阻断', '监控'],
    targetType: ['C2服务器', '恶意域名', '挖矿节点', '僵尸网络'],
  };

  // 表格列定义
  const columns = [
    {
      title: '时间',
      dataIndex: 'time',
      width: 180,
      render: (time: string) => moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '受控主机',
      dataIndex: 'attackIp',
      width: 180,
      render: (ip: string) => (
        <div style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
          <Typography.Text copyable={{ text: ip }} style={{ margin: 0 }}>
            {ip}
          </Typography.Text>
        </div>
      )
    },
    {
      title: '源端口',
      dataIndex: 'sourcePort',
      width: 100,
    },
    {
      title: '外联域名/URL',
      dataIndex: ['requestInfo', 'url'],
      width: 240,
      ellipsis: true,
      render: (url: string, record: { requestInfo: { dnsName: any; }; }) => {
        const displayText = url || record.requestInfo?.dnsName || '-';
        return (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            maxWidth: '100%'
          }}>
            <Typography.Text
              copyable={{ text: displayText }}
              ellipsis={{ tooltip: displayText }}
              style={{ margin: 0, maxWidth: '100%' }}
            >
              {displayText}
            </Typography.Text>
          </div>
        );
      }
    },
    {
      title: '下一跳DNS',
      dataIndex: ['requestInfo', 'nextHopDns'],
      width: 180,
      render: (dns: string) => {
        if (!dns) {
          return null;
        }
        return (
          <div style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
            <Typography.Text copyable={{ text: dns }} style={{ margin: 0 }}>
              {dns}
            </Typography.Text>
          </div>
        );
      }
    },
    {
      title: '目的IP',
      dataIndex: 'targetIp',
      width: 180,
      render: (ip: string) => (
        <div style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
          <Typography.Text copyable={{ text: ip }} style={{ margin: 0 }}>
            {ip}
          </Typography.Text>
        </div>
      )
    },
    {
      title: '目的端口',
      dataIndex: 'targetPort',
      width: 100,
    },
    {
      title: '目标类型',
      dataIndex: 'targetType',
      width: 120,
      render: (type: string) => <Tag>{type || '-'}</Tag>
    },
    {
      title: '命中类型',
      dataIndex: 'hitType',
      width: 120,
      render: (type: string) => <Tag>{type || '-'}</Tag>
    },
    {
      title: '威胁等级',
      dataIndex: 'threatLevel',
      width: 100,
      render: (level: string) => {
        const color = {
          '高危': 'red',
          '中危': 'orange',
          '低危': 'green'
        }[level] || 'default';
        return <Tag color={color}>{level}</Tag>;
      }
    },
    {
      title: '处理动作',
      dataIndex: 'action',
      width: 100,
      render: (action: string) => {
        const color = action === '阻断' ? 'red' : 'blue';
        return <Tag color={color}>{action}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'operation',
      width: 160,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setState({
                ...state,
                selectedLog: record,
                isDetailVisible: true
              });
            }}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {/* 误报加白逻辑 */ }}
          >
            误报加白
          </Button>
        </Space>
      )
    }
  ];

  // 生成模拟数据
  const generateMockData = (count: number) => {
    const protocols = ['HTTP', 'HTTPS', 'FTP', 'DNS'];
    const targetTypes = ['C2服务器', '恶意域名', '挖矿节点', '僵尸网络'];
    const hitTypes = ['情报命中', '规则命中', 'AI检测', '行为分析'];
    const threatLevels = ['高危', '中危', '低危'];
    const actions = ['监控', '阻断'];
    const domains = ['evil.com', 'malware.net', 'hack.org', 'attack.cn'];
    const dnsServers = ['8.8.8.8', '8.8.4.4', '1.1.1.1', '114.114.114.114', '223.5.5.5', '223.6.6.6'];
    const intelSources = ['威胁情报', '安全社区', '自定义规则', '系统检测'];
    const methods = ['GET', 'POST', 'PUT', 'DELETE'];
    const contentTypes = ['application/json', 'text/html', 'application/x-www-form-urlencoded'];
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
    ];

    const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
    const getRandomPort = () => Math.floor(Math.random() * 65535);
    const getRandomIP = () => `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

    return Array.from({ length: count }, (_, i) => {
      const protocol = getRandomElement(protocols);
      const domain = getRandomElement(domains);
      const url = protocol === 'DNS' ? '' : `${protocol.toLowerCase()}://${domain}/path/to/resource`;
      const method = getRandomElement(methods);
      const contentType = getRandomElement(contentTypes);
      const userAgent = getRandomElement(userAgents);
      const requestSize = Math.floor(Math.random() * 1000) + 100;
      const responseSize = Math.floor(Math.random() * 2000) + 200;
      const statusCode = Math.random() > 0.8 ? getRandomElement([400, 403, 404, 500, 502, 503]) : 200;

      return {
        id: `${i}`,
        time: moment().subtract(Math.floor(Math.random() * 7), 'days')
          .subtract(Math.floor(Math.random() * 24), 'hours')
          .subtract(Math.floor(Math.random() * 60), 'minutes')
          .format('YYYY-MM-DD HH:mm:ss'),
        attackIp: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        location: getRandomElement(['北京', '上海', '广州', '深圳']),
        sourcePort: getRandomPort(),
        requestInfo: {
          protocol,
          url: url || `${protocol.toLowerCase()}://${domain}/path/to/resource`,
          dnsName: protocol === 'DNS' ? domain : '',
          nextHopDns: getRandomElement(dnsServers),
          method,
          headers: {
            'Host': domain,
            'User-Agent': userAgent,
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Content-Type': contentType,
            'Content-Length': requestSize.toString(),
            'X-Forwarded-For': getRandomIP(),
            'X-Real-IP': getRandomIP()
          },
          body: protocol === 'DNS' ? null : {
            type: contentType,
            size: `${requestSize} bytes`,
            content: 'Base64编码的请求内容...',
            params: {
              key1: 'value1',
              key2: 'value2',
              timestamp: new Date().getTime().toString()
            }
          },
          params: {
            key1: 'value1',
            key2: 'value2',
            timestamp: new Date().getTime().toString()
          }
        },
        responseInfo: protocol === 'DNS' ? null : {
          statusCode,
          headers: {
            'Content-Type': contentType,
            'Content-Length': responseSize.toString(),
            'Server': 'nginx/1.18.0',
            'Date': new Date().toUTCString(),
            'Connection': 'keep-alive',
            'X-Powered-By': 'PHP/7.4.0',
            'Cache-Control': 'no-cache, private'
          },
          body: {
            type: contentType,
            size: `${responseSize} bytes`,
            content: 'Base64编码的响应内容...',
            data: statusCode === 200 ? {
              code: 0,
              message: 'success',
              data: {
                id: Math.floor(Math.random() * 1000),
                name: 'Sample Response',
                timestamp: new Date().getTime()
              }
            } : {
              code: statusCode,
              message: 'error',
              error: 'Request failed'
            }
          }
        },
        targetIp: `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        targetPort: getRandomPort().toString(),
        targetType: getRandomElement(targetTypes),
        hitType: getRandomElement(hitTypes),
        intelType: getRandomElement(['情报命中', '规则命中']),
        threatLevel: getRandomElement(threatLevels),
        action: getRandomElement(actions),
        intelSource: getRandomElement(intelSources),
        localVerification: {
          ruleName: ['SQL注入检测', 'XSS攻击检测', '命令注入检测', 'WebShell检测'][Math.floor(Math.random() * 4)],
          protocolNumber: '323-2',
          protocolType: protocol,
          attackType: ['SQL注入', 'XSS攻击', '命令注入', 'WebShell'][Math.floor(Math.random() * 4)],
          malformedPacketLength: Math.floor(Math.random() * 1000),
          attackFeatures: ['特征1：异常字符串', '特征2：恶意代码片段', '特征3：非法请求参数'][Math.floor(Math.random() * 3)]
        }
      };
    });
  };

  // 在组件加载时生成模拟数据
  const [logs, setLogs] = useState<LogItem[]>([]);
  useEffect(() => {
    const mockData = generateMockData(100);
    setLogs(mockData);
  }, []);

  // 筛选数据
  const filteredData = logs.filter(item => {
    return (
      (!filterValues.hitType || item.hitType === filterValues.hitType) &&
      (!filterValues.action || item.action === filterValues.action) &&
      (!filterValues.targetType || item.targetType === filterValues.targetType) &&
      (!filterValues.controlledHost || item.attackIp.toLowerCase().includes(filterValues.controlledHost.toLowerCase())) &&
      (!filterValues.externalDomain ||
        (item.requestInfo?.url?.toLowerCase().includes(filterValues.externalDomain.toLowerCase()) ||
          item.requestInfo?.dnsName?.toLowerCase().includes(filterValues.externalDomain.toLowerCase()))) &&
      (!filterValues.destinationIp || item.targetIp.toLowerCase().includes(filterValues.destinationIp.toLowerCase())) &&
      (!filterValues.threatLevel || item.threatLevel === filterValues.threatLevel) &&
      (!filterValues.savedFilter || filterValues.savedFilter === 'all')
    );
  });

  // 处理筛选表单提交
  const handleFilter = (values: FilterValues) => {
    setState({ ...state, filterValues: values });
  };

  // 重置筛选
  const handleReset = () => {
    form.resetFields();
    setState({ ...state, filterValues: {} });
  };

  // 从 localStorage 加载保存的筛选条件
  useEffect(() => {
    const saved = localStorage.getItem('attackLogsSavedFilters');
    if (saved) {
      setState({ ...state, savedFilters: JSON.parse(saved) });
    }
  }, []);

  // 保存筛选条件到 localStorage
  const saveToLocalStorage = (filters: SavedFilter[]) => {
    localStorage.setItem('attackLogsSavedFilters', JSON.stringify(filters));
    setState({ ...state, savedFilters: filters });
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
    setState({ ...state, isModalVisible: false, filterName: '' });
    message.success('筛选条件保存成功');
  };

  // 应用保存的筛选条件
  const applyFilter = (filter: SavedFilter) => {
    form.setFieldsValue(filter.conditions);
    setState({ ...state, filterValues: filter.conditions });
  };

  // 删除保存的筛选条件
  const deleteFilter = (id: string) => {
    const newFilters = savedFilters.filter(f => f.id !== id);
    saveToLocalStorage(newFilters);
    message.success('删除成功');
  };

  // 构建下拉菜单

  return (
    <>
      <Card style={{ marginBottom: '24px', backgroundColor: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ width: '48%' }}>
            <AttackTrendChart />
          </div>
          <div style={{ width: '48%' }}>
            <IntelTypeChart />
          </div>
        </div>
      </Card>
      <Card style={{ backgroundColor: 'white' }}>
        <Form
          form={form}
          onFinish={handleFilter}
          style={{ marginBottom: '24px' }}
          layout="inline"
        >
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Form.Item name="savedFilter" label="快速搜索" style={{ marginBottom: 0 }}>
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
                          </div>
                        ))
                      )}
                    </div>
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="hitType" label="命中类型" style={{ marginBottom: 0 }}>
                <Select
                  allowClear
                  placeholder="请选择命中类型"
                  options={filterOptions.hitType.map(item => ({ label: item, value: item }))}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="action" label="处置动作" style={{ marginBottom: 0 }}>
                <Select
                  allowClear
                  placeholder="请选择处置动作"
                  options={filterOptions.action.map(item => ({ label: item, value: item }))}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="targetType" label="目标类型" style={{ marginBottom: 0 }}>
                <Select
                  allowClear
                  placeholder="请选择目标类型"
                  options={filterOptions.targetType.map(item => ({ label: item, value: item }))}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="threatLevel" label="威胁等级" style={{ marginBottom: 0 }}>
                <Select
                  allowClear
                  placeholder="请选择威胁等级"
                  options={[
                    { value: '高危', label: '高危' },
                    { value: '中危', label: '中危' },
                    { value: '低危', label: '低危' }
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="controlledHost" label="受控主机" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入受控主机" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="externalDomain" label="外联域名/URL" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入外联域名或URL" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="destinationIp" label="目的IP" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入目的IP" allowClear />
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
                  <Button onClick={() => setState({ ...state, isModalVisible: true })}>
                    保存条件
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
            setState({ ...state, isModalVisible: false, filterName: '' });
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
                onChange={e => setState({ ...state, filterName: e.target.value })}
              />
            </Form.Item>
          </Form>
        </Modal>

        <Space style={{ marginBottom: '16px' }}>
          {selectedRows.length > 0 && (
            <>
              <Button type="primary">导出</Button>
              <Button onClick={() => setState({ ...state, selectedRows: [] })}>清空</Button>
            </>
          )}
          <Button onClick={() => {/* 刷新逻辑 */ }}>刷新</Button>
        </Space>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 1800 }}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedRows,
            onChange: (selectedRowKeys) => setState({ ...state, selectedRows: selectedRowKeys as string[] }),
          }}
        />
      </Card>
      <ExternalConnectionDetail
        data={selectedLog || {
          id: '',
          time: '',
          attackIp: '',
          location: '',
          targetIp: '',
          targetPort: '',
          intelType: '',
          action: '',
          intelSource: '',
          rule: '',
          assetGroup: '',
          requestInfo: {
            protocol: '',
            url: '',
            dnsName: '',
            headers: {},
            body: '',
            params: {}
          }
        }}
        open={isDetailVisible}
        onClose={() => setState({ ...state, isDetailVisible: false })}
      />
    </>
  );
};

export default ExternalConnectionLogs;
