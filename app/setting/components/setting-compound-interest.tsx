'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface SettingCompoundInterestProps {
    isEditMode: boolean;
}

export default function SettingCompoundInterest({ isEditMode }: SettingCompoundInterestProps) {
    const [settings, setSettings] = useState({
        interestRate: "0.5", // 利率の初期値
        paymentSpan: "weekly", // 支払いスパンの初期値
        paymentDay: "0", // 日曜日の初期値（0）
        paymentDate: "1" // 日付の初期値
    });

    const handleChange = (field: string, value: string) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="border p-4 rounded-md my-4">
            <h2 className="text-xl font-semibold mb-4">複利に関する設定</h2>
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">利率設定</h3>
                <Input
                    type="number"
                    step="0.05"
                    min="0.05"
                    placeholder="利率（例: 0.5）"
                    value={settings.interestRate}
                    onChange={(e) => handleChange('interestRate', e.target.value)}
                    disabled={!isEditMode}
                />
                <h3 className="text-lg font-semibold">支払いスパン設定</h3>
                <RadioGroup
                    value={settings.paymentSpan}
                    onValueChange={(value) => handleChange('paymentSpan', value)}
                    disabled={!isEditMode}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="payment-weekly" />
                        <Label htmlFor="payment-weekly">毎週</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="payment-monthly" />
                        <Label htmlFor="payment-monthly">毎月</Label>
                    </div>
                </RadioGroup>
                {settings.paymentSpan === "weekly" && (
                    <Select
                        value={settings.paymentDay}
                        onValueChange={(value) => handleChange('paymentDay', value)}
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
                        value={settings.paymentDate}
                        onValueChange={(value) => handleChange('paymentDate', value)}
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
            </div>
        </div>
    );
}
