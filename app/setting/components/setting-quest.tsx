'use client';

import { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface SettingQuestProps {
    isEditMode: boolean;
}

export default function SettingQuest({ isEditMode }: SettingQuestProps) {
    const [settings, setSettings] = useState({
        checkbox1: false,
        checkbox2: false,
        radio: "option1",
        textField: "",
        selectField: "1"
    });

    const handleChange = (field: string, value: string | boolean) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="border p-4 rounded-md my-4">
            <h2 className="text-xl font-semibold mb-4">クエストボード関係の設定</h2>
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="quest-checkbox1"
                        checked={settings.checkbox1}
                        onCheckedChange={(checked) => handleChange('checkbox1', checked)}
                        disabled={!isEditMode}
                    />
                    <Label htmlFor="quest-checkbox1">チェックボックス1</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="quest-checkbox2"
                        checked={settings.checkbox2}
                        onCheckedChange={(checked) => handleChange('checkbox2', checked)}
                        disabled={!isEditMode}
                    />
                    <Label htmlFor="quest-checkbox2">チェックボックス2</Label>
                </div>
                <RadioGroup
                    value={settings.radio}
                    onValueChange={(value) => handleChange('radio', value)}
                    disabled={!isEditMode}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option1" id="quest-radio1" />
                        <Label htmlFor="quest-radio1">オプション1</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option2" id="quest-radio2" />
                        <Label htmlFor="quest-radio2">オプション2</Label>
                    </div>
                </RadioGroup>
                <Input
                    placeholder="テキストフィールド"
                    value={settings.textField}
                    onChange={(e) => handleChange('textField', e.target.value)}
                    disabled={!isEditMode}
                />
                <Select
                    value={settings.selectField}
                    onValueChange={(value) => handleChange('selectField', value)}
                    disabled={!isEditMode}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="数字を選択" />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.from({length: 30}, (_, i) => i + 1).map((num) => (
                            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
