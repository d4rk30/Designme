import { Card, Tabs } from 'antd';
import { useState } from 'react';
import PolicyList from '../components/password-policy/PolicyList';
import CustomPasswordList from '../components/password-policy/CustomPasswordList';

const { TabPane } = Tabs;

const PasswordPolicy = () => {
  const [activeTab, setActiveTab] = useState('1');

  return (
    <Card>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="策略列表" key="1">
          <PolicyList />
        </TabPane>
        <TabPane tab="自定义口令列表" key="2">
          <CustomPasswordList />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default PasswordPolicy;
