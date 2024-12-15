import { Breadcrumb, Switch, DatePicker, Space, Tooltip } from 'antd';
import { useLocation } from 'react-router-dom';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

// 获取本周的开始和结束时间
const getCurrentWeek = () => {
  const now = dayjs();
  const startOfWeek = now.startOf('week');
  const endOfWeek = now.endOf('week');
  return [startOfWeek, endOfWeek];
};

// 菜单路径映射，记录每个页面的完整路径层级
const menuPathMap: Record<string, string[]> = {
  // 一级菜单
  '/home': ['首页'],
  '/dashboard': ['仪表盘'],
  '/weak-password': ['弱口令登录告警'],
  '/application-hiding': ['应用隐身'],
  '/report': ['报表导出'],

  // 攻击监测告警
  '/attack-logs': ['攻击监测告警', '攻击监测日志'],
  '/attack-ip-analysis': ['攻击监测告警', '攻击IP分析'],
  '/attacked-ip-analysis': ['攻击监测告警', '被攻击IP分析'],

  // 外联检测告警
  '/external-logs': ['外联检测告警', '外联检测日志'],
  '/controlled-host-analysis': ['外联检测告警', '受控主机分析'],
  '/external-target-analysis': ['外联检测告警', '外联目标分析'],

  // 反测绘告警
  '/mapping-logs': ['反测绘告警', '反测绘日志'],
  '/mapping-source-analysis': ['反测绘告警', '测绘源分析'],
  '/mapping-target-analysis': ['反测绘告警', '测绘目的分析'],

  // 威胁情报
  '/intelligence-tracing': ['威胁情报', '威胁情报溯源'],
  '/public-intelligence': ['威胁情报', '公有情报管理'],
  '/private-intelligence': ['威胁情报', '私有情报管理'],
  '/false-positive': ['威胁情报', '误报反馈'],

  // 策略配置
  '/attack-policy': ['策略配置', '攻击监测策略'],
  '/external-policy': ['策略配置', '外联检测策略'],
  '/password-policy': ['策略配置', '弱口令登录策略'],
  '/ip-control': ['策略配置', 'IP访问控制'],
  '/blacklist': ['策略配置', '黑白名单'],
  '/mapping-policy': ['策略配置', '反测绘策略'],
  '/asset-management': ['系统管理', '防护资产管理'],
  '/system-allocation': ['系统管理', '系统配属'],
  '/system-status': ['系统管理', '系统状态'],
  '/network-config': ['系统管理', '网络配置'],
  '/v01-config': ['系统管理', 'V01通道配置'],
  '/license-auth': ['系统管理', '许可授权'],
  '/license-management': ['系统管理', '许可管理'],
  '/syslog-config': ['系统管理', 'Syslog配置'],
  '/upgrade': ['系统管理', '升级管理'],
  '/backup': ['系统管理', '备份及回退'],
  '/system-operation': ['系统管理', '系统操作'],
  '/maintenance': ['系统管理', '运维工具'],
  '/central-management': ['系统管理', '集中管理配置'],
  '/about': ['系统管理', '关于我们'],
};

interface PageHeaderProps {
  extra?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ extra }) => {
  const location = useLocation();
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [dateRange, setDateRange] = useState(getCurrentWeek());

  const breadcrumbItems = useMemo(() => {
    const pathname = location.pathname.endsWith('/') 
      ? location.pathname.slice(0, -1) 
      : location.pathname;
    
    const paths = menuPathMap[pathname];
    if (!paths) return [{ title: '未知页面' }];

    return paths.map((path) => ({
      title: path,
    }));
  }, [location.pathname]);

  const handleAutoRefreshChange = (checked: boolean) => {
    setAutoRefresh(checked);
    if (checked) {
      const timer = setInterval(() => {
        // 刷新数据的逻辑
      }, 120000); // 2分钟
      return () => clearInterval(timer);
    }
  };

  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates);
  };

  const isAttackLogsPage = location.pathname === '/attack-logs';

  const extraContent = isAttackLogsPage ? (
    <Space size={24}>
      <Space>
        <span>自动刷新</span>
        <Tooltip title="开启自动刷新后每隔两分钟刷新一次数据，数据受到右侧时间筛选器的影响">
          <QuestionCircleOutlined />
        </Tooltip>
        <Switch 
          checked={autoRefresh} 
          onChange={handleAutoRefreshChange} 
        />
      </Space>
      <RangePicker 
        value={dateRange}
        onChange={handleDateRangeChange}
        defaultValue={[dayjs().startOf('week'), dayjs()]}
      />
    </Space>
  ) : extra;

  return (
    <div className="page-header">
      <div className="page-header-content">
        <Breadcrumb items={breadcrumbItems} />
        {extraContent && <div className="page-header-extra">{extraContent}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
