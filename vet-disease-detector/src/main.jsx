import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './style.css';

// Initial Clinical Datasets
const initialData = {
  speciesList: typeof SPECIES_CONFIG !== 'undefined' ? SPECIES_CONFIG : [
    { id: 'dog', name: 'Canine (Dog)', icon: '🐶', category: 'companion', desc: 'Dogs, puppies, working dogs', vitals: { temp: '38.3 - 39.2 °C', heartRate: '60 - 140 bpm', respRate: '10 - 30 bpm', crt: '< 2s' } },
    { id: 'cat', name: 'Feline (Cat)', icon: '🐱', category: 'companion', desc: 'Cats, kittens', vitals: { temp: '38.1 - 39.2 °C', heartRate: '140 - 220 bpm', respRate: '20 - 30 bpm', crt: '< 2s' } },
    { id: 'cattle', name: 'Bovine (Cattle)', icon: '🐄', category: 'livestock', desc: 'Dairy, beef cows, calves', vitals: { temp: '38.5 - 39.5 °C', heartRate: '48 - 84 bpm', respRate: '26 - 50 bpm', crt: '< 2s' } },
    { id: 'horse', name: 'Equine (Horse)', icon: '🐎', category: 'equine', desc: 'Horses, ponies, foals', vitals: { temp: '37.2 - 38.3 °C', heartRate: '28 - 44 bpm', respRate: '8 - 16 bpm', crt: '< 2s' } },
    { id: 'sheep_goat', name: 'Caprine / Ovine (Goat & Sheep)', icon: '🐐', category: 'livestock', desc: 'Goats, sheep, lambs', vitals: { temp: '38.5 - 40.0 °C', heartRate: '70 - 90 bpm', respRate: '12 - 20 bpm', crt: '< 2s' } },
    { id: 'poultry', name: 'Poultry (Bird / Chicken)', icon: '🐔', category: 'poultry', desc: 'Chickens, ducks, layers', vitals: { temp: '40.6 - 41.7 °C', heartRate: '250 - 350 bpm', respRate: '15 - 30 bpm', crt: '< 2s' } },
    { id: 'pig', name: 'Swine (Pig)', icon: '🐷', category: 'livestock', desc: 'Pigs, hogs', vitals: { temp: '38.7 - 39.8 °C', heartRate: '70 - 120 bpm', respRate: '13 - 18 bpm', crt: '< 2s' } },
    { id: 'rabbit_exotic', name: 'Small Mammal & Exotic', icon: '🐰', category: 'exotic', desc: 'Rabbits, guinea pigs', vitals: { temp: '38.5 - 40.0 °C', heartRate: '130 - 325 bpm', respRate: '30 - 60 bpm', crt: '< 2s' } }
  ],
  symptomCategories: typeof SYMPTOM_CATEGORIES !== 'undefined' ? SYMPTOM_CATEGORIES : [],
  diseasesDatabase: typeof DISEASES_DATABASE !== 'undefined' ? DISEASES_DATABASE : [],
  scannerPresets: typeof IMAGE_SCAN_PRESETS !== 'undefined' ? IMAGE_SCAN_PRESETS : [],
  normalVitals: typeof NORMAL_VITALS !== 'undefined' ? NORMAL_VITALS : [],
  toxicityAlerts: typeof TOXICITY_ALERTS !== 'undefined' ? TOXICITY_ALERTS : []
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App initialData={initialData} />
    </React.StrictMode>
  );
}
