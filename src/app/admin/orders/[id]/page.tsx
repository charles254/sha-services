'use client';

import { useEffect, useState, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft, Loader2, CheckCircle2, Clock, Zap,
  XCircle, ShieldCheck, Phone, Mail, FileText,
  ExternalLink, AlertCircle, Download,
} from 'lucide-react';

type Document = { fileUrl: string; fileType: string };
type Order = {
  id: string; status: string; finalPrice: number; mpesaReceipt: string | null;
  notes: string | null; createdAt: string; updatedAt: string;
  service:   { name: string; slug: string; price: number };
  user:      { name: string; email: string; phone: string };
  documents: Document[];
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  PENDING:    { label: 'Awaiting Payment',  color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200',  icon: Clock },
  PAID:       { label: 'Payment Confirmed', color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',    icon: ShieldCheck },
  PROCESSING: { label: 'Agent Processing',  color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200',icon: Zap },
  COMPLETED:  { label: 'Completed',         color: 'text-green-700',  bg: 'bg-green-50 border-green-200',  icon: CheckCircle2 },
  REJECTED:   { label: 'Rejected',          color: 'text-red-700',    bg: 'bg-red-50 border-red-200',      icon: XCircle },
};

// Valid next statuses for each current status
const NEXT_STATUSES: Record<string, string[]> = {
  PENDING:    ['PAID', 'REJECTED'],
  PAID:       ['PROCESSING', 'REJECTED'],
  PROCESSING: ['COMPLETED', 'REJECTED'],
  COMPLETED:  [],
  REJECTED:   [],
};

const ACTION_STYLE: Record<string, string> = {
  PAID:       'bg-blue-600 hover:bg-blue-700 text-white',
  PROCESSING: 'bg-purple-600 hover:bg-purple-700 text-white',
  COMPLETED:  'bg-green-600 hover:bg-green-700 text-white',
  REJECTED:   'bg-red-500 hover:bg-red-600 text-white',
};

const ACTION_LABEL: Record<string, string> = {
  PAID:       '✓ Mark as Paid',
  PROCESSING: '⚡ Mark as Processing',
  COMPLETED:  '🎉 Mark as Completed',
  REJECTED:   '✕ Reject Request',
};

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router     = useRouter();
  const [order, setOrder]     = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError]     = useState('');
  const [notes, setNotes]     = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then(r => r.json())
      .then(d => { setOrder(d.order); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const updateStatus = async (newStatus: string) => {
    if (newStatus === 'REJECTED' && !notes.trim()) {
      setShowNotes(true);
      setError('Please add a rejection reason before rejecting.');
      return;
    }
    setError(''); setUpdating(newStatus);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status: newStatus, notes: notes || undefined }),
      });
      if (res.ok) {
        const d = await res.json();
        setOrder(prev => prev ? { ...prev, status: d.order.status } : prev);
      } else {
        const d = await res.json();
        setError(d.error || 'Update failed.');
      }
    } catch { setError('Connection error.'); }
    finally { setUpdating(null); }
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('File too large (max 5MB)'); return; }
    
    setUploading(true); setError('');
    try {
      // 1. Get presigned URL or use multipart fallback
      const uploadRes = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`);
      const data = await uploadRes.json();
      
      let docUrl = data.url;
      if (data.uploadUrl) {
        await fetch(data.uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
        docUrl = `https://${process.env.AWS_BUCKET_NAME || 'sha-documents'}.s3.${process.env.AWS_REGION || 'eu-west-1'}.amazonaws.com/${data.key}`;
      }

      // 2. Attach to order
      const res = await fetch(`/api/admin/orders/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ 
          documents: [{ fileUrl: docUrl, fileType: 'FINAL_OUTPUT' }],
          notes: `[Log] Agent attached document: ${file.name}`
        }),
      });

      if (res.ok) {
         // Refresh order to show new doc
         const d = await (await fetch(`/api/admin/orders/${id}`)).json();
         setOrder(d.order);
      } else {
        setError('Failed to link document to order.');
      }
    } catch (err) {
      console.error(err);
      setError('Upload failed.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-10 h-10 text-sha-600 animate-spin" />
    </div>
  );

  if (!order) return (
    <div className="text-center py-20">
      <AlertCircle className="w-16 h-16 text-gray-200 mx-auto mb-4" />
      <p className="font-black text-gray-400 text-xl">Order not found.</p>
      <Link href="/admin/orders" className="mt-4 inline-block text-sha-600 font-bold text-sm">← Back to orders</Link>
    </div>
  );

  const config      = STATUS_CONFIG[order.status];
  const nextActions = NEXT_STATUSES[order.status] || [];
  let parsedNotes: Record<string, any> = {};
  try { parsedNotes = order.notes ? JSON.parse(order.notes) : {}; } catch { /* ignore */ }

  return (
    <div className="max-w-5xl space-y-6">
      {/* Back + header */}
      <div className="flex items-start gap-4">
        <button onClick={() => router.back()} className="p-2.5 bg-white rounded-xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-all mt-0.5">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-black text-gray-900">Order Details</h1>
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black border ${config.bg} ${config.color}`}>
              <config.icon className="w-3.5 h-3.5" />
              {config.label}
            </span>
          </div>
          <p className="text-xs font-mono font-black text-sha-600 mt-1">{order.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Customer info */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-black text-gray-900 text-sm uppercase tracking-widest text-[10px] text-gray-400">Customer Details</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="w-10 h-10 bg-sha-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-black">{order.user.name[0]}</span>
                </div>
                <div>
                  <p className="font-black text-gray-900">{order.user.name}</p>
                  <p className="text-xs text-gray-400 font-bold">Customer</p>
                </div>
              </div>
              {[
                { icon: Phone, label: 'Phone', val: order.user.phone, href: `tel:${order.user.phone}` },
                { icon: Mail,  label: 'Email', val: order.user.email, href: `mailto:${order.user.email}` },
              ].map(({ icon: Icon, label, val, href }) => (
                <div key={label} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                  <Icon className="w-4 h-4 text-sha-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{label}</p>
                    <a href={href} className="font-bold text-gray-800 hover:text-sha-600 transition-colors text-sm">{val}</a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service data */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Service Request Data</h2>
            <div className="space-y-2">
              {Object.entries(parsedNotes)
                .filter(([k]) => k !== 'agentNotes')
                .map(([key, val]) => (
                  <div key={key} className="flex items-start justify-between p-3 bg-gray-50 rounded-xl gap-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex-shrink-0 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-sm font-bold text-gray-800 text-right break-all">
                      {Array.isArray(val)
                        ? `${(val as unknown[]).length} item(s)`
                        : String(val ?? '—')}
                    </span>
                  </div>
                ))}
              {Object.keys(parsedNotes).length === 0 && (
                <p className="text-gray-400 text-sm font-bold text-center py-4">No service data recorded</p>
              )}
            </div>
          </div>

          {/* Documents */}
          {order.documents.length > 0 && (
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 space-y-4">
              <h2 className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Documents</h2>
              <div className="space-y-3">
                {order.documents.map((doc, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-10 h-10 bg-sha-50 border border-sha-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-sha-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-gray-900 text-sm">
                        {doc.fileType.replace(/_/g, ' ')}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate font-mono">{doc.fileUrl.slice(0, 50)}…</p>
                    </div>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 bg-sha-700 text-white rounded-xl text-xs font-black hover:bg-sha-600 transition-all flex-shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" /> View
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — actions */}
        <div className="space-y-5">
          {/* Order summary */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Order Summary</h2>
            <div className="space-y-2">
              {[
                ['Service', order.service.name],
                ['Amount', `Ksh ${order.finalPrice?.toLocaleString()}`],
                ['M-Pesa Receipt', order.mpesaReceipt || '—'],
                ['Submitted', new Date(order.createdAt).toLocaleDateString('en-KE', { dateStyle: 'medium' })],
                ['Updated', new Date(order.updatedAt).toLocaleDateString('en-KE', { dateStyle: 'medium', timeStyle: 'short' } as Intl.DateTimeFormatOptions)],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between items-start p-3 bg-gray-50 rounded-xl">
                  <span className="text-[10px] font-black text-gray-400 uppercase">{l}</span>
                  <span className="text-xs font-black text-gray-800 text-right max-w-[160px] break-all">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Final Document Upload (Agent) */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 space-y-4">
             <h2 className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Process Order</h2>
             <input type="file" ref={fileRef} onChange={onUpload} className="hidden" />
             <button 
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-sha-400 hover:bg-sha-50 transition-all disabled:opacity-50"
             >
                {uploading ? <Loader2 className="w-6 h-6 text-sha-600 animate-spin" /> : <Download className="w-6 h-6 text-gray-300" />}
                <p className="text-xs font-black text-gray-600">{uploading ? 'Uploading…' : 'Upload Final Statement'}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">PDF or Official Scan</p>
             </button>
          </div>

          {/* Status actions */}
          {nextActions.length > 0 && (
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 space-y-4">
              <h2 className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Update Status</h2>

              {/* Agent notes */}
              {(showNotes || nextActions.includes('REJECTED')) && (
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                    Agent Notes {nextActions.includes('REJECTED') ? '(required for rejection)' : '(optional)'}
                  </label>
                  <textarea
                    value={notes}
                    onChange={e => { setNotes(e.target.value); setError(''); }}
                    placeholder="Add agent notes or rejection reason…"
                    rows={3}
                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-bold outline-none focus:border-sha-500 focus:ring-4 focus:ring-sha-500/10 transition-all resize-none"
                  />
                </div>
              )}

              <div className="space-y-2">
                {nextActions.map((next) => (
                  <button
                    key={next}
                    onClick={() => updateStatus(next)}
                    disabled={!!updating}
                    className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${ACTION_STYLE[next]} disabled:opacity-50`}
                  >
                    {updating === next ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {ACTION_LABEL[next]}
                  </button>
                ))}
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-xs font-bold text-red-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                </div>
              )}
            </div>
          )}

          {/* SHA portal quick link */}
          <a
            href="https://sha.go.ke"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-5 bg-sha-900 rounded-2xl group hover:bg-sha-800 transition-all"
          >
            <div>
              <p className="font-black text-white text-sm">Open SHA Portal</p>
              <p className="text-[10px] text-sha-400 font-bold">sha.go.ke</p>
            </div>
            <ExternalLink className="w-5 h-5 text-sha-400 group-hover:text-sha-200 transition-colors" />
          </a>
        </div>
      </div>
    </div>
  );
}
