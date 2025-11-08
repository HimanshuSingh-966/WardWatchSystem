import { useState } from 'react';
import TabNavigation, { DashboardTab } from '../TabNavigation';

export default function TabNavigationExample() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  return (
    <div className="h-screen">
      <div className="h-16 bg-card border-b" />
      <TabNavigation 
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          console.log('Tab changed to:', tab);
        }}
      />
      <div className="p-8">
        <p className="text-muted-foreground">Active tab: {activeTab}</p>
      </div>
    </div>
  );
}
