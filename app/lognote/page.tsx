import Link from 'next/link';
import { TransactionHistory } from './components/transaction-history';
import { getTransactions } from '@/lib/dummy-db/transactions';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function LogNotePage() {
  const transactions = getTransactions();

  return (
    <div className="container mx-auto px-4 py-8 max-w-md relative">
      <Link href="/">
        <Button className="absolute top-2 right-2" variant="ghost" size="icon">
          <X className="h-4 w-4" />
        </Button>
      </Link>
      <h1 className="text-3xl font-bold mb-6">おかね通帳</h1>
      <TransactionHistory transactions={transactions} />
    </div>
  );
}
