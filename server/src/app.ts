import express, { type ErrorRequestHandler } from "express"
import { z } from "zod"
import { TransactionStore } from "./store.js"

const newTransactionSchema = z.object({
  amount: z.number().finite().positive(),
  description: z.string().trim().min(1).max(200),
  category: z.string().trim().min(1).max(100),
  type: z.enum(["income", "expense"]),
})

const updateTransactionSchema = z.object({
  amount: z.number().finite().positive(),
  description: z.string().trim().min(1).max(200),
  category: z.string().trim().min(1).max(100),
})

export function createApp(store: TransactionStore) {
  const app = express()

  app.disable("x-powered-by")
  app.use(express.json({ limit: "16kb" }))

  app.get("/api/health", (_request, response) => {
    response.json({ status: "ok" })
  })

  // Get all transactions
  app.get("/api/transactions", async (_request, response, next) => {
    try {
      response.json(await store.list())
    } catch (error) {
      next(error)
    }
  })

  // Add a new transaction
  app.post("/api/transactions", async (request, response, next) => {
    const result = newTransactionSchema.safeParse(request.body)
    if (!result.success) {
      response.status(400).json({
        error: "Invalid transaction.",
        details: result.error.flatten().fieldErrors,
      })
      return
    }

    try {
      response.status(201).json(await store.create(result.data))
    } catch (error) {
      next(error)
    }
  })

  // Update an existing transaction
  app.put("/api/transactions/:id", async (request, response, next) => {
    const result = newTransactionSchema.safeParse(request.body)
    if (!result.success) {
      response.status(400).json({
        error: "Invalid transaction.",
        details: result.error.flatten().fieldErrors,
      })
      return
    }

    try {
      response.json(await store.update(request.params.id, result.data))
    } catch (error) {
      next(error)
    }
  })

  app.patch("/api/transactions/:id", async (request, response, next) => {
    const result = updateTransactionSchema.safeParse(request.body)
    if (!result.success) {
      response.status(400).json({
        error: "Invalid transaction.",
        details: result.error.flatten().fieldErrors,
      })
      return
    }

    try {
      response.json(await store.updatePartial(request.params.id, result.data))
    } catch (error) {
      next(error)
    }
  })

  // Return total income, total expenses, and net balance
  app.get("/api/summary", async (_request, response, next) => {
    try {
      response.json(await store.summary())
    } catch (error) {
      next(error)
    }
  })

  // Delete a transaction
  app.delete("/api/transactions/:id", async (request, response, next) => {
    try {
      await store.delete(request.params.id)
      response.status(204).end()
    } catch (error) {
      next(error)
    }
  })

  const handleError: ErrorRequestHandler = (
    error,
    _request,
    response,
    _next
  ) => {
    if (error instanceof SyntaxError && "body" in error) {
      response.status(400).json({ error: "Request body must be valid JSON." })
      return
    }

    console.error("API request failed", error)
    response.status(500).json({ error: "Internal server error." })
  }
  app.use(handleError)

  return app
}
