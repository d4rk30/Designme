import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Tag, Space } from 'antd';
import { ThunderboltOutlined, GlobalOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';


// 修改模拟数据生成函数
const generateMockData = () => ({
  threatOverview: {
    // 攻击监测告警数据
    attack: {
      high: Math.floor(Math.random() * 100), // 高危 0-100
      medium: Math.floor(Math.random() * 150), // 中危 0-150
      low: Math.floor(Math.random() * 200), // 低危 0-200
    },
    // 外联检测告警数据
    external: {
      high: Math.floor(Math.random() * 50), // 高危 0-50
      medium: Math.floor(Math.random() * 80), // 中危 0-80
      low: Math.floor(Math.random() * 100), // 低危 0-100
    },
    attackTrend: Array(7).fill(0).map(() => Math.floor(Math.random() * 100)), // 新增攻击趋势
    mediumAttackTrend: Array(7).fill(0).map(() => Math.floor(Math.random() * 100)), // 新增中危攻击趋势
    lowAttackTrend: Array(7).fill(0).map(() => Math.floor(Math.random() * 100)), // 新增低危攻击趋势
    externalTrend: Array(7).fill(0).map(() => Math.floor(Math.random() * 100)), // 新增外联趋势
    mediumExternalTrend: Array(7).fill(0).map(() => Math.floor(Math.random() * 100)), // 新增中危外联趋势
    lowExternalTrend: Array(7).fill(0).map(() => Math.floor(Math.random() * 100)), // 新增低危外联趋势
    weeklyTrend: Array(7).fill(0).map(() => Math.floor(Math.random() * 100)), // 新增外联趋势
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
      { name: '公安一所情报', value: Math.floor(Math.random() * 100) },
      { name: '奇安信威胁情报', value: Math.floor(Math.random() * 100) },
      { name: '腾讯威胁情报', value: Math.floor(Math.random() * 100) },
      { name: '360威胁情报', value: Math.floor(Math.random() * 100) },
      { name: '华为威胁情报', value: Math.floor(Math.random() * 100) },
      { name: '阿里云威胁情报', value: Math.floor(Math.random() * 100) },
      { name: '私有情报', value: Math.floor(Math.random() * 100) }
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

// 统一配色方案
const colorScheme = {
  primary: {
    light: '#e6f4ff',
    main: '#1890ff',
    dark: '#0050b3',
    border: '#91d5ff'
  },
  success: {
    light: '#f6ffed',
    main: '#52c41a',
    dark: '#389e0d',
    border: '#b7eb8f'
  },
  warning: {
    light: '#fff7e6',
    main: '#faad14',
    dark: '#d48806',
    border: '#ffd591'
  },
  danger: {
    light: '#fff1f0',
    main: '#ff4d4f',
    dark: '#cf1322',
    border: '#ffa39e'
  }
};

// 修改图表配色
const getChartColors = () => ({
  series: [colorScheme.primary.main, colorScheme.success.main, colorScheme.warning.main, colorScheme.danger.main],
  background: [colorScheme.primary.light, colorScheme.success.light, colorScheme.warning.light, colorScheme.danger.light]
});

// 修改仪表盘配置
const getGaugeOption = (value: number, type: 'cpu' | 'memory' | 'disk') => {
  const colorMap = {
    cpu: {
      start: '#BAE7FF',  // Daybreak Blue-2
      end: '#1890FF',    // Daybreak Blue-6
      background: '#F0F5FF'  // Daybreak Blue-1
    },
    memory: {
      start: '#FFD6E7',  // Magenta-2
      end: '#EB2F96',    // Magenta-6
      background: '#FFF0F6'  // Magenta-1
    },
    disk: {
      start: '#D3F261',  // Lime-3
      end: '#52C41A',    // Green-6
      background: '#FCFFE6'  // Lime-1
    }
  };

  // 根据数值确定文字颜色
  const getTextColor = (val: number) => {
    if (val >= 90) return '#FF4D4F';  // 红色
    if (val >= 80) return '#FA8C16';  // 橙色
    return '#000000D9';  // 默认黑色
  };

  return {
    series: [{
      type: 'gauge',
      startAngle: 90,
      endAngle: -270,
      min: 0,
      max: 100,
      radius: '80%',
      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        clip: false,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: colorMap[type].start },
              { offset: 1, color: colorMap[type].end }
            ]
          }
        }
      },
      axisLine: {
        lineStyle: {
          width: 12,
          color: [[1, colorMap[type].background]]
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      pointer: {
        show: false
      },
      anchor: {
        show: false
      },
      title: {
        show: false
      },
      detail: {
        valueAnimation: true,
        fontSize: 20,
        offsetCenter: [0, '0%'],
        formatter: '{value}%',
        color: getTextColor(value)  // 使用动态文字颜色
      },
      data: [{
        value: value
      }]
    }]
  };
};

// 定义迷你折线图的配置
const getMiniLineChartOption = (data: number[]) => ({
  xAxis: {
    type: 'category',
    show: false,
    data: Array(data.length).fill('')
  },
  yAxis: {
    type: 'value',
    show: false
  },
  series: [{
    data: data,
    type: 'line',
    smooth: true,
    lineStyle: {
      width: 2,
      color: colorScheme.primary.main
    },
    symbol: 'none',
    areaStyle: {
      color: 'rgba(24, 144, 255, 0.2)'
    }
  }],
  grid: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }
});

const Dashboard: React.FC = () => {
  const [attackTimeRange, setAttackTimeRange] = useState<'today' | 'week' | 'month'>('today');  // 攻击监测的时间范围
  const [externalTimeRange, setExternalTimeRange] = useState<'today' | 'week' | 'month'>('today');  // 外联检测的时间范围
  const [data, setData] = useState(generateMockData());

  useEffect(() => {
    const timer = setInterval(() => {
      setData(generateMockData());
    }, 30000); // 30秒更新一次数据

    return () => clearInterval(timer);
  }, []);

  // 修改威胁趋势图配置
  const threatTrendOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#eee',
      borderWidth: 1,
      textStyle: {
        color: '#666',
        fontSize: 14
      }
    },
    legend: {
      data: ['攻击监测', '外联检测'],
      right: '5%',
      top: 10,
      textStyle: {
        fontSize: 14,
        color: '#666'
      }
    },
    grid: {
      top: '15%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: Array(7).fill(0).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      axisLine: {
        lineStyle: {
          color: '#d9d9d9'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#666666',
        fontSize: 12,
        margin: 12
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: '#eee',
          type: 'dashed'
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    series: [
      {
        name: '攻击监测',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: '#1890ff'
        },
        itemStyle: {
          color: '#1890ff',
          borderWidth: 2,
          borderColor: '#fff'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(24, 144, 255, 0.25)'
            }, {
              offset: 1,
              color: 'rgba(24, 144, 255, 0.05)'
            }]
          }
        },
        data: data.threatOverview.attackTrend
      },
      {
        name: '外联检测',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: '#69c0ff'
        },
        itemStyle: {
          color: '#69c0ff',
          borderWidth: 2,
          borderColor: '#fff'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(105, 192, 255, 0.25)'
            }, {
              offset: 1,
              color: 'rgba(105, 192, 255, 0.05)'
            }]
          }
        },
        data: data.threatOverview.externalTrend
      }
    ]
  };

  // 修改情报源分布图配置
  const intelSourceOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#eee',
      borderWidth: 1,
      textStyle: {
        color: '#666',
        fontSize: 14
      }
    },
    legend: {
      orient: 'vertical',
      right: '20%',
      top: 'middle',
      itemWidth: 15,
      itemHeight: 15,
      textStyle: {
        fontSize: 14,
        color: '#666'
      },
      itemGap: 16,
      formatter: (name: string) => {
        const item = data.threatIntel.sourceDistribution.find(item => item.name === name);
        return `${name}  ${item?.value || 0}`;
      }
    },
    color: [
      new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: '#1890FF' },  // Daybreak Blue-6
        { offset: 1, color: '#69C0FF' }   // Daybreak Blue-4
      ]),
      new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: '#36CFC9' },  // Cyan-6
        { offset: 1, color: '#87E8DE' }   // Cyan-4
      ]),
      new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: '#73D13D' },  // Green-6
        { offset: 1, color: '#95DE64' }   // Green-4
      ]),
      new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: '#597EF7' },  // Geekblue-5
        { offset: 1, color: '#85A5FF' }   // Geekblue-4
      ]),
      new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: '#FFA940' },  // Orange-5
        { offset: 1, color: '#FFC069' }   // Orange-4
      ]),
      new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: '#FF7A45' },  // Volcano-5
        { offset: 1, color: '#FF9C6E' }   // Volcano-4
      ]),
      new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: '#9254DE' },  // Purple-5
        { offset: 1, color: '#B37FEB' }   // Purple-4
      ])
    ],
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['25%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#fff',
        borderWidth: 2,
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.1)'
      },
      label: {
        show: false
      },
      emphasis: {
        scale: true,
        scaleSize: 10,
        itemStyle: {
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.2)'
        }
      },
      data: data.threatIntel.sourceDistribution
        .sort((a, b) => b.value - a.value)
        .map((item, index) => ({
          ...item,
          itemStyle: {
            opacity: 0.9 - (index * 0.05)
          }
        }))
    }]
  };

  return (
    <div>
      {/* 攻击监测告警 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Card styles={{ body: { padding: '24px' } }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
              <Col>
                <div style={{
                  fontSize: '16px',
                  color: '#000000d9',
                  fontWeight: 500
                }}>
                  攻击监测告警
                </div>
              </Col>
              <Col>
                <div style={{
                  display: 'flex',
                  gap: '4px'
                }}>
                  {['today', 'week', 'month'].map((range) => (
                    <div
                      key={range}
                      style={{
                        padding: '4px 12px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        backgroundColor: attackTimeRange === range ? '#e6f4ff' : 'transparent',
                        color: attackTimeRange === range ? '#1890ff' : '#000000d9',
                        transition: 'all 0.3s',
                        userSelect: 'none',
                        fontWeight: 500
                      }}
                      onClick={() => setAttackTimeRange(range as 'today' | 'week' | 'month')}
                    >
                      {range === 'today' ? '今日' : range === 'week' ? '本周' : '当月'}
                    </div>
                  ))}
                </div>
              </Col>
            </Row>

            <Row align="middle" justify="space-between">
              {/* 左侧总数 */}
              <Col>
                <Space align="center" size={8}>
                  <ThunderboltOutlined style={{
                    color: colorScheme.primary.main,
                    fontSize: '30px'
                  }} />
                  <span style={{
                    fontSize: '30px',
                    fontWeight: 600,
                    color: '#000000d9',
                  }}>
                    {data.threatOverview.attack.high + data.threatOverview.attack.medium + data.threatOverview.attack.low}
                  </span>
                </Space>
              </Col>

              {/* 右侧统计 */}
              <Col>
                <Space split={<div style={{ width: '1px', height: '40px', background: '#f0f0f0', margin: '0 24px' }} />}>
                  {/* 高危 */}
                  <Space align="center" size={8}>
                    <Tag style={{
                      color: colorScheme.danger.main,
                      backgroundColor: 'rgba(255, 77, 79, 0.1)',
                      border: 'none',
                      padding: '4px 8px'
                    }}>
                      高危
                    </Tag>
                    <span style={{
                      fontSize: '28px',
                      fontWeight: 600,
                      color: colorScheme.danger.main
                    }}>
                      {data.threatOverview.attack.high}
                    </span>
                    <ReactECharts
                      option={getMiniLineChartOption(data.threatOverview.attackTrend)}
                      style={{ width: '50px', height: '30px' }}
                    />
                  </Space>

                  {/* 中危 */}
                  <Space align="center" size={8}>
                    <Tag style={{
                      color: colorScheme.warning.main,
                      backgroundColor: 'rgba(250, 173, 20, 0.1)',
                      border: 'none',
                      padding: '4px 8px'
                    }}>
                      中危
                    </Tag>
                    <span style={{
                      fontSize: '28px',
                      fontWeight: 600,
                      color: colorScheme.warning.main
                    }}>
                      {data.threatOverview.attack.medium}
                    </span>
                    <ReactECharts
                      option={getMiniLineChartOption(data.threatOverview.mediumAttackTrend)}
                      style={{ width: '50px', height: '30px' }}
                    />
                  </Space>

                  {/* 低危 */}
                  <Space align="center" size={8}>
                    <Tag style={{
                      color: colorScheme.success.main,
                      backgroundColor: 'rgba(82, 196, 26, 0.1)',
                      border: 'none',
                      padding: '4px 8px'
                    }}>
                      低危
                    </Tag>
                    <span style={{
                      fontSize: '28px',
                      fontWeight: 600,
                      color: colorScheme.success.main
                    }}>
                      {data.threatOverview.attack.low}
                    </span>
                    <ReactECharts
                      option={getMiniLineChartOption(data.threatOverview.lowAttackTrend)}
                      style={{ width: '50px', height: '30px' }}
                    />
                  </Space>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={12}>
          <Card styles={{ body: { padding: '24px' } }}>
            {/* 标题和时间选择器行 */}
            <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
              <Col>
                <div style={{
                  fontSize: '16px',
                  color: '#000000d9',
                  fontWeight: 500
                }}>
                  外联检测告警
                </div>
              </Col>
              <Col>
                <div style={{
                  display: 'flex',
                  gap: '4px'
                }}>
                  {['today', 'week', 'month'].map((range) => (
                    <div
                      key={range}
                      style={{
                        padding: '4px 12px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        backgroundColor: externalTimeRange === range ? '#e6f4ff' : 'transparent',
                        color: externalTimeRange === range ? '#1890ff' : '#000000d9',
                        transition: 'all 0.3s',
                        userSelect: 'none',
                        fontWeight: 500
                      }}
                      onClick={() => setExternalTimeRange(range as 'today' | 'week' | 'month')}
                    >
                      {range === 'today' ? '今日' : range === 'week' ? '本周' : '当月'}
                    </div>
                  ))}
                </div>
              </Col>
            </Row>

            {/* 数据展示行 */}
            <Row align="middle" justify="space-between">
              {/* 左侧总数 */}
              <Col>
                <Space align="center" size={8}>
                  <GlobalOutlined style={{
                    color: colorScheme.primary.main,
                    fontSize: '30px'
                  }} />
                  <span style={{
                    fontSize: '30px',
                    fontWeight: 600,
                    color: '#000000d9',
                  }}>
                    {data.threatOverview.external.high + data.threatOverview.external.medium + data.threatOverview.external.low}
                  </span>
                </Space>
              </Col>

              {/* 右侧统计 */}
              <Col>
                <Space split={<div style={{ width: '1px', height: '40px', background: '#f0f0f0', margin: '0 24px' }} />}>
                  {/* 高危 */}
                  <Space align="center" size={8}>
                    <Tag style={{
                      color: colorScheme.danger.main,
                      backgroundColor: 'rgba(255, 77, 79, 0.1)',
                      border: 'none',
                      padding: '4px 8px'
                    }}>
                      高危
                    </Tag>
                    <span style={{
                      fontSize: '28px',
                      fontWeight: 600,
                      color: colorScheme.danger.main
                    }}>
                      {data.threatOverview.external.high}
                    </span>
                    <ReactECharts
                      option={getMiniLineChartOption(data.threatOverview.externalTrend)}
                      style={{ width: '50px', height: '30px' }}
                    />
                  </Space>

                  {/* 中危 */}
                  <Space align="center" size={8}>
                    <Tag style={{
                      color: colorScheme.warning.main,
                      backgroundColor: 'rgba(250, 173, 20, 0.1)',
                      border: 'none',
                      padding: '4px 8px'
                    }}>
                      中危
                    </Tag>
                    <span style={{
                      fontSize: '28px',
                      fontWeight: 600,
                      color: colorScheme.warning.main
                    }}>
                      {data.threatOverview.external.medium}
                    </span>
                    <ReactECharts
                      option={getMiniLineChartOption(data.threatOverview.mediumExternalTrend)}
                      style={{ width: '50px', height: '30px' }}
                    />
                  </Space>

                  {/* 低危 */}
                  <Space align="center" size={8}>
                    <Tag style={{
                      color: colorScheme.success.main,
                      backgroundColor: 'rgba(82, 196, 26, 0.1)',
                      border: 'none',
                      padding: '4px 8px'
                    }}>
                      低危
                    </Tag>
                    <span style={{
                      fontSize: '28px',
                      fontWeight: 600,
                      color: colorScheme.success.main
                    }}>
                      {data.threatOverview.external.low}
                    </span>
                    <ReactECharts
                      option={getMiniLineChartOption(data.threatOverview.lowExternalTrend)}
                      style={{ width: '50px', height: '30px' }}
                    />
                  </Space>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 2. 威胁趋势和资产状态 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Card title="威胁趋势分析">
            <ReactECharts option={threatTrendOption} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="命中情报源分布">
            <ReactECharts option={intelSourceOption} />
          </Card>
        </Col>
      </Row>

      {/* 3. 威胁情报指标 */}
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card title="威胁情报命中情况" style={{ height: '240px' }}>
            <Row gutter={[24, 24]}>
              <Col span={8}>
                <div style={{
                  padding: '24px',
                  borderRadius: '8px',
                  background: '#E6F7FF',
                  height: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ marginBottom: '4px' }}>
                    <div style={{
                      fontSize: '14px',
                      color: '#8c8c8c',
                      marginBottom: '4px'
                    }}>恶意IP</div>
                    <div style={{
                      fontSize: '30px',
                      fontWeight: 600,
                      color: '#1890ff'
                    }}>{data.threatIntel.activeIndicators.ip}</div>
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#1890ff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    较昨日 +{Math.floor(Math.random() * 100)}
                  </div>
                </div>
              </Col>

              <Col span={8}>
                <div style={{
                  padding: '24px',
                  borderRadius: '8px',
                  background: '#FFF7E6',
                  height: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ marginBottom: '4px' }}>
                    <div style={{
                      fontSize: '14px',
                      color: '#8c8c8c',
                      marginBottom: '4px'
                    }}>恶意域名</div>
                    <div style={{
                      fontSize: '30px',
                      fontWeight: 600,
                      color: '#fa8c16'
                    }}>{data.threatIntel.activeIndicators.domain}</div>
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#fa8c16',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    较昨日 +{Math.floor(Math.random() * 50)}
                  </div>
                </div>
              </Col>

              <Col span={8}>
                <div style={{
                  padding: '24px',
                  borderRadius: '8px',
                  background: '#F6FFED',
                  height: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ marginBottom: '4px' }}>
                    <div style={{
                      fontSize: '14px',
                      color: '#8c8c8c',
                      marginBottom: '4px'
                    }}>恶意URL</div>
                    <div style={{
                      fontSize: '30px',
                      fontWeight: 600,
                      color: '#52c41a'
                    }}>{data.threatIntel.activeIndicators.url}</div>
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#52c41a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    较昨日 +{Math.floor(Math.random() * 30)}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="系统性能监控" style={{ height: '240px' }}>
            <Row gutter={[32, 16]} justify="space-around" align="middle">
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    marginBottom: 8,
                    fontSize: '14px',
                    color: '#666'
                  }}>CPU使用率</div>
                  <ReactECharts
                    option={getGaugeOption(data.realtimeMonitoring.systemStatus.cpu, 'cpu')}
                    style={{ height: '120px' }}
                  />
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    marginBottom: 8,
                    fontSize: '14px',
                    color: '#666'
                  }}>内存使用率</div>
                  <ReactECharts
                    option={getGaugeOption(data.realtimeMonitoring.systemStatus.memory, 'memory')}
                    style={{ height: '120px' }}
                  />
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    marginBottom: 8,
                    fontSize: '14px',
                    color: '#666'
                  }}>磁盘使用率</div>
                  <ReactECharts
                    option={getGaugeOption(data.realtimeMonitoring.systemStatus.disk, 'disk')}
                    style={{ height: '120px' }}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
