import type { ITab } from '@/models/tab.model';
import React, { useState } from 'react';

interface TabsComponentProps {
  tabs: ITab[];
}

const TabsComponent: React.FC<TabsComponentProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      {/* Encabezados de las Tabs */}
      <div className="flex sticky top-0 z-10 bg-background rounded-2xl p-2">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`py-2 text-sm font-bold  cursor-pointer rounded-lg px-10 mr-2 transition-colors duration-300 ease-in-out ${
              activeTab === index
                ? 'text-onPrimary border-b-2 border-primary bg-primary border'
                : 'text-colorText hover:text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de la Tab Activa */}
      <div className="pt-2 h-full w-full">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

export default TabsComponent;
