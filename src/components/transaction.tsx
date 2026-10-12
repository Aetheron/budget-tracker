import clsx from "clsx"
import { useState } from "react"
import type { TransactionType } from "../App"

export default function Transaction({
  transaction,
  className,
}: {
  transaction: TransactionType
  className?: string
}) {
  const [amount, setAmount] = useState(transaction.amount)
  const [description, setDescription] = useState(transaction.description)
  const [category, setCategory] = useState(transaction.category)
  const [editing, setEditing] = useState(false)

  const submitChanges = async () => {
    const response = await fetch(`/api/transactions/${transaction.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, description, category }),
    })
    if (!response.ok) {
      throw new Error(`Failed to save transaction: ${response.status}`)
    }

    setEditing(false)
  }

  return (
    <tr className="text-left">
      <td
        className={clsx(
          className,
          "py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6 lg:pl-8 dark:text-white"
        )}
      >
        {transaction.date.toLocaleDateString()}
      </td>
      <td
        className={clsx(
          className,
          "hidden px-3 py-4 text-sm whitespace-nowrap text-gray-500 sm:table-cell dark:text-gray-400"
        )}
      >
        <div hidden={editing}>{transaction.amount}</div>
        <input
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
          id="amount"
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          required
          hidden={!editing}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </td>
      <td
        className={clsx(
          className,
          "hidden px-3 py-4 text-sm whitespace-nowrap text-gray-500 lg:table-cell dark:text-gray-400"
        )}
      >
        <div hidden={editing}>{transaction.description}</div>
        <input
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
          id="description"
          name="description"
          required
          hidden={!editing}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </td>
      <td
        className={clsx(
          className,
          "px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400"
        )}
      >
        <div hidden={editing}>{transaction.category}</div>
        <input
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
          id="category"
          name="category"
          type="text"
          required
          hidden={!editing}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </td>
      <td
        className={clsx(
          className,
          "py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-8 lg:pr-8"
        )}
      >
        <a
          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer"
          hidden={editing}
          onClick={() => setEditing(true)}
        >
          Edit
          <span className="sr-only">, {transaction.id}</span>
        </a>
        <a
          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer"
          hidden={!editing}
          onClick={submitChanges}
        >
          Done
          <span className="sr-only">, {transaction.id}</span>
        </a>
      </td>
    </tr>
  )
}
