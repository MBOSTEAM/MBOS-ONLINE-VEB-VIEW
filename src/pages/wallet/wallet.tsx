import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWallet, useTransactions, useTopUpWallet } from '@/config/queries/wallet/wallet.queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function WalletPage() {
  const { data: walletResp, isLoading: walletLoading } = useWallet()
  const [page, setPage] = useState(1)
  const { data: txResp, isLoading: txLoading } = useTransactions({ page, limit: 10 })

  const [amount, setAmount] = useState<string>('')
  const { mutate: topUp, isPending } = useTopUpWallet()

  const handleTopUp = () => {
    const parsed = Number(amount)
    if (!parsed || parsed <= 0 || !isFinite(parsed)) return
    topUp(
      { amount: parsed, payment_method: 'payme' },
      {
        onSuccess: (res) => {
          const url = res?.data?.payment_url
          if (url) {
            window.location.href = url
          }
        }
      }
    )
  }

  const wallet = walletResp?.data
  const transactions = txResp?.data ?? []
  const pagination = txResp?.pagination

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Link to="/profile" className="p-2 rounded-full bg-muted">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18l-6-6 6-6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <h1 className="text-lg font-semibold">Wallet</h1>
      </div>

      <div className="bg-blue-500 rounded-xl p-4 text-white flex justify-between items-center">
        <div>
          <p className="text-base opacity-80">Balance</p>
          <h3 className="text-2xl font-bold">
            {walletLoading ? '...' : `${(wallet?.balance ?? 0).toLocaleString('ru-RU')} ${wallet?.currency ?? 'UZS'}`}
          </h3>
        </div>
      </div>

      <div className="bg-muted rounded-xl p-4 space-y-3">
        <h2 className="text-base font-medium">Top Up</h2>
        <div className="flex gap-2">
          <Input
            type="number"
            inputMode="decimal"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button onClick={handleTopUp} disabled={isPending || !amount}>
            {isPending ? 'Redirecting...' : 'Top Up'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Payment method: Payme</p>
      </div>

      <div className="bg-muted rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-medium">Transactions</h2>
          <span className="text-xs text-muted-foreground">
            {txLoading ? '...' : `${pagination?.total ?? 0} total`}
          </span>
        </div>
        <div className="space-y-2">
          {txLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
          {!txLoading && transactions.length === 0 && (
            <div className="text-sm text-muted-foreground">No transactions</div>
          )}
          {transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-lg bg-background px-3 py-2">
              <div className="flex flex-col">
                <span className="text-sm font-medium capitalize">{t.type}</span>
                <span className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString()}</span>
              </div>
              <div className="text-right">
                <span className={`text-sm font-semibold ${t.direction === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.direction === 'credit' ? '+' : '-'}{t.amount.toLocaleString('ru-RU')}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-3">
          <Button
            variant="outline"
            disabled={txLoading || (pagination?.page ?? 1) <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <span className="text-xs text-muted-foreground">
            {pagination ? `${pagination.page}/${pagination.total_pages}` : ''}
          </span>
          <Button
            variant="outline"
            disabled={txLoading || (pagination?.page ?? 1) >= (pagination?.total_pages ?? 1)}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}


