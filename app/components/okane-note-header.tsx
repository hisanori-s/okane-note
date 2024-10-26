import { useState } from "react"
import { HelpCircle, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from 'next/link'

// OkaneNoteヘッダー
export function OkaneNoteHeader() {
  const [showHelpPopup, setShowHelpPopup] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" size="icon" onClick={() => setShowHelpPopup(true)}>
          <HelpCircle className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">Okane note</h1>
        {/* 設定画面へのリンク */}
        <Link href="/setting">
          <Button variant="ghost" size="icon" aria-label="設定画面へ移動">
            <Settings className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      {/* ヘルプダイアログ */}
      <Dialog open={showHelpPopup} onOpenChange={setShowHelpPopup}>
        <DialogContent className="w-full h-[80vh] max-w-md mx-auto overflow-y-auto flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>ヘルプ</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4 flex-grow overflow-y-auto">
            <h2 className="text-xl font-semibold">アプリの使い方</h2>
            <div>
              <p className="font-bold mb-2">お金の記録をつけよう！</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>入金ボタン、出金ボタンを押してお金の記録を残せます。</li>
                <li>ただし、現在はデータベースと接続されていないため、記録は一時的なものとなります。</li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-2">お仕事の記録をつけよう！</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>今日の仕事が終わったら、「お仕事リスト」にチェックを入れて「お仕事終了」ボタンを押してください。</li>
                <li>お仕事の報酬は、１週間に１回日曜日にもらえます。</li>
                <li>クエストの報酬はその日のうちにもらえます。</li>
                <li>クエストをクリアしたら、父に言ってください。</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
