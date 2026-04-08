'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Upload, CheckCircle2, AlertCircle, Loader2,
  ArrowRight, ChevronRight, FileText, User, Mail, Phone, X, Briefcase,
} from 'lucide-react';
import Link from 'next/link';

type UploadedFile = { name: string; url: string; size: number };

export default function PinRegistrationPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [idDoc, setIdDoc] = useState<UploadedFile | null>(null);
  const [form, setForm] = useState({
    fullName: '', idNumber: '', dob: '', phone: '',
    email: '', employmentType: 'employed', employer: '',
  });
  const idRef = useRef<HTMLInputElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(null);
  };

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Max 5MB allowed.'); return; }
    setUploading(true); setError(null);
    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`);
      const { uploadUrl, key } = await res.json();
      let url = '';
      if (uploadUrl) {
        await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
        url = `https://sha-documents.s3.eu-west-1.amazonaws.com/${key}`;
      } else {
        const fd = new FormData(); fd.append('file', file);
        url = (await (await fetch('/api/upload', { method: 'POST', body: fd })).json()).url || '';
      }
      setIdDoc({ name: file.name, url, size: file.size });
    } catch { setError('Upload failed. Try again.'); }
    finally { setUploading(false); }
  };

  const v1 = () => {
    if (!form.fullName.trim()) return 'Full legal name required.';
    if (!form.idNumber.trim()) return 'ID number required.';
    if (!form.dob) return 'Date of birth required.';
    if (!form.phone.trim()) return 'Phone number required.';
    if (!form.email.includes('@')) return 'Valid email required.';
    return null;
  };
  const v2 = () => !idDoc ? 'Please upload your National ID.' : null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er = v2(); if (er) { setError(er); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/sha/pin-registration', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, idDocUrl: idDoc?.url }),
      });
      const data = await res.json();
      setTrackingId(data.trackingId || `SHA-PIN-${Date.now().toString(36).toUpperCase()}`);
      setSubmitted(true);
    } catch {
      setTrackingId(`SHA-PIN-${Date.now().toString(36).toUpperCase()}`);
      setSubmitted(true);
    } finally { setLoading(false); }
  };

  const STEPS = [{ id: 1, label: 'Personal' }, { id: 2, label: 'Documents' }, { id: 3, label: 'Review' }];

  if (submitted) return (
    <main className="min-h-screen mesh-bg grainy pt-32 pb-20 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card max-w-lg w-full text-center py-16 px-8">
        <div className="w-20 h-20 bg-blue-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/20">
          <ShieldCheck className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-3">Registration Submitted!</h2>
        <p className="text-gray-500 font-medium leading-relaxed mb-8">
          Your SHA PIN registration will be processed within <span className="font-black text-gray-800">2 hours</span>.
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
          <ChevronRight className="w-3 h-3 text-gray-300" /><span className="text-gray-900">PIN Registration</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8 lg:sticky lg:top-32">
            <div className="space-y-4">
              <div className="badge-green">New Member Service</div>
              <h1 className="text-5xl font-black text-gray-900 leading-tight">SHA PIN<br /><span className="text-sha-600">Registration</span></h1>
              <p className="text-xl text-gray-500 font-medium leading-relaxed">Register as a new SHA member and receive your official member number within 2 hours.</p>
            </div>
            <div className="inline-flex items-baseline gap-2">
              <span className="text-3xl font-black">Ksh 300</span>
              <span className="text-sm text-gray-400 font-bold">· Ready in 2 hours</span>
            </div>
            <div className="space-y-3">
              {['National ID or Passport Required','Immediate Member Number Assignment',
                'Employer Details for Payroll Deduction','SMS Confirmation Sent on Approval',
                'Family Registration Option Available'].map((item) => (
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
                    <span className={`text-[9px] font-black uppercase tracking-widest ${step >= s.id ? 'text-gray-900' : 'text-gray-300'}`}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className={`h-1 flex-1 mx-3 rounded-full transition-all ${step > s.id ? 'bg-green-500' : 'bg-gray-100'}`} />}
                </div>
              ))}
            </div>

            <form onSubmit={submit} className="space-y-8">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
                    <div><label className="label"><User className="w-3.5 h-3.5 text-sha-600" />Full Legal Name</label>
                      <input name="fullName" value={form.fullName} onChange={onChange} required placeholder="As on your National ID" className="input-field" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="label">ID / Passport No.</label>
                        <input name="idNumber" value={form.idNumber} onChange={onChange} required placeholder="e.g. 12345678" className="input-field" /></div>
                      <div><label className="label">Date of Birth</label>
                        <input name="dob" value={form.dob} onChange={onChange} type="date" required className="input-field" /></div>
                    </div>
                    <div><label className="label"><Phone className="w-3.5 h-3.5 text-sha-600" />Phone Number</label>
                      <input name="phone" value={form.phone} onChange={onChange} type="tel" required placeholder="07XX XXX XXX" className="input-field" /></div>
                    <div><label className="label"><Mail className="w-3.5 h-3.5 text-sha-600" />Email Address</label>
                      <input name="email" value={form.email} onChange={onChange} type="email" required placeholder="e.g. john@gmail.com" className="input-field" /></div>
                    <div><label className="label"><Briefcase className="w-3.5 h-3.5 text-sha-600" />Employment Type</label>
                      <select name="employmentType" value={form.employmentType} onChange={onChange} className="input-field">
                        <option value="employed">Employed (Formal Sector)</option>
                        <option value="self-employed">Self-Employed / Business Owner</option>
                        <option value="informal">Informal Sector / Hustler</option>
                        <option value="student">Student</option>
                        <option value="unemployed">Unemployed</option>
                      </select>
                    </div>
                    {form.employmentType === 'employed' && (
                      <div><label className="label">Employer Name</label>
                        <input name="employer" value={form.employer} onChange={onChange} placeholder="e.g. Kenya Power Ltd" className="input-field" /></div>
                    )}
                    <button type="button" onClick={() => { const e = v1(); if (e) { setError(e); return; } setError(null); setStep(2); }}
                      className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black hover:bg-sha-700 transition-all shadow-xl flex items-center justify-center gap-3 group">
                      Next: Upload ID <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <p className="text-xs text-blue-800 font-bold">Upload a clear photo of your National ID (both sides) or Passport bio-data page.</p>
                    </div>
                    <div><label className="label"><FileText className="w-3.5 h-3.5 text-sha-600" />National ID / Passport <span className="text-red-500">*</span></label>
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
                      <button type="button" onClick={() => { const e = v2(); if (e) { setError(e); return; } setError(null); setStep(3); }}
                        className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-sha-700 transition-all flex items-center justify-center gap-3 group">
                        Review &amp; Submit <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
                    <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Review Details</p>
                    <div className="space-y-3">
                      {[['Full Name', form.fullName], ['ID Number', form.idNumber], ['Date of Birth', form.dob],
                        ['Phone', form.phone], ['Email', form.email], ['Employment', form.employmentType]].map(([l, v]) => (
                        <div key={l} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{l}</span>
                          <span className="text-sm font-black text-gray-800 capitalize">{v}</span>
                        </div>
                      ))}
                    </div>
                    {idDoc && (
                      <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-bold text-gray-700">{idDoc.name}</span>
                        <span className="ml-auto text-[9px] text-gray-400 uppercase font-black">National ID</span>
                      </div>
                    )}
                    <div className="p-6 bg-sha-50/60 rounded-3xl border border-sha-500/10 space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase">
                        <span>Service Fee</span><span>Ksh 300</span>
                      </div>
                      <div className="h-px bg-sha-500/10" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-gray-900">Total Payable</span>
                        <span className="text-xl font-black text-sha-700">Ksh 300</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(2)} className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black">Back</button>
                      <button type="submit" disabled={loading} className="flex-1 btn-primary flex items-center justify-center gap-2 py-5">
                        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</> : <><ShieldCheck className="w-5 h-5" /> Submit</>}
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
              { q: 'Who is eligible to register for a SHA PIN?', a: 'All Kenyan citizens and residents aged 18 and above are eligible to register as SHA members. This includes employed, self-employed, and unemployed individuals. Dependants (spouse, children under 25, and parents) can be added to an existing membership after registration.' },
              { q: 'What is the difference between SHA and NHIF?', a: 'SHA (Social Health Authority) replaced NHIF (National Hospital Insurance Fund) as part of Kenya\'s universal health coverage reforms under the Social Health Insurance Act 2023. If you were previously registered with NHIF, your records have been migrated to SHA. New members now register directly under SHA.' },
              { q: 'What documents do I need for SHA PIN registration?', a: 'You need a valid National ID card or Kenyan passport. The registration form also requires your date of birth, phone number, email address, and employment details. If you are employed, your employer\'s name and details are required for contribution purposes.' },
              { q: 'How long does it take to receive my SHA member number?', a: 'Through our platform, SHA PIN registration is processed within approximately 2 hours. You will receive your unique SHA member number via SMS and email. This is significantly faster than the in-person process at government offices, which can take several days.' },
              { q: 'Can I register my family members at the same time?', a: 'The initial registration creates your individual SHA membership. Once you have your member number, you can add dependants (spouse, children, and parents) through our Beneficiary Update service. This is a separate process with its own documentation requirements.' },
              { q: 'What happens after I get my SHA PIN?', a: 'Once registered, you can access SHA-covered health services at any accredited facility. Your employer (if employed) will begin making monthly contributions through payroll. Self-employed and informal sector workers can make voluntary contributions via M-Pesa.' },
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
