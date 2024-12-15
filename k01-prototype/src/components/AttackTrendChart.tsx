import React from 'react';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

// 生成过去一周的日期和数据
const generateData = () => {
  const dates = [];
  const highRiskData = [];
  const mediumRiskData = [];
  const lowRiskData = [];

  for (let i = 6; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day').format('MM-DD');
    dates.push(date);
    
    // 高危数据：2000-4800 的范围，有20%的概率生成4800-5000的数据
    const highRisk = Math.random() < 0.2 
      ? Math.floor(Math.random() * 200 + 4800)  // 4800-5000
      : Math.floor(Math.random() * 2800 + 2000); // 2000-4800
    
    // 中危数据：1500-3500
    const mediumRisk = Math.floor(Math.random() * 2000 + 1500);
    
    // 低危数据：500-2500
    const lowRisk = Math.floor(Math.random() * 2000 + 500);

    highRiskData.push(highRisk);
    mediumRiskData.push(mediumRisk);
    lowRiskData.push(lowRisk);
  }

  return {
    dates,
    highRiskData,
    mediumRiskData,
    lowRiskData,
  };
};

export const AttackTrendChart: React.FC = () => {
  const { dates, highRiskData, mediumRiskData, lowRiskData } = generateData();

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['高危', '中危', '低危'],
      top: 0,
      left: 'center',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '40px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates,
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 5000,
      interval: 1000,
    },
    series: [
      {
        name: '高危',
        type: 'bar',
        data: highRiskData,
        itemStyle: {
          color: '#ff4d4f',
          borderRadius: [4, 4, 0, 0]
        }
      },
      {
        name: '中危',
        type: 'bar',
        data: mediumRiskData,
        itemStyle: {
          color: '#faad14',
          borderRadius: [4, 4, 0, 0]
        }
      },
      {
        name: '低危',
        type: 'bar',
        data: lowRiskData,
        itemStyle: {
          color: '#1890ff',
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  };

  return (
    <>
      <div style={{ marginBottom: '8px', marginLeft: '12px' }}>
        <span style={{ fontWeight: 500 }}>攻击趋势</span>
        <span style={{ fontSize: '12px', color: '#8c8c8c', marginLeft: '4px' }}>（单位：次数）</span>
      </div>
      <ReactECharts 
        option={option} 
        style={{ height: '180px' }}
        opts={{ renderer: 'svg' }}
      />
    </>
  );
};
