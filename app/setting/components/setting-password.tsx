'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface SettingPasswordProps {
    onEditModeChange: (isEditMode: boolean) => void;
}

export default function SettingPassword({ onEditModeChange }: SettingPasswordProps) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [password, setPassword] = useState('');

    useEffect(() => {
        onEditModeChange(isEditMode);
    }, [isEditMode, onEditModeChange]);

    const handleToggleChange = (checked: boolean) => {
        if (checked) {
            setShowPasswordDialog(true);
        } else {
            setIsEditMode(false);
        }
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const isCorrect = password === '1234';
        if (isCorrect) {
            setIsEditMode(true);
            setShowPasswordDialog(false);
        } else {
            alert('パスワードが間違っています。');
        }
        setPassword('');
    };

    return (
        <div className="flex items-center justify-between mb-4">
            <span>編集モード</span>
            <Switch
                checked={isEditMode}
                onCheckedChange={handleToggleChange}
            />

            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>パスワードを入力してください</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handlePasswordSubmit}>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="パスワードを入力"
                            className="mb-2"
                        />
                        <DialogFooter>
                            <Button type="submit">確認</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
