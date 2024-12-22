import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tag, Space } from 'antd';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';


// 修改模拟数据生成函数
const generateMockData = () => ({
  threatOverview: {
    // 攻击监测告警数据
    attack: {
      high: Math.floor(Math.random() * 100),    // 0-99
      medium: Math.floor(Math.random() * 100),  // 0-99
      low: Math.floor(Math.random() * 100),     // 0-99
      mapping: Math.floor(Math.random() * 100), // 0-99
    },
    // 外联检测告警数据
    external: {
      high: Math.floor(Math.random() * 100),    // 0-99
      medium: Math.floor(Math.random() * 100),  // 0-99
      low: Math.floor(Math.random() * 100),     // 0-99
      foreign: Math.floor(Math.random() * 100), // 0-99
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
    },
    foreignExternalTrend: Array(7).fill(0).map(() => Math.floor(Math.random() * 100)), // 新增境外流量趋势数据
    mappingTrend: Array(7).fill(0).map(() => Math.floor(Math.random() * 100)), // 新增反测绘趋势
    foreignTrend: Array(7).fill(0).map(() => Math.floor(Math.random() * 100)), // 新增境外流量总体趋势
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
const getMiniLineChartOption = (data: number[], color: string) => ({
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
      color: color  // 使用传入的颜色
    },
    symbol: 'none',
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
        {
          offset: 0,
          color: 'rgba(255, 255, 255, 0)'  // 完全透明
        },
        {
          offset: 1,
          color: color.replace(')', ', 0.2)')  // 添加 20% 透明度
        }
      ])
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
  const [trendTimeRange, setTrendTimeRange] = useState<'today' | 'week' | 'month'>('today');
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
      data: ['攻击监测', '外联检测', '反测绘', '出境流量'],
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
          width: 2,
          color: '#ff4d4f'
        },
        itemStyle: {
          color: '#ff4d4f',
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
              color: 'rgba(255, 77, 79, 0.25)'
            }, {
              offset: 1,
              color: 'rgba(255, 77, 79, 0.05)'
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
          width: 2,
          color: '#ffa940'
        },
        itemStyle: {
          color: '#ffa940',
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
              color: 'rgba(255, 169, 64, 0.25)'
            }, {
              offset: 1,
              color: 'rgba(255, 169, 64, 0.05)'
            }]
          }
        },
        data: data.threatOverview.externalTrend
      },
      {
        name: '反测绘',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 2,
          color: '#40a9ff'
        },
        itemStyle: {
          color: '#40a9ff',
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
              color: 'rgba(64, 169, 255, 0.25)'
            }, {
              offset: 1,
              color: 'rgba(64, 169, 255, 0.05)'
            }]
          }
        },
        data: data.threatOverview.mappingTrend
      },
      {
        name: '出境流量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 2,
          color: '#722ed1'
        },
        itemStyle: {
          color: '#722ed1',
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
              color: 'rgba(114, 46, 209, 0.25)'
            }, {
              offset: 1,
              color: 'rgba(114, 46, 209, 0.05)'
            }]
          }
        },
        data: data.threatOverview.foreignTrend
      }
    ]
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

            <Row align="middle">
              <Col span={24}>
                <Space split={<div style={{
                  width: '1px',
                  height: '40px',
                  background: '#f0f0f0',
                  margin: '0 16px'
                }} />}>
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
                      option={getMiniLineChartOption(data.threatOverview.attackTrend, colorScheme.danger.main)}
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
                      option={getMiniLineChartOption(data.threatOverview.mediumAttackTrend, colorScheme.warning.main)}
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
                      option={getMiniLineChartOption(data.threatOverview.lowAttackTrend, colorScheme.success.main)}
                      style={{ width: '50px', height: '30px' }}
                    />
                  </Space>

                  {/* 新增反测绘统计 */}
                  <Space align="center" size={8}>
                    <Tag style={{
                      color: '#40a9ff',
                      backgroundColor: 'rgba(64, 169, 255, 0.1)',
                      border: 'none',
                      padding: '4px 8px'
                    }}>
                      反测绘
                    </Tag>
                    <span style={{
                      fontSize: '28px',
                      fontWeight: 600,
                      color: '#40a9ff'
                    }}>
                      {data.threatOverview.attack.mapping}
                    </span>
                    <ReactECharts
                      option={getMiniLineChartOption(data.threatOverview.mappingTrend, '#40a9ff')}
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
            <Row align="middle">
              <Col span={24}>
                <Space split={<div style={{
                  width: '1px',
                  height: '40px',
                  background: '#f0f0f0',
                  margin: '0 16px' // 将分隔线的左右边距从 24px 减小到 16px
                }} />}>
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
                      option={getMiniLineChartOption(data.threatOverview.externalTrend, colorScheme.danger.main)}
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
                      option={getMiniLineChartOption(data.threatOverview.mediumExternalTrend, colorScheme.warning.main)}
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
                      option={getMiniLineChartOption(data.threatOverview.lowExternalTrend, colorScheme.success.main)}
                      style={{ width: '50px', height: '30px' }}
                    />
                  </Space>

                  {/* 新增境外流量统计 */}
                  <Space align="center" size={8}>
                    <Tag style={{
                      color: '#722ed1', // 使用紫色作为境外流量的标识色
                      backgroundColor: 'rgba(114, 46, 209, 0.1)',
                      border: 'none',
                      padding: '4px 8px'
                    }}>
                      出境
                    </Tag>
                    <span style={{
                      fontSize: '28px',
                      fontWeight: 600,
                      color: '#722ed1'
                    }}>
                      {data.threatOverview.external.foreign}
                    </span>
                    <ReactECharts
                      option={getMiniLineChartOption(data.threatOverview.foreignExternalTrend, '#722ed1')}
                      style={{ width: '50px', height: '30px' }}
                    />
                  </Space>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 3. 威胁情报指标 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Card styles={{
            body: {
              padding: '24px',
              height: '240px'  // 统一高度
            }
          }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
              <Col>
                <div style={{
                  fontSize: '16px',
                  color: '#000000d9',
                  fontWeight: 500
                }}>
                  威胁情报命中情况
                </div>
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col span={8}>
                <div style={{
                  padding: '24px',  // 改回与其他卡片一致的内边距
                  borderRadius: '8px',
                  background: '#E6F7FF',
                  height: '140px',  // 改为与其他卡片一致的高度
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
          <Card styles={{
            body: {
              padding: '24px',
              height: '240px'  // 统一高度
            }
          }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
              <Col>
                <div style={{
                  fontSize: '16px',
                  color: '#000000d9',
                  fontWeight: 500
                }}>
                  系统性能监控
                </div>
              </Col>
            </Row>
            <Row
              gutter={[32, 16]}
              justify="space-around"
              align="middle"
              style={{ height: 'calc(100% - 40px)' }}  // 减去标题和边距的高度
            >
              {(['cpu', 'memory', 'disk'] as const).map((type) => (
                <Col span={8} key={type}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      marginBottom: 4,
                      fontSize: '14px',
                      color: '#666'
                    }}>
                      {type === 'cpu' ? 'CPU使用率' : type === 'memory' ? '内存使用率' : '磁盘使用率'}
                    </div>
                    <ReactECharts
                      option={getGaugeOption(data.realtimeMonitoring.systemStatus[type], type)}
                      style={{ height: '110px' }}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 2. 威胁趋势 - 移到最后 */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
              <Col>
                <div style={{
                  fontSize: '16px',
                  color: '#000000d9',
                  fontWeight: 500
                }}>
                  威胁趋势分析
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
                        backgroundColor: trendTimeRange === range ? '#e6f4ff' : 'transparent',
                        color: trendTimeRange === range ? '#1890ff' : '#000000d9',
                        transition: 'all 0.3s',
                        userSelect: 'none',
                        fontWeight: 500
                      }}
                      onClick={() => setTrendTimeRange(range as 'today' | 'week' | 'month')}
                    >
                      {range === 'today' ? '今日' : range === 'week' ? '本周' : '当月'}
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
            <ReactECharts option={threatTrendOption} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
