'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Search, Filter, ArrowRight, Loader2, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

type Order = {
  id: string; status: string; finalPrice: number; createdAt: string; mpesaReceipt: string | null;
  service: { name: string }; user: { name: string; email: string; phone: string };
};

const STATUS_STYLE: Record<string, string> = {
  PENDING:    'bg-amber-50 text-amber-700 border-amber-200',
  PAID:       'bg-blue-50 text-blue-700 border-blue-200',
  PROCESSING: 'bg-purple-50 text-purple-700 border-purple-200',
  COMPLETED:  'bg-green-50 text-green-700 border-green-200',
  REJECTED:   'bg-red-50 text-red-700 border-red-200',
};

const STATUSES = ['', 'PENDING', 'PAID', 'PROCESSING', 'COMPLETED', 'REJECTED'];

export default function AdminOrdersPage() {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [total, setTotal]     = useState(0);
  const [pages, setPages]     = useState(1);
  const [loading, setLoading] = useState(true);
  const [status, setStatus]   = useState('');
  const [search, setSearch]   = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage]       = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
        ...(status ? { status } : {}),
        ...(search ? { search } : {}),
      });
      const res = await fetch(`/api/admin/orders?${params}`);
      if (res.ok) {
        const d = await res.json();
        setOrders(d.orders || []);
        setTotal(d.total || 0);
        setPages(d.pages || 1);
      }
    } finally { setLoading(false); }
  }, [status, search, page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">All Orders</h1>
          <p className="text-sm text-gray-400 font-bold mt-1">{total} total requests</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-100 shadow-sm text-sm font-black text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex gap-3 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search by name, email, phone or ID…"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-sha-500 focus:ring-4 focus:ring-sha-500/10 outline-none font-bold text-sm transition-all placeholder:text-gray-300"
            />
          </div>
          <button type="submit" className="px-5 py-3 bg-sha-700 text-white rounded-xl font-black text-sm hover:bg-sha-600 transition-all">
            Search
          </button>
        </form>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 font-black text-sm outline-none focus:border-sha-500 transition-all"
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>{s || 'All Statuses'}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-10 h-10 text-sha-600 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/60">
                <tr>
                  {['Tracking ID', 'Customer', 'Service', 'Amount', 'M-Pesa', 'Status', 'Date', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-16 text-gray-400 font-bold">No orders found</td></tr>
                ) : orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-black text-sha-700 tracking-wider text-xs font-mono">{order.id.slice(0, 8).toUpperCase()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-900">{order.user.name}</p>
                      <p className="text-xs text-gray-400">{order.user.phone}</p>
                      <p className="text-xs text-gray-300">{order.user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-700 text-xs max-w-[160px] truncate">{order.service.name}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-black text-gray-900">Ksh {order.finalPrice?.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      {order.mpesaReceipt ? (
                        <span className="text-[10px] font-black text-green-600 bg-green-50 border border-green-200 px-2 py-1 rounded-lg">{order.mpesaReceipt}</span>
                      ) : (
                        <span className="text-[10px] text-gray-300 font-bold">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black border whitespace-nowrap ${STATUS_STYLE[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs text-gray-400 font-bold whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/admin/orders/${order.id}`}
                        className="flex items-center gap-1 text-xs font-black text-sha-600 hover:text-sha-700 whitespace-nowrap">
                        Manage <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
            <p className="text-xs text-gray-400 font-bold">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page >= pages}
                className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
