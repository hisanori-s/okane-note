## Okane Note

### アプリの概要

Okane Noteは、子供が**自分の自由にできるお金の実態を視覚的に全容把握できる** ためのウェブアプリケーションです。仕事や複利による収入を組み込み、無理なくお金の運用の仕組みを学べるように設計されています。

### 開発の背景

* 開発者自身が子供のお金の管理にNotionを用いていたが、以下の課題を感じていた
    * 関数を使って自動処理をしても、細かいところで手動操作が必要になる
    * 更新が滞りがちで、継続的な管理が難しい
* ハッカソンを機に、これらの課題を解決するアプリを開発

### 特徴

* **子供向けに最適化されたインターフェース**
* 入金・出金記録機能
   - わかりやすいインターフェースで、入金・出金の記録ができる
* 仕事と収入の管理
    - 家事の手伝いなど、保護者と協議の上で設定した定期的な仕事を登録可能
    - 仕事達成率により、支払日の報酬は変動する
    - 単発の仕事も設定可能
* 自動複利計算機能
    - 定期的に預金残高に対して複利を計算
    - 複利の仕組みを視覚的に理解できる
* 資産推移のグラフ表示
    - 貯蓄の増加を視覚的に把握

### 開発環境

- **フロントエンド:** Next.js (v0)
- **データベース:** Supabase
- **その他:** TypeScript, React, shadcn/ui

### 今後の展望

- 複利の金利や支払日の変更機能
  - 支払い間隔や金利を変更できる
- 長期間更新がなかった期間の仕事達成ログの調整機能
  - 一定以上の空白が開く場合はログを圧縮し、データベースの容量を保護する
- 複数ユーザーへの対応
  - ユーザーごとにデータを管理する
- 入出金額および仕事リストのDB管理
  - ユーザーごとにデータを管理する
- よりゲーム性の高い仕組
  - レベルアップやアチーブメントの導入
- 親と子供が一緒に使える機能
  - お金の使い道について話し合える

