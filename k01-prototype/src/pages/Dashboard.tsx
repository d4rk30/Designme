import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Space, Progress, Table, Badge, Alert, Timeline } from 'antd';
import {
  AlertOutlined,
  SafetyCertificateOutlined,
  SecurityScanOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

// 模拟数据生成函数
const generateMockData = () => ({
  threatOverview: {
    todayTotal: Math.floor(Math.random() * 1000),
    processed: Math.floor(Math.random() * 800),
    unprocessed: Math.floor(Math.random() * 200),
    weeklyTrend: Array(7).fill(0).map(() => Math.floor(Math.random() * 100)),
    riskDistribution: {
      high: Math.floor(Math.random() * 100),
      medium: Math.floor(Math.random() * 200),
      low: Math.floor(Math.random() * 300),
    }
  },
  assetStatus: {
    total: Math.floor(Math.random() * 500),
    riskDistribution: {
      high: Math.floor(Math.random() * 50),
      medium: Math.floor(Math.random() * 150),
      low: Math.floor(Math.random() * 300)
    },
    topAttacked: Array(5).fill(0).map((_, i) => ({
      key: i,
      asset: `Asset-${i + 1}`,
      attacks: Math.floor(Math.random() * 100),
      type: ['服务器', '终端', '网络设备'][Math.floor(Math.random() * 3)]
    }))
  },
  threatIntel: {
    activeIndicators: {
      ip: Math.floor(Math.random() * 1000),
      domain: Math.floor(Math.random() * 500),
      url: Math.floor(Math.random() * 300),
      hash: Math.floor(Math.random() * 200)
    },
    sourceDistribution: [
      { name: '源1', value: Math.floor(Math.random() * 100) },
      { name: '源2', value: Math.floor(Math.random() * 100) },
      { name: '源3', value: Math.floor(Math.random() * 100) }
    ],
    lastUpdate: new Date().toLocaleString()
  },
  blockingEffectiveness: {
    successRate: Math.floor(Math.random() * 100),
    falsePositiveRate: Math.floor(Math.random() * 10),
    avgResponseTime: Math.floor(Math.random() * 1000),
    blockingTypes: {
      network: Math.floor(Math.random() * 100),
      application: Math.floor(Math.random() * 100),
      endpoint: Math.floor(Math.random() * 100)
    }
  },
  realtimeMonitoring: {
    recentEvents: Array(5).fill(0).map((_, i) => ({
      key: i,
      time: new Date(Date.now() - i * 60000).toLocaleString(),
      event: `阻断事件 ${i + 1}`,
      type: ['高危', '中危', '低危'][Math.floor(Math.random() * 3)],
      status: ['已处理', '处理中'][Math.floor(Math.random() * 2)]
    })),
    systemStatus: {
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      disk: Math.floor(Math.random() * 100)
    }
  },
  compliance: {
    policyExecution: Math.floor(Math.random() * 100),
    complianceRate: Math.floor(Math.random() * 100),
    recentAudits: Array(3).fill(0).map((_, i) => ({
      key: i,
      time: new Date(Date.now() - i * 3600000).toLocaleString(),
      action: `配置变更 ${i + 1}`,
      operator: `管理员${i + 1}`
    }))
  }
});

const Dashboard: React.FC = () => {
  const [data, setData] = useState(generateMockData());

  useEffect(() => {
    const timer = setInterval(() => {
      setData(generateMockData());
    }, 30000); // 30秒更新一次数据

    return () => clearInterval(timer);
  }, []);

  // 威胁趋势图配置
  const threatTrendOption = {
    title: { text: '近7天威胁趋势' },
    xAxis: { type: 'category', data: Array(7).fill(0).map((_, i) => `Day ${i + 1}`) },
    yAxis: { type: 'value' },
    series: [{
      data: data.threatOverview.weeklyTrend,
      type: 'line',
      smooth: true
    }]
  };

  // 情报源分布图配置
  const intelSourceOption = {
    title: { text: '情报源分布' },
    series: [{
      type: 'pie',
      radius: '60%',
      data: data.threatIntel.sourceDistribution
    }]
  };

  return (
    <div>
      {/* 1. 威胁概览 */}
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日威胁总数"
              value={data.threatOverview.todayTotal}
              prefix={<AlertOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已处理威胁"
              value={data.threatOverview.processed}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="未处理威胁"
              value={data.threatOverview.unprocessed}
              prefix={<WarningOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="阻断成功率"
              value={data.blockingEffectiveness.successRate}
              suffix="%"
              prefix={<SecurityScanOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* 2. 威胁趋势和资产状态 */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={12}>
          <Card title="威胁趋势">
            <ReactECharts option={threatTrendOption} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="资产风险分布">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <span>高风险资产</span>
                <Progress
                  percent={Math.round(data.assetStatus.riskDistribution.high / data.assetStatus.total * 100)}
                  strokeColor="#ff4d4f"
                />
              </div>
              <div>
                <span>中风险资产</span>
                <Progress
                  percent={Math.round(data.assetStatus.riskDistribution.medium / data.assetStatus.total * 100)}
                  strokeColor="#faad14"
                />
              </div>
              <div>
                <span>低风险资产</span>
                <Progress
                  percent={Math.round(data.assetStatus.riskDistribution.low / data.assetStatus.total * 100)}
                  strokeColor="#52c41a"
                />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 3. 威胁情报指标 */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={12}>
          <Card title="活跃威胁情报指标">
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Statistic title="IP" value={data.threatIntel.activeIndicators.ip} />
              </Col>
              <Col span={6}>
                <Statistic title="域名" value={data.threatIntel.activeIndicators.domain} />
              </Col>
              <Col span={6}>
                <Statistic title="URL" value={data.threatIntel.activeIndicators.url} />
              </Col>
              <Col span={6}>
                <Statistic title="文件哈希" value={data.threatIntel.activeIndicators.hash} />
              </Col>
            </Row>
            <div style={{ marginTop: '16px' }}>
              <Alert
                message={`最后更新时间: ${data.threatIntel.lastUpdate}`}
                type="info"
                showIcon
              />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="情报源分布">
            <ReactECharts option={intelSourceOption} />
          </Card>
        </Col>
      </Row>

      {/* 4. 实时监控 */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={12}>
          <Card title="实时阻断事件">
            <Table
              dataSource={data.realtimeMonitoring.recentEvents}
              columns={[
                { title: '时间', dataIndex: 'time', key: 'time' },
                { title: '事件', dataIndex: 'event', key: 'event' },
                {
                  title: '类型',
                  dataIndex: 'type',
                  key: 'type',
                  render: (type) => (
                    <Badge
                      status={type === '高危' ? 'error' : type === '中危' ? 'warning' : 'success'}
                      text={type}
                    />
                  )
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status) => (
                    <Badge
                      status={status === '已处理' ? 'success' : 'processing'}
                      text={status}
                    />
                  )
                }
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="系统性能监控">
            <Row gutter={[32, 16]}>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: 8 }}>CPU使用率</div>
                  <Progress type="dashboard" percent={data.realtimeMonitoring.systemStatus.cpu} />
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: 8 }}>内存使用率</div>
                  <Progress type="dashboard" percent={data.realtimeMonitoring.systemStatus.memory} />
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: 8 }}>磁盘使用率</div>
                  <Progress type="dashboard" percent={data.realtimeMonitoring.systemStatus.disk} />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 5. 合规与审计 */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={12}>
          <Card title="合规状态">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="策略执行率"
                  value={data.compliance.policyExecution}
                  suffix="%"
                  prefix={<SafetyCertificateOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="合规达标率"
                  value={data.compliance.complianceRate}
                  suffix="%"
                  prefix={<CheckCircleOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="最近审计日志">
            <Timeline>
              {data.compliance.recentAudits.map(audit => (
                <Timeline.Item key={audit.key}>
                  <p>{audit.time}</p>
                  <p>{audit.action} - {audit.operator}</p>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
