import { useEffect, useState } from "react"
import "./App.css"
import StatsHeader from "./components/stats-header"
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

  useEffect(() => {
    const controller = new AbortController()

    async function fetchSummary() {
      try {
        const response = await fetch("/api/summary", {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Failed to fetch summary: ${response.status}`)
        }

        const summary: {
          income: number
          expense: number
          balance: number
        } = await response.json()

        setIncome(summary.income)
        setExpense(summary.expense)
        setBalance(summary.balance)
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Unable to load budget summary", error)
        }
      }
    }

    void fetchSummary()

    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function fetchTransactions() {
      try {
        const response = await fetch("/api/transactions", {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Failed to fetch transactions: ${response.status}`)
        }

        const result: Array<Omit<TransactionType, "date"> & { date: string }> =
          await response.json()
        setTransactions(
          result.map((transaction) => ({
            ...transaction,
            date: new Date(transaction.date),
          }))
        )
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Unable to load transactions", error)
        }
      }
    }

    void fetchTransactions()

    return () => controller.abort()
  }, [])

  return (
    <>
      <section id="center" className="container mx-auto sm:px-6 lg:px-8">
        <StatsHeader income={income} expense={expense} balance={balance} />
        <TransactionsTable transactions={transactions} />
      </section>
    </>
  )
}

export default App
