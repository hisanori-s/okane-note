'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SettingPassword from './components/setting-password';
import SettingCompoundInterest from './components/setting-compound-interest';
import SettingQuest from './components/setting-quest';
import SettingWork from './components/setting-work';

export default function SettingPage() {
    const [isEditMode, setIsEditMode] = useState(false);
    const router = useRouter();

    const handleEditModeChange = (editMode: boolean) => {
        setIsEditMode(editMode);
    };

    const handleClose = () => {
        router.push('/');
    };

    return (
        <div className="max-w-md mx-auto p-4 relative">
            <Button
                onClick={handleClose}
                className="absolute top-2 right-2"
                variant="ghost"
                size="icon"
            >
                <X className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold mb-4">設定</h1>
            <SettingPassword onEditModeChange={handleEditModeChange} />
            <SettingCompoundInterest isEditMode={isEditMode} />
            <SettingWork isEditMode={isEditMode} />
            <SettingQuest isEditMode={isEditMode} />
        </div>
    );
}
