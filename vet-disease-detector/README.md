# VetScan AI - Veterinary Disease Detection & Triage Web Platform

VetScan AI is a modern, responsive, and clinical-grade veterinary health assessment and decision-support web application. It enables pet owners, farmers, shelter volunteers, and veterinary students to evaluate clinical signs, test lesion images, reference normal physiological vitals, and generate printable triage reports.

---

## 🌟 Key Features

1. **Multi-Species Symptom Checker & Differential Diagnostic Engine**:
   - Covers 8 species categories: Canine (Dogs), Feline (Cats), Bovine (Cattle), Equine (Horses), Caprine/Ovine (Goats & Sheep), Poultry (Chickens/Ducks), Swine (Pigs), and Small Mammals/Exotics.
   - Dynamic real-time calculation of disease probability match scores, key indicators, and missing symptoms.
   - Automated emergency red-flag detection (e.g. Parvovirus, GDV Bloat, Cat Urethral Blockage, Colic, FMD).

2. **Visual AI Disease Scanner (Computer Vision Simulation)**:
   - Live photo scanner viewport with animated laser rastering and bounding box detection.
   - Built-in clinical preset samples (Canine Hot Spot, Feline Ringworm, Bovine Lumpy Skin Disease, Severe Tick Infestation).
   - Custom image upload support with automatic feature classification, lesion characteristics, and recommended lab tests.

3. **Color-Coded Emergency Triage Protocol**:
   - 🔴 **RED (Emergency - Immediate 24/7 Vet)**: Unresponsiveness, severe dyspnea, bloat, seizures, lethal toxicities.
   - 🟡 **AMBER (Urgent - Within 24h)**: Acute diarrhea/vomiting, eye injuries, mastitis, tick fever.
   - 🟢 **GREEN (Routine / Monitoring)**: Minor pruritus, mild dandruff, routine wellness.

4. **Veterinary Disease Encyclopedia**:
   - In-depth medical profiles with pathogen type, incubation periods, first-aid instructions, zoonotic risk flags, and veterinary treatment protocols.
   - Instant search and multi-criteria filters.

5. **Normal Physiological Vitals & Toxicity Blacklist**:
   - Baseline normal ranges for body temperature, heart rate, respiration rate, and capillary refill time across species.
   - Detailed warning cards for critical toxic substances (Acetaminophen, Xylitol, Lilies, Chocolate, Antifreeze).

6. **Printable Medical Triage Summary Report**:
   - Instant one-click generation and browser print formatting with patient profiles, active symptoms, differential diagnoses, and veterinary disclaimers.

7. **Clinic Finder & Teleconsultation Booking**:
   - 24/7 Emergency trauma center contacts, livestock mobile vets, and interactive consultation scheduling modals.

---

## 🚀 How to Run

1. Open `index.html` in any web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
2. No installation, server, or build step is required—everything is self-contained.

---

## 📁 File Structure

```text
vet-disease-detector/
├── index.html          # Main application layout, navigation tabs & modals
├── app.js              # State management, diagnostic algorithm, scanner simulation & triage engine
├── diseases-data.js    # Comprehensive clinical dataset, symptoms taxonomy, vitals & toxicities
├── styles.css          # Medical theme styles, scanner animations & print stylesheet
└── README.md           # Documentation and user guide
```
