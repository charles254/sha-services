'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Search, Clock, CheckCircle2, Loader2, AlertCircle,
  ShieldCheck, ArrowRight, ChevronRight, Package,
  FileText, Download
} from 'lucide-react';
import Link from 'next/link';

type Order = {
  id: string;
  status: 'PENDING' | 'PAID' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  service: { name: string };
  createdAt: string;
  updatedAt: string;
  finalPrice: number;
  notes?: string;
  documents?: { fileType: string; fileUrl: string }[];
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  PENDING:    { label: 'Awaiting Payment',    color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200',  icon: Clock },
  PAID:       { label: 'Payment Confirmed',   color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',    icon: ShieldCheck },
  PROCESSING: { label: 'Agent Processing',    color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200',icon: Loader2 },
  COMPLETED:  { label: 'Completed',           color: 'text-green-700',  bg: 'bg-green-50 border-green-200',  icon: CheckCircle2 },
  REJECTED:   { label: 'Rejected',            color: 'text-red-700',    bg: 'bg-red-50 border-red-200',      icon: AlertCircle },
};

const TIMELINE = ['PENDING', 'PAID', 'PROCESSING', 'COMPLETED'];

function TrackContent() {
  const searchParams = useSearchParams();
  const [trackingId, setTrackingId] = useState(searchParams.get('id') || '');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(!!searchParams.get('id'));

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) { setError('Please enter a tracking ID.'); return; }
    setLoading(true); setError(null); setOrder(null);
    try {
      const res = await fetch(`/api/sha/track?id=${encodeURIComponent(trackingId.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      } else {
        setError('No request found with that Tracking ID. Please check and try again.');
      }
    } catch {
      setError('Connection error. Please try again.');
    }
    setHasSearched(true);
    setLoading(false);
  };

  const config = order ? STATUS_CONFIG[order.status] : null;
  const statusIdx = order ? TIMELINE.indexOf(order.status) : -1;
  const finalDocs = order?.documents?.filter(d => d.fileType === 'FINAL_OUTPUT') || [];

  return (
    <main className="min-h-screen mesh-bg grainy pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-12">
          <Link href="/" className="hover:text-sha-600">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span className="text-gray-900">Track Request</span>
        </nav>

        <div className="text-center mb-12 space-y-4">
          <div className="badge-green mx-auto w-fit">Real-Time Tracking</div>
          <h1 className="text-5xl font-black text-gray-900">Track Your<br /><span className="text-sha-600">SHA Request</span></h1>
          <p className="text-gray-500 font-medium">Enter the Tracking ID you received after submitting your request.</p>
        </div>

        {/* Search Form */}
        <div className="card mb-8">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                value={trackingId}
                onChange={e => { setTrackingId(e.target.value); setError(null); }}
                placeholder="e.g. SHA-PH-ABC123"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-sha-500/10 focus:border-sha-500 transition-all outline-none font-bold placeholder:text-gray-300 uppercase text-sm"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-6 whitespace-nowrap">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-5 h-5" />Track</>}
            </button>
          </form>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />{error}
            </div>
          )}
        </div>

        {/* Result */}
        {order && config && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {/* Status Header */}
            <div className={`card p-6 border ${config.bg}`}>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${config.bg.split(' ')[0]} border ${config.bg.split(' ')[1]}`}>
                  <config.icon className={`w-7 h-7 ${config.color} ${order.status === 'PROCESSING' ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Request Status</p>
                  <p className={`text-2xl font-black ${config.color}`}>{config.label}</p>
                  <p className="text-sm text-gray-500 font-bold">{order.service.name}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total</p>
                  <p className="font-black text-gray-900 text-lg">Ksh {order.finalPrice}</p>
                </div>
              </div>
            </div>

            {/* Results / Downloads */}
            {order.status === 'COMPLETED' && finalDocs.length > 0 && (
              <div className="card p-6 border-2 border-green-500 bg-green-50/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-200">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-gray-900">Final Results Ready!</h3>
                    <p className="text-sm text-gray-500 font-medium mb-4">Your SHA request has been processed successfully. You can download your documents below:</p>
                    <div className="space-y-2">
                       {finalDocs.map((doc, idx) => (
                         <a 
                          key={idx} 
                          href={doc.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-white border border-green-100 rounded-2xl hover:border-green-300 hover:shadow-md transition-all group"
                         >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                                <FileText className="w-4 h-4 text-green-600" />
                              </div>
                              <span className="text-sm font-black text-gray-800">Processed Document {finalDocs.length > 1 ? idx + 1 : ''}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-black text-green-600">
                              Download <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                            </div>
                         </a>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Timeline */}
            <div className="card">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Progress Timeline</p>
              <div className="space-y-0">
                {TIMELINE.map((status, i) => {
                  const s = STATUS_CONFIG[status];
                  if (!s) return null;
                  const isDone = statusIdx > i;
                  const isCurrent = statusIdx === i;
                  const Icon = s.icon;
                  return (
                    <div key={status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${isDone ? 'bg-green-500' : isCurrent ? 'bg-sha-600' : 'bg-gray-100'}`}>
                          {isDone ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Icon className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-gray-400'} ${isCurrent && status === 'PROCESSING' ? 'animate-spin' : ''}`} />}
                        </div>
                        {i < TIMELINE.length - 1 && <div className={`w-0.5 h-8 my-1 rounded-full ${isDone ? 'bg-green-500' : 'bg-gray-100'}`} />}
                      </div>
                      <div className="pb-8">
                        <p className={`font-black text-sm ${isDone ? 'text-green-700' : isCurrent ? 'text-sha-700' : 'text-gray-400'}`}>{s.label}</p>
                        {isCurrent && <p className="text-xs text-gray-400 font-medium mt-0.5">Currently at this stage</p>}
                        {isDone && <p className="text-xs text-green-600 font-bold mt-0.5">✓ Completed</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Details Card */}
            <div className="card">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Request Details</p>
              <div className="space-y-3">
                {[
                  ['Tracking ID', order.id],
                  ['Service', order.service.name],
                  ['Submitted', new Date(order.createdAt).toLocaleDateString('en-KE', { dateStyle: 'full' })],
                  ['Last Updated', new Date(order.updatedAt).toLocaleDateString('en-KE', { dateStyle: 'full' })],
                ].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{l}</span>
                    <span className="text-sm font-black text-gray-800 text-right max-w-[200px]">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {(order.status !== 'COMPLETED' || finalDocs.length === 0) && order.status !== 'REJECTED' && (
              <div className="p-5 bg-sha-50 rounded-2xl border border-sha-100 flex items-center gap-4">
                <ShieldCheck className="w-8 h-8 text-sha-600 flex-shrink-0" />
                <div>
                  <p className="font-black text-sha-800">Need Help?</p>
                  <p className="text-xs text-sha-600 font-medium">Chat with our agent on WhatsApp for any updates.</p>
                </div>
                <a href="https://wa.me/254719628275" target="_blank" rel="noopener noreferrer"
                  className="ml-auto flex items-center gap-2 text-xs font-black text-sha-600 hover:text-sha-700 whitespace-nowrap">
                  WhatsApp <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {!hasSearched && !order && (
          <div className="card text-center py-16">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="font-black text-gray-400 text-lg">Enter your Tracking ID above</p>
            <p className="text-sm text-gray-400 font-medium mt-2">You received it via SMS and email after submitting your request.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-sm text-gray-400 font-bold mb-4">Need to submit a new request?</p>
          <Link href="/#services" className="btn-outline inline-flex items-center gap-2">
            View All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-sha-600" /></div>}>
      <TrackContent />
    </Suspense>
  );
}
