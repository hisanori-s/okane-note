import { useState } from "react"
import { HelpCircle, Settings, Lock, Unlock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

import { SettingsSection, SettingsData } from '@/types'

// OkaneNoteヘッダー
export function OkaneNoteHeader() {
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [settingsData, setSettingsData] = useState<SettingsData>({
    compoundInterest: {
      checkbox1: false,
      checkbox2: false,
      radio: "option1",
      textField: "",
      selectField: "1"
    },
    workList: {
      checkbox1: false,
      checkbox2: false,
      radio: "option1",
      textField: "",
      selectField: "1"
    },
    questBoard: {
      checkbox1: false,
      checkbox2: false,
      radio: "option1",
      textField: "",
      selectField: "1"
    }
  });

  const handleEditModeToggle = (checked: boolean) => {
    if (checked && !isEditMode) {
      const enteredPassword = prompt("パスワードを入力してください:");
      if (enteredPassword === "1234") {
        setIsEditMode(true);
      } else {
        alert("パスワードが間違っています。");
      }
    } else {
      setIsEditMode(checked);
    }
  };

  const handleSettingsChange = (section: keyof SettingsData, field: keyof SettingsSection, value: string | boolean) => {
    setSettingsData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    console.log("Settings saved:", settingsData);
    setIsEditMode(false);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" size="icon" onClick={() => setShowHelpPopup(true)}>
          <HelpCircle className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">Okane note</h1>
        <Button variant="ghost" size="icon" onClick={() => setShowSettingsPopup(true)}>
          <Settings className="h-6 w-6" />
        </Button>
      </div>

      {/* ヘルプダイアログ */}
      <Dialog open={showHelpPopup} onOpenChange={setShowHelpPopup}>
        <DialogContent className="w-full h-[80vh] max-w-md mx-auto overflow-y-auto">
          <DialogHeader>
            <DialogTitle>ヘルプ</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {/* ヘルプの内容をここに追加 */}
            <p>ここにヘルプの内容が表示されます。</p>
            <p>スクロールして全ての情報を確認できます。</p>
            {/* 長いコンテンツをシミュレートするためのダミーテキスト */}
            {Array(20).fill(0).map((_, i) => (
              <p key={i}>これはダミーテキストです。実際のヘルプコンテンツに置き換えてください。</p>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* 設定ダイアログ */}
      <Dialog open={showSettingsPopup} onOpenChange={setShowSettingsPopup}>
        <DialogContent className="w-full h-[80vh] max-w-md mx-auto overflow-y-auto">
          <DialogHeader>
            <DialogTitle>設定</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-mode" className="flex items-center space-x-2">
                <span>編集モード</span>
                {isEditMode ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              </Label>
              <Switch
                id="edit-mode"
                checked={isEditMode}
                onCheckedChange={handleEditModeToggle}
              />
            </div>

            {['compoundInterest', 'workList', 'questBoard'].map((section) => (
              <div key={section}>
                <h3 className="text-lg font-semibold mb-2">
                  {section === 'compoundInterest' ? '複利に関する設定' :
                   section === 'workList' ? 'お仕事リスト関係の定' :
                   'クエストボード関係の設定'}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`${section}-checkbox1`}
                      checked={settingsData[section as keyof SettingsData].checkbox1}
                      onCheckedChange={(checked) => handleSettingsChange(section as keyof SettingsData, 'checkbox1', checked)}
                      disabled={!isEditMode}
                    />
                    <Label htmlFor={`${section}-checkbox1`}>チェックボックス1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`${section}-checkbox2`}
                      checked={settingsData[section as keyof SettingsData].checkbox2}
                      onCheckedChange={(checked) => handleSettingsChange(section as keyof SettingsData, 'checkbox2', checked)}
                      disabled={!isEditMode}
                    />
                    <Label htmlFor={`${section}-checkbox2`}>チェックボックス2</Label>
                  </div>
                  <RadioGroup
                    value={settingsData[section as keyof SettingsData].radio}
                    onValueChange={(value) => handleSettingsChange(section as keyof SettingsData, 'radio', value)}
                    disabled={!isEditMode}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option1"                       id={`${section}-radio1`} />
                      <Label htmlFor={`${section}-radio1`}>オプション1</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option2" id={`${section}-radio2`} />
                      <Label htmlFor={`${section}-radio2`}>オプション2</Label>
                    </div>
                  </RadioGroup>
                  <Input
                    placeholder="テキストフィールド"
                    value={settingsData[section as keyof SettingsData].textField}
                    onChange={(e) => handleSettingsChange(section as keyof SettingsData, 'textField', e.target.value)}
                    disabled={!isEditMode}
                  />
                  <Select
                    value={settingsData[section as keyof SettingsData].selectField}
                    onValueChange={(value) => handleSettingsChange(section as keyof SettingsData, 'selectField', value)}
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
            ))}

            {isEditMode && (
              <Button onClick={handleSaveSettings} className="w-full">
                変更を反映
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
