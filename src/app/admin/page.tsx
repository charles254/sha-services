'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ClipboardList, Clock, Zap, CheckCircle2, XCircle,
  TrendingUp, Users, ArrowRight, Loader2, RefreshCw,
} from 'lucide-react';

type Stats = {
  total: number; pending: number; paid: number;
  processing: number; completed: number; rejected: number;
  revenue: number; todayOrders: number;
};

type Order = {
  id: string; status: string; finalPrice: number; createdAt: string;
  service: { name: string }; user: { name: string; phone: string };
};

const STATUS_STYLE: Record<string, string> = {
  PENDING:    'bg-amber-50 text-amber-700 border-amber-200',
  PAID:       'bg-blue-50 text-blue-700 border-blue-200',
  PROCESSING: 'bg-purple-50 text-purple-700 border-purple-200',
  COMPLETED:  'bg-green-50 text-green-700 border-green-200',
  REJECTED:   'bg-red-50 text-red-700 border-red-200',
};

export default function AdminDashboardPage() {
  const [stats, setStats]     = useState<Stats | null>(null);
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (quiet = false) => {
    if (!quiet) setLoading(true); else setRefreshing(true);
    try {
      const [sRes, oRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/orders?limit=8&page=1'),
      ]);
      if (sRes.ok) setStats(await sRes.json());
      if (oRes.ok) { const d = await oRes.json(); setOrders(d.orders || []); }
    } catch { /* ignore */ }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchData(); }, []);
  // Auto-refresh every 30 seconds
  useEffect(() => {
    const id = setInterval(() => fetchData(true), 30_000);
    return () => clearInterval(id);
  }, []);

  const STAT_CARDS = stats ? [
    { label: 'Total Orders',    value: stats.total,      icon: ClipboardList, color: 'bg-sha-600',   text: 'text-sha-50' },
    { label: 'Pending Payment', value: stats.pending,    icon: Clock,         color: 'bg-amber-500', text: 'text-amber-50' },
    { label: 'In Progress',     value: stats.paid + stats.processing, icon: Zap, color: 'bg-blue-600', text: 'text-blue-50' },
    { label: 'Completed',       value: stats.completed,  icon: CheckCircle2,  color: 'bg-green-600', text: 'text-green-50' },
    { label: 'Rejected',        value: stats.rejected,   icon: XCircle,       color: 'bg-red-500',   text: 'text-red-50' },
    { label: 'Today\'s Orders', value: stats.todayOrders,icon: TrendingUp,    color: 'bg-purple-600',text: 'text-purple-50' },
  ] : [];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-10 h-10 text-sha-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 font-bold mt-1">
            {new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-100 shadow-sm text-sm font-black text-gray-600 hover:bg-gray-50 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Revenue banner */}
      {stats && (
        <div className="bg-sha-900 rounded-[2rem] p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-sha-400">Total Revenue Collected</p>
            <p className="text-5xl font-black text-white mt-1">
              Ksh {stats.revenue.toLocaleString()}
            </p>
            <p className="text-sha-400 text-xs font-bold mt-1">From PAID + PROCESSING + COMPLETED orders</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Users className="w-5 h-5 text-sha-400" />
            <div>
              <p className="font-black text-white">{stats.total} Total Requests</p>
              <p className="text-[10px] text-sha-400 font-bold">{stats.todayOrders} new today</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, text }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${text}`} />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900">{value}</p>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-black text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="flex items-center gap-1.5 text-xs font-black text-sha-600 hover:text-sha-700">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/60">
              <tr>
                {['Tracking ID', 'Customer', 'Service', 'Amount', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400 font-bold">No orders yet</td></tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-black text-sha-700 tracking-wider text-xs">{order.id.slice(0, 8).toUpperCase()}…</span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-gray-900">{order.user.name}</p>
                    <p className="text-xs text-gray-400">{order.user.phone}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-gray-700 text-xs">{order.service.name}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-black text-gray-900">Ksh {order.finalPrice?.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black border ${STATUS_STYLE[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-gray-400 font-bold">
                      {new Date(order.createdAt).toLocaleDateString('en-KE', { day: '2-digit', month: 'short' })}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/orders/${order.id}`}
                      className="flex items-center gap-1 text-xs font-black text-sha-600 hover:text-sha-700">
                      Manage <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
