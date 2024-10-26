'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import SettingPassword from './components/setting-password';
import SettingCompoundInterest from './components/setting-compound-interest';
import SettingWork from './components/setting-work';
import SettingQuest from './components/setting-quest';

export default function SettingPage() {
    const [isEditMode, setIsEditMode] = useState(false);

    const handlePasswordSubmit = (isCorrect: boolean) => {
        setIsEditMode(isCorrect);
    };

    const handleSaveSettings = () => {
        // ここで全ての設定を保存する処理を実装
        console.log('全ての設定を保存しました');
        setIsEditMode(false);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">設定</h1>

            {!isEditMode ? (
                <SettingPassword onPasswordSubmit={handlePasswordSubmit} />
            ) : (
                <Button onClick={() => setIsEditMode(false)} className="mb-4">
                    編集モードを無効にする
                </Button>
            )}

            <div className="space-y-8">
                <SettingCompoundInterest isEditMode={isEditMode} />
                <SettingWork isEditMode={isEditMode} />
                <SettingQuest isEditMode={isEditMode} />
            </div>

            {isEditMode && (
                <Button onClick={handleSaveSettings} className="mt-8">
                    全ての設定を保存
                </Button>
            )}
        </div>
    );
}
