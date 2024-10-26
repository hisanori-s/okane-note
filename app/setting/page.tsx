'use client';

import { useState } from 'react';
import SettingPassword from './components/setting-password';
import SettingCompoundInterest from './components/setting-compound-interest';
import SettingQuest from './components/setting-quest';
import SettingWork from './components/setting-work';

export default function SettingPage() {
    const [isEditMode, setIsEditMode] = useState(false);

    const handleEditModeChange = (editMode: boolean) => {
        setIsEditMode(editMode);
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">設定</h1>
            <SettingPassword onEditModeChange={handleEditModeChange} />
            <SettingCompoundInterest isEditMode={isEditMode} />
            <SettingQuest isEditMode={isEditMode} />
            <SettingWork isEditMode={isEditMode} />
        </div>
    );
}
