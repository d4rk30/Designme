import React from 'react';
import ReactECharts from 'echarts-for-react';

export const IntelTypeChart: React.FC = () => {
  // 生成示例数据
  const generateData = () => {
    const types = [
      'IP信誉库', 'Botnet僵尸网络', 'Web攻击', 'APT组织', 'Webshell',
      'RAT木马', '勒索软件', '挖矿木马', '后门程序', '蠕虫病毒'
    ];
    
    return types.map(type => ({
      name: type,
      value: Math.floor(Math.random() * 1000)
    }));
  };

  const data = generateData();
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // 蓝色系渐变色
  const colors = [
    '#1890ff', // header蓝色作为最深色
    '#2E9BFF',
    '#44A6FF',
    '#5AB1FF',
    '#70BCFF',
    '#86C7FF',
    '#9CD2FF',
    '#B2DDFF',
    '#C8E8FF',
    '#DEF3FF'  // 浅蓝
  ];

  const option = {
    color: colors,
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        return `${params.name}: ${params.value} 次 (${params.percent}%)`;
      }
    },
    legend: [
      {
        type: 'scroll',
        orient: 'vertical',
        right: '35%',
        top: 'middle',
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 10,
        data: data.slice(0, 5),
        formatter: (name: string) => {
          const item = data.find(d => d.name === name);
          if (item) {
            const percent = ((item.value / total) * 100).toFixed(1);
            return `${name}  ${percent}%`;
          }
          return name;
        },
        textStyle: {
          fontSize: 12
        }
      },
      {
        type: 'scroll',
        orient: 'vertical',
        right: '10%',
        top: 'middle',
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 10,
        data: data.slice(5, 10),
        formatter: (name: string) => {
          const item = data.find(d => d.name === name);
          if (item) {
            const percent = ((item.value / total) * 100).toFixed(1);
            return `${name}  ${percent}%`;
          }
          return name;
        },
        textStyle: {
          fontSize: 12
        }
      }
    ],
    series: [
      {
        name: '情报类型',
        type: 'pie',
        radius: ['40%', '60%'],
        center: ['20%', '50%'],
        data: data,
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return (
    <>
      <div style={{ marginBottom: '8px', marginLeft: '12px' }}>
        <span style={{ fontWeight: 500 }}>情报类型TOP10</span>
        <span style={{ fontSize: '12px', color: '#8c8c8c', marginLeft: '4px' }}>（单位：次数）</span>
      </div>
      <ReactECharts 
        option={option} 
        style={{ height: '180px', marginLeft: '-30px' }}
        opts={{ renderer: 'svg' }}
      />
    </>
  );
};
