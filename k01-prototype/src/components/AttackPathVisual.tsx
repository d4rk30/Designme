import React from 'react';
import { Space, Typography, Button, Tag, Descriptions } from 'antd';
import { StopOutlined } from '@ant-design/icons';

interface AttackPathVisualProps {
  attackerInfo: {
    ip: string;
    time: string;
    location: string;
  };
  deviceInfo: {
    intelType: string;
    rule: string;
    intelSource: string;
    localCalibration?: {
      status: string;
      result: string;
      time: string;
    };
  };
  victimInfo: {
    ip: string;
    port: string;
    assetGroup: string;
  };
  threatLevel: string;
  action: string;
}

const AttackPathVisual: React.FC<AttackPathVisualProps> = ({
  attackerInfo,
  deviceInfo,
  victimInfo,
  threatLevel,
  action
}) => {
  const getThreatLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      '高': 'red',
      '中': 'orange',
      '低': 'green'
    };
    return colors[level] || 'blue';
  };

  const iconMapping = {
    attacker: '/images/path-point/attack.png',
    device: '/images/path-point/device.png',
    victim: '/images/path-point/victim.png'
  };

  return (
    <div style={{ paddingTop: '10px', position: 'relative', minHeight: '100px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        position: 'relative'
      }}>
        {/* 连线层 */}
        <div style={{
          position: 'absolute',
          left: '0',
          right: '0',
          top: '32px',
          height: '2px',
          zIndex: 1
        }}>
          {/* 第一段连线（蓝色） */}
          <div style={{
            position: 'absolute',
            left: 'calc(16.5% + 32px)',
            width: 'calc(33% - 64px)',
            height: '2px',
            background: '#1890ff'
          }} />
          {/* 威胁等级标签 */}
          <div style={{
            position: 'absolute',
            left: '33%',
            top: '-12px',
            transform: 'translateX(-50%)',
            zIndex: 3
          }}>
            <Tag color={getThreatLevelColor(threatLevel)}>{threatLevel}</Tag>
          </div>

          {/* 第二段连线（红色） */}
          <div style={{
            position: 'absolute',
            left: 'calc(50% + 32px)',
            width: 'calc(33% - 64px)',
            height: '2px',
            background: '#ff4d4f'
          }} />
          {/* 阻断标签 */}
          <div style={{
            position: 'absolute',
            left: '66.5%',
            top: '-12px',
            transform: 'translateX(-50%)',
            zIndex: 3
          }}>
            <Tag color="red">
              <Space>
                <StopOutlined />
                {action}
              </Space>
            </Tag>
          </div>
        </div>

        {/* 攻击者信息 */}
        <div style={{ flex: 1, maxWidth: '33%', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: '#f0f2f5',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            position: 'relative',
            zIndex: 2
          }}>
            <img src={iconMapping.attacker} alt="攻击者" style={{ width: '32px', height: '32px' }} />
          </div>
          <div style={{ padding: '0 20px' }}>
            <Descriptions column={1} size="small" style={{ textAlign: 'left' }}>
              <Descriptions.Item label="攻击IP" style={{ padding: '4px 0' }}>
                <Typography.Text copyable>{attackerInfo.ip}</Typography.Text>
              </Descriptions.Item>
              <Descriptions.Item label="时间" style={{ padding: '4px 0' }}>{attackerInfo.time}</Descriptions.Item>
              <Descriptions.Item label="归属地" style={{ padding: '4px 0' }}>{attackerInfo.location}</Descriptions.Item>
            </Descriptions>
          </div>
        </div>

        {/* 设备信息 */}
        <div style={{ flex: 1, maxWidth: '33%', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: '#f0f2f5',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            position: 'relative',
            zIndex: 2
          }}>
            <img src={iconMapping.device} alt="设备" style={{ width: '32px', height: '32px' }} />
          </div>
          <div style={{ padding: '0 20px' }}>
            <Descriptions column={1} size="small" style={{ textAlign: 'left' }}>
              <Descriptions.Item label="情报类型" style={{ padding: '4px 0' }}>{deviceInfo.intelType}</Descriptions.Item>
              <Descriptions.Item label="命中规则" style={{ padding: '4px 0' }}>{deviceInfo.rule}</Descriptions.Item>
              <Descriptions.Item label="命中情报源" style={{ padding: '4px 0' }}>{deviceInfo.intelSource}</Descriptions.Item>
              {deviceInfo.localCalibration && (
                <>
                  <Descriptions.Item label="二次本地校准状态" style={{ padding: '4px 0' }}>
                    <Tag color={deviceInfo.localCalibration.status === '已完成' ? 'success' : 'processing'}>
                      {deviceInfo.localCalibration.status}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="校准结果" style={{ padding: '4px 0' }}>
                    <Tag color={deviceInfo.localCalibration.result === '确认为威胁' ? 'error' : 'success'}>
                      {deviceInfo.localCalibration.result}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="校准时间" style={{ padding: '4px 0' }}>
                    {deviceInfo.localCalibration.time}
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>
          </div>
        </div>

        {/* 被攻击者信息 */}
        <div style={{ flex: 1, maxWidth: '33%', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: '#f0f2f5',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            position: 'relative',
            zIndex: 2
          }}>
            <img src={iconMapping.victim} alt="被攻击者" style={{ width: '32px', height: '32px' }} />
          </div>
          <div style={{ padding: '0 20px' }}>
            <Descriptions column={1} size="small" style={{ textAlign: 'left' }}>
              <Descriptions.Item label="被攻击IP" style={{ padding: '4px 0' }}>
                <Typography.Text copyable>{victimInfo.ip}</Typography.Text>
              </Descriptions.Item>
              <Descriptions.Item label="被攻击端口" style={{ padding: '4px 0' }}>{victimInfo.port}</Descriptions.Item>
              <Descriptions.Item label="所属资产组" style={{ padding: '4px 0' }}>{victimInfo.assetGroup}</Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttackPathVisual;
