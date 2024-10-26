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
    </>
  );
}
