import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AttackLogs from './pages/AttackLogs';
import PasswordPolicy from './pages/PasswordPolicy';
import Dashboard from './pages/Dashboard';
import ExternalConnectionLogs from './pages/ExternalConnectionLogs';
import PublicIntelligence from './pages/PublicIntelligence';
import License from './pages/License';
import Blacklist from './pages/Blacklist';
import AssetManagement from './pages/AssetManagement';
import AssetList from './pages/AssetList';
import ReportPage from './pages/ReportPage';
import './App.css';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

// 设置 dayjs 的默认语言为中文
dayjs.locale('zh-cn');

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<div>首页</div>} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="attack-logs" element={<AttackLogs />} />
            <Route path="attack-ip-analysis" element={<div>攻击IP分析</div>} />
            <Route path="attacked-ip-analysis" element={<div>被攻击IP分析</div>} />
            <Route path="external-logs" element={<ExternalConnectionLogs />} />
            <Route path="controlled-host-analysis" element={<div>受控主机分析</div>} />
            <Route path="external-target-analysis" element={<div>外联目标分析</div>} />
            <Route path="weak-password" element={<div>弱口令登录告警</div>} />
            <Route path="mapping-logs" element={<div>反测绘日志</div>} />
            <Route path="mapping-source-analysis" element={<div>测绘源分析</div>} />
            <Route path="mapping-target-analysis" element={<div>测绘目的分析</div>} />
            <Route path="intelligence-tracing" element={<div>威胁情报溯源</div>} />
            <Route path="public-intelligence" element={<PublicIntelligence />} />
            <Route path="private-intelligence" element={<div>私有情报管理</div>} />
            <Route path="false-positive" element={<div>误报反馈</div>} />
            <Route path="application-hiding" element={<div>应用隐身</div>} />
            <Route path="attack-policy" element={<div>攻击监测策略</div>} />
            <Route path="external-policy" element={<div>外联检测策略</div>} />
            <Route path="password-policy" element={<PasswordPolicy />} />
            <Route path="report" element={<ReportPage />} />
            <Route path="ip-control" element={<div>IP访问控制</div>} />
            <Route path="blacklist" element={<Blacklist />} />
            <Route path="mapping-policy" element={<div>反测绘策略</div>} />
            <Route path="asset-management" element={<AssetManagement />} />
            <Route path="asset-management/:groupId" element={<AssetList />} />
            <Route path="system-allocation" element={<div>系统配属</div>} />
            <Route path="system-status" element={<div>系统状态</div>} />
            <Route path="network-config" element={<div>网络配置</div>} />
            <Route path="v01-config" element={<div>V01通道配置</div>} />
            <Route path="license-auth" element={<License />} />
            <Route path="license-management" element={<div>许可管理</div>} />
            <Route path="syslog-config" element={<div>Syslog配置</div>} />
            <Route path="upgrade" element={<div>升级管理</div>} />
            <Route path="backup" element={<div>备份及回退</div>} />
            <Route path="system-operation" element={<div>系统操作</div>} />
            <Route path="maintenance" element={<div>运维工具</div>} />
            <Route path="central-management" element={<div>集中管理配置</div>} />
            <Route path="about" element={<div>关于我们</div>} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
