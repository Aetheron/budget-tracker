import type { TransactionType } from "./App"

export const fetchSummary = async (controller: AbortController) => {
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

    return summary
  } catch (error) {
    if (!controller.signal.aborted) {
      console.error("Unable to load budget summary", error)
    }
  }
}

export const fetchTransactions = async (controller: AbortController) => {
  try {
    const response = await fetch("/api/transactions", {
      signal: controller.signal,
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.status}`)
    }

    const result: Array<Omit<TransactionType, "date"> & { date: string }> =
      await response.json()

    return result.map<TransactionType>((transaction) => ({
      ...transaction,
      date: new Date(transaction.date),
    }))
  } catch (error) {
    if (!controller.signal.aborted) {
      console.error("Unable to load transactions", error)
    }
  }
}
