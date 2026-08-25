import React from 'react';

export default function PredictionCard({ prediction, rank, onOpenDetails, onBookVet }) {
  const badgeColor = prediction.urgencyLevel === 'CRITICAL'
    ? 'bg-red-100 text-red-800 border-red-200'
    : prediction.urgencyLevel === 'URGENT'
    ? 'bg-amber-100 text-amber-800 border-amber-200'
    : 'bg-emerald-100 text-emerald-800 border-emerald-200';

  const progressColor = prediction.confidence > 75 
    ? 'bg-red-500' 
    : prediction.confidence > 50 
    ? 'bg-amber-500' 
    : 'bg-emerald-500';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-emerald-300 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center space-x-2 flex-wrap gap-1">
            {rank && <span className="text-xs font-black text-slate-400">#{rank}</span>}
            <h4 className="text-base font-bold text-slate-900">{prediction.name}</h4>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${badgeColor}`}>
              {prediction.urgencyLevel}
            </span>
            {prediction.zoonotic && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                ☣️ Zoonotic Risk
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {prediction.pathogenType} • Incubation: {prediction.incubationPeriod}
          </p>
        </div>

        <div className="text-right sm:min-w-[130px]">
          <div className="flex items-center justify-end space-x-1.5">
            <span className="text-xs text-slate-400 font-semibold">Confidence:</span>
            <span className="text-base font-black text-slate-900">{prediction.confidence}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-1 overflow-hidden">
            <div 
              className={`${progressColor} h-full rounded-full transition-all duration-500`} 
              style={{ width: `${prediction.confidence}%` }}
            ></div>
          </div>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-slate-700 mb-4 leading-relaxed">
        {prediction.description}
      </p>

      {/* Matched vs Unmatched indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
        <div>
          <span className="font-bold text-slate-800 block mb-1">
            Matched Clinical Signs ({prediction.matchedSymptoms ? prediction.matchedSymptoms.length : 0}):
          </span>
          <div className="flex flex-wrap gap-1">
            {prediction.matchedSymptoms && prediction.matchedSymptoms.length > 0 ? (
              prediction.matchedSymptoms.map((s, idx) => (
                <span key={idx} className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium text-[11px]">
                  ✓ {s.replace(/_/g, ' ')}
                </span>
              ))
            ) : (
              <span className="text-slate-400 italic">No direct symptom tags</span>
            )}
          </div>
        </div>
        <div>
          <span className="font-bold text-slate-800 block mb-1">Recommended Lab Tests:</span>
          <p className="text-slate-600 text-[11px]">
            {Array.isArray(prediction.clinicalDiagnostics) 
              ? prediction.clinicalDiagnostics.slice(0, 2).join('; ') 
              : prediction.recommendedTest || 'Complete CBC & Cytology'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <button
          onClick={() => onOpenDetails && onOpenDetails(prediction)}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-800 hover:underline flex items-center gap-1"
        >
          View Full Clinical Treatment Protocol →
        </button>

        {onBookVet && (
          <button
            onClick={() => onBookVet(prediction)}
            className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-lg transition-colors"
          >
            Schedule Vet Exam
          </button>
        )}
      </div>
    </div>
  );
}
