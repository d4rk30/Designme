import React, { useState, useEffect, useRef } from 'react';
import { Typography, Tag } from 'antd';
import styled from '@emotion/styled';

const { Text } = Typography;

const AnimatedDiv = styled.div`
  .content {
    transition: opacity 0.3s ease-in-out;
    opacity: 1;
  }
  
  .content.fade-out {
    opacity: 0;
  }
`;

const TypeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex-shrink: 0;
  
  .type-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 120px;
  }
`;

interface AttackTrendData {
  date: string;
  high: number;
  medium: number;
  low: number;
}

interface IntelTypeData {
  type: string;
  count: number;
  percentage: number;
}

interface CollapsedChartsProps {
  trendData: AttackTrendData[];
  intelTypeData: IntelTypeData[];
}

const CollapsedCharts: React.FC<CollapsedChartsProps> = ({ trendData, intelTypeData }) => {
  const [currentTrendIndex, setCurrentTrendIndex] = useState(0);
  const [currentIntelTypeIndex, setCurrentIntelTypeIndex] = useState(0);
  const [isPausedTrend, setIsPausedTrend] = useState(false);
  const [isPausedIntelType, setIsPausedIntelType] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const trendInterval = useRef<NodeJS.Timeout>();
  const intelTypeInterval = useRef<NodeJS.Timeout>();

  const updateTrendIndex = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentTrendIndex((prev) => (prev + 1) % trendData.length);
      setIsFading(false);
    }, 300);
  };

  const updateIntelTypeIndex = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIntelTypeIndex((prev) => (prev + 1) % Math.ceil(intelTypeData.length / 3));
      setIsFading(false);
    }, 300);
  };

  useEffect(() => {
    if (!isPausedTrend) {
      trendInterval.current = setInterval(updateTrendIndex, 5000);
    }
    return () => clearInterval(trendInterval.current);
  }, [isPausedTrend, trendData.length]);

  useEffect(() => {
    if (!isPausedIntelType) {
      intelTypeInterval.current = setInterval(updateIntelTypeIndex, 5000);
    }
    return () => clearInterval(intelTypeInterval.current);
  }, [isPausedIntelType, intelTypeData.length]);

  return (
    <AnimatedDiv 
      style={{ 
        height: '32px', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 24px',
        background: '#fff',
        overflow: 'hidden'
      }}
    >
      {/* 攻击趋势 */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          marginRight: '24px',
          flexShrink: 0
        }}
        onMouseEnter={() => setIsPausedTrend(true)}
        onMouseLeave={() => setIsPausedTrend(false)}
      >
        <span style={{ fontSize: '14px', color: '#000000', fontWeight: 500 }}>攻击趋势</span>
        <span style={{ fontSize: '12px', color: '#8c8c8c', marginLeft: '4px' }}>（单位：次数）</span>
        <div className={`content ${isFading ? 'fade-out' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>
            {trendData[currentTrendIndex]?.date}
          </span>
          <Tag style={{ 
            marginLeft: '8px', 
            background: 'rgba(255, 77, 79, 0.1)', 
            color: '#ff4d4f',
            border: '1px solid rgba(255, 77, 79, 0.2)'
          }}>
            高危：{trendData[currentTrendIndex]?.high}
          </Tag>
          <Tag style={{ 
            marginLeft: '8px', 
            background: 'rgba(250, 173, 20, 0.1)', 
            color: '#faad14',
            border: '1px solid rgba(250, 173, 20, 0.2)'
          }}>
            中危：{trendData[currentTrendIndex]?.medium}
          </Tag>
          <Tag style={{ 
            marginLeft: '8px', 
            background: 'rgba(82, 196, 26, 0.1)', 
            color: '#52c41a',
            border: '1px solid rgba(82, 196, 26, 0.2)'
          }}>
            低危：{trendData[currentTrendIndex]?.low}
          </Tag>
        </div>
      </div>

      {/* 分隔线 */}
      <div style={{ width: '1px', height: '20px', background: '#f0f0f0', margin: '0 24px', flexShrink: 0 }} />

      {/* 情报类型分布 */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '24px',
          minWidth: 0,
          flex: 1,
          overflow: 'hidden'
        }}
        onMouseEnter={() => setIsPausedIntelType(true)}
        onMouseLeave={() => setIsPausedIntelType(false)}
      >
        <div style={{ flexShrink: 0 }}>
          <span style={{ fontSize: '14px', color: '#000000', fontWeight: 500 }}>情报类型TOP10</span>
          <span style={{ fontSize: '12px', color: '#8c8c8c', marginLeft: '4px' }}>（单位：百分比）</span>
        </div>
        <div className={`content ${isFading ? 'fade-out' : ''}`} style={{ display: 'flex', gap: '32px', minWidth: 0, flex: 1 }}>
          {intelTypeData
            .slice(currentIntelTypeIndex * 3, (currentIntelTypeIndex + 1) * 3)
            .map((item, index) => (
              <TypeItem key={`${item.type}-${currentIntelTypeIndex}-${index}`}>
                <div 
                  style={{ 
                    width: '18px', 
                    height: '18px', 
                    borderRadius: '50%', 
                    background: '#e6f7ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1890ff',
                    fontSize: '12px',
                    flexShrink: 0
                  }}
                >
                  {currentIntelTypeIndex * 3 + index + 1}
                </div>
                <Text className="type-text">{item.type}</Text>
                <Tag style={{ 
                  marginLeft: '4px', 
                  background: 'rgba(24, 144, 255, 0.1)', 
                  color: '#1890ff',
                  border: '1px solid rgba(24, 144, 255, 0.2)',
                  flexShrink: 0
                }}>{item.percentage}%</Tag>
              </TypeItem>
            ))}
        </div>
      </div>
    </AnimatedDiv>
  );
};

export default CollapsedCharts;
