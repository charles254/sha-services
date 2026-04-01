'use client';

import { useEffect, useState, useCallback } from 'react';

const services = [
  'changed their SHA phone number',
  'downloaded a contribution statement',
  'registered a new SHA PIN',
  'updated their beneficiaries',
  'registered as an employer',
  'requested a member certificate',
  'verified their SHA status'
];

const names = [
  'James M.', 'Fatuma A.', 'Peter O.', 'Grace W.', 'Joseph K.', 'Mary N.', 'David M.', 'Alice C.',
  'John K.', 'Sarah W.', 'Abdi H.', 'Zainab J.', 'Kevin O.', 'Lydia N.', 'Samuel T.', 'Beatrice A.',
  'Hassan M.', 'Esther K.', 'George N.', 'Rose M.', 'Charles O.', 'Mercy W.', 'Vincent K.'
];

// Small subset of cities for social proof — avoids importing the full 500+ location array into the client bundle
const cities = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Nyeri', 'Machakos',
  'Meru', 'Kitale', 'Malindi', 'Naivasha', 'Garissa', 'Kakamega', 'Embu', 'Nanyuki',
  'Kericho', 'Kilifi', 'Bungoma', 'Isiolo', 'Lamu', 'Kajiado', 'Migori', 'Homa Bay',
];

export default function SocialProof() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState({ name: '', city: '', service: '' });

  const show = useCallback(() => {
    setCurrent({
      name: names[Math.floor(Math.random() * names.length)],
      city: cities[Math.floor(Math.random() * cities.length)],
      service: services[Math.floor(Math.random() * services.length)]
    });
    setVisible(true);
    setTimeout(() => setVisible(false), 5000);
  }, []);

  useEffect(() => {
    const id = setInterval(show, 12000);
    const init = setTimeout(show, 4000);
    return () => { clearInterval(id); clearTimeout(init); };
  }, [show]);

  const a = current;

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-90 pointer-events-none'
      }`}
    >
      <div className="glass rounded-3xl p-4 flex items-center gap-4 max-w-sm border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        <div className="w-12 h-12 bg-sha-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-sha-600/20">
          <span className="text-white font-black text-lg">{a?.name[0]}</span>
        </div>
        <div className="flex-1 pr-2">
          <p className="text-sm font-black text-gray-900 leading-tight mb-0.5">{a?.name}</p>
          <p className="text-[12px] text-gray-500 font-medium leading-snug">
            <span className="text-sha-600 font-bold">{a?.city}</span>
            <br />
            {a?.service}
          </p>
        </div>
        <div className="relative flex items-center justify-center w-3 h-3">
          <span className="absolute w-full h-full bg-green-500 rounded-full animate-ping opacity-40" />
          <span className="relative w-2 h-2 bg-green-500 rounded-full" />
        </div>
      </div>
    </div>
  );
}
