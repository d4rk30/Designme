import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tag, Space } from 'antd';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { AlertOutlined, SafetyCertificateOutlined, EyeOutlined } from '@ant-design/icons';


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
  },
  attackStats: {
    total: 2469134,      // 正向攻击总数
    blocked: 1234567,     // 阻断次数
    monitored: 1234567,   // 监控次数
  },
  externalStats: {
    total: 1234567,      // 外联行为总数
    blocked: 567890,      // 阻断次数
    monitored: 666777,    // 监控次数
  },
  attackView: {
    // 攻击IP TOP10
    topAttackIPs: Array(10).fill(0).map((_, i) => ({
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      count: Math.floor(Math.random() * 10000)
    })).sort((a, b) => b.count - a.count),

    // 攻击地区 TOP10
    topAttackRegions: Array(10).fill(0).map((_, i) => ({
      region: ['北京', '上海', '广东', '浙江', '江苏', '四川', '湖北', '福建', '山东', '河南'][i],
      count: Math.floor(Math.random() * 8000)
    })).sort((a, b) => b.count - a.count),

    // 被攻击IP TOP10
    topTargetIPs: Array(10).fill(0).map((_, i) => ({
      ip: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      count: Math.floor(Math.random() * 5000)
    })).sort((a, b) => b.count - a.count),

    // 高危端口分布
    portDistribution: [
      { name: '80', value: 2341 },
      { name: '443', value: 1893 },
      { name: '22', value: 1562 },
      { name: '3389', value: 1231 },
      { name: '8080', value: 987 }
    ],

    // 攻击类型分布
    attackTypes: [
      { name: 'SQL注入', value: 3245 },
      { name: 'XSS攻击', value: 2876 },
      { name: '暴力破解', value: 2564 },
      { name: '命令注入', value: 1987 },
      { name: '文件包含', value: 1654 }
    ]
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

// 修改柱状图配置函数
const getBarChartOption = (data: any[], xField: string, yField: string, color: string) => {
  // 先排序
  const sortedData = [...data].sort((a, b) => b[xField] - a[xField]);
  // 再反转数组，因为y轴是从下到上的
  const reversedData = [...sortedData].reverse();

  return {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'category',
      data: reversedData.map(item => item[yField]),
      axisLine: { lineStyle: { color: '#f0f0f0' } },
      axisTick: { show: false },
      axisLabel: {
        color: '#8c8c8c',
        fontSize: 12
      }
    },
    series: [{
      type: 'bar',
      data: reversedData.map(item => item[xField]),
      barWidth: '60%',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: color },
          { offset: 1, color: color.replace(')', ', 0.6)').replace('rgb', 'rgba') }
        ]),
        borderRadius: [0, 4, 4, 0]
      }
    }]
  };
};

// 添加饼图配置函数
const getPieChartOption = (data: any[], colorRange: [string, string]) => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    right: '5%',
    top: 'center',
    itemWidth: 8,
    itemHeight: 8,
    icon: 'circle',
    formatter: (name: string) => {
      const item = data.find(d => d.name === name);
      return `${name} ${item?.value}`;
    },
    textStyle: {
      fontSize: 12,
      color: '#8c8c8c'
    }
  },
  series: [{
    type: 'pie',
    radius: ['50%', '70%'],
    center: ['30%', '50%'],
    avoidLabelOverlap: false,
    itemStyle: {
      borderRadius: 4,
      borderColor: '#fff',
      borderWidth: 2
    },
    label: { show: false },
    emphasis: {
      label: { show: false },
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.2)'
      }
    },
    data: data.map((item, index) => ({
      ...item,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: colorRange[0] },
          { offset: 1, color: colorRange[1] }
        ])
      }
    }))
  }]
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
      {/* 第一行 - 布局比例 3:7:7:7 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {/* 安全态势总览 */}
        <Col span={4}>  {/* 3/24 = 3 */}
          <Card styles={{ body: { padding: '24px' } }}>
            <div style={{
              fontSize: '16px',
              color: '#000000d9',
              fontWeight: 500,
              marginBottom: '48px'  // 增加标题下方间距
            }}>
              安全态势总览
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              height: '100%'  // 让内容区域填充剩余空间
            }}>
              {/* 左侧运行天数 */}
              <div>
                <div style={{
                  fontSize: '14px',
                  color: '#8c8c8c',
                  marginBottom: '12px'  // 调整间距
                }}>
                  已安全运行
                </div>
                <div style={{
                  fontSize: '30px',  // 增大字号
                  fontWeight: 600,
                  color: '#000000d9'
                }}>
                  143天
                </div>
              </div>

              {/* 右侧图片 */}
              <div>
                <img
                  src="/images/logos/dash.png"
                  alt="安全态势图标"
                  style={{
                    width: '80px',  // 调整回更大的尺寸
                    height: 'auto',
                    display: 'block'
                  }}
                />
              </div>
            </div>
          </Card>
        </Col>

        {/* 攻击态势 */}
        <Col span={7}>  {/* 7/24 = 7 */}
          <Card styles={{ body: { padding: '24px' } }}>
            <div style={{
              fontSize: '16px',
              color: '#000000d9',
              fontWeight: 500,
              marginBottom: '24px'
            }}>
              攻击态势
            </div>
            <Row gutter={[16, 16]}>
              {/* 正向攻击 - 独占一行 */}
              <Col span={24}>
                <div style={{
                  background: '#fafafa',
                  borderRadius: '8px',
                  padding: '16px',
                  height: '100%'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      backgroundColor: 'rgba(24, 144, 255, 0.1)',
                      padding: '8px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <AlertOutlined style={{
                        fontSize: '16px',
                        color: '#1890ff'
                      }} />
                    </div>
                    <span style={{ fontSize: '14px', color: '#8c8c8c' }}>
                      正向攻击
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: 600,
                      color: '#000000d9'
                    }}>
                      {data.attackStats.total.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '14px', color: '#8c8c8c' }}>次</span>
                  </div>
                </div>
              </Col>

              {/* 阻断次数和监控次数 - 左右分布 */}
              <Col span={12}>
                <div style={{
                  background: '#fafafa',
                  borderRadius: '8px',
                  padding: '16px',
                  height: '100%'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      backgroundColor: 'rgba(24, 144, 255, 0.1)',
                      padding: '8px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <SafetyCertificateOutlined style={{
                        fontSize: '16px',
                        color: '#1890ff'
                      }} />
                    </div>
                    <span style={{ fontSize: '14px', color: '#8c8c8c' }}>
                      阻断次数
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: 600,
                      color: '#000000d9'
                    }}>
                      {data.attackStats.blocked.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '14px', color: '#8c8c8c' }}>次</span>
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <div style={{
                  background: '#fafafa',
                  borderRadius: '8px',
                  padding: '16px',
                  height: '100%'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      backgroundColor: 'rgba(24, 144, 255, 0.1)',
                      padding: '8px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <EyeOutlined style={{
                        fontSize: '16px',
                        color: '#1890ff'
                      }} />
                    </div>
                    <span style={{ fontSize: '14px', color: '#8c8c8c' }}>
                      监控次数
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: 600,
                      color: '#000000d9'
                    }}>
                      {data.attackStats.monitored.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '14px', color: '#8c8c8c' }}>次</span>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 外联态势 */}
        <Col span={7}>  {/* 7/24 = 7 */}
          <Card styles={{ body: { padding: '24px' } }}>
            <div style={{
              fontSize: '16px',
              color: '#000000d9',
              fontWeight: 500,
              marginBottom: '16px'
            }}>
              外联态势
            </div>

            {/* 内容区域 - 三个指标并排显示 */}
            <Row gutter={[16, 16]} align="middle">
              <Col span={8}>
                <div style={{
                  background: '#fafafa',
                  borderRadius: '8px',
                  padding: '16px',
                  height: '100%'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      backgroundColor: 'rgba(24, 144, 255, 0.1)',
                      padding: '8px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <AlertOutlined style={{
                        fontSize: '16px',
                        color: '#1890ff'
                      }} />
                    </div>
                    <span style={{ fontSize: '14px', color: '#8c8c8c' }}>
                      外联次数
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: 600,
                      color: '#000000d9'
                    }}>
                      {data.externalStats.total.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '14px', color: '#8c8c8c' }}>次</span>
                  </div>
                </div>
              </Col>

              <Col span={8}>
                <div style={{
                  background: '#fafafa',
                  borderRadius: '8px',
                  padding: '16px',
                  height: '100%'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      backgroundColor: 'rgba(24, 144, 255, 0.1)',
                      padding: '8px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <SafetyCertificateOutlined style={{
                        fontSize: '16px',
                        color: '#1890ff'
                      }} />
                    </div>
                    <span style={{ fontSize: '14px', color: '#8c8c8c' }}>
                      阻断次数
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: 600,
                      color: '#000000d9'
                    }}>
                      {data.externalStats.blocked.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '14px', color: '#8c8c8c' }}>次</span>
                  </div>
                </div>
              </Col>

              <Col span={8}>
                <div style={{
                  background: '#fafafa',
                  borderRadius: '8px',
                  padding: '16px',
                  height: '100%'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      backgroundColor: 'rgba(24, 144, 255, 0.1)',
                      padding: '8px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <EyeOutlined style={{
                        fontSize: '16px',
                        color: '#1890ff'
                      }} />
                    </div>
                    <span style={{ fontSize: '14px', color: '#8c8c8c' }}>
                      监控次数
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: 600,
                      color: '#000000d9'
                    }}>
                      {data.externalStats.monitored.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '14px', color: '#8c8c8c' }}>次</span>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 安全数据 */}
        <Col span={6}>  {/* 7/24 = 7 */}
          <Card styles={{ body: { padding: '24px' } }}>
            <div style={{
              fontSize: '16px',
              color: '#000000d9',
              fontWeight: 500,
              marginBottom: '24px'
            }}>
              安全数据
            </div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div style={{
                  background: '#fafafa',
                  borderRadius: '8px',
                  padding: '16px',
                  height: '100%'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      backgroundColor: 'rgba(24, 144, 255, 0.1)',
                      padding: '8px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <AlertOutlined style={{
                        fontSize: '16px',
                        color: '#1890ff'
                      }} />
                    </div>
                    <span style={{ fontSize: '14px', color: '#8c8c8c' }}>
                      资产总数
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: 600,
                      color: '#000000d9'
                    }}>
                      {data.assetStatus.total.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '14px', color: '#8c8c8c' }}>个</span>
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <div style={{
                  background: '#fafafa',
                  borderRadius: '8px',
                  padding: '16px',
                  height: '100%'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      backgroundColor: 'rgba(24, 144, 255, 0.1)',
                      padding: '8px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <SafetyCertificateOutlined style={{
                        fontSize: '16px',
                        color: '#1890ff'
                      }} />
                    </div>
                    <span style={{ fontSize: '14px', color: '#8c8c8c' }}>
                      情报总数
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: 600,
                      color: '#000000d9'
                    }}>
                      {(data.threatIntel.activeIndicators.ip +
                        data.threatIntel.activeIndicators.domain +
                        data.threatIntel.activeIndicators.url +
                        data.threatIntel.activeIndicators.hash).toLocaleString()}
                    </span>
                    <span style={{ fontSize: '14px', color: '#8c8c8c' }}>条</span>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 第二行 - 外部威胁数据统计 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {/* 外部威胁数据统计 - 占据左半部分 */}
        <Col span={12}>
          <Card styles={{ body: { padding: '24px' } }}>
            <div style={{
              fontSize: '16px',
              color: '#000000d9',
              fontWeight: 500,
              marginBottom: '24px'
            }}>
              外部威胁数据统计
            </div>
            <Row gutter={[24, 24]}>
              {/* 攻击IP TOP10 */}
              <Col span={8}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: '#8c8c8c',
                    marginBottom: '16px'
                  }}>
                    攻击IP TOP10
                  </div>
                  <div style={{ height: '300px' }}>
                    <ReactECharts
                      option={getBarChartOption(
                        data.attackView.topAttackIPs,
                        'count',
                        'ip',
                        'rgb(24, 144, 255)'
                      )}
                      style={{ height: '100%' }}
                    />
                  </div>
                </div>
              </Col>

              {/* 攻击地区 TOP10 */}
              <Col span={8}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: '#8c8c8c',
                    marginBottom: '16px'
                  }}>
                    攻击地区 TOP10
                  </div>
                  <div style={{ height: '300px' }}>
                    <ReactECharts
                      option={getBarChartOption(
                        data.attackView.topAttackRegions,
                        'count',
                        'region',
                        'rgb(250, 84, 28)'
                      )}
                      style={{ height: '100%' }}
                    />
                  </div>
                </div>
              </Col>

              {/* 被攻击IP TOP10 */}
              <Col span={8}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: '#8c8c8c',
                    marginBottom: '16px'
                  }}>
                    被攻击IP TOP10
                  </div>
                  <div style={{ height: '300px' }}>
                    <ReactECharts
                      option={getBarChartOption(
                        data.attackView.topTargetIPs,
                        'count',
                        'ip',
                        'rgb(47, 84, 235)'
                      )}
                      style={{ height: '100%' }}
                    />
                  </div>
                </div>
              </Col>

              {/* 高危端口分布 */}
              <Col span={12}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: '#8c8c8c',
                    marginBottom: '16px'
                  }}>
                    高危端口分布
                  </div>
                  <div style={{ height: '300px' }}>
                    <ReactECharts
                      option={getPieChartOption(
                        data.attackView.portDistribution,
                        ['#ffd666', '#ffa39e']
                      )}
                      style={{ height: '100%' }}
                    />
                  </div>
                </div>
              </Col>

              {/* 攻击类型分布 */}
              <Col span={12}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: '#8c8c8c',
                    marginBottom: '16px'
                  }}>
                    攻击类型分布
                  </div>
                  <div style={{ height: '300px' }}>
                    <ReactECharts
                      option={getPieChartOption(
                        data.attackView.attackTypes,
                        ['#95de64', '#5cdbd3']
                      )}
                      style={{ height: '100%' }}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 右半部分可以放置新的卡片 */}
        <Col span={12}>
          {/* 这里可以添加新的内容 */}
        </Col>
      </Row>

      {/* 第三行 - 威胁情报指标 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          {/* 威胁情报命中情况卡片 */}
          <Card styles={{
            body: {
              padding: '24px',
              height: '240px'
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

          {/* 情报厂商排行 */}
          <Card
            styles={{
              body: {
                padding: '24px',
                height: '240px'
              }
            }}
            style={{ marginTop: '24px' }}
          >
            <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
              <Col>
                <div style={{
                  fontSize: '16px',
                  color: '#000000d9',
                  fontWeight: 500
                }}>
                  情报厂商排行
                </div>
              </Col>
            </Row>
            <ReactECharts
              option={{
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'shadow'
                  }
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  top: '3%',
                  containLabel: true
                },
                xAxis: {
                  type: 'value',
                  axisLine: { show: false },
                  axisTick: { show: false },
                  splitLine: {
                    lineStyle: {
                      type: 'dashed'
                    }
                  }
                },
                yAxis: {
                  type: 'category',
                  data: data.threatIntel.sourceDistribution
                    .sort((a, b) => b.value - a.value)
                    .map(item => item.name),
                  axisLine: { lineStyle: { color: '#f0f0f0' } },
                  axisTick: { show: false }
                },
                series: [{
                  type: 'bar',
                  data: data.threatIntel.sourceDistribution
                    .sort((a, b) => b.value - a.value)
                    .map(item => ({
                      value: item.value,
                      itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                          { offset: 0, color: '#1890ff' },
                          { offset: 1, color: 'rgba(24, 144, 255, 0.6)' }
                        ])
                      }
                    })),
                  barWidth: '60%',
                  label: {
                    show: true,
                    position: 'right',
                    color: '#666'
                  }
                }]
              }}
              style={{ height: 'calc(100% - 40px)' }}
            />
          </Card>
        </Col>

        <Col span={12}>
          {/* 系统性能监控 */}
          <Card styles={{
            body: {
              padding: '24px',
              height: '240px'
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
              style={{ height: 'calc(100% - 40px)' }}
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

      {/* 最后一行 - 威胁趋势和境外流量走势 */}
      <Row gutter={[24, 24]}>
        {/* 威胁趋势分析 */}
        <Col span={12}>
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

        {/* 境外流量走势 */}
        <Col span={12}>
          <Card>
            <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
              <Col>
                <div style={{
                  fontSize: '16px',
                  color: '#000000d9',
                  fontWeight: 500
                }}>
                  境外流量走势
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
            <ReactECharts
              option={{
                ...threatTrendOption,
                legend: {
                  data: ['出境流量'],
                  right: '5%',
                  top: 10,
                  textStyle: {
                    fontSize: 14,
                    color: '#666'
                  }
                },
                series: [{
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
                }]
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
