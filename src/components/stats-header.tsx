export default function StatsHeader({
  income,
  expense,
  balance,
}: {
  income: number
  expense: number
  balance: number
}) {
  return (
    <div className="w-full border-b border-b-gray-900/10 lg:border-t lg:border-t-gray-900/5 dark:border-b-white/10 dark:lg:border-t-white/5">
      <dl className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:px-2 xl:px-0">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-gray-900/5 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8 dark:border-white/5">
          <dt className="w-full text-sm/6 font-medium text-gray-500 dark:text-gray-400">
            Income
          </dt>
          {/* <dd
                    className='text-gray-700 dark:text-gray-300 text-xs font-medium'
                    
                  >
                    {stat.change}
                  </dd> */}
          <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900 dark:text-white">
            ${income}
          </dd>
        </div>
        <div className="sm:border-l flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-gray-900/5 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8 dark:border-white/5">
          <dt className="w-full text-sm/6 font-medium text-gray-500 dark:text-gray-400">
            Expense
          </dt>
          {/* <dd
                    className={classNames(
                      stat.changeType === 'negative'
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-gray-700 dark:text-gray-300',
                      'text-xs font-medium',
                    )}
                  >
                    {stat.change}
                  </dd> */}
          <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900 dark:text-white">
            ${expense}
          </dd>
        </div>
        <div className="lg:border-l flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-gray-900/5 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8 dark:border-white/5 md:col-span-2 lg:col-span-1">
          <dt className="w-full text-sm/6 font-medium text-gray-500 dark:text-gray-400">
            Balance
          </dt>
          {/* <dd
                    className={classNames(
                      stat.changeType === 'negative'
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-gray-700 dark:text-gray-300',
                      'text-xs font-medium',
                    )}
                  >
                    {stat.change}
                  </dd> */}
          <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900 dark:text-white">
            ${balance}
          </dd>
        </div>
      </dl>
    </div>
  )
}
