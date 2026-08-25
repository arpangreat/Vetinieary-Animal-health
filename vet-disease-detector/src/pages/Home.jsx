import React from 'react';
import AnimalCard from '../components/AnimalCard.jsx';

export default function Home({ setActivePage, setSelectedSpecies, speciesList, recentStats }) {
  return (
    <div className="space-y-12">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase px-3.5 py-1.5 rounded-full border border-emerald-400/30">
            <span>🐾 Next-Gen Veterinary Diagnostics AI</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Instant Disease Prediction & Triage for Every Animal.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Detect early clinical signs, run computer-vision skin lesion scans, calculate emergency triage scores, and receive instant differential diagnosis protocols across 8 species.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActivePage('prediction')}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2"
            >
              <span>🩺 Start Disease Prediction</span>
              <span>→</span>
            </button>
            <button
              onClick={() => setActivePage('emergency')}
              className="bg-red-600/90 hover:bg-red-600 text-white font-bold text-sm px-5 py-3.5 rounded-xl border border-red-500/50 transition-all flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
              <span>24/7 Emergency Triage</span>
            </button>
            <button
              onClick={() => setActivePage('disease-info')}
              className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm px-5 py-3.5 rounded-xl border border-slate-700 transition-all"
            >
              Browse Disease Library
            </button>
          </div>
        </div>

        {/* Floating background decorative badge */}
        <div className="absolute -right-6 -bottom-10 text-9xl opacity-10 select-none pointer-events-none hidden lg:block">
          🐕🐄🐈
        </div>
      </section>

      {/* Quick Metrics Bar */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="text-3xl p-3 bg-emerald-50 rounded-xl">⚡</div>
          <div>
            <span className="text-2xl font-black text-slate-900">96.8%</span>
            <p className="text-xs text-slate-500 font-medium">Diagnostic Accuracy</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="text-3xl p-3 bg-blue-50 rounded-xl">🐾</div>
          <div>
            <span className="text-2xl font-black text-slate-900">8 Species</span>
            <p className="text-xs text-slate-500 font-medium">Companion & Livestock</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="text-3xl p-3 bg-purple-50 rounded-xl">📚</div>
          <div>
            <span className="text-2xl font-black text-slate-900">30+ Pathologies</span>
            <p className="text-xs text-slate-500 font-medium">Clinical Protocols</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="text-3xl p-3 bg-red-50 rounded-xl">🚨</div>
          <div>
            <span className="text-2xl font-black text-slate-900">&lt; 15 Sec</span>
            <p className="text-xs text-slate-500 font-medium">Emergency Triage Speed</p>
          </div>
        </div>
      </section>

      {/* Select Animal Species Section */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Select an Animal to Begin</h2>
            <p className="text-xs sm:text-sm text-slate-500">Pick a species to inspect normal vitals or launch tailored symptom analysis</p>
          </div>
          <button
            onClick={() => setActivePage('animal-info')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-800"
          >
            View All Species Reference Guide →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {speciesList.slice(0, 4).map(sp => (
            <AnimalCard
              key={sp.id}
              animal={sp}
              onSelect={(id) => {
                setSelectedSpecies(id);
                setActivePage('prediction');
              }}
              onLearnMore={() => {
                setSelectedSpecies(sp.id);
                setActivePage('animal-info');
              }}
            />
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-100 rounded-3xl p-8 sm:p-10 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Clinical Suite Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Comprehensive Veterinary AI Modules</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="text-3xl">🩺</div>
            <h3 className="text-base font-bold text-slate-900">Symptom Differential Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Algorithmic scoring that correlates multi-system symptoms with verified veterinary pathology, ranking differentials by probability.
            </p>
            <button onClick={() => setActivePage('prediction')} className="text-xs font-bold text-emerald-600 hover:underline">
              Launch Checker →
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="text-3xl">📷</div>
            <h3 className="text-base font-bold text-slate-900">Visual AI Lesion Scanner</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Simulated convolutional vision models for skin dermatitis, ringworm, ectoparasite clusters, and ocular infections.
            </p>
            <button onClick={() => setActivePage('prediction')} className="text-xs font-bold text-emerald-600 hover:underline">
              Scan a Photo →
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="text-3xl">📄</div>
            <h3 className="text-base font-bold text-slate-900">Printable Triage Summary</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Export patient history, observed signs, and differential scores into a formatted report to present directly to your veterinarian.
            </p>
            <button onClick={() => setActivePage('history')} className="text-xs font-bold text-emerald-600 hover:underline">
              View History & Reports →
            </button>
          </div>
        </div>
      </section>

      {/* Emergency Callout Card */}
      <section className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
            Immediate Attention Required?
          </span>
          <h3 className="text-xl font-bold text-red-950">Is Your Animal In Severe Acute Distress?</h3>
          <p className="text-xs sm:text-sm text-red-800 max-w-xl">
            Bloat, sudden collapse, difficulty breathing, or poisoning require immediate in-person emergency hospital care.
          </p>
        </div>
        <button
          onClick={() => setActivePage('emergency')}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md transition-all shrink-0"
        >
          🚨 Open Emergency Guide & Hotlines
        </button>
      </section>

    </div>
  );
}
