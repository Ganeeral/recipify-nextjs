// файл: components/ProfileTabs.tsx
"use client";

import React, { useState } from "react";
import ProfileHistory from "../ProfileHistory/ProfileHistory";
import ProfileFavorites from "../profileFavorites/ProfileFavorites";
enum Tab {
  HISTORY = "history",
  FAVORITES = "favorites",
}

const ProfileTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HISTORY);

  return (
    <div className="w-full h-full">
      {/* Навигация по вкладкам */}
      <div className="flex gap-4 mt-[40px] ">
        <button
          onClick={() => setActiveTab(Tab.HISTORY)}
          className={` py-2 text-xl text-black font-['ArsenalB'] ${
            activeTab === Tab.HISTORY ? "underline" : "underline-offset-0 "
          }`}
        >
          История запросов
        </button>
        <button
          onClick={() => setActiveTab(Tab.FAVORITES)}
          className={` py-2 text-xl text-black font-['ArsenalB'] ${
            activeTab === Tab.FAVORITES ? "underline" : "underline-offset-0 "
          }`}
        >
          Избранное
        </button>
      </div>
      {/* Контент вкладок */}
      <div className="mt-8">
        {activeTab === Tab.HISTORY ? <ProfileHistory /> : <ProfileFavorites />}
      </div>
    </div>
  );
};

export default ProfileTabs;
