'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SettingPasswordProps {
    onPasswordSubmit: (isCorrect: boolean) => void;
}

export default function SettingPassword({ onPasswordSubmit }: SettingPasswordProps) {
    const [password, setPassword] = useState('');

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const isCorrect = password === '1234';
        onPasswordSubmit(isCorrect);
        if (!isCorrect) {
            alert('パスワードが間違っています。');
        }
        setPassword(''); // パスワード入力をクリア
    };

    return (
        <form onSubmit={handlePasswordSubmit} className="mb-4">
            <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                className="mb-2"
            />
            <Button type="submit">編集モードを有効にする</Button>
        </form>
    );
}
