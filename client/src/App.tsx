"use client"

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import { XIcon } from "lucide-react"
import { useActionState, useEffect, useState } from "react"
import {
  deleteTransactionAction,
  fetchSummary,
  fetchTransactions,
} from "./actions"
import "./App.css"
import StatsHeader from "./components/stats-header"
import Transaction from "./components/transaction"
import TransactionsTable from "./components/transactions-table"

export type TransactionType = {
  id: string
  date: Date
  amount: number
  description: string
  category: string
  type: "income" | "expense"
}

function App() {
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<TransactionType[]>([])
  const [search, setSearch] = useState("")
  const [newTransactionModalOpen, setNewTransactionModalOpen] = useState(false)
  const [formState, formAction, isSubmitting] = useActionState(
    async (_previousState: { error: string | null }, formData: FormData) => {
      const amount = Number(formData.get("amount"))
      const description = String(formData.get("description") ?? "").trim()
      const category = String(formData.get("category") ?? "").trim()
      const type = formData.get("transaction-type")

      if (!Number.isFinite(amount) || amount <= 0) {
        return { error: "Enter an amount greater than zero." }
      }
      if (!description || !category) {
        return { error: "Enter a description and category." }
      }
      if (type !== "income" && type !== "expense") {
        return { error: "Select a transaction type." }
      }

      try {
        const response = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, description, category, type }),
        })
        if (!response.ok) {
          throw new Error(`Failed to save transaction: ${response.status}`)
        }

        try {
          const [transactionsResponse, summaryResponse] = await Promise.all([
            fetch("/api/transactions"),
            fetch("/api/summary"),
          ])
          if (!transactionsResponse.ok || !summaryResponse.ok) {
            throw new Error("Failed to refresh the budget data")
          }

          const [transactionResult, summary] = await Promise.all([
            transactionsResponse.json() as Promise<
              Array<Omit<TransactionType, "date"> & { date: string }>
            >,
            summaryResponse.json() as Promise<{
              income: number
              expense: number
              balance: number
            }>,
          ])
          setTransactions(
            transactionResult.map((transaction) => ({
              ...transaction,
              date: new Date(transaction.date),
            }))
          )
          setIncome(summary.income)
          setExpense(summary.expense)
          setBalance(summary.balance)
        } catch (error) {
          console.error("Unable to refresh budget data", error)
        }

        setNewTransactionModalOpen(false)
        return { error: null }
      } catch (error) {
        return {
          error:
            error instanceof Error
              ? error.message
              : "Unable to save the transaction.",
        }
      }
    },
    { error: null }
  )

  useEffect(() => {
    const controller = new AbortController()

    fetchSummary(controller).then((summary) => {
      if (summary) {
        setIncome(summary.income)
        setExpense(summary.expense)
        setBalance(summary.balance)
      }
    })

    return () => controller.abort()
  }, [transactions])

  useEffect(() => {
    const controller = new AbortController()

    fetchTransactions(controller).then((transactions) => {
      if (transactions) {
        setTransactions(transactions)
      }
    })

    return () => controller.abort()
  }, [])

  const deleteTransaction = async (transaction: TransactionType) => {
    await deleteTransactionAction(transaction.id)

    // Remove the transaction from the table
    setTransactions((prev) => prev.filter((t) => t.id !== transaction.id))

    // Update the budget summary
    setIncome(
      (prev) => prev - (transaction.type === "income" ? transaction.amount : 0)
    )
    setExpense(
      (prev) => prev - (transaction.type === "expense" ? transaction.amount : 0)
    )
    setBalance(
      (prev) =>
        prev -
        (transaction.type === "income" ? transaction.amount : 0) +
        (transaction.type === "expense" ? transaction.amount : 0)
    )
  }

  const updateSummary = () => {
    const controller = new AbortController()

    fetchSummary(controller).then((summary) => {
      if (summary) {
        setIncome(summary.income)
        setExpense(summary.expense)
        setBalance(summary.balance)
      }
    })

    return () => controller.abort()
  }

  return (
    <>
      <section id="center" className="container mx-auto sm:px-6 lg:px-8">
        <StatsHeader income={income} expense={expense} balance={balance} />
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-left text-base font-semibold text-gray-900 dark:text-white">
                Transactions
              </h1>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                type="button"
                className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
                onClick={() => setNewTransactionModalOpen(true)}
              >
                Add transaction
              </button>
            </div>
          </div>
          <TransactionsTable search={setSearch}>
            {transactions
              .filter(
                (transaction) =>
                  transaction.description
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  transaction.category
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  (search === "income" && transaction.type === "income") ||
                  (search === "expense" && transaction.type === "expense")
              )
              .map((transaction, transactionIdx) => (
                <Transaction
                  transaction={transaction}
                  key={transaction.id}
                  className={
                    transactionIdx !== transactions.length - 1
                      ? "border-b border-gray-200 dark:border-white/10"
                      : ""
                  }
                  onUpdate={() => updateSummary()}
                  onDelete={() => deleteTransaction(transaction)}
                />
              ))}
          </TransactionsTable>
        </div>
      </section>

      <Dialog
        open={newTransactionModalOpen}
        onClose={setNewTransactionModalOpen}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in dark:bg-gray-900/50"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95 dark:bg-gray-800 dark:outline dark:-outline-offset-1 dark:outline-white/10"
            >
              <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  type="button"
                  onClick={() => setNewTransactionModalOpen(false)}
                  className="cursor-pointer rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 dark:bg-gray-800 dark:hover:text-gray-300 dark:focus:outline-white"
                >
                  <span className="sr-only">Close</span>
                  <XIcon aria-hidden="true" className="size-6" />
                </button>
              </div>
              <div className="flex flex-col items-center gap-8">
                <div className="w-full">
                  <form action={formAction}>
                    <div className="px-4 py-6 sm:p-8">
                      <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                          <label
                            htmlFor="amount"
                            className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                          >
                            Amount
                          </label>
                          <div className="mt-2">
                            <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 dark:bg-white/5 dark:outline-1 dark:-outline-offset-1 dark:outline-gray-600 dark:focus-within:outline-indigo-500">
                              <input
                                id="amount"
                                name="amount"
                                type="number"
                                min="0.01"
                                step="0.01"
                                required
                                placeholder="0.00"
                                className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-span-full">
                          <label
                            htmlFor="description"
                            className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                          >
                            Description
                          </label>
                          <div className="mt-2">
                            <textarea
                              id="description"
                              name="description"
                              rows={3}
                              required
                              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-1 dark:-outline-offset-1 dark:outline-gray-600 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                              defaultValue={""}
                            />
                          </div>
                          <p className="mt-3 text-sm/6 text-gray-600 dark:text-gray-400">
                            A short description of this transaction.
                          </p>
                        </div>

                        <fieldset className="col-span-full">
                          <legend className="text-sm/6 font-semibold text-gray-900 dark:text-white">
                            Transaction Type
                          </legend>
                          <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
                            Select the type of this transaction.
                          </p>
                          <div className="mt-6 space-y-6 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                            <div className="flex items-center">
                              <input
                                defaultChecked={true}
                                id="income"
                                name="transaction-type"
                                value="income"
                                type="radio"
                                className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 dark:border-white/10 dark:bg-white/5 dark:checked:border-indigo-500 dark:checked:bg-indigo-500 dark:focus-visible:outline-indigo-500 dark:disabled:border-white/5 dark:disabled:bg-white/10 dark:disabled:before:bg-white/20 forced-colors:appearance-auto forced-colors:before:hidden"
                              />
                              <label
                                htmlFor="income"
                                className="ml-3 block text-sm/6 font-medium text-gray-900 dark:text-white"
                              >
                                Income
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                defaultChecked={false}
                                id="expense"
                                name="transaction-type"
                                value="expense"
                                type="radio"
                                className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 dark:border-white/10 dark:bg-white/5 dark:checked:border-indigo-500 dark:checked:bg-indigo-500 dark:focus-visible:outline-indigo-500 dark:disabled:border-white/5 dark:disabled:bg-white/10 dark:disabled:before:bg-white/20 forced-colors:appearance-auto forced-colors:before:hidden"
                              />
                              <label
                                htmlFor="expense"
                                className="ml-3 block text-sm/6 font-medium text-gray-900 dark:text-white"
                              >
                                Expense
                              </label>
                            </div>
                          </div>
                        </fieldset>

                        <div className="sm:col-span-4">
                          <label
                            htmlFor="category"
                            className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                          >
                            Category
                          </label>
                          <div className="mt-2">
                            <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 dark:bg-white/5 dark:outline-1 dark:-outline-offset-1 dark:outline-gray-600 dark:focus-within:outline-indigo-500">
                              <input
                                id="category"
                                name="category"
                                type="text"
                                required
                                placeholder=""
                                className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {formState.error && (
                      <p
                        role="alert"
                        className="px-4 pb-2 text-sm text-red-600 sm:px-8 dark:text-red-400"
                      >
                        {formState.error}
                      </p>
                    )}

                    <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8 dark:border-white/10">
                      <button
                        type="button"
                        className="text-sm/6 font-semibold text-gray-900 dark:text-white"
                        onClick={() => setNewTransactionModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
                        // onClick={() =>
                        //   addTransaction({
                        //     id: crypto.randomUUID(),
                        //     date: new Date(),
                        //     description,
                        //     amount,
                        //     category,
                        //     type,
                        //   })
                        // }
                      >
                        {isSubmitting ? "Saving…" : "Save"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default App
