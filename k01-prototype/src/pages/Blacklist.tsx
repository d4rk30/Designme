import React, { useState } from 'react';
import { Card } from 'antd';
import IPBlacklist from '../components/IPBlacklist';

const tabList = [
  {
    key: 'ip-blacklist',
    tab: 'IP黑名单',
  },
  {
    key: 'ip-whitelist',
    tab: 'IP白名单',
  },
  {
    key: 'url-blacklist',
    tab: 'URL黑名单',
  },
  {
    key: 'url-whitelist',
    tab: 'URL白名单',
  },
  {
    key: 'config',
    tab: '黑白名单配置',
  },
];

const contentList: Record<string, React.ReactNode> = {
  'ip-blacklist': <IPBlacklist />,
  'ip-whitelist': <div>IP白名单内容</div>,
  'url-blacklist': <div>URL黑名单内容</div>,
  'url-whitelist': <div>URL白名单内容</div>,
  'config': <div>黑白名单配置内容</div>,
};

const Blacklist: React.FC = () => {
  const [activeTabKey, setActiveTabKey] = useState<string>('ip-blacklist');

  const onTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  return (
    <div>
      <Card
        tabList={tabList}
        activeTabKey={activeTabKey}
        onTabChange={onTabChange}
        className="blacklist-card"
      >
        {contentList[activeTabKey]}
      </Card>
    </div>
  );
};

export default Blacklist;
