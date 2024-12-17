import React from 'react';
import { Space, Typography, Tag } from 'antd';

// 导入图片
import attackerIcon from '../assets/icons/attacker.svg';
import victimIcon from '../assets/icons/victim.svg';

interface ExternalConnectionPathVisualProps {
  attackerInfo: {
    ip: string;
  };
  victimInfo: {
    ip: string;
  };
  protocol: string;
  url: string;
}

const ExternalConnectionPathVisual: React.FC<ExternalConnectionPathVisualProps> = ({
  attackerInfo,
  victimInfo,
  protocol,
  url
}) => {
  // 获取协议标签的颜色
  const getProtocolColor = (protocol: string) => {
    const colors: Record<string, string> = {
      'HTTP': 'blue',
      'HTTPS': 'green',
      'FTP': 'orange',
      'DNS': 'purple'
    };
    return colors[protocol.toUpperCase()] || 'default';
  };

  return (
    <div style={{ paddingTop: '10px', position: 'relative', minHeight: '100px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        position: 'relative',
        padding: '0 20px'
      }}>
        {/* 连线层 */}
        <div style={{
          position: 'absolute',
          left: '20px',
          right: '20px',
          top: '32px',
          height: '2px',
          zIndex: 1
        }}>
          {/* 红色连接线 */}
          <div style={{
            position: 'absolute',
            left: '32px',
            right: '32px',
            height: '2px',
            background: '#ff4d4f'
          }} />
          {/* 协议和URL信息 */}
          <div style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 3
          }}>
            <Tag 
              color={getProtocolColor(protocol)}
              style={{ 
                marginBottom: '4px',
                marginTop: '-12px'
              }}
            >
              {protocol.toUpperCase()}
            </Tag>
            <Typography.Text 
              copyable
              style={{ 
                fontSize: '12px',
                color: '#666',
                marginTop: '8px',
                maxWidth: '300px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {url || '-'}
            </Typography.Text>
          </div>
        </div>

        {/* 受控主机信息 */}
        <div style={{ flex: 1, maxWidth: '45%', textAlign: 'left' }}>
          <div style={{ 
            width: '64px',
            height: '64px',
            background: '#f0f2f5',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            position: 'relative',
            zIndex: 2
          }}>
            <img src={victimIcon} alt="受控主机" style={{ width: '32px', height: '32px' }} />
          </div>
          <div>
            <Space>
              <Typography.Text type="secondary">受控主机：</Typography.Text>
              <Typography.Text copyable style={{ fontSize: '14px' }}>
                {attackerInfo.ip}
              </Typography.Text>
            </Space>
          </div>
        </div>

        {/* 目的IP信息 */}
        <div style={{ flex: 1, maxWidth: '45%', textAlign: 'right' }}>
          <div style={{ 
            width: '64px',
            height: '64px',
            background: '#f0f2f5',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            marginLeft: 'auto',
            position: 'relative',
            zIndex: 2
          }}>
            <img src={attackerIcon} alt="目的IP" style={{ width: '32px', height: '32px' }} />
          </div>
          <div>
            <Space>
              <Typography.Text type="secondary">目的IP：</Typography.Text>
              <Typography.Text copyable style={{ fontSize: '14px' }}>
                {victimInfo.ip}
              </Typography.Text>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalConnectionPathVisual;
