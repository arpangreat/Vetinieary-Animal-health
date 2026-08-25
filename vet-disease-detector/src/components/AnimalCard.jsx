import React from 'react';

export default function AnimalCard({ animal, isSelected, onSelect, onLearnMore }) {
  return (
    <div 
      className={`rounded-2xl border-2 p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
        isSelected 
          ? 'border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-400/20' 
          : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm'
      }`}
      onClick={() => onSelect && onSelect(animal.id)}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-4xl p-2 bg-slate-100 rounded-xl inline-block">{animal.icon}</div>
          <span className="text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {animal.category}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-1">{animal.name}</h3>
        <p className="text-xs text-slate-500 mb-3 line-clamp-2">{animal.desc}</p>

        {animal.vitals && (
          <div className="bg-white/80 border border-slate-100 rounded-xl p-2.5 text-[11px] space-y-1 mb-3 text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-400">Normal Temp:</span>
              <span className="font-semibold text-emerald-700">{animal.vitals.temp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Heart Rate:</span>
              <span className="font-semibold">{animal.vitals.heartRate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Respiration:</span>
              <span className="font-semibold">{animal.vitals.respRate}</span>
            </div>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-emerald-600">
          {isSelected ? '✓ Selected' : 'Select Species'}
        </span>
        {onLearnMore && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onLearnMore(animal.id);
            }}
            className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 hover:underline"
          >
            Vitals Guide →
          </button>
        )}
      </div>
    </div>
  );
}
