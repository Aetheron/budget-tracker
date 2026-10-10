"use client"

import clsx from "clsx"
import type { TransactionType } from "../App"

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
                  Descriptioon
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
                <tr key={transaction.id}>
                  <td
                    className={clsx(
                      transactionIdx !== transactions.length - 1
                        ? "border-b border-gray-200 dark:border-white/10"
                        : "",
                      "py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6 lg:pl-8 dark:text-white"
                    )}
                  >
                    {transaction.date.toLocaleDateString()}
                  </td>
                  <td
                    className={clsx(
                      transactionIdx !== transactions.length - 1
                        ? "border-b border-gray-200 dark:border-white/10"
                        : "",
                      "hidden px-3 py-4 text-sm whitespace-nowrap text-gray-500 sm:table-cell dark:text-gray-400"
                    )}
                  >
                    {transaction.amount}
                  </td>
                  <td
                    className={clsx(
                      transactionIdx !== transactions.length - 1
                        ? "border-b border-gray-200 dark:border-white/10"
                        : "",
                      "hidden px-3 py-4 text-sm whitespace-nowrap text-gray-500 lg:table-cell dark:text-gray-400"
                    )}
                  >
                    {transaction.description}
                  </td>
                  <td
                    className={clsx(
                      transactionIdx !== transactions.length - 1
                        ? "border-b border-gray-200 dark:border-white/10"
                        : "",
                      "px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {transaction.category}
                  </td>
                  <td
                    className={clsx(
                      transactionIdx !== transactions.length - 1
                        ? "border-b border-gray-200 dark:border-white/10"
                        : "",
                      "py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-8 lg:pr-8"
                    )}
                  >
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Edit
                      <span className="sr-only">, {transaction.id}</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
