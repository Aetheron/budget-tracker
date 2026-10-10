import "dotenv/config"
import { createApp } from "./app.js"
import { TransactionStore } from "./store.js"

const port = Number(process.env.PORT ?? 3001)
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535.")
}

const store = new TransactionStore()
await store.initialize()

const app = createApp(store)
app.listen(port, () => {
  console.log(`Budget tracker API listening on http://localhost:${port}`)
})
