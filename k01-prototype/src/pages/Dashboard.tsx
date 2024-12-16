import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Space, Progress } from 'antd';
import { SecurityScanOutlined, AlertOutlined, SafetyCertificateOutlined, BugOutlined } from '@ant-design/icons';

// 模拟数据生成函数
const generateMockData = () => {
  return {
    threatCount: Math.floor(Math.random() * 1000),
    attackCount: Math.floor(Math.random() * 5000),
    assetCount: Math.floor(Math.random() * 100),
    vulnerabilityCount: Math.floor(Math.random() * 200),
    threatLevels: {
      high: Math.floor(Math.random() * 100),
      medium: Math.floor(Math.random() * 200),
      low: Math.floor(Math.random() * 300),
    },
    assetHealth: Math.floor(Math.random() * 100),
    systemPerformance: {
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      disk: Math.floor(Math.random() * 100),
    },
    complianceScore: Math.floor(Math.random() * 100),
  };
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState(generateMockData());

  // 模拟数据更新
  useEffect(() => {
    const timer = setInterval(() => {
      setData(generateMockData());
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{  }}>
      {/* 顶部统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="实时威胁"
              value={data.threatCount}
              prefix={<AlertOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="攻击事件"
              value={data.attackCount}
              prefix={<SecurityScanOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="资产总数"
              value={data.assetCount}
              prefix={<SafetyCertificateOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="漏洞数量"
              value={data.vulnerabilityCount}
              prefix={<BugOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 威胁等级和资产健康度 */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={12}>
          <Card title="威胁等级分布">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <span>高危威胁</span>
                <Progress 
                  percent={Math.round(data.threatLevels.high / (data.threatLevels.high + data.threatLevels.medium + data.threatLevels.low) * 100)} 
                  strokeColor="#ff4d4f"
                />
              </div>
              <div>
                <span>中危威胁</span>
                <Progress 
                  percent={Math.round(data.threatLevels.medium / (data.threatLevels.high + data.threatLevels.medium + data.threatLevels.low) * 100)} 
                  strokeColor="#faad14"
                />
              </div>
              <div>
                <span>低危威胁</span>
                <Progress 
                  percent={Math.round(data.threatLevels.low / (data.threatLevels.high + data.threatLevels.medium + data.threatLevels.low) * 100)} 
                  strokeColor="#52c41a"
                />
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="资产健康度">
            <Row justify="center">
              <Progress
                type="circle"
                percent={data.assetHealth}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                width={200}
              />
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 系统性能监控 */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={24}>
          <Card title="系统性能监控">
            <Row gutter={[32, 16]}>
              <Col span={8}>
                <Progress
                  type="dashboard"
                  percent={data.systemPerformance.cpu}
                  width={160}
                />
                <div style={{ textAlign: 'center', marginTop: '8px' }}>CPU使用率</div>
              </Col>
              <Col span={8}>
                <Progress
                  type="dashboard"
                  percent={data.systemPerformance.memory}
                  width={160}
                />
                <div style={{ textAlign: 'center', marginTop: '8px' }}>内存使用率</div>
              </Col>
              <Col span={8}>
                <Progress
                  type="dashboard"
                  percent={data.systemPerformance.disk}
                  width={160}
                />
                <div style={{ textAlign: 'center', marginTop: '8px' }}>磁盘使用率</div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 合规评分 */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={24}>
          <Card title="合规评分">
            <Row justify="center">
              <Progress
                type="circle"
                percent={data.complianceScore}
                strokeColor={{
                  '0%': '#ff4d4f',
                  '50%': '#faad14',
                  '100%': '#52c41a',
                }}
                width={200}
              />
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
