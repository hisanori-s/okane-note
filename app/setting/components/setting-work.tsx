'use client';

import { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getWorks, getWorkSettings } from "@/lib/supabase/client";
import type { Work, WorkSettings } from '@/types';

interface SettingWorkProps {
    isEditMode: boolean;
}

export default function SettingWork({ isEditMode }: SettingWorkProps) {
    const [works, setWorks] = useState<Work[]>([]);
    const [settings, setSettings] = useState<WorkSettings>({
        paymentSpan: "weekly",
        paymentDay: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            const fetchedWorks = await getWorks();
            const fetchedSettings = await getWorkSettings();
            setWorks(fetchedWorks);
            setSettings(fetchedSettings);
        };
        fetchData();
    }, []);

    const handleChange = (field: string, value: string | number) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="border p-4 rounded-md my-4">
            <h2 className="text-xl font-semibold mb-4">お仕事リスト関係の設定</h2>
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">支払いスパン設定</h3>
                <RadioGroup
                    value={settings.paymentSpan}
                    onValueChange={(value) => handleChange('paymentSpan', value)}
                    disabled={!isEditMode}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="work-payment-weekly" />
                        <Label htmlFor="work-payment-weekly">毎週</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="work-payment-monthly" />
                        <Label htmlFor="work-payment-monthly">毎月</Label>
                    </div>
                </RadioGroup>
                {settings.paymentSpan === "weekly" && (
                    <Select
                        value={settings.paymentDay.toString()}
                        onValueChange={(value) => handleChange('paymentDay', parseInt(value))}
                        disabled={!isEditMode}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="曜日を選択" />
                        </SelectTrigger>
                        <SelectContent>
                            {["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"].map((day, index) => (
                                <SelectItem key={day} value={index.toString()}>{day}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
                {settings.paymentSpan === "monthly" && (
                    <Select
                        value={settings.paymentDay.toString()}
                        onValueChange={(value) => handleChange('paymentDay', parseInt(value))}
                        disabled={!isEditMode}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="日付を選択" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                                <SelectItem key={date} value={date.toString()}>{date}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
                <h3 className="text-lg font-semibold mt-6">仕事リスト</h3>
                <ul className="list-disc pl-5">
                    {works.map(work => (
                        <li key={work.id}>
                            {work.title} - 報酬: {work.reward}円
                            ({work.executionSpan === 'weekly' ? '毎週' : '毎月'}
                            {work.executionDays.map(day =>
                                work.executionSpan === 'weekly'
                                    ? ["日", "月", "火", "水", "木", "金", "土"][day]
                                    : day + "日"
                            ).join(', ')})
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
