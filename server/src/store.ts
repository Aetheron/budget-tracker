import { randomUUID } from "node:crypto"
import { mkdir, readFile, rename, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"

export type TransactionType = "income" | "expense"

export type Transaction = {
  id: string
  date: string
  amount: number
  description: string
  category: string
  type: TransactionType
}

export type NewTransaction = Omit<Transaction, "id" | "date">

export class TransactionStore {
  private writes: Promise<void> = Promise.resolve()

  constructor(
    private readonly filePath = resolve(
      process.cwd(),
      process.env.DATA_FILE ?? "data/transactions.json"
    )
  ) {}

  async initialize(): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true })

    try {
      await readFile(this.filePath, "utf8")
    } catch (error) {
      if (!isNodeError(error) || error.code !== "ENOENT") {
        throw error
      }
      await writeFile(this.filePath, "[]\n", "utf8")
    }
  }

  async list(): Promise<Transaction[]> {
    await this.writes
    const transactions = await this.readTransactions()
    return transactions.sort((a, b) => b.date.localeCompare(a.date))
  }

  async create(input: NewTransaction): Promise<Transaction> {
    const write = this.writes.then(async () => {
      const transactions = await this.readTransactions()
      const transaction: Transaction = {
        ...input,
        id: randomUUID(),
        date: new Date().toISOString(),
      }

      transactions.push(transaction)
      await this.persist(transactions)
      return transaction
    })

    this.writes = write.then(
      () => undefined,
      () => undefined
    )

    return write
  }

  async update(id: string, input: NewTransaction): Promise<Transaction> {
    const write = this.writes.then(async () => {
      const transactions = await this.readTransactions()
      const index = transactions.findIndex((t) => t.id === id)
      if (index === -1) {
        throw new Error(`Transaction with id ${id} not found.`)
      }
      const updatedTransaction: Transaction = {
        ...transactions[index],
        ...input,
      }
      transactions[index] = updatedTransaction
      await this.persist(transactions)
      return updatedTransaction
    })

    this.writes = write.then(
      () => undefined,
      () => undefined
    )

    return write
  }

  async updatePartial(
    id: string,
    input: Partial<NewTransaction>
  ): Promise<Transaction> {
    const write = this.writes.then(async () => {
      const transactions = await this.readTransactions()
      const index = transactions.findIndex((t) => t.id === id)
      if (index === -1) {
        throw new Error(`Transaction with id ${id} not found.`)
      }
      const updatedTransaction: Transaction = {
        ...transactions[index],
        ...input,
      }
      transactions[index] = updatedTransaction
      await this.persist(transactions)
      return updatedTransaction
    })

    this.writes = write.then(
      () => undefined,
      () => undefined
    )

    return write
  }

  async summary(): Promise<{
    income: number
    expense: number
    balance: number
  }> {
    const transactions = await this.list()
    const incomeCents = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce(
        (total, transaction) => total + Math.round(transaction.amount * 100),
        0
      )
    const expenseCents = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce(
        (total, transaction) => total + Math.round(transaction.amount * 100),
        0
      )

    return {
      income: incomeCents / 100,
      expense: expenseCents / 100,
      balance: (incomeCents - expenseCents) / 100,
    }
  }

  private async readTransactions(): Promise<Transaction[]> {
    const contents = await readFile(this.filePath, "utf8")
    const transactions: unknown = JSON.parse(contents)
    if (!Array.isArray(transactions)) {
      throw new Error("Transaction data must be a JSON array.")
    }
    return transactions as Transaction[]
  }

  private async persist(transactions: Transaction[]): Promise<void> {
    const temporaryPath = `${this.filePath}.${randomUUID()}.tmp`
    await writeFile(
      temporaryPath,
      `${JSON.stringify(transactions, null, 2)}\n`,
      "utf8"
    )
    await rename(temporaryPath, this.filePath)
  }
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error
}
