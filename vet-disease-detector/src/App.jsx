import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

// Pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AnimalInfo from './pages/AnimalInfo.jsx';
import Prediction from './pages/Prediction.jsx';
import Result from './pages/Result.jsx';
import DiseaseInfo from './pages/DiseaseInfo.jsx';
import History from './pages/History.jsx';
import Emergency from './pages/Emergency.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';

export default function App({ initialData }) {
  const {
    speciesList = [],
    symptomCategories = [],
    diseasesDatabase = [],
    scannerPresets = [],
    normalVitals = [],
    toxicityAlerts = []
  } = initialData || {};

  const [activePage, setActivePage] = useState('home');
  const [user, setUser] = useState({ name: 'Dr. Sarah Jenkins', email: 'sarah.j@vetscan.org', role: 'veterinarian' });
  const [selectedSpecies, setSelectedSpecies] = useState('dog');
  const [activeResult, setActiveResult] = useState(null);
  const [selectedDiseaseModal, setSelectedDiseaseModal] = useState(null);

  // Stored prediction history
  const [historyList, setHistoryList] = useState([
    {
      id: 'hist_1',
      date: 'Aug 24, 2026, 04:30 PM',
      patientName: 'Buddy',
      species: 'Canine (Dog)',
      breed: 'Golden Retriever',
      topDisease: 'Canine Parvovirus (CPV-2)',
      confidence: 96,
      urgency: 'CRITICAL',
      triageLevel: 'RED',
      symptoms: ['bloody_diarrhea', 'vomiting', 'fever', 'lethargy']
    },
    {
      id: 'hist_2',
      date: 'Aug 23, 2026, 11:15 AM',
      patientName: 'Misty',
      species: 'Feline (Cat)',
      breed: 'Persian',
      topDisease: 'Dermatophytosis (Ringworm)',
      confidence: 91,
      urgency: 'MODERATE',
      triageLevel: 'AMBER',
      symptoms: ['alopecia', 'crusting_scabs', 'severe_itching']
    }
  ]);

  // Differential Diagnostic Evaluation Algorithm
  const handleRunPrediction = ({ patient, symptoms, scannerOverride }) => {
    const currentSpecies = patient.species || selectedSpecies;

    if (scannerOverride) {
      const scanResultObj = {
        patient,
        symptoms,
        scannerOverride,
        evaluatedAt: new Date().toLocaleTimeString(),
        triageStatus: {
          level: scannerOverride.severity.includes('URGENT') || scannerOverride.severity.includes('CRITICAL') ? 'AMBER' : 'GREEN',
          title: scannerOverride.severity,
          message: scannerOverride.actionPlan,
          hasRedFlags: false,
          redFlagList: []
        },
        topMatches: [
          {
            id: scannerOverride.id,
            name: scannerOverride.detectedDisease,
            confidence: scannerOverride.confidence,
            urgencyLevel: scannerOverride.severity.includes('CRITICAL') ? 'CRITICAL' : 'URGENT',
            pathogenType: 'Visual Lesion Scan Match',
            incubationPeriod: 'N/A (Cutaneous Presentation)',
            description: scannerOverride.lesionType,
            clinicalDiagnostics: [scannerOverride.recommendedTest],
            matchedSymptoms: symptoms,
            zoonotic: scannerOverride.severity.includes('ZOONOTIC')
          },
          ...(scannerOverride.secondaryMatches || []).map((m, i) => ({
            id: `sec_${i}`,
            name: m.name,
            confidence: m.conf,
            urgencyLevel: 'MODERATE',
            pathogenType: 'Secondary Differential',
            incubationPeriod: 'Varies',
            description: 'Secondary morphological match based on dermatological boundary characteristics.',
            clinicalDiagnostics: ['Skin Scraping / Cytology'],
            matchedSymptoms: []
          }))
        ]
      };

      setActiveResult(scanResultObj);
      saveToHistory(scanResultObj);
      return;
    }

    // Standard symptom matching algorithm
    const relevant = diseasesDatabase.filter(d => d.species.includes(currentSpecies) || d.species.includes('all'));

    const matches = relevant.map(disease => {
      const totalKey = disease.keySymptoms.length;
      const matched = disease.keySymptoms.filter(s => symptoms.includes(s));
      const missing = disease.keySymptoms.filter(s => !symptoms.includes(s));
      const matchCount = matched.length;
      const matchRatio = totalKey > 0 ? matchCount / totalKey : 0;

      let confidence = 0;
      if (symptoms.length > 0 && matchCount > 0) {
        confidence = Math.min(98, Math.round(matchRatio * 70 + Math.min(matchCount, 4) * 7));
      }

      return {
        ...disease,
        matchCount,
        totalKey,
        matchedSymptoms: matched,
        missingSymptoms: missing,
        confidence
      };
    });

    matches.sort((a, b) => b.confidence - a.confidence);
    const topMatches = matches.filter(m => m.confidence > 15);

    // Emergency Triage
    const criticalSymptoms = ['collapse', 'bloody_vomit', 'bloody_diarrhea', 'bloat_distension', 'dyspnea', 'cyanosis', 'anuria', 'seizures', 'paralysis'];
    const activeCritical = symptoms.filter(s => criticalSymptoms.includes(s));

    let triageStatus = {
      level: 'GREEN',
      title: 'Routine Care / Mild Urgency',
      message: 'No immediate red-flag indicators detected. Continue monitoring vitals and schedule a veterinary visit if symptoms persist.',
      hasRedFlags: false,
      redFlagList: []
    };

    if (activeCritical.length > 0 || (topMatches[0] && topMatches[0].urgencyLevel === 'CRITICAL' && topMatches[0].confidence >= 50)) {
      triageStatus = {
        level: 'RED',
        title: 'CRITICAL EMERGENCY - IMMEDIATE VET CARE',
        message: 'Potentially life-threatening conditions or acute clinical distress detected. Do not delay. Transport patient immediately to an emergency veterinary hospital.',
        hasRedFlags: true,
        redFlagList: activeCritical.map(c => c.replace(/_/g, ' ').toUpperCase())
      };
    } else if (symptoms.length >= 3 || (topMatches[0] && topMatches[0].confidence >= 40)) {
      triageStatus = {
        level: 'AMBER',
        title: 'URGENT - VET VISIT WITHIN 24 HOURS',
        message: 'Active symptoms indicate an acute infectious, inflammatory, or parasitic disease. Schedule a veterinary examination today.',
        hasRedFlags: false,
        redFlagList: []
      };
    }

    const newResult = {
      patient,
      symptoms,
      topMatches: topMatches.length > 0 ? topMatches : relevant.slice(0, 3).map(r => ({ ...r, confidence: 25, matchedSymptoms: [] })),
      triageStatus,
      evaluatedAt: new Date().toLocaleTimeString()
    };

    setActiveResult(newResult);
    saveToHistory(newResult);
  };

  const saveToHistory = (resultObj) => {
    const topD = resultObj.topMatches[0] || { name: 'Undetermined Malaise', confidence: 50, urgencyLevel: 'MODERATE' };
    const historyEntry = {
      id: `hist_${Date.now()}`,
      date: new Date().toLocaleString(),
      patientName: resultObj.patient?.name || 'Patient',
      species: resultObj.patient?.species?.toUpperCase() || 'CANINE',
      breed: resultObj.patient?.breed || 'Mixed',
      topDisease: topD.name,
      confidence: topD.confidence,
      urgency: topD.urgencyLevel,
      triageLevel: resultObj.triageStatus.level,
      symptoms: resultObj.symptoms,
      fullResult: resultObj
    };
    setHistoryList([historyEntry, ...historyList]);
  };

  const handleSelectHistoryItem = (historyItem) => {
    if (historyItem.fullResult) {
      setActiveResult(historyItem.fullResult);
    } else {
      setActiveResult({
        patient: { name: historyItem.patientName, species: historyItem.species.toLowerCase().includes('dog') ? 'dog' : 'cat', breed: historyItem.breed, age: '2 yrs', weight: '20 kg' },
        symptoms: historyItem.symptoms,
        evaluatedAt: historyItem.date,
        triageStatus: {
          level: historyItem.triageLevel,
          title: `${historyItem.triageLevel} Triage`,
          message: 'Historical record triage evaluation.',
          hasRedFlags: historyItem.triageLevel === 'RED',
          redFlagList: []
        },
        topMatches: [
          {
            id: 'h_match',
            name: historyItem.topDisease,
            confidence: historyItem.confidence,
            urgencyLevel: historyItem.urgency,
            pathogenType: 'Clinical Record',
            incubationPeriod: 'Varies',
            description: 'Archived case evaluation.',
            clinicalDiagnostics: ['Standard CBC', 'Cytology'],
            matchedSymptoms: historyItem.symptoms
          }
        ]
      });
    }
    setActivePage('result');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        user={user}
        setUser={setUser}
      />

      {/* Main Page Routing */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activePage === 'home' && (
          <Home
            setActivePage={setActivePage}
            setSelectedSpecies={setSelectedSpecies}
            speciesList={speciesList}
          />
        )}

        {activePage === 'login' && (
          <Login
            setActivePage={setActivePage}
            setUser={setUser}
          />
        )}

        {activePage === 'signup' && (
          <Signup
            setActivePage={setActivePage}
            setUser={setUser}
          />
        )}

        {activePage === 'dashboard' && (
          <Dashboard
            setActivePage={setActivePage}
            user={user}
            historyList={historyList}
            onSelectHistoryItem={handleSelectHistoryItem}
          />
        )}

        {activePage === 'animal-info' && (
          <AnimalInfo
            speciesList={speciesList}
            selectedSpecies={selectedSpecies}
            setSelectedSpecies={setSelectedSpecies}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'prediction' && (
          <Prediction
            speciesList={speciesList}
            symptomCategories={symptomCategories}
            diseasesDatabase={diseasesDatabase}
            scannerPresets={scannerPresets}
            selectedSpecies={selectedSpecies}
            setSelectedSpecies={setSelectedSpecies}
            onRunPrediction={handleRunPrediction}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'result' && (
          <Result
            activeResult={activeResult}
            setActivePage={setActivePage}
            onOpenDiseaseModal={(d) => setSelectedDiseaseModal(d)}
          />
        )}

        {activePage === 'disease-info' && (
          <DiseaseInfo
            diseasesDatabase={diseasesDatabase}
            speciesList={speciesList}
            onOpenDiseaseModal={(d) => setSelectedDiseaseModal(d)}
          />
        )}

        {activePage === 'history' && (
          <History
            historyList={historyList}
            onSelectHistoryItem={handleSelectHistoryItem}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'emergency' && (
          <Emergency
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'about' && (
          <About
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'contact' && (
          <Contact />
        )}
      </main>

      {/* Disease Detail Modal */}
      {selectedDiseaseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {selectedDiseaseModal.urgencyLevel}
                  </span>
                  {selectedDiseaseModal.zoonotic && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      ☣️ Zoonotic Risk
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-black text-slate-900 mt-1">{selectedDiseaseModal.name}</h2>
                <p className="text-xs text-slate-500">{selectedDiseaseModal.pathogenType} • Incubation: {selectedDiseaseModal.incubationPeriod}</p>
              </div>
              <button onClick={() => setSelectedDiseaseModal(null)} className="text-slate-400 hover:text-slate-600 font-black text-xl">✕</button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div>
                <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">Pathophysiology & Presentation:</h4>
                <p className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 leading-relaxed">{selectedDiseaseModal.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50/70 p-4 rounded-2xl border border-red-100 space-y-2">
                  <h4 className="font-bold text-red-950 uppercase text-xs">Emergency First-Aid:</h4>
                  <ul className="space-y-1 text-xs text-red-900 list-disc list-inside">
                    {selectedDiseaseModal.firstAidInstructions ? (
                      selectedDiseaseModal.firstAidInstructions.map((s, i) => <li key={i}>{s}</li>)
                    ) : (
                      <li>Seek immediate veterinary consultation.</li>
                    )}
                  </ul>
                </div>

                <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100 space-y-2">
                  <h4 className="font-bold text-blue-950 uppercase text-xs">Diagnostic Lab Tests:</h4>
                  <ul className="space-y-1 text-xs text-blue-900 list-disc list-inside">
                    {selectedDiseaseModal.clinicalDiagnostics ? (
                      selectedDiseaseModal.clinicalDiagnostics.map((t, i) => <li key={i}>{t}</li>)
                    ) : (
                      <li>{selectedDiseaseModal.recommendedTest || 'Complete Blood Count & Panel'}</li>
                    )}
                  </ul>
                </div>
              </div>

              {selectedDiseaseModal.treatmentProtocol && (
                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">Veterinary Treatment Protocol:</h4>
                  <p className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100 leading-relaxed text-xs text-emerald-950">
                    {selectedDiseaseModal.treatmentProtocol}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedDiseaseModal(null)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}
