import { motion } from 'framer-motion';
import {
  ArrowUpRight, ArrowDownLeft, TrendingUp, Wallet,
  Sparkles, CreditCard, DollarSign, Euro,
  Send, Bell, Search, Plus, ChevronRight,
  Shield, Globe, CheckCircle2
} from 'lucide-react';
import CountUp from 'react-countup';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';

const transactions = [
  { id: 1, type: 'credit', description: 'Payment from Acme Corp', sender: 'Acme Corp', avatar: 'AC', amount: 2450.0, currency: 'USD', time: '2 min ago', status: 'completed' },
  { id: 2, type: 'debit', description: 'AWS Infrastructure', sender: 'Amazon Web Services', avatar: 'AW', amount: 847.32, currency: 'USD', time: '1 hour ago', status: 'completed' },
  { id: 3, type: 'credit', description: 'Subscription Revenue', sender: 'Stripe', avatar: 'ST', amount: 1200.0, currency: 'USD', time: '3 hours ago', status: 'pending' },
];

const wallets = [
  { currency: 'USD', symbol: '$', balance: 24847.5, change: 12.4, icon: DollarSign, gradient: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/25' },
  { currency: 'EUR', symbol: '€', balance: 8420.0, change: 8.2, icon: Euro, gradient: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-500/25' },
  { currency: 'GBP', symbol: '£', balance: 5230.75, change: 15.1, icon: Globe, gradient: 'from-violet-400 to-purple-500', shadow: 'shadow-violet-500/25' },
];

const quickActions = [
  { icon: Send, label: 'Send', gradient: 'from-indigo-500 to-violet-500' },
  { icon: Plus, label: 'Add', gradient: 'from-emerald-500 to-teal-500' },
  { icon: CreditCard, label: 'Cards', gradient: 'from-pink-500 to-rose-500' },
];

export function DashboardPreview() {
  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount);

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  return (
    <div className="relative">
      {}
      <div className="absolute -inset-8 bg-gradient-to-r from-indigo-500/25 via-violet-500/25 to-pink-500/25 rounded-[50px] blur-3xl opacity-70" />
      <div className="absolute -inset-4 bg-gradient-to-br from-blue-400/15 to-purple-400/15 rounded-[40px] blur-2xl" />

      {}
      <motion.div
        initial={{ opacity: 0, x: -30, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.4, type: 'spring', stiffness: 100 }}
        className="absolute -top-6 -left-10 z-20 hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-200/60 px-4 py-3 flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">+$2,450 received</p>
            <p className="text-[10px] text-slate-500">Just now</p>
          </div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
        </motion.div>
      </motion.div>

      {}
      <motion.div
        initial={{ opacity: 0, x: 30, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.6, type: 'spring', stiffness: 100 }}
        className="absolute -bottom-8 -right-8 z-20 hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl shadow-slate-400/30 px-5 py-4 text-white"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/40">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Portfolio Growth</p>
              <p className="text-xl font-bold text-emerald-400">+24.8%</p>
            </div>
            <Sparkles className="w-5 h-5 text-amber-400 ml-1" />
          </div>
        </motion.div>
      </motion.div>

      {}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute -top-3 -right-4 z-20 hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl px-3 py-2 flex items-center gap-2 shadow-xl shadow-emerald-500/30"
        >
          <Shield className="w-4 h-4" />
          <span className="text-xs font-bold">Secured</span>
        </motion.div>
      </motion.div>

      {}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        whileHover={{ y: -4 }}
        className="relative bg-white/95 backdrop-blur-2xl rounded-[32px] shadow-[0_25px_80px_-20px_rgba(0,0,0,0.15),0_10px_30px_-10px_rgba(0,0,0,0.1)] overflow-hidden"
      >
        {}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/30 pointer-events-none" />

        {}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {}
        <div className="relative px-6 py-5 bg-gradient-to-r from-slate-50/80 via-white/60 to-indigo-50/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.05 }}
                className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/35"
              >
                <Wallet className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Dashboard</h3>
                <p className="text-xs text-slate-500">Welcome back, Alex 👋</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 bg-slate-100/80 hover:bg-slate-200/80 rounded-xl transition-colors"
              >
                <Search className="w-4 h-4 text-slate-500" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 bg-slate-100/80 hover:bg-slate-200/80 rounded-xl transition-colors relative"
              >
                <Bell className="w-4 h-4 text-slate-500" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
              </motion.button>
              <div className="flex items-center gap-2 pl-3 ml-1">
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"
                />
                <span className="text-xs font-semibold text-emerald-600">Live</span>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="relative px-6 pb-6 pt-4 space-y-5">
          {}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 rounded-3xl p-6 text-white"
          >
            {}
            <motion.div
              animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-br from-indigo-500/30 via-violet-500/20 to-transparent rounded-full blur-3xl"
            />
            <motion.div
              animate={{ x: [0, -20, 0], y: [0, 25, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-10 -left-10 w-44 h-44 bg-gradient-to-tr from-emerald-500/25 to-cyan-500/15 rounded-full blur-3xl"
            />

            {}
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />

            <div className="relative">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" />
                    Total Balance
                  </p>
                  <p className="text-4xl font-bold mt-2 tracking-tight bg-gradient-to-r from-white via-white to-slate-300 bg-clip-text text-transparent">
                    $<CountUp end={totalBalance} decimals={2} duration={2.5} separator="," />
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 backdrop-blur-sm rounded-xl text-emerald-400 text-sm font-semibold">
                      <TrendingUp className="w-4 h-4" />
                      +18.2%
                    </span>
                    <span className="text-xs text-slate-500">vs last month</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {quickActions.map((action, i) => (
                    <motion.button
                      key={action.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-11 h-11 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center shadow-lg transition-all`}
                      title={action.label}
                    >
                      <action.icon className="w-5 h-5 text-white" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-900 text-sm">My Wallets</h4>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs text-indigo-600 font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50/80 hover:bg-indigo-100/80 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </motion.button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {wallets.map((wallet, i) => (
                <motion.div
                  key={wallet.currency}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative bg-gradient-to-br from-white to-slate-50/80 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {}
                  <div className={`absolute inset-0 bg-gradient-to-br ${wallet.gradient} opacity-0 group-hover:opacity-[0.08] transition-all duration-300`} />

                  {}
                  <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${wallet.gradient} opacity-0 group-hover:opacity-100 transition-all duration-300`} />

                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${wallet.gradient} rounded-xl flex items-center justify-center shadow-lg ${wallet.shadow}`}>
                        <wallet.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-bold text-slate-400">{wallet.currency}</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900 tracking-tight">
                      {wallet.symbol}<CountUp end={wallet.balance} duration={2} delay={0.6 + i * 0.2} decimals={0} separator="," />
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold bg-emerald-50/80 px-2 py-0.5 rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        +{wallet.change}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {}
          <div className="bg-slate-50/60 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 text-sm">Recent Activity</h4>
                <span className="px-2 py-0.5 bg-indigo-100/80 text-indigo-600 text-[10px] font-bold rounded-full">
                  {transactions.length} new
                </span>
              </div>
              <motion.button
                whileHover={{ x: 3 }}
                className="flex items-center gap-1 text-xs text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
              >
                View all
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
            <div className="space-y-2">
              {transactions.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.8)' }}
                  className="group flex items-center gap-3 p-3 rounded-xl bg-white/60 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="relative">
                    <Avatar className="w-10 h-10 shadow-md">
                      <AvatarFallback className={`text-xs font-bold ${tx.type === 'credit' ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white' : 'bg-gradient-to-br from-rose-400 to-pink-500 text-white'}`}>
                        {tx.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center shadow-md ${tx.type === 'credit' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                      {tx.type === 'credit' ? <ArrowDownLeft className="w-2.5 h-2.5 text-white" /> : <ArrowUpRight className="w-2.5 h-2.5 text-white" />}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900 truncate">{tx.description}</p>
                      {tx.status === 'pending' && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full font-bold">Pending</span>
                      )}
                      {tx.status === 'completed' && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span>{tx.sender}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span>{tx.time}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">{tx.currency}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}