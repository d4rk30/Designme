import React from 'react';
import { Card, Row, Col, Tag, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Meta } = Card;
const { Paragraph } = Typography;

interface IntelligenceSource {
  title: string;
  logoPath: string;
  description: string;
  status: 'connected' | 'disconnected';
}

const intelligenceSources: IntelligenceSource[] = [
  {
    title: '公安一所情报',
    logoPath: '/images/logos/public-security.png',
    description: '正向攻击情报',
    status: 'connected',
  },
  {
    title: '奇安信息威胁情报',
    logoPath: '/images/logos/qianxin.png',
    description: '受控外联情报',
    status: 'connected',
  },
  {
    title: '腾讯威胁情报',
    logoPath: '/images/logos/tencent.png',
    description: '正向攻击情报',
    status: 'disconnected',
  },
  {
    title: '360威胁情报',
    logoPath: '/images/logos/360.png',
    description: '受控外联情报',
    status: 'connected',
  },
  {
    title: '华为威胁情报',
    logoPath: '/images/logos/huawei.png',
    description: '正向攻击情报',
    status: 'connected',
  },
  {
    title: '阿里云威胁情报',
    logoPath: '/images/logos/aliyun.png',
    description: '受控外联情报',
    status: 'disconnected',
  },
];

const PublicIntelligence: React.FC = () => {
  const renderStatus = (status: 'connected' | 'disconnected') => {
    return status === 'connected' ? (
      <Tag color="success" icon={<CheckCircleOutlined />}>
        已连接
      </Tag>
    ) : (
      <Tag color="error" icon={<CloseCircleOutlined />}>
        未连接
      </Tag>
    );
  };

  return (
    <div style={{}}>
      <Row gutter={[24, 24]}>
        {intelligenceSources.map((source, index) => (
          <Col xs={24} sm={12} md={8} lg={4} xl={4} key={index}>
            <Card
              hoverable
            >
              <div style={{ position: 'relative' }}>
                <div style={{ 
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <img
                    alt={source.title}
                    src={source.logoPath}
                    style={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
                <Meta
                  title={
                    <div style={{ 
                      paddingRight: '32px' // 为logo留出空间
                    }}>
                      <span>{source.title}</span>
                    </div>
                  }
                  description={
                    <div>
                      <div style={{ marginBottom: '8px' }}>{source.description}</div>
                      {renderStatus(source.status)}
                    </div>
                  }
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PublicIntelligence;
