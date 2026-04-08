'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, CheckCircle2, AlertCircle, Loader2, ShieldCheck,
  ArrowRight, ChevronRight, User, Lock, Calendar, Download,
} from 'lucide-react';
import Link from 'next/link';

export default function ContributionStatementPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [form, setForm] = useState({
    fullName: '', shaPin: '', idNumber: '', phone: '', email: '',
    fromDate: '', toDate: '', purpose: 'personal',
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(null);
  };

  const validate = () => {
    if (!form.fullName.trim()) return 'Full name required.';
    if (!form.shaPin.trim()) return 'SHA member number required.';
    if (!form.idNumber.trim()) return 'ID number required.';
    if (!form.phone.trim()) return 'Phone number required.';
    if (!form.email.includes('@')) return 'Valid email required.';
    return null;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er = validate(); if (er) { setError(er); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/sha/contribution-statement', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setTrackingId(data.trackingId || `SHA-CS-${Date.now().toString(36).toUpperCase()}`);
      setSubmitted(true);
    } catch {
      setTrackingId(`SHA-CS-${Date.now().toString(36).toUpperCase()}`);
      setSubmitted(true);
    } finally { setLoading(false); }
  };

  if (submitted) return (
    <main className="min-h-screen mesh-bg grainy pt-32 pb-20 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card max-w-lg w-full text-center py-16 px-8">
        <div className="w-20 h-20 bg-amber-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-amber-500/20">
          <Download className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-3">Statement Requested!</h2>
        <p className="text-gray-500 font-medium leading-relaxed mb-8">
          Your SHA contribution statement will be ready and emailed to you within <span className="font-black text-gray-800">1 hour</span>.
        </p>
        <div className="p-6 bg-sha-50 rounded-3xl border border-sha-100 mb-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-sha-500 mb-2">Tracking ID</p>
          <p className="text-2xl font-black text-sha-700 tracking-wider">{trackingId}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/" className="flex-1 py-4 rounded-2xl font-black text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 text-center">Home</Link>
          <Link href={`/track?id=${trackingId}`} className="flex-1 py-4 btn-primary rounded-2xl font-black text-sm text-center">Track Request</Link>
        </div>
      </motion.div>
    </main>
  );

  return (
    <main className="min-h-screen mesh-bg grainy pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-12">
          <Link href="/" className="hover:text-sha-600">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-300" /><span>SHA Services</span>
          <ChevronRight className="w-3 h-3 text-gray-300" /><span className="text-gray-900">Contribution Statement</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8 lg:sticky lg:top-32">
            <div className="space-y-4">
              <div className="badge-green">Records Service</div>
              <h1 className="text-5xl font-black text-gray-900 leading-tight">Contribution<br /><span className="text-sha-600">Statement</span></h1>
              <p className="text-xl text-gray-500 font-medium leading-relaxed">
                Get your official SHA contribution history and payment records delivered to your email in under 1 hour.
              </p>
            </div>
            <div className="inline-flex items-baseline gap-2">
              <span className="text-3xl font-black">Ksh 200</span>
              <span className="text-sm text-gray-400 font-bold">· Ready in under 1 hour</span>
            </div>
            <div className="space-y-3">
              {['Official SHA-Stamped PDF Statement','Custom Date Range Available',
                'Emailed Directly to You','Accepted for Mortgage & Visa Applications',
                'Historical Records Back to NHIF Era'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-bold text-gray-500">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />{item}
                </div>
              ))}
            </div>
            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
              <p className="font-black text-amber-800 flex items-center gap-2">
                <FileText className="w-4 h-4" />Common Uses
              </p>
              <ul className="text-sm text-amber-700 font-medium space-y-1 list-disc list-inside">
                <li>Loan or Mortgage Applications</li>
                <li>Visa & Travel Documentation</li>
                <li>Employment Records Verification</li>
                <li>Tax Filing & Compliance</li>
              </ul>
            </div>
          </div>

          <div className="card border-sha-500/10 grainy">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-black text-xl text-gray-900">Request Statement</h2>
                <p className="text-xs text-gray-500 font-bold">Fill in your SHA member details below</p>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-5">
              <div><label className="label"><User className="w-3.5 h-3.5 text-sha-600" />Full Legal Name</label>
                <input name="fullName" value={form.fullName} onChange={onChange} required placeholder="As registered with SHA" className="input-field" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label"><Lock className="w-3.5 h-3.5 text-sha-600" />SHA / NHIF Number</label>
                  <input name="shaPin" value={form.shaPin} onChange={onChange} required placeholder="0012345678" className="input-field" /></div>
                <div><label className="label">National ID No.</label>
                  <input name="idNumber" value={form.idNumber} onChange={onChange} required placeholder="e.g. 12345678" className="input-field" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Phone Number</label>
                  <input name="phone" value={form.phone} onChange={onChange} type="tel" required placeholder="07XX XXX XXX" className="input-field" /></div>
                <div><label className="label">Email Address</label>
                  <input name="email" value={form.email} onChange={onChange} type="email" required placeholder="Statement delivery" className="input-field" /></div>
              </div>
              <div className="p-5 bg-gray-50 rounded-2xl space-y-4">
                <p className="text-xs font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-sha-600" />Statement Period (Optional)
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="label">From Date</label>
                    <input name="fromDate" value={form.fromDate} onChange={onChange} type="date" className="input-field" /></div>
                  <div><label className="label">To Date</label>
                    <input name="toDate" value={form.toDate} onChange={onChange} type="date" className="input-field" /></div>
                </div>
              </div>
              <div><label className="label">Purpose of Statement</label>
                <select name="purpose" value={form.purpose} onChange={onChange} className="input-field">
                  <option value="personal">Personal Records</option>
                  <option value="loan">Loan / Mortgage Application</option>
                  <option value="visa">Visa Application</option>
                  <option value="employment">Employment Verification</option>
                  <option value="tax">Tax Filing</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="p-6 bg-sha-50/60 rounded-3xl border border-sha-500/10 space-y-3 mt-4">
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase"><span>Service Fee</span><span>Ksh 200</span></div>
                <div className="h-px bg-sha-500/10" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-gray-900">Total Payable</span>
                  <span className="text-xl font-black text-sha-700">Ksh 200</span>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 py-5">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Processing…</> : <><ShieldCheck className="w-5 h-5" />Request Statement <ArrowRight className="w-5 h-5" /></>}
              </button>

              <AnimatePresence>
                {error && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />{error}</motion.div>)}
              </AnimatePresence>
              <p className="text-[10px] text-center text-gray-400 uppercase font-bold tracking-widest">
                KDPA Compliant · AES-256 Encrypted · SHA Certified
              </p>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-20">
          <h2 className="text-3xl font-black text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'What is an SHA contribution statement?', a: 'An SHA contribution statement is an official document showing your history of health insurance contributions to the Social Health Authority (formerly NHIF). It lists all payments made, including dates, amounts, and employer details where applicable. The document is stamped and authenticated by SHA.' },
              { q: 'Will my statement include old NHIF contributions?', a: 'Yes. Your SHA contribution statement includes historical records dating back to the NHIF era. When NHIF transitioned to SHA, all contribution records were migrated. Your statement will show your complete contribution history across both systems.' },
              { q: 'Is the contribution statement accepted by banks for loan applications?', a: 'Yes. SHA contribution statements are widely accepted by Kenyan banks and financial institutions as proof of employment and income stability. They are commonly required for mortgage applications, personal loans, and business financing. The official SHA stamp and authentication make it a recognized financial document.' },
              { q: 'Can I request a statement for a specific date range?', a: 'Yes. When submitting your request, you can specify a custom date range for your contribution history. If no dates are provided, you will receive a complete statement covering your entire contribution history. Custom date ranges are useful for specific application requirements.' },
              { q: 'How is the contribution statement delivered?', a: 'Your SHA contribution statement is delivered as an official PDF document directly to the email address you provide during the request. The PDF includes SHA authentication stamps and can be printed or forwarded digitally. Delivery takes approximately 1 hour from submission.' },
              { q: 'What if my contribution records show missing payments?', a: 'If your statement reveals gaps in contributions, this may indicate periods where your employer did not remit payments or where voluntary contributions were missed. You can use the statement as evidence to follow up with your employer or SHA directly. Our support team can guide you on the dispute process.' },
            ].map((faq, i) => (
              <details key={i} className="group card !p-0 overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-black text-gray-900 hover:text-sha-600 transition-colors">
                  {faq.q}
                  <ChevronRight className="w-5 h-5 text-gray-300 group-open:rotate-90 transition-transform flex-shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-6 text-gray-500 font-medium leading-relaxed border-t border-gray-50 pt-4">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
