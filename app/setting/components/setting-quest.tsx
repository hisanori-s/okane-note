'use client';

import { useState, useEffect } from 'react';
import { getQuests } from "@/lib/supabase/client";
import type { Quest } from '@/types';

interface SettingQuestProps {
    isEditMode: boolean;
}

export default function SettingQuest({ isEditMode }: SettingQuestProps) {
    const [quests, setQuests] = useState<Quest[]>([]);

    useEffect(() => {
        const fetchQuests = async () => {
            const fetchedQuests = await getQuests();
            setQuests(fetchedQuests);
        };
        fetchQuests();
    }, []);

    const getExecutionDaysText = (quest: Quest) => {
        if (quest.frequency === 'weekly') {
            const days = ['日', '月', '火', '水', '木', '金', '土'];
            return quest.executionDays.map(day => days[day]).join(', ');
        } else {
            return quest.executionDays.join(', ') + '日';
        }
    };

    return (
        <div className="border p-4 rounded-md my-4">
            <h2 className="text-xl font-semibold mb-4">クエストボード関係の設定</h2>
            {isEditMode ? (
                // 編集モード用のUI
                <p>編集モードです。ここに編集用のフォームなどを実装してください。</p>
            ) : (
                // 閲覧モード用のUI（既存のテーブル）
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left">タイトル</th>
                            <th className="text-left">頻度</th>
                            <th className="text-left">実行日</th>
                            <th className="text-left">報酬</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quests.map(quest => (
                            <tr key={quest.id}>
                                <td>{quest.title}</td>
                                <td>{quest.frequency === 'weekly' ? '毎週' : '毎月'}</td>
                                <td>{getExecutionDaysText(quest)}</td>
                                <td>{quest.reward}円</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
