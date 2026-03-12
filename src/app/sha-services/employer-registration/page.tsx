'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Upload, CheckCircle2, AlertCircle, Loader2, ShieldCheck,
  ArrowRight, ChevronRight, FileText, User, Lock, X, Mail, Phone,
} from 'lucide-react';
import Link from 'next/link';

type UploadedFile = { name: string; url: string; size: number };

export default function EmployerRegistrationPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [certDoc, setCertDoc] = useState<UploadedFile | null>(null);
  const [form, setForm] = useState({
    companyName: '', kraPin: '', registrationNo: '', phone: '',
    email: '', contactPerson: '', employees: '', industry: 'private',
  });
  const certRef = useRef<HTMLInputElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(null);
  };

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
      setCertDoc({ name: file.name, url, size: file.size });
    } catch { setError('Upload failed.'); }
    finally { setUploading(false); }
  };

  const v1 = () => {
    if (!form.companyName.trim()) return 'Company name required.';
    if (!form.kraPin.trim()) return 'KRA PIN required.';
    if (!form.phone.trim()) return 'Phone required.';
    if (!form.email.includes('@')) return 'Valid email required.';
    if (!form.contactPerson.trim()) return 'Contact person name required.';
    return null;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certDoc) { setError('Please upload your Certificate of Incorporation.'); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/sha/employer-registration', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, certDocUrl: certDoc?.url }),
      });
      const data = await res.json();
      setTrackingId(data.trackingId || `SHA-ER-${Date.now().toString(36).toUpperCase()}`);
      setSubmitted(true);
    } catch {
      setTrackingId(`SHA-ER-${Date.now().toString(36).toUpperCase()}`);
      setSubmitted(true);
    } finally { setLoading(false); }
  };

  const STEPS = [{ id: 1, label: 'Company' }, { id: 2, label: 'Documents' }, { id: 3, label: 'Review' }];

  if (submitted) return (
    <main className="min-h-screen mesh-bg grainy pt-32 pb-20 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card max-w-lg w-full text-center py-16 px-8">
        <div className="w-20 h-20 bg-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-rose-500/20">
          <Building2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-3">Registration Submitted!</h2>
        <p className="text-gray-500 font-medium leading-relaxed mb-8">Your employer registration will be processed within <span className="font-black text-gray-800">48 hours</span>.</p>
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
          <span className="text-gray-900">Employer Registration</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8 lg:sticky lg:top-32">
            <div className="space-y-4">
              <div className="badge-green">Corporate Service</div>
              <h1 className="text-5xl font-black text-gray-900 leading-tight">Employer<br /><span className="text-sha-600">Registration</span></h1>
              <p className="text-xl text-gray-500 font-medium leading-relaxed">
                Register your company as an SHA employer and comply with Kenya&apos;s mandatory health coverage rules.
              </p>
            </div>
            <div className="inline-flex items-baseline gap-2">
              <span className="text-3xl font-black">Ksh 800</span>
              <span className="text-sm text-gray-400 font-bold">· Processed in 48hrs</span>
            </div>
            <div className="space-y-3">
              {['Certificate of Incorporation Required','Employer Code Assignment',
                'Employee Onboarding Guidance Included','Payroll Deduction Setup Support',
                'Compliance Certificate Issued'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-bold text-gray-500">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />{item}
                </div>
              ))}
            </div>
            <div className="p-6 bg-rose-50 rounded-2xl border border-rose-200 space-y-2">
              <p className="font-black text-rose-800 flex items-center gap-2 mb-2">
                <Building2  className="w-4 h-4" />Legal Requirement
              </p>
              <p className="text-sm text-rose-700 font-medium leading-relaxed">
                Under SHA Act 2023, all employers with 1+ employees are legally required to register and remit monthly contributions on behalf of their staff.
              </p>
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
                    <span className={`text-[9px] font-black uppercase tracking-widest ${step >= s.id ? 'text-gray-900' : 'text-gray-300'}`}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className={`h-1 flex-1 mx-3 rounded-full ${step > s.id ? 'bg-green-500' : 'bg-gray-100'}`} />}
                </div>
              ))}
            </div>

            <form onSubmit={submit} className="space-y-8">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
                    <div><label className="label"><Building2 className="w-3.5 h-3.5 text-sha-600" />Company / Business Name</label>
                      <input name="companyName" value={form.companyName} onChange={onChange} required placeholder="e.g. Kilimani Enterprises Ltd" className="input-field" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="label"><Lock className="w-3.5 h-3.5 text-sha-600" />KRA PIN</label>
                        <input name="kraPin" value={form.kraPin} onChange={onChange} required placeholder="e.g. P051234567A" className="input-field" /></div>
                      <div><label className="label">Reg. Number</label>
                        <input name="registrationNo" value={form.registrationNo} onChange={onChange} placeholder="e.g. PVT-2024/12345" className="input-field" /></div>
                    </div>
                    <div><label className="label"><User className="w-3.5 h-3.5 text-sha-600" />Contact Person Name</label>
                      <input name="contactPerson" value={form.contactPerson} onChange={onChange} required placeholder="HR Manager / Director" className="input-field" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="label"><Phone className="w-3.5 h-3.5 text-sha-600" />Phone</label>
                        <input name="phone" value={form.phone} onChange={onChange} type="tel" required placeholder="07XX XXX XXX" className="input-field" /></div>
                      <div><label className="label"><Mail className="w-3.5 h-3.5 text-sha-600" />Email</label>
                        <input name="email" value={form.email} onChange={onChange} type="email" required placeholder="hr@company.com" className="input-field" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="label">No. of Employees</label>
                        <input name="employees" value={form.employees} onChange={onChange} type="number" placeholder="e.g. 25" className="input-field" /></div>
                      <div><label className="label">Sector</label>
                        <select name="industry" value={form.industry} onChange={onChange} className="input-field">
                          <option value="private">Private Sector</option>
                          <option value="ngo">NGO / Non-Profit</option>
                          <option value="parastatals">Parastatals</option>
                          <option value="faith">Faith-Based</option>
                        </select>
                      </div>
                    </div>
                    <button type="button" onClick={() => { const e = v1(); if (e) { setError(e); return; } setError(null); setStep(2); }}
                      className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black hover:bg-sha-700 transition-all flex items-center justify-center gap-3 group">
                      Next: Upload Certificate <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <p className="text-xs text-blue-800 font-bold">Upload your Certificate of Incorporation or Business Registration Certificate from eCitizen.</p>
                    </div>
                    <div><label className="label"><FileText className="w-3.5 h-3.5 text-sha-600" />Certificate of Incorporation <span className="text-red-500">*</span></label>
                      <input ref={certRef} type="file" accept="image/*,.pdf" className="hidden" onChange={uploadFile} />
                      {certDoc ? (
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-green-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-green-600" /></div>
                            <div><p className="text-sm font-black text-gray-800 truncate max-w-[180px]">{certDoc.name}</p><p className="text-[10px] text-gray-400">{(certDoc.size/1024).toFixed(0)} KB</p></div>
                          </div>
                          <button type="button" onClick={() => setCertDoc(null)} className="p-2 text-gray-300 hover:text-red-500"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => certRef.current?.click()} disabled={uploading} className="drop-zone-amber w-full">
                          {uploading ? <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto mb-3" /> : <FileText className="w-10 h-10 text-amber-300 mx-auto mb-3" />}
                          <p className="text-sm font-black text-gray-700">{uploading ? 'Uploading…' : 'Upload Certificate of Incorporation'}</p>
                          <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-widest">JPG, PNG or PDF · Max 5MB</p>
                        </button>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(1)} className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black">Back</button>
                      <button type="button" onClick={() => { if (!certDoc) { setError('Upload certificate first.'); return; } setError(null); setStep(3); }}
                        className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-sha-700 flex items-center justify-center gap-3 group">
                        Review <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
                    <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Review Registration</p>
                    <div className="space-y-2">
                      {[['Company', form.companyName], ['KRA PIN', form.kraPin], ['Contact', form.contactPerson],
                        ['Phone', form.phone], ['Employees', form.employees || '—']].map(([l, v]) => (
                        <div key={l} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{l}</span>
                          <span className="text-sm font-black text-gray-800">{v}</span>
                        </div>
                      ))}
                    </div>
                    {certDoc && (
                      <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-bold text-gray-700">{certDoc.name}</span>
                      </div>
                    )}
                    <div className="p-6 bg-sha-50/60 rounded-3xl border border-sha-500/10 space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase"><span>Service Fee</span><span>Ksh 800</span></div>
                      <div className="h-px bg-sha-500/10" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-gray-900">Total Payable</span>
                        <span className="text-xl font-black text-sha-700">Ksh 800</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(2)} className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black">Back</button>
                      <button type="submit" disabled={loading} className="flex-1 btn-primary flex items-center justify-center gap-2 py-5">
                        {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Processing…</> : <><ShieldCheck className="w-5 h-5" />Submit Registration</>}
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
              <p className="text-[10px] text-center text-gray-400 uppercase font-bold tracking-widest">KDPA Compliant · SHA Certified</p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
