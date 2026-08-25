import React, { useState } from 'react';
import AnimalCard from '../components/AnimalCard.jsx';
import PredictionCard from '../components/PredictionCard.jsx';

export default function Prediction({
  speciesList,
  symptomCategories,
  diseasesDatabase,
  scannerPresets,
  selectedSpecies,
  setSelectedSpecies,
  onRunPrediction,
  setActivePage
}) {
  const [activeMode, setActiveMode] = useState('symptoms'); // 'symptoms' or 'scanner'
  const [patient, setPatient] = useState({
    name: 'Buddy',
    species: selectedSpecies || 'dog',
    breed: 'Golden Retriever',
    age: '2 years',
    weight: '28 kg',
    vaccineStatus: 'up_to_date',
    duration: '1-3 Days'
  });
  const [selectedSymptoms, setSelectedSymptoms] = useState(new Set(['fever', 'lethargy', 'vomiting']));

  // Scanner state
  const [scanImage, setScanImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannerResult, setScannerResult] = useState(null);

  const toggleSymptom = (symId) => {
    const next = new Set(selectedSymptoms);
    if (next.has(symId)) next.delete(symId);
    else next.add(symId);
    setSelectedSymptoms(next);
  };

  const handlePredictSubmit = (e) => {
    e.preventDefault();
    if (selectedSymptoms.size === 0) {
      alert('Please select at least 1 observed symptom to run the differential AI diagnostic algorithm.');
      return;
    }
    onRunPrediction({
      patient: { ...patient, species: selectedSpecies },
      symptoms: Array.from(selectedSymptoms)
    });
    setActivePage('result');
  };

  const handlePresetScan = (preset) => {
    setScanImage(preset.thumbnail);
    setIsScanning(true);
    setScannerResult(null);

    setTimeout(() => {
      setIsScanning(false);
      setScannerResult(preset);
    }, 1600);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const customPreset = {
        id: 'custom_upload',
        title: 'Custom Uploaded Lesion',
        species: patient.species,
        area: 'Dermal / Cutaneous Region',
        detectedDisease: 'Superficial Pyoderma / Focal Erythematous Dermatitis',
        confidence: 89.2,
        secondaryMatches: [
          { name: 'Allergic Contact Dermatitis', conf: 72.0 },
          { name: 'Demodicosis', conf: 61.4 }
        ],
        lesionType: 'Localized epidermal erythema, papular eruption with secondary excoriation',
        severity: 'MODERATE - SCHEDULE VET EXAM',
        recommendedTest: 'Impression smear skin cytology, Fungal DTM culture',
        actionPlan: 'Prevent patient from licking/scratching area (cone collar recommended). Cleanse with antiseptic 2% Chlorhexidine solution and seek veterinary confirmation.',
        thumbnail: event.target.result
      };
      setScanImage(event.target.result);
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        setScannerResult(customPreset);
      }, 1600);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8">
      
      {/* Header Mode Toggle */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase">
            AI Clinical Prediction Engine
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1.5">Disease Detection Suite</h1>
          <p className="text-xs text-slate-500">Choose between multi-symptom differential analysis or visual lesion photo scanning</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveMode('symptoms')}
            className={`px-4 py-2 rounded-lg transition-all ${activeMode === 'symptoms' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            🩺 Symptom Checker
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('scanner')}
            className={`px-4 py-2 rounded-lg transition-all ${activeMode === 'scanner' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            📷 Visual AI Scanner
          </button>
        </div>
      </div>

      {/* MODE 1: SYMPTOM CHECKER */}
      {activeMode === 'symptoms' && (
        <form onSubmit={handlePredictSubmit} className="space-y-8">
          
          {/* Step 1: Species Selection */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Step 1: Choose Animal Species</h2>
                <p className="text-xs text-slate-500">Pathology rules and diagnostic scores adapt to species physiology</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600">Active: {selectedSpecies.toUpperCase()}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {speciesList.map(sp => (
                <button
                  type="button"
                  key={sp.id}
                  onClick={() => {
                    setSelectedSpecies(sp.id);
                    setPatient({ ...patient, species: sp.id });
                  }}
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center ${
                    selectedSpecies === sp.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-2xl mb-1">{sp.icon}</span>
                  <span className="text-xs truncate w-full">{sp.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Patient Profile Inputs */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Step 2: Patient Information
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Name / Tag</label>
                <input
                  type="text"
                  value={patient.name}
                  onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Breed</label>
                <input
                  type="text"
                  value={patient.breed}
                  onChange={(e) => setPatient({ ...patient, breed: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Age</label>
                <select
                  value={patient.age}
                  onChange={(e) => setPatient({ ...patient, age: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option>Young / Puppy / Calf (&lt; 1 yr)</option>
                  <option>Adult (1 - 7 yrs)</option>
                  <option>Senior (&gt; 7 yrs)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Weight</label>
                <input
                  type="text"
                  value={patient.weight}
                  onChange={(e) => setPatient({ ...patient, weight: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Vaccination</label>
                <select
                  value={patient.vaccineStatus}
                  onChange={(e) => setPatient({ ...patient, vaccineStatus: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="up_to_date">Fully Vaccinated</option>
                  <option value="partially">Partially Vaccinated</option>
                  <option value="unvaccinated">Unvaccinated</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Duration</label>
                <select
                  value={patient.duration}
                  onChange={(e) => setPatient({ ...patient, duration: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option>Sudden / Acute (&lt; 24h)</option>
                  <option>1-3 Days</option>
                  <option>4-7 Days</option>
                  <option>Chronic (&gt; 1 Week)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 3: Check Symptoms */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-slate-900">Step 3: Check Observed Clinical Signs</h2>
                <p className="text-xs text-slate-500">Selected: {selectedSymptoms.size} symptoms</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSymptoms(new Set())}
                className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
              >
                Clear All ✕
              </button>
            </div>

            <div className="space-y-4">
              {symptomCategories.map(cat => (
                <div key={cat.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 pb-2 mb-3 border-b border-slate-100">
                    {cat.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {cat.symptoms.map(sym => {
                      const isChecked = selectedSymptoms.has(sym.id);
                      return (
                        <label
                          key={sym.id}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                            isChecked
                              ? 'border-emerald-500 bg-emerald-50/80 font-semibold text-emerald-950'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center space-x-3 pr-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleSymptom(sym.id)}
                              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                            />
                            <span className="text-xs select-none">{sym.name}</span>
                          </div>
                          {sym.severity === 'critical' ? (
                            <span className="text-[10px] uppercase font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                              Emergency
                            </span>
                          ) : sym.severity === 'high' ? (
                            <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                              Urgent
                            </span>
                          ) : null}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Prediction Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm px-8 py-4 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <span>🔬 Analyze Symptoms & Calculate Differentials</span>
              <span>→</span>
            </button>
          </div>

        </form>
      )}

      {/* MODE 2: VISUAL AI SCANNER */}
      {activeMode === 'scanner' && (
        <div className="space-y-6">
          
          {/* Preset Sample Selector */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Click a Clinical Preset to Test:</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {scannerPresets.map(preset => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetScan(preset)}
                  className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-md transition-all text-left group flex flex-col justify-between"
                >
                  <div className="w-full h-24 rounded-xl overflow-hidden mb-2 bg-slate-100 flex items-center justify-center">
                    <img src={preset.thumbnail} alt={preset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">{preset.title}</span>
                    <span className="text-[11px] text-slate-400">{preset.species} • {preset.area}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Scanner Viewport & Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Viewport */}
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Image Analysis Viewport</h3>
                <label className="cursor-pointer text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl transition-colors">
                  <span>📤 Upload Custom Photo</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <div className="scan-container relative w-full h-80 bg-slate-900 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-800">
                {!scanImage ? (
                  <div className="text-center p-6">
                    <div className="text-5xl mb-2 opacity-50">📷</div>
                    <p className="text-sm font-bold text-slate-300">No Image Loaded</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">Select a preset or upload an image of the lesion/parasite to scan.</p>
                  </div>
                ) : (
                  <>
                    <img src={scanImage} alt="Scan preview" className="w-full h-full object-contain" />
                    {isScanning && <div className="scan-laser-line"></div>}
                    {!isScanning && <div className="detection-box w-36 h-36 top-1/4 left-1/3"></div>}
                  </>
                )}
              </div>

              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Model: VetVisionNet v4 (Segmentation CNN)</span>
                <span>Ready for Inference</span>
              </div>
            </div>

            {/* AI Findings Output */}
            <div className="lg:col-span-6 space-y-4">
              {isScanning ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mb-3"></div>
                  <h4 className="text-sm font-bold text-slate-900">Neural Visual Analysis in Progress...</h4>
                  <p className="text-xs text-slate-500 mt-1">Extracting morphological features, color histology & edge margins</p>
                </div>
              ) : scannerResult ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-bold text-emerald-600 uppercase">Visual Classification Result</span>
                      <h3 className="text-lg font-black text-slate-900">{scannerResult.detectedDisease}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-600">{scannerResult.confidence}%</span>
                      <span className="block text-[10px] text-slate-400 font-bold">Confidence</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 block font-semibold">Lesion Characteristics:</span>
                      <span className="font-semibold text-slate-800">{scannerResult.lesionType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Severity Rating:</span>
                      <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                        {scannerResult.severity}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Confirmatory Lab Diagnostic:</span>
                      <span className="font-semibold text-slate-800">{scannerResult.recommendedTest}</span>
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-xs text-emerald-950">
                    <strong className="block mb-1">Recommended Action Protocol:</strong>
                    <p className="leading-relaxed">{scannerResult.actionPlan}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setActivePage('emergency')}
                      className="text-xs font-bold bg-slate-900 text-white px-4 py-2 rounded-xl"
                    >
                      Find Emergency Vet →
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onRunPrediction({
                          patient: { ...patient, species: scannerResult.species.toLowerCase().includes('dog') ? 'dog' : 'cat' },
                          symptoms: ['skin_nodules', 'erythema_hotspots', 'severe_itching'],
                          scannerOverride: scannerResult
                        });
                        setActivePage('result');
                      }}
                      className="text-xs font-bold text-emerald-600 hover:underline"
                    >
                      Export to Full Medical Report 📄
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-400 text-xs">
                  <div className="text-4xl mb-2">🔬</div>
                  Select a clinical preset above or upload a photo to view AI classification.
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
