// 1. 引入
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Table, Button, Space, Input, Form, Select, Row, Col, Cascader, Modal, message, Typography, Tag } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import AttackLogDetail from '../components/AttackLogDetail';
import IpFavorites from '../components/IpFavorites';

// 2. 类型定义
// 定义筛选条件的类型
interface FilterValues {
  intelType?: string;  // 情报类型
  intelSource?: string; // 情报源
  action?: string;      // 处理动作
  attackIp?: string;    // 攻击IP
  targetIp?: string;    // 被攻击IP
  location?: string[];   // 归属地
}

// 定义保存的筛选条件的类型
interface SavedFilter {
  id: string;           // 筛选条件的唯一标识符
  name: string;         // 筛选条件的名称
  conditions: FilterValues; // 筛选条件的具体内容
  createTime: string;   // 创建时间
}

// 攻击趋势数据结构定义
interface AttackTrendData {
  date: string;      // 日期，例如: "2024年8月7日"
  high: number;      // 高危攻击数量
  medium: number;    // 中危攻击数量
  low: number;       // 低危攻击数量
}

// 情报类型数据结构定义
interface IntelTypeData {
  type: string;      // 情报类型名称
  count: number;     // 该类型的数量
  percentage: number; // 该类型占总数的百分比
}

// 定义攻击日志数据的接口
interface AttackLog {
  key: string;
  time: string;
  attackIp: string;
  location: string;
  targetIp: string;
  targetPort: string;
  intelType: string;
  threatLevel: string;
  action: string;
  intelSource: string;
  lastAttackUnit: string;
  rule: string;
  assetGroup: string;
  requestInfo: {
    protocol: string;
    url: string;
    dnsName: string;
    headers: {
      'User-Agent': string;
      'Accept': string;
      'Content-Type': string;
      'X-Forwarded-For': string;
      'Host': string;
      'Connection': string;
      'Accept-Encoding': string;
      'Accept-Language': string;
    };
    body: {
      payload: string;
      size: string;
      type: string;
      timestamp: string;
    };
  };
  responseInfo: {
    headers: {
      'Content-Type': string;
      'Server': string;
      'Date': string;
      'Content-Length': string;
    };
    statusCode: number;
    body: {
      status: number;
      message: string;
      data: string;
    };
  };
  localVerification: {
    ruleName: string;
    protocolNumber: string;
    protocolType: string;
    attackType: string;
    malformedPacketLength: number;
    attackFeatures: string;
  };
}

// 4. Mock数据和常量
const MOCK_DATA_CONFIG = {
  locations: ['北京', '上海', '广州', '深圳', '杭州', '美国', '俄罗斯', '日本', '德国', '法国'],
  intelTypes: ['僵尸网络', '恶意软件', 'DDoS攻击', '漏洞利用', '暴力破解', '钓鱼攻击'],
  threatLevels: ['高危', '中危', '低危'],
  actions: ['阻断', '监控'],
  intelSources: ['公有情报源', '私有情报源', '第三方情报源', '自建情报源'],
  assetGroups: ['核心资产', '测试资产', '开发资产', '生产资产'],
};

const generateMockData = (): AttackLog[] => {
  // 从给定数组中随机选择一个元素
  const getRandomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
  // 生成一个在指定范围内的随机整数
  const getRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  // 生成一个随机的IP地址，格式为 "x.x.x.x"
  const getRandomIp = () => Array.from({ length: 4 }, () => getRandomNumber(0, 255)).join('.');

  return Array.from({ length: 100 }, (_, index) => ({
    key: String(index + 1),
    time: dayjs().subtract(getRandomNumber(0, 24), 'hour').format('YYYY-MM-DD HH:mm:ss'),
    attackIp: getRandomIp(),
    location: getRandomItem(MOCK_DATA_CONFIG.locations),
    targetIp: `192.168.${getRandomNumber(0, 255)}.${getRandomNumber(0, 255)}`,
    targetPort: String(getRandomNumber(0, 65535)),
    intelType: getRandomItem(MOCK_DATA_CONFIG.intelTypes),
    threatLevel: getRandomItem(MOCK_DATA_CONFIG.threatLevels),
    action: getRandomItem(MOCK_DATA_CONFIG.actions),
    intelSource: getRandomItem(MOCK_DATA_CONFIG.intelSources),
    lastAttackUnit: getRandomNumber(0, 1) ? `${getRandomNumber(1, 24)}小时前` : `${getRandomNumber(1, 60)}分钟前`,
    rule: `Rule-${getRandomNumber(1, 1000)}`,
    assetGroup: getRandomItem(MOCK_DATA_CONFIG.assetGroups),
    requestInfo: {
      protocol: ['http', 'https', 'dns', 'ftp', 'smtp'][Math.floor(Math.random() * 5)],
      url: `example.com/api/endpoint/${Math.floor(Math.random() * 1000)}`,
      dnsName: `subdomain${Math.floor(Math.random() * 100)}.example.com`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Forwarded-For': `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
        'Host': 'example.com',
        'Connection': 'keep-alive',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      body: {
        payload: 'Base64编码的请求内容...',
        size: Math.floor(Math.random() * 1000) + 'bytes',
        type: ['SQL注入', 'XSS攻击', '命令注入', 'WebShell'][Math.floor(Math.random() * 4)],
        timestamp: new Date().toISOString()
      }
    },
    responseInfo: {
      headers: {
        'Content-Type': 'application/json',
        'Server': 'nginx/1.18.0',
        'Date': new Date().toUTCString(),
        'Content-Length': String(Math.floor(Math.random() * 1000))
      },
      statusCode: [200, 400, 403, 404, 500][Math.floor(Math.random() * 5)],
      body: {
        status: [200, 400, 403, 404, 500][Math.floor(Math.random() * 5)],
        message: ['Success', 'Bad Request', 'Forbidden', 'Not Found', 'Server Error'][Math.floor(Math.random() * 5)],
        data: 'Base64编码的响应内容...'
      }
    },
    localVerification: {
      ruleName: ['SQL注入检测', 'XSS攻击检测', '命令注入检测', 'WebShell检测'][Math.floor(Math.random() * 4)],
      protocolNumber: '323-2',
      protocolType: 'HTTPS',
      attackType: ['SQL注入', 'XSS攻击', '命令注入', 'WebShell'][Math.floor(Math.random() * 4)],
      malformedPacketLength: Math.floor(Math.random() * 1000),
      attackFeatures: ['特征1：异常字符串', '特征2：恶意代码片段', '特征3：非法请求参数'][Math.floor(Math.random() * 3)]
    }
  }));
};

const FILTER_OPTIONS = {
  intelType: MOCK_DATA_CONFIG.intelTypes,
  action: MOCK_DATA_CONFIG.actions,
  intelSource: MOCK_DATA_CONFIG.intelSources,
};

// 定义国家和城市的结构
interface Location {
  country: string; // 国家
  cities: string[]; // 城市列表
}

// 定义所有的国家和城市
const locations: Location[] = [
  { country: '中国', cities: ['北京', '上海', '广州', '深圳', '杭州'] },
  { country: '美国', cities: ['加利福尼亚州', '纽约', '德克萨斯州'] },
  { country: '日本', cities: ['东京', '大阪', '京都'] },
  { country: '俄罗斯', cities: ['莫斯科', '圣彼得堡'] },
  { country: '德国', cities: ['柏林', '慕尼黑'] },
  { country: '法国', cities: ['巴黎', '马赛'] },
];

// 定义 LOCATION_OPTIONS
const LOCATION_OPTIONS = [
  {
    value: 'world',
    label: '世界',
    children: locations.map(location => ({
      value: location.country.toLowerCase(),
      label: location.country,
    })),
  },
  {
    value: 'china',
    label: '中国',
    children: locations.find(location => location.country === '中国')?.cities.map(city => ({
      value: city.toLowerCase(),
      label: city,
    })) || [],
  },
];

const CHART_COLORS = {
  high: '#ff4d4f',
  medium: '#faad14',
  low: '#52c41a',
  blue: '#1890ff',
};

// 5. 组件定义
const AttackLogs: React.FC = () => {
  // 状态定义
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [form] = Form.useForm();
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [filterName, setFilterName] = useState('');
  const [modalState, setModalState] = useState({
    isFilterModalVisible: false,
    isDetailVisible: false,
    isIpDrawerVisible: false,
    isChartsExpanded: false,
  });
  const [selectedLog, setSelectedLog] = useState<any>(null);

  // 子组件定义
  const CollapsedCharts = ({
    trendData,
    intelTypeData,
    style
  }: {
    trendData: AttackTrendData[];
    intelTypeData: IntelTypeData[];
    style?: React.CSSProperties;
  }) => {
    const [indexes, setIndexes] = useState({ trend: 0, intelType: 0 });
    const [isPaused, setIsPaused] = useState({ trend: false, intelType: false });
    const [isFading, setIsFading] = useState(false);
    const intervals = useRef<{ trend?: NodeJS.Timeout; intelType?: NodeJS.Timeout }>({});

    const updateIndex = (type: 'trend' | 'intelType') => {
      setIsFading(true);
      setTimeout(() => {
        setIndexes(prev => ({
          ...prev,
          [type]: type === 'trend'
            ? (prev.trend + 1) % trendData.length
            : (prev.intelType + 1) % Math.ceil(intelTypeData.length / 3)
        }));
        setIsFading(false);
      }, 300);
    };

    useEffect(() => {
      if (!isPaused.trend) {
        intervals.current.trend = setInterval(() => updateIndex('trend'), 5000);
      }
      if (!isPaused.intelType) {
        intervals.current.intelType = setInterval(() => updateIndex('intelType'), 5000);
      }
      return () => {
        clearInterval(intervals.current.trend);
        clearInterval(intervals.current.intelType);
      };
    }, [isPaused, trendData.length, intelTypeData.length]);

    return (
      <div
        style={{
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
          ...style
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginRight: '24px',
            flexShrink: 0
          }}
          onMouseEnter={() => setIsPaused({ ...isPaused, trend: true })}
          onMouseLeave={() => setIsPaused({ ...isPaused, trend: false })}
        >
          <span style={{ fontWeight: 500, fontSize: '14px', color: '#000000' }}>攻击趋势</span>
          <span style={{ fontSize: '12px', color: '#8c8c8c', marginLeft: '4px' }}>（单位：次数）</span>
          <div className={`content ${isFading ? 'fade-out' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>
              {trendData[indexes.trend]?.date}
            </span>
            <Tag style={{
              marginLeft: '8px',
              border: '1px solid',
              background: 'rgba(255, 77, 79, 0.1)',
              color: CHART_COLORS.high,
              borderColor: 'rgba(255, 77, 79, 0.2)'
            }}>
              高危：{trendData[indexes.trend]?.high}
            </Tag>
            <Tag style={{
              marginLeft: '8px',
              border: '1px solid',
              background: 'rgba(250, 173, 20, 0.1)',
              color: CHART_COLORS.medium,
              borderColor: 'rgba(250, 173, 20, 0.2)'
            }}>
              中危：{trendData[indexes.trend]?.medium}
            </Tag>
            <Tag style={{
              marginLeft: '8px',
              border: '1px solid',
              background: 'rgba(82, 196, 26, 0.1)',
              color: CHART_COLORS.low,
              borderColor: 'rgba(82, 196, 26, 0.2)'
            }}>
              低危：{trendData[indexes.trend]?.low}
            </Tag>
          </div>
        </div>

        <div style={{ width: '1px', height: '20px', background: '#f0f0f0', margin: '0 24px', flexShrink: 0 }} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            flex: 1,
            justifyContent: 'space-between'
          }}
          onMouseEnter={() => setIsPaused({ ...isPaused, intelType: true })}
          onMouseLeave={() => setIsPaused({ ...isPaused, intelType: false })}
        >
          <div style={{ flexShrink: 0 }}>
            <span style={{ fontWeight: 500, fontSize: '14px', color: '#000000' }}>情报类型TOP10</span>
            <span style={{ fontSize: '12px', color: '#8c8c8c', marginLeft: '4px' }}>（单位：百分比）</span>
          </div>
          <div className={`content ${isFading ? 'fade-out' : ''}`} style={{ display: 'flex', gap: '32px', minWidth: 0, flex: 1 }}>
            {intelTypeData
              .slice(indexes.intelType * 3, (indexes.intelType + 1) * 3)
              .map((item: IntelTypeData, index: number) => (
                <div key={`${item.type}-${indexes.intelType}-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flexShrink: 0 }}>
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: '#e6f7ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: CHART_COLORS.blue,
                      fontSize: '12px',
                      flexShrink: 0
                    }}
                  >
                    {indexes.intelType * 3 + index + 1}
                  </div>
                  <Typography.Text className="type-text">{item.type}</Typography.Text>
                  <Tag style={{
                    marginLeft: '8px',
                    border: '1px solid',
                    background: 'rgba(24, 144, 255, 0.1)',
                    color: CHART_COLORS.blue,
                    borderColor: 'rgba(24, 144, 255, 0.2)',
                    flexShrink: 0
                  }}>{item.percentage}%</Tag>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  const AttackTrendChart = () => {
    const generateData = (): {
      dates: string[];
      highRiskData: number[];
      mediumRiskData: number[];
      lowRiskData: number[];
    } => {
      const dates = [];
      const highRiskData = [];
      const mediumRiskData = [];
      const lowRiskData = [];

      for (let i = 6; i >= 0; i--) {
        const date = dayjs().subtract(i, 'day').format('MM-DD');
        dates.push(date);

        const highRisk = Math.random() < 0.2
          ? Math.floor(Math.random() * 200 + 4800)  // 4800-5000
          : Math.floor(Math.random() * 2800 + 2000); // 2000-4800

        const mediumRisk = Math.floor(Math.random() * 2000 + 1500);

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
          <span style={{ fontWeight: 500, fontSize: '14px', color: '#000000' }}>攻击趋势</span>
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

  const IntelTypeChart = () => {
    const generateData = () => {
      const types = [
        '僵尸网络', '漏洞利用', '恶意IP', '暴力破解', '扫描探测',
        '拒绝服务攻击', 'WebShell攻击', '恶意代码攻击', '代理IP', '木马蠕虫攻击'
      ];

      return types.map(type => ({
        name: type,
        value: Math.floor(Math.random() * 1000)
      }));
    };

    const data = generateData();
    const total = data.reduce((sum, item) => sum + item.value, 0);

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
        formatter: (params: { name: any; value: any; percent: any; }) => {
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
          <span style={{ fontWeight: 500, fontSize: '14px', color: '#000000' }}>情报类型TOP10</span>
          <span style={{ fontSize: '12px', color: '#8c8c8c', marginLeft: '4px' }}>（单位：百分比）</span>
        </div>
        <ReactECharts
          option={option}
          style={{ height: '180px', marginLeft: '-30px' }}
          opts={{ renderer: 'svg' }}
        />
      </>
    );
  };

  // 工具函数
  const toggleModal = (key: keyof typeof modalState) => {
    setModalState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const addToFavorites = (ip: string, type: 'attack' | 'target') => {
    const savedIps = JSON.parse(localStorage.getItem('favoriteIps') || '[]');
    if (savedIps.some((item: any) => item.ip === ip)) {
      message.warning('该IP已在收藏夹中');
      return;
    }
    localStorage.setItem('favoriteIps', JSON.stringify([...savedIps, { ip, type, key: ip }]));
    message.success('IP已添加到收藏夹');
  };

  const filterData = useMemo(() => {
    return (data: any[]) => {
      return data.filter(item => {
        const matchesFilter = (key: keyof FilterValues) =>
          !filterValues[key] ||
          (Array.isArray(filterValues[key])
            ? (filterValues[key] as string[]).includes(item[key])
            : item[key].toLowerCase().includes((filterValues[key] as string).toLowerCase()));

        return Object.keys(filterValues).every(key =>
          key === 'location'
            ? !filterValues.location?.length || matchesLocation(item.location, filterValues.location)
            : matchesFilter(key as keyof FilterValues)
        );
      });
    };
  }, [filterValues]);

  const matchesLocation = (location: string, filterLocation: string[]) => {
    const [category, specific] = filterLocation;
    if (category === 'world') {
      return true;
    } else if (category === 'china') {
      return location === specific;
    } else if (category === 'foreign') {
      return location === specific;
    }
    return false;
  };

  const getTableColumns = (addToFavorites: (ip: string, type: 'attack' | 'target') => void, setSelectedLog: (log: any) => void, setIsDetailVisible: (visible: boolean) => void) => [
    {
      title: '时间',
      dataIndex: 'time',
      width: 180,
      ellipsis: true
    },
    {
      title: '攻击IP',
      dataIndex: 'attackIp',
      width: 220,
      render: (ip: string) => (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Button
            type="link"
            style={{ padding: 0, minWidth: 32, marginRight: 8 }}
            icon={<StarOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              addToFavorites(ip, 'attack');
            }}
          />
          <Typography.Text copyable style={{ width: 160 }} ellipsis>{ip}</Typography.Text>
        </div>
      ),
    },
    {
      title: '归属地',
      dataIndex: 'location',
      width: 120,
      ellipsis: true
    },
    {
      title: '被攻击IP',
      dataIndex: 'targetIp',
      width: 220,
      ellipsis: true,
      render: (ip: string) => (
        <Typography.Text copyable style={{ width: 180 }} ellipsis>{ip}</Typography.Text>
      )
    },
    {
      title: '被攻击端口',
      dataIndex: 'targetPort',
      width: 120,
      ellipsis: true
    },
    {
      title: '情报类型',
      dataIndex: 'intelType',
      width: 150,
      ellipsis: true
    },
    {
      title: '威胁等级',
      dataIndex: 'threatLevel',
      width: 120,
      ellipsis: true,
      render: (text: string) => {
        const colors = {
          '高危': 'red',
          '中危': 'orange',
          '低危': 'blue',
        };
        return <Tag color={colors[text as keyof typeof colors]}>{text}</Tag>;
      },
    },
    {
      title: '处理动作',
      dataIndex: 'action',
      width: 120,
      ellipsis: true
    },
    {
      title: '命中情报源',
      dataIndex: 'intelSource',
      width: 150,
      ellipsis: true
    },
    {
      title: '最近攻击单位',
      dataIndex: 'lastAttackUnit',
      width: 150,
      ellipsis: true
    },
    {
      title: '规则',
      dataIndex: 'rule',
      width: 120,
      ellipsis: true
    },
    {
      title: '资产组',
      dataIndex: 'assetGroup',
      width: 120,
      ellipsis: true
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right' as const,
      width: 180,
      render: (_: any, record: any) => (
        <Space size="middle" style={{ paddingRight: 8 }}>
          <Button
            type="link"
            onClick={() => {
              setSelectedLog(record);
              setIsDetailVisible(true);
            }}
            style={{ padding: '4px 8px' }}
          >
            详情
          </Button>
          <Button
            type="link"
            style={{ padding: '4px 8px' }}
          >
            误报加白
          </Button>
        </Space>
      ),
    }
  ];

  // 事件处理函数
  const handleFilter = (values: FilterValues) => setFilterValues(values);
  const handleReset = () => {
    form.resetFields();
    setFilterValues({});
  };

  const saveToLocalStorage = (filters: SavedFilter[]) => {
    localStorage.setItem('attackLogsSavedFilters', JSON.stringify(filters));
    setSavedFilters(filters);
  };

  const handleSaveFilter = () => {
    const currentValues = form.getFieldsValue();
    if (Object.keys(currentValues).every(key => !currentValues[key])) {
      message.warning('请至少设置一个筛选条件');
      return;
    }

    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName,
      conditions: currentValues,
      createTime: new Date().toLocaleString()
    };

    saveToLocalStorage([...savedFilters, newFilter]);
    toggleModal('isFilterModalVisible');
    setFilterName('');
    message.success('筛选条件保存成功');
  };

  const applyFilter = (filter: SavedFilter) => {
    form.setFieldsValue(filter.conditions);
    setFilterValues(filter.conditions);
  };

  const deleteFilter = (id: string) => {
    const newFilters = savedFilters.filter(f => f.id !== id);
    saveToLocalStorage(newFilters);
    message.success('删除成功');
  };

  // 副作用
  useEffect(() => {
    const saved = localStorage.getItem('attackLogsSavedFilters');
    if (saved) {
      setSavedFilters(JSON.parse(saved));
    }
  }, []);

  // 获取数据
  const columns = getTableColumns(addToFavorites, setSelectedLog, () => toggleModal('isDetailVisible'));
  // 生成模拟数据
  const data = generateMockData();
  // 筛选操作后的模拟数据
  const filteredData = filterData(data);

  // 渲染函数
  const renderFilterForm = () => (
    <Form form={form} onFinish={handleFilter} style={{ marginBottom: '16px' }}>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Form.Item name="savedFilter" label="快捷搜索" style={{ marginBottom: 0 }}>
            <Select
              placeholder="选择已保存的筛选条件"
              allowClear
              dropdownRender={() => (
                <div>
                  {savedFilters.length === 0 ? (
                    <div style={{ padding: '8px', color: '#999', textAlign: 'center' }}>
                      暂无保存的筛选条件
                    </div>
                  ) : (
                    savedFilters.map(filter => (
                      <div
                        key={filter.id}
                        className="filter-item"
                        style={{
                          padding: '8px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #f0f0f0'
                        }}
                        onClick={() => applyFilter(filter)}
                      >
                        <div>{filter.name}</div>
                        <div style={{ fontSize: '12px', color: '#999' }}>{filter.createTime}</div>
                        <div style={{ textAlign: 'right' }}>
                          <Button
                            type="link"
                            size="small"
                            danger
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteFilter(filter.id);
                            }}
                          >
                            删除
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="intelType" label="情报类型" style={{ marginBottom: 0 }}>
            <Select
              allowClear
              placeholder="请选择情报类型"
              options={FILTER_OPTIONS.intelType.map(item => ({ label: item, value: item }))}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="intelSource" label="命中情报源" style={{ marginBottom: 0 }}>
            <Select
              allowClear
              placeholder="请选择情报源"
              options={FILTER_OPTIONS.intelSource.map(item => ({ label: item, value: item }))}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="action" label="处理动作" style={{ marginBottom: 0 }}>
            <Select
              allowClear
              placeholder="请选择处理动作"
              options={FILTER_OPTIONS.action.map(item => ({ label: item, value: item }))}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="attackIp" label="攻击IP" style={{ marginBottom: 0 }}>
            <Input placeholder="请输入攻击IP" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="targetIp" label="被攻击IP" style={{ marginBottom: 0 }}>
            <Input placeholder="请输入被攻击IP" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="location" label="归属地" style={{ marginBottom: 0 }}>
            <Cascader
              options={LOCATION_OPTIONS}
              placeholder="请选择归属地"
              allowClear
              showSearch={{
                filter: (inputValue, path) => {
                  return path.some(option =>
                    option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
                  );
                },
              }}
            />
          </Form.Item>
        </Col>
        <Col span={6} style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Form.Item style={{ marginBottom: 0 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                筛选
              </Button>
              <Button onClick={handleReset}>
                重置
              </Button>
              <Button onClick={() => toggleModal('isFilterModalVisible')}>
                保存条件
              </Button>
              <Button
                icon={<StarOutlined />}
                onClick={() => toggleModal('isIpDrawerVisible')}
              >
                IP收藏夹
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );

  // 返回JSX
  return (
    <div>
      {/* 图表区域 */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <Card style={{ marginBottom: modalState.isChartsExpanded ? '24px' : '0' }}>
          {modalState.isChartsExpanded ? (
            <Row gutter={24}>
              <Col span={12}>
                <AttackTrendChart />
              </Col>
              <Col span={12} style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', right: 12, top: -4, zIndex: 1 }}>
                  <Button
                    type="link"
                    onClick={() => toggleModal('isChartsExpanded')}
                    style={{ padding: '4px 0' }}
                  >
                    收起图表
                  </Button>
                </div>
                <IntelTypeChart />
              </Col>
            </Row>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <CollapsedCharts
                  trendData={[
                    { date: '2024年8月7日', high: 934, medium: 1498, low: 3065 },
                    { date: '2024年8月6日', high: 856, medium: 1389, low: 2987 },
                    { date: '2024年8月5日', high: 912, medium: 1456, low: 3123 }
                  ]}
                  intelTypeData={[
                    { type: '注入攻击', count: 2345, percentage: 23.45 },
                    { type: 'XSS攻击', count: 1234, percentage: 12.34 },
                    { type: '暴力破解', count: 987, percentage: 9.87 }
                  ]}
                  style={{ padding: 0 }}
                />
              </div>
              <Button
                type="link"
                onClick={() => toggleModal('isChartsExpanded')}
                style={{ padding: '4px 0', marginLeft: '16px' }}
              >
                展开图表
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* 筛选和表格区域 */}
      <Card style={{ backgroundColor: 'white' }}>
        {renderFilterForm()}

        <Space style={{ marginBottom: '16px' }}>
          {selectedRows.length > 0 && (
            <>
              <Button type="primary">导出</Button>
              <Button onClick={() => setSelectedRows([])}>清空</Button>
            </>
          )}
          <Button onClick={() => {/* 刷新逻辑 */ }}>刷新</Button>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowSelection={{
            selectedRowKeys: selectedRows.map(row => row.key),
            onChange: (_, rows) => setSelectedRows(rows),
          }}
          scroll={{ x: 2000 }}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 添加保存筛选条件的 Modal */}
      <Modal
        title="保存筛选条件"
        open={modalState.isFilterModalVisible}
        onOk={handleSaveFilter}
        onCancel={() => toggleModal('isFilterModalVisible')}
        okText="保存"
        cancelText="取消"
      >
        <Form layout="vertical">
          <Form.Item
            label="筛选条件名称"
            required
            rules={[{ required: true, message: '请输入筛选条件名称' }]}
          >
            <Input
              placeholder="请输入名称"
              value={filterName}
              onChange={e => setFilterName(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 弹窗组件 */}
      <AttackLogDetail
        data={selectedLog || {}}
        open={modalState.isDetailVisible}
        onClose={() => toggleModal('isDetailVisible')}
      />
      <IpFavorites
        open={modalState.isIpDrawerVisible}
        onClose={() => toggleModal('isIpDrawerVisible')}
      />
    </div>
  );
};

export default AttackLogs;
