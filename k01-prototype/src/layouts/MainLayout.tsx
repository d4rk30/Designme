import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  DashboardOutlined,
  AlertOutlined,
  LinkOutlined,
  LockOutlined,
  RadarChartOutlined,
  SafetyCertificateOutlined,
  EyeInvisibleOutlined,
  SettingOutlined,
  FileOutlined,
  ToolOutlined,
  UserOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import PageHeader from '../components/PageHeader';
import logo from '../assets/logo.png';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuProps['items'] = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: 'attack-monitoring',
      icon: <AlertOutlined />,
      label: '攻击监测告警',
      children: [
        {
          key: 'attack-logs',
          label: '攻击监测日志',
        },
        {
          key: 'attack-ip-analysis',
          label: '攻击IP分析',
        },
        {
          key: 'attacked-ip-analysis',
          label: '被攻击IP分析',
        },
      ],
    },
    {
      key: 'external-detection',
      icon: <LinkOutlined />,
      label: '外联检测告警',
      children: [
        {
          key: 'external-logs',
          label: '外联检测日志',
        },
        {
          key: 'controlled-host-analysis',
          label: '受控主机分析',
        },
        {
          key: 'external-target-analysis',
          label: '外联目标分析',
        },
      ],
    },
    {
      key: 'weak-password',
      icon: <LockOutlined />,
      label: '弱口令登录告警',
    },
    {
      key: 'anti-mapping',
      icon: <RadarChartOutlined />,
      label: '反测绘告警',
      children: [
        {
          key: 'mapping-logs',
          label: '反测绘日志',
        },
        {
          key: 'mapping-source-analysis',
          label: '测绘源分析',
        },
        {
          key: 'mapping-target-analysis',
          label: '测绘目的分析',
        },
      ],
    },
    {
      key: 'threat-intelligence',
      icon: <SafetyCertificateOutlined />,
      label: '威胁情报',
      children: [
        {
          key: 'intelligence-tracing',
          label: '威胁情报溯源',
        },
        {
          key: 'public-intelligence',
          label: '公有情报管理',
        },
        {
          key: 'private-intelligence',
          label: '私有情报管理',
        },
        {
          key: 'false-positive',
          label: '误报反馈',
        },
      ],
    },
    {
      key: 'application-hiding',
      icon: <EyeInvisibleOutlined />,
      label: '应用隐身',
    },
    {
      key: 'policy',
      icon: <SettingOutlined />,
      label: '策略配置',
      children: [
        {
          key: 'attack-policy',
          label: '攻击监测策略',
        },
        {
          key: 'external-policy',
          label: '外联检测策略',
        },
        {
          key: 'password-policy',
          label: '弱口令登录策略',
        },
        {
          key: 'ip-control',
          label: 'IP访问控制',
        },
        {
          key: 'blacklist',
          label: '黑白名单',
        },
        {
          key: 'mapping-policy',
          label: '反测绘策略',
        },
      ],
    },
    {
      key: 'report',
      icon: <FileOutlined />,
      label: '报表导出',
    },
    {
      key: 'system',
      icon: <ToolOutlined />,
      label: '系统管理',
      children: [
        {
          key: 'asset-management',
          label: '防护资产管理',
        },
        {
          key: 'system-allocation',
          label: '系统配属',
        },
        {
          key: 'system-status',
          label: '系统状态',
        },
        {
          key: 'network-config',
          label: '网络配置',
        },
        {
          key: 'v01-config',
          label: 'V01通道配置',
        },
        {
          key: 'license-auth',
          label: '许可授权',
        },
        {
          key: 'license-management',
          label: '许可管理',
        },
        {
          key: 'syslog-config',
          label: 'Syslog配置',
        },
        {
          key: 'upgrade',
          label: '升级管理',
        },
        {
          key: 'backup',
          label: '备份及回退',
        },
        {
          key: 'system-operation',
          label: '系统操作',
        },
        {
          key: 'maintenance',
          label: '运维工具',
        },
        {
          key: 'central-management',
          label: '集中管理配置',
        },
        {
          key: 'about',
          label: '关于我们',
        },
      ],
    },
  ];

  const getDefaultOpenKey = (pathname: string): string => {
    const path = pathname.substring(1);

    // 处理资产列表页面的特殊情况
    if (path.startsWith('asset-management/')) {
      return 'system';  // 返回系统管理的 key
    }

    const parentKey = menuItems?.find(item =>
      item && 'children' in item && item.children?.some(child =>
        child && child.key === path
      )
    )?.key;
    return parentKey as string || '';
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(`/${e.key}`);
  };

  const handleCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  // 获取当前路径对应的选中菜单项
  const getSelectedKeys = (pathname: string): string[] => {
    const path = pathname.substring(1);
    // 处理资产列表页面的特殊情况
    if (path.startsWith('asset-management/')) {
      return ['asset-management'];
    }
    return [path];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header>
        <div className="header-logo">
          <img src={logo} alt="K01 Logo" />
          <span className="header-title">
            网盾K01 | 网络威胁联防阻断系统
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Admin</span>
          <UserOutlined style={{ fontSize: '16px' }} />
        </div>
      </Header>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={handleCollapse}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 64,
            bottom: 0,
            paddingBottom: '48px'
          }}
        >
          <Menu
            theme="dark"
            selectedKeys={getSelectedKeys(location.pathname)}
            defaultOpenKeys={[getDefaultOpenKey(location.pathname)]}
            mode="inline"
            items={menuItems}
            onClick={handleMenuClick}
            style={{
              height: 'calc(100vh - 112px)',
              overflowY: 'auto'
            }}
            className="custom-menu-scroll"
          />
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
          <PageHeader />
          <Content style={{ background: '#f0f2f5', padding: '24px', overflow: 'auto' }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
