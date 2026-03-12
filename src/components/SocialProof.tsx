'use client';

import { useEffect, useState } from 'react';

const activities = [
  { city: 'Nairobi', name: 'James M.', service: 'changed their SHA phone number' },
  { city: 'Mombasa', name: 'Fatuma A.', service: 'downloaded a contribution statement' },
  { city: 'Kisumu', name: 'Peter O.', service: 'registered a new SHA PIN' },
  { city: 'Nakuru', name: 'Grace W.', service: 'updated their beneficiaries' },
  { city: 'Eldoret', name: 'Joseph K.', service: 'registered as an employer' },
  { city: 'Thika', name: 'Mary N.', service: 'changed their SHA phone number' },
  { city: 'Nyeri', name: 'David M.', service: 'registered a new SHA PIN' },
  { city: 'Kitale', name: 'Alice C.', service: 'updated their beneficiaries' },
];

export default function SocialProof() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const show = () => {
      setCurrent(Math.floor(Math.random() * activities.length));
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
    };
    const id = setInterval(show, 9000);
    const init = setTimeout(show, 3000);
    return () => { clearInterval(id); clearTimeout(init); };
  }, []);

  const a = activities[current];

  return (
    <div
      className={`fixed bottom-24 left-6 z-40 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-center gap-4 max-w-xs">
        <div className="w-10 h-10 bg-sha-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white font-black text-sm">{a?.name[0]}</span>
        </div>
        <div>
          <p className="text-sm font-black text-gray-900">{a?.name}</p>
          <p className="text-[11px] text-gray-500 font-medium">
            <span className="text-sha-600 font-black">{a?.city}</span> — just {a?.service}
          </p>
        </div>
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
      </div>
    </div>
  );
}
