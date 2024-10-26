"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeftRight, ChevronRight, ChevronLeft, X, HelpCircle, Settings, Lock, Unlock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

import { TransactionLog, Task, DailyWorkRecord, SettingsSection, SettingsData } from '@/types'
import { dummyTransactions } from '@/lib/supabase/dummy/transactions'
import { dummyTasks } from '@/lib/supabase/dummy/tasks'
import { formatDate, getNextSunday } from '@/lib/date-utils'
import { calculateCompoundInterest } from '@/lib/financial-utils'

// コンポーネント一覧
// - AnimatedReward: アニメーション付きの報酬表示コンポーネント（お仕事セクション）
// - QuestBoard: クエストボードコンポーネント（クエストセクション）
// - TransactionPopup: 取引ポップアップコンポーネント（入出金ポップアップ）
// - ConfirmationDialog: 確認ダイアログコンポーネント（クエストボードでのクエスト完了確認）
// - TransactionHistory: 取引履歴コンポーネント（通帳セクション）
// - CustomTooltip: カスタムツールチップコンポーネント（残高概要セクション）
// - OkaneNote: メインのOkaneNoteコンポーネント

