"use client"

import type { TransactionType } from "../App"
import Transaction from "./transaction"

export default function TransactionsTable({
  transactions,
}: {
  transactions: TransactionType[]
}) {
  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky top-0 z-10 border-b border-gray-300 bg-white/75 py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 backdrop-blur-sm backdrop-filter sm:pl-6 lg:pl-8 dark:border-white/15 dark:bg-gray-900/75 dark:text-white"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur-sm backdrop-filter sm:table-cell dark:border-white/15 dark:bg-gray-900/75 dark:text-white"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur-sm backdrop-filter lg:table-cell dark:border-white/15 dark:bg-gray-900/75 dark:text-white"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="sticky top-0 z-10 border-b border-gray-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur-sm backdrop-filter dark:border-white/15 dark:bg-gray-900/75 dark:text-white"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="sticky top-0 z-10 border-b border-gray-300 bg-white/75 py-3.5 pr-4 pl-3 backdrop-blur-sm backdrop-filter sm:pr-6 lg:pr-8 dark:border-white/15 dark:bg-gray-900/75"
                >
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, transactionIdx) => (
                <Transaction
                  transaction={transaction}
                  key={transactionIdx}
                  className={
                    transactionIdx !== transactions.length - 1
                      ? "border-b border-gray-200 dark:border-white/10"
                      : ""
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
