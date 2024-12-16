import { Card } from 'antd';
import { useState } from 'react';
import PolicyList from '../components/password-policy/PolicyList';
import CustomPasswordList from '../components/password-policy/CustomPasswordList';
import './PasswordPolicy.css';

const tabList = [
  {
    key: 'policy',
    tab: '策略列表',
  },
  {
    key: 'custom',
    tab: '自定义口令列表',
  },
];

const contentList = {
  policy: <PolicyList />,
  custom: <CustomPasswordList />,
};

const PasswordPolicy = () => {
  const [activeTabKey, setActiveTabKey] = useState<string>('policy');

  const onTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  return (
    <Card
      className="password-policy-card"
      tabList={tabList}
      activeTabKey={activeTabKey}
      onTabChange={onTabChange}
      tabProps={{
        size: 'large',
      }}
    >
      {contentList[activeTabKey as keyof typeof contentList]}
    </Card>
  );
};

export default PasswordPolicy;
