import React from 'react';
import { TransactionLog } from '@/types';

interface TransactionHistoryProps {
  transactions: TransactionLog[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">日付</th>
              <th className="border border-gray-300 px-4 py-2 text-left">タイトル</th>
              <th className="border border-gray-300 px-4 py-2 text-right">金額 / 残高</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(transaction.timestamp).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">{transaction.title}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex flex-col items-end">
                    <span className={`${transaction.category === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.category === 'income' ? '+' : '-'}{transaction.amount.toLocaleString()}円
                    </span>
                    <span className="text-sm text-gray-600">
                      残高: {transaction.balance.toLocaleString()}円
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
