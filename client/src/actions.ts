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
