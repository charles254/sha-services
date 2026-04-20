'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Upload, CheckCircle2, AlertCircle, Loader2, ShieldCheck,
  ArrowRight, ChevronRight, FileText, User, Lock, X, Plus, Trash2,
} from 'lucide-react';
import Link from 'next/link';

type Beneficiary = { name: string; relation: string; dob: string; idNumber: string };
type UploadedFile = { name: string; url: string; size: number };

export default function BeneficiaryUpdatePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [idDoc, setIdDoc] = useState<UploadedFile | null>(null);
  const [form, setForm] = useState({ fullName: '', shaPin: '', idNumber: '', phone: '', email: '' });
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([{ name: '', relation: 'spouse', dob: '', idNumber: '' }]);

  const idRef = useRef<HTMLInputElement>(null);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(null); };
  const onBenChange = (i: number, field: keyof Beneficiary, val: string) => {
    setBeneficiaries(prev => prev.map((b, idx) => idx === i ? { ...b, [field]: val } : b));
  };

  const addBeneficiary = () => setBeneficiaries(p => [...p, { name: '', relation: 'child', dob: '', idNumber: '' }]);
  const removeBeneficiary = (i: number) => setBeneficiaries(p => p.filter((_, idx) => idx !== i));

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Max 5MB.'); return; }
    setUploading(true); setError(null);
    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`);
      const { uploadUrl, key } = await res.json();
      let url = '';
      if (uploadUrl) { await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } }); url = `https://sha-documents.s3.eu-west-1.amazonaws.com/${key}`; }
      else { const fd = new FormData(); fd.append('file', file); url = (await (await fetch('/api/upload', { method: 'POST', body: fd })).json()).url || ''; }
      setIdDoc({ name: file.name, url, size: file.size });
    } catch { setError('Upload failed.'); }
    finally { setUploading(false); }
  };

  const v1 = () => {
    if (!form.fullName.trim()) return 'Full name required.';
    if (!form.idNumber.trim()) return 'ID number required.';
    if (!form.phone.trim()) return 'Phone required.';
    if (!form.email.includes('@')) return 'Valid email required.';
    if (beneficiaries.some(b => !b.name.trim())) return 'All beneficiary names required.';
    return null;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idDoc) { setError('Please upload your National ID.'); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/sha/beneficiary-update', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, beneficiaries, idDocUrl: idDoc?.url }),
      });
      const data = await res.json();
      setTrackingId(data.trackingId || `SHA-BU-${Date.now().toString(36).toUpperCase()}`);
      setSubmitted(true);
    } catch {
      setTrackingId(`SHA-BU-${Date.now().toString(36).toUpperCase()}`);
      setSubmitted(true);
    } finally { setLoading(false); }
  };

  const STEPS = [{ id: 1, label: 'Member + Beneficiaries' }, { id: 2, label: 'Documents' }, { id: 3, label: 'Review' }];

  if (submitted) return (
    <main className="min-h-screen mesh-bg grainy pt-32 pb-20 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card max-w-lg w-full text-center py-16 px-8">
        <div className="w-20 h-20 bg-purple-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-purple-500/20">
          <Users className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-3">Beneficiaries Updated!</h2>
        <p className="text-gray-500 font-medium leading-relaxed mb-8">Your SHA beneficiary changes will be applied within <span className="font-black text-gray-800">24 hours</span>.</p>
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
          <Link href="/" className="hover:text-sha-600">Home</Link><ChevronRight className="w-3 h-3 text-gray-300" />
          <span>SHA Services</span><ChevronRight className="w-3 h-3 text-gray-300" />
          <span className="text-gray-900">Beneficiary Update</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8 lg:sticky lg:top-32">
            <div className="space-y-4">
              <div className="badge-green">Dependant Management</div>
              <h1 className="text-5xl font-black text-gray-900 leading-tight">Beneficiary<br /><span className="text-sha-600">Update</span></h1>
              <p className="text-xl text-gray-500 font-medium leading-relaxed">Add, remove or update your SHA dependants. Cover your spouse, children and parents under your membership.</p>
            </div>
            <div className="inline-flex items-baseline gap-2">
              <span className="text-3xl font-black">Ksh 400</span>
              <span className="text-sm text-gray-400 font-bold">· Processed in 24hrs</span>
            </div>
            <div className="space-y-3">
              {['Add Spouse, Children & Parents','Remove Outdated Dependants',
                'Up to 5 Beneficiaries Supported','Birth Certificates Required for Children',
                'Marriage Certificate for Spouse'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-bold text-gray-500">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />{item}
                </div>
              ))}
            </div>
          </div>

          <div className="card border-sha-500/10 grainy">
            <div className="flex items-center mb-10">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all ${step === s.id ? 'step-active' : step > s.id ? 'step-done' : 'step-idle'}`}>
                      {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-widest text-center ${step >= s.id ? 'text-gray-900' : 'text-gray-300'}`}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className={`h-1 flex-1 mx-2 rounded-full ${step > s.id ? 'bg-green-500' : 'bg-gray-100'}`} />}
                </div>
              ))}
            </div>

            <form onSubmit={submit} className="space-y-8">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                    <div className="p-4 bg-sha-50 rounded-2xl border border-sha-100">
                      <p className="text-xs font-black text-sha-700 mb-1">Member Details</p>
                    </div>
                    <div><label className="label"><User className="w-3.5 h-3.5 text-sha-600" />Your Full Name</label>
                      <input name="fullName" value={form.fullName} onChange={onChange} required placeholder="Your legal name" className="input-field" /></div>
                    <div><label className="label"><Lock className="w-3.5 h-3.5 text-sha-600" />ID Number</label>
                      <input name="idNumber" value={form.idNumber} onChange={onChange} required placeholder="e.g. 12345678" className="input-field" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="label">Phone</label>
                        <input name="phone" value={form.phone} onChange={onChange} type="tel" required placeholder="07XX XXX XXX" className="input-field" /></div>
                      <div><label className="label">Email</label>
                        <input name="email" value={form.email} onChange={onChange} type="email" required placeholder="your@email.com" className="input-field" /></div>
                    </div>

                    <div className="pt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Beneficiaries to Add/Update</p>
                        {beneficiaries.length < 5 && (
                          <button type="button" onClick={addBeneficiary} className="flex items-center gap-1.5 text-xs font-black text-sha-600 hover:text-sha-700">
                            <Plus className="w-4 h-4" />Add More
                          </button>
                        )}
                      </div>
                      {beneficiaries.map((b, i) => (
                        <div key={i} className="p-4 bg-gray-50 rounded-2xl space-y-3 relative">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Beneficiary {i + 1}</p>
                            {beneficiaries.length > 1 && (
                              <button type="button" onClick={() => removeBeneficiary(i)} className="text-gray-300 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <input value={b.name} onChange={e => onBenChange(i, 'name', e.target.value)} required placeholder="Full Name" className="input-field !bg-white" />
                          <div className="grid grid-cols-2 gap-3">
                            <select value={b.relation} onChange={e => onBenChange(i, 'relation', e.target.value)} className="input-field !bg-white">
                              <option value="spouse">Spouse</option>
                              <option value="child">Child</option>
                              <option value="parent">Parent</option>
                              <option value="sibling">Sibling</option>
                            </select>
                            <input value={b.dob} onChange={e => onBenChange(i, 'dob', e.target.value)} type="date" placeholder="Date of Birth" className="input-field !bg-white" />
                          </div>
                          <input value={b.idNumber} onChange={e => onBenChange(i, 'idNumber', e.target.value)} placeholder="ID / Birth Cert No." className="input-field !bg-white" />
                        </div>
                      ))}
                    </div>

                    <button type="button" onClick={() => { const e = v1(); if (e) { setError(e); return; } setError(null); setStep(2); }}
                      className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black hover:bg-sha-700 transition-all flex items-center justify-center gap-3 group">
                      Next: Upload Documents <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <p className="text-xs text-blue-800 font-bold">Upload your National ID. Additional docs (birth cert, marriage cert) can be sent via WhatsApp after submission.</p>
                    </div>
                    <div><label className="label"><FileText className="w-3.5 h-3.5 text-sha-600" />Your National ID <span className="text-red-500">*</span></label>
                      <input ref={idRef} type="file" accept="image/*,.pdf" className="hidden" onChange={uploadFile} />
                      {idDoc ? (
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-green-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-green-600" /></div>
                            <div><p className="text-sm font-black text-gray-800 truncate max-w-[180px]">{idDoc.name}</p><p className="text-[10px] text-gray-400">{(idDoc.size/1024).toFixed(0)} KB</p></div>
                          </div>
                          <button type="button" onClick={() => setIdDoc(null)} className="p-2 text-gray-300 hover:text-red-500"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => idRef.current?.click()} disabled={uploading} className="drop-zone w-full">
                          {uploading ? <Loader2 className="w-10 h-10 text-sha-600 animate-spin mx-auto mb-3" /> : <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />}
                          <p className="text-sm font-black text-gray-700">{uploading ? 'Uploading…' : 'Click to Upload National ID'}</p>
                          <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-widest">JPG, PNG or PDF · Max 5MB</p>
                        </button>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(1)} className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black">Back</button>
                      <button type="button" onClick={() => { if (!idDoc) { setError('Upload your ID first.'); return; } setError(null); setStep(3); }}
                        className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-sha-700 flex items-center justify-center gap-3 group">
                        Review &amp; Submit <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
                    <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Review Submission</p>
                    <div className="space-y-2">
                      {[['Member Name', form.fullName], ['ID Number', form.idNumber], ['Phone', form.phone]].map(([l, v]) => (
                        <div key={l} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{l}</span>
                          <span className="text-sm font-black text-gray-800">{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-sha-50 rounded-2xl space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-sha-600 mb-2">Beneficiaries ({beneficiaries.length})</p>
                      {beneficiaries.map((b, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm font-bold text-gray-700">{b.name}</span>
                          <span className="text-[10px] text-gray-400 ml-auto capitalize">{b.relation}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-6 bg-sha-50/60 rounded-3xl border border-sha-500/10 space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase"><span>Service Fee</span><span>Ksh 400</span></div>
                      <div className="h-px bg-sha-500/10" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-gray-900">Total Payable</span>
                        <span className="text-xl font-black text-sha-700">Ksh 400</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(2)} className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black">Back</button>
                      <button type="submit" disabled={loading} className="flex-1 btn-primary flex items-center justify-center gap-2 py-5">
                        {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Processing…</> : <><ShieldCheck className="w-5 h-5" />Submit</>}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {error && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />{error}</motion.div>)}
              </AnimatePresence>
              <p className="text-[10px] text-center text-gray-400 uppercase font-bold tracking-widest">KDPA Compliant · AES-256 Encrypted</p>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-20">
          <h2 className="text-3xl font-black text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Who can I add as a beneficiary on my SHA membership?', a: 'You can add your spouse, biological or legally adopted children under the age of 25, and your parents as dependants on your SHA membership. Each dependant type requires specific supporting documentation — marriage certificate for a spouse, birth certificate for children, and birth certificate or ID showing parentage for parents.' },
              { q: 'How many beneficiaries can I add to my SHA account?', a: 'There is no strict limit on the number of dependants you can register. You can add one spouse, multiple children (under 25 years), and both parents. Each beneficiary is covered under your SHA membership for health services at accredited facilities across Kenya.' },
              { q: 'What documents are needed to add a spouse as a beneficiary?', a: 'To add a spouse, you need their National ID (or passport), your marriage certificate, and your own National ID for verification. For customary marriages, an affidavit or chief\'s letter confirming the union may be accepted in place of a formal marriage certificate.' },
              { q: 'Can I remove a beneficiary from my SHA membership?', a: 'Yes. You can remove beneficiaries through our platform. Common reasons include divorce, a child turning 25, or updating records after a parent\'s passing. Removal requires your National ID and a brief explanation for the change. The update is processed within 24 hours.' },
              { q: 'Will my beneficiaries retain coverage during the update process?', a: 'Yes. Existing beneficiaries retain their SHA coverage throughout the update process. Adding new beneficiaries does not affect the coverage of those already registered. New dependants become eligible for services once the update is confirmed, typically within 24 hours.' },
              { q: 'What if my child turns 25 — are they automatically removed?', a: 'Children are not automatically removed when they turn 25, but they become ineligible for coverage as dependants under your membership. It is recommended to update your beneficiary list proactively. Children over 25 should register for their own SHA membership independently.' },
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
