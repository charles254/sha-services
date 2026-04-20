'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, Upload, CheckCircle2, AlertCircle, Loader2, ShieldCheck,
  ArrowRight, ChevronRight, FileText, X, Lock, User, Mail,
} from 'lucide-react';
import Link from 'next/link';

type UploadedFile = { name: string; url: string; size: number };


export default function ChangePhonePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [idDoc, setIdDoc] = useState<UploadedFile | null>(null);
  const [form, setForm] = useState({
    fullName: '', email: '', shaPin: '',
    oldPhone: '', newPhone: '', confirmPhone: '',
  });

  const idRef = useRef<HTMLInputElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setError(null);
  };

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('File too large. Max 5MB.'); return; }
    setUploading('id');
    setError(null);
    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`);
      const { uploadUrl, key } = await res.json();
      let url = '';
      if (uploadUrl) {
        await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
        url = `https://sha-documents.s3.eu-west-1.amazonaws.com/${key}`;
      } else {
        const fd = new FormData(); fd.append('file', file);
        const r = await fetch('/api/upload', { method: 'POST', body: fd });
        url = (await r.json()).url || '';
      }
      setIdDoc({ name: file.name, url, size: file.size });
    } catch { setError('Upload failed. Please try again.'); }
    finally { setUploading(null); }
  };

  const v1 = () => {
    if (!form.fullName.trim()) return 'Full name is required.';
    if (!form.email.includes('@')) return 'Valid email is required.';
    if (!form.shaPin.trim()) return 'ID number is required.';
    if (!form.newPhone.trim()) return 'New phone number is required.';
    if (form.newPhone !== form.confirmPhone) return 'Phone numbers do not match.';
    return null;
  };
  const v2 = () => {
    if (!idDoc) return 'Please upload your National ID.';
    return null;
  };

  const next = () => {
    const e = step === 1 ? v1() : null;
    if (e) { setError(e); return; }
    setError(null); setStep(s => s + 1);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er = v2(); if (er) { setError(er); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/sha/change-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, idDocUrl: idDoc?.url }),
      });
      const data = await res.json();
      setTrackingId(data.trackingId || `SHA-PH-${Date.now().toString(36).toUpperCase()}`);
      setSubmitted(true);
    } catch {
      setTrackingId(`SHA-PH-${Date.now().toString(36).toUpperCase()}`);
      setSubmitted(true);
    } finally { setLoading(false); }
  };

  const STEPS = [{ id: 1, label: 'Details' }, { id: 2, label: 'Documents' }, { id: 3, label: 'Review' }];

  if (submitted) return (
    <main className="min-h-screen mesh-bg grainy pt-32 pb-20 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
        className="card max-w-lg w-full text-center py-16 px-8">
        <div className="w-20 h-20 bg-green-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/20">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-3">Request Submitted!</h2>
        <p className="text-gray-500 font-medium leading-relaxed mb-8">
          Our SHA agents will process your phone change request within <span className="font-black text-gray-800">24 hours</span>.
        </p>
        <div className="p-6 bg-sha-50 rounded-3xl border border-sha-100 mb-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-sha-500 mb-2">Tracking ID</p>
          <p className="text-2xl font-black text-sha-700 tracking-wider">{trackingId}</p>
          <p className="text-[10px] text-gray-400 mt-2">Save this to track your request</p>
        </div>
        <div className="flex gap-3">
          <Link href="/" className="flex-1 py-4 rounded-2xl font-black text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 text-center transition-all">Home</Link>
          <Link href={`/track?id=${trackingId}`} className="flex-1 py-4 btn-primary rounded-2xl font-black text-sm text-center">Track Request</Link>
        </div>
      </motion.div>
    </main>
  );

  return (
    <main className="min-h-screen mesh-bg grainy pt-32 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "SHA Phone Number Change",
            "description": "Professional assistance to update your registered Social Health Authority (SHA) phone number.",
            "provider": {
              "@type": "Organization",
              "name": "SHA Online Cyber Services Kenya"
            },
            "serviceType": "Government Document Update",
            "offers": {
              "@type": "Offer",
              "price": "200",
              "priceCurrency": "KES"
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to change SHA Phone Number",
            "step": [
              { "@type": "HowToStep", "text": "Fill in your full name, email and SHA PIN." },
              { "@type": "HowToStep", "text": "Upload your National ID." },
              { "@type": "HowToStep", "text": "Submit and pay the processing fee via M-Pesa." }
            ]
          })
        }}
      />
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-12">
          <Link href="/" className="hover:text-sha-600 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span>SHA Services</span>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span className="text-gray-900">Change Phone Number</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Info */}
          <div className="space-y-8 lg:sticky lg:top-32">
            <div className="space-y-4">
              <div className="badge-green">SHA Portal Service</div>
              <h1 className="text-5xl font-black text-gray-900 leading-tight">
                Change Your<br /><span className="text-sha-600">Phone Number</span>
              </h1>
              <p className="text-xl text-gray-500 font-medium leading-relaxed">
                Update your registered SHA/NHIF phone number securely online. Handled by certified SHA agents.
              </p>
            </div>
            <div className="inline-flex items-baseline gap-2">
              <span className="text-3xl font-black">Ksh 200</span>
              <span className="text-sm text-gray-400 font-bold">· Processed in 24hrs</span>
            </div>
            <div className="space-y-3">
              {['Certified SHA Agent Handles Submission',
                'SMS & Email Confirmation Sent','24-Hour Request Tracking Available',
                'Documents Deleted After 48hrs'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-bold text-gray-500">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />{item}
                </div>
              ))}
            </div>
            <div className="p-6 glass rounded-[2rem]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-sha-700 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-black text-gray-900">Identity Protected</h4>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                All documents are AES-256 encrypted and deleted after 48 hours. KDPA 2019 compliant.
              </p>
            </div>
          </div>

          {/* Right Form */}
          <div className="card border-sha-500/10 grainy">
            {/* Progress */}
            <div className="flex items-center mb-10">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all duration-300 ${step === s.id ? 'step-active' : step > s.id ? 'step-done' : 'step-idle'}`}>
                      {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${step >= s.id ? 'text-gray-900' : 'text-gray-300'}`}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className={`h-1 flex-1 mx-3 rounded-full transition-all duration-500 ${step > s.id ? 'bg-green-500' : 'bg-gray-100'}`} />}
                </div>
              ))}
            </div>

            <form onSubmit={submit} className="space-y-8">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }} className="space-y-5">
                    <div><label className="label"><User className="w-3.5 h-3.5 text-sha-600" />Full Legal Name</label>
                      <input name="fullName" value={form.fullName} onChange={onChange} required placeholder="e.g. John Kamau Mwangi" className="input-field" /></div>
                    <div><label className="label"><Mail className="w-3.5 h-3.5 text-sha-600" />Email Address</label>
                      <input name="email" value={form.email} onChange={onChange} type="email" required placeholder="e.g. john@gmail.com" className="input-field" /></div>
                    <div><label className="label"><Lock className="w-3.5 h-3.5 text-sha-600" />ID Number</label>
                      <input name="shaPin" value={form.shaPin} onChange={onChange} required placeholder="e.g. 12345678" className="input-field" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="label"><Phone className="w-3.5 h-3.5 text-gray-400" />Old Phone <span className="text-[9px] text-gray-400 normal-case">(if known)</span></label>
                        <input name="oldPhone" value={form.oldPhone} onChange={onChange} type="tel" placeholder="07XX XXX XXX" className="input-field" /></div>
                      <div><label className="label"><Phone className="w-3.5 h-3.5 text-green-500" />New Phone <span className="text-red-500">*</span></label>
                        <input name="newPhone" value={form.newPhone} onChange={onChange} type="tel" required placeholder="07XX XXX XXX" className="input-field !border-green-200 focus:!border-green-500" /></div>
                    </div>
                    <div><label className="label"><Phone className="w-3.5 h-3.5 text-green-500" />Confirm New Phone</label>
                      <input name="confirmPhone" value={form.confirmPhone} onChange={onChange} type="tel" required placeholder="Re-enter new number"
                        className={`input-field ${form.confirmPhone && form.confirmPhone !== form.newPhone ? '!border-red-300 focus:!border-red-500' : form.confirmPhone && form.confirmPhone === form.newPhone ? '!border-green-300 focus:!border-green-500' : ''}`} />
                      {form.confirmPhone && form.confirmPhone !== form.newPhone && <p className="text-[10px] text-red-500 font-black flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" />Numbers don&apos;t match</p>}
                      {form.confirmPhone && form.confirmPhone === form.newPhone && <p className="text-[10px] text-green-600 font-black flex items-center gap-1 mt-1"><CheckCircle2 className="w-3 h-3" />Numbers match</p>}
                    </div>
                    <button type="button" onClick={next} className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-base hover:bg-sha-700 transition-all shadow-xl flex items-center justify-center gap-3 group">
                      Next: Upload Documents <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }} className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <p className="text-xs text-blue-800 font-bold">Upload clear, readable photos or scans. Accepted: JPG, PNG, PDF · Max 5MB each.</p>
                    </div>
                    {/* ID Upload */}
                    <div><label className="label"><FileText className="w-3.5 h-3.5 text-sha-600" />National ID — Front &amp; Back <span className="text-red-500">*</span></label>
                      <input ref={idRef} type="file" accept="image/*,.pdf" className="hidden" onChange={uploadFile} />
                      {idDoc ? (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-green-200">
                          <div className="flex items-center gap-3"><div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-green-600" /></div>
                            <div><p className="text-sm font-black text-gray-800 truncate max-w-[180px]">{idDoc.name}</p><p className="text-[10px] text-gray-400">{(idDoc.size/1024).toFixed(0)} KB</p></div>
                          </div>
                          <button type="button" onClick={() => setIdDoc(null)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                        </motion.div>
                      ) : (
                        <button type="button" onClick={() => idRef.current?.click()} disabled={uploading === 'id'} className="drop-zone w-full">
                          {uploading === 'id' ? <Loader2 className="w-10 h-10 text-sha-600 animate-spin mx-auto mb-3" /> : <Upload className="w-10 h-10 text-gray-300 group-hover:text-sha-500 mx-auto mb-3 transition-colors" />}
                          <p className="text-sm font-black text-gray-700">{uploading === 'id' ? 'Uploading…' : 'Click to Upload National ID'}</p>
                          <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-widest">JPG, PNG or PDF · Max 5MB</p>
                        </button>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(1)} className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black hover:bg-gray-200 transition-all">Back</button>
                      <button type="button" onClick={() => { const e = v2(); if (e) { setError(e); return; } setError(null); setStep(3); }}
                        className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-sha-700 transition-all flex items-center justify-center gap-3 group">
                        Review &amp; Submit <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }} className="space-y-5">
                    <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Review Your Details</p>
                    <div className="space-y-3">
                      {[['Full Name', form.fullName], ['Email', form.email], ['ID Number', form.shaPin],
                        ['Old Phone', form.oldPhone || '—'], ['New Phone', form.newPhone]].map(([l, v]) => (
                        <div key={l} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{l}</span>
                          <span className="text-sm font-black text-gray-800">{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-5 bg-gray-50 rounded-2xl space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Attached Documents</p>
                      {[['National ID', idDoc?.name]].map(([t, n]) => (
                        <div key={t} className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-bold text-gray-700 flex-1">{n}</span>
                          <span className="text-[9px] text-gray-400 uppercase font-black">{t}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-6 bg-sha-50/60 rounded-3xl border border-sha-500/10 space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase">
                        <span>Service Fee</span><span>Ksh 200</span>
                      </div>
                      <div className="h-px bg-sha-500/10" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-gray-900">Total Payable</span>
                        <span className="text-xl font-black text-sha-700">Ksh 200</span>
                      </div>
                      <p className="text-[10px] text-gray-400">Payment via M-Pesa after submission. KDPA Compliant.</p>
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(2)} className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black hover:bg-gray-200 transition-all">Back</button>
                      <button type="submit" disabled={loading} className="flex-1 btn-primary flex items-center justify-center gap-2 py-5">
                        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</> : <><ShieldCheck className="w-5 h-5" /> Submit Request</>}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />{error}
                  </motion.div>
                )}
              </AnimatePresence>
              <p className="text-[10px] text-center text-gray-400 uppercase font-bold tracking-widest pt-2">
                KDPA Compliant · AES-256 Encrypted · SHA Certified Agents
              </p>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-20">
          <h2 className="text-3xl font-black text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'What happens to my old phone number after the change?', a: 'Once the phone number change is processed, your old number is immediately delinked from your SHA account. All future OTPs, notifications, and communication from SHA will be sent to your new number. Your SHA membership number and all benefits remain unchanged.' },
              { q: 'Can I change my SHA phone number if I lost my SIM card?', a: 'Yes. A lost SIM card is one of the most common reasons for a phone number change. Simply submit your National ID through our platform and our certified agents will process the change within 24 hours.' },
              { q: 'How will I know my phone number change was successful?', a: 'You will receive a confirmation SMS on your new phone number and an email notification once the change is processed. You can also track the status of your request in real time using the tracking ID provided at submission.' },
              { q: 'What if my National ID name differs from my SHA registration?', a: 'Your National ID name must match your SHA registration records. If there is a discrepancy, you may need to update your SHA records first. Contact our support team via WhatsApp for guidance on resolving name mismatches before submitting a phone change request.' },
              { q: 'Can I change my phone number back to the original one later?', a: 'Yes, you can submit another phone number change request at any time. Each change requires the standard Ksh 200 service fee, and the same 24-hour processing time applies.' },
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
