/**
 * VetScan AI - Main Application Logic & Diagnostic Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  const state = {
    currentTab: 'checker',
    selectedSpecies: 'dog',
    patient: {
      name: 'Buddy',
      species: 'dog',
      breed: 'Golden Retriever',
      age: '2 years',
      weight: '28 kg',
      vaccineStatus: 'up_to_date',
      duration: '1-2 days',
      notes: ''
    },
    selectedSymptoms: new Set(['fever', 'lethargy', 'vomiting']),
    activeDiagnosis: null,
    scanner: {
      activePreset: null,
      customImage: null,
      isScanning: false,
      result: null
    },
    encyclopediaFilter: {
      search: '',
      species: 'all',
      pathogen: 'all',
      zoonoticOnly: false
    }
  };

  // Init UI
  initNavigation();
  renderSpeciesSelector();
  renderSymptomChecklist();
  renderScannerPresets();
  renderEncyclopedia();
  renderVitalsTable();
  renderToxicityAlerts();
  renderClinicsList();
  bindGlobalEvents();

  // Run initial diagnostic check
  runDiagnosticEngine();

  // Tab Navigation Handling
  function initNavigation() {
    const tabButtons = document.querySelectorAll('[data-tab-target]');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab-target');
        switchTab(targetTab);
      });
    });
  }

  window.switchTab = function(tabId) {
    state.currentTab = tabId;
    document.querySelectorAll('.tab-content').forEach(section => {
      section.classList.add('hidden');
    });
    const targetSection = document.getElementById(`tab-${tabId}`);
    if (targetSection) {
      targetSection.classList.remove('hidden');
    }

    // Update nav active states
    document.querySelectorAll('[data-tab-target]').forEach(btn => {
      if (btn.getAttribute('data-tab-target') === tabId) {
        btn.classList.add('bg-emerald-600', 'text-white');
        btn.classList.remove('text-slate-600', 'hover:bg-slate-100');
      } else {
        btn.classList.remove('bg-emerald-600', 'text-white');
        btn.classList.add('text-slate-600', 'hover:bg-slate-100');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Species Selector Component
  function renderSpeciesSelector() {
    const container = document.getElementById('speciesSelectorGrid');
    if (!container) return;

    container.innerHTML = SPECIES_CONFIG.map(sp => {
      const isSelected = state.selectedSpecies === sp.id;
      return `
        <button 
          type="button"
          onclick="selectSpecies('${sp.id}')"
          class="flex flex-col items-center justify-center p-3.5 rounded-xl border-2 transition-all duration-200 text-center ${
            isSelected 
              ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold shadow-sm ring-2 ring-emerald-400/20' 
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700'
          }"
        >
          <span class="text-3xl mb-1.5">${sp.icon}</span>
          <span class="text-xs sm:text-sm font-medium leading-tight">${sp.name}</span>
        </button>
      `;
    }).join('');
  }

  window.selectSpecies = function(speciesId) {
    state.selectedSpecies = speciesId;
    state.patient.species = speciesId;
    
    // Update default sample patient
    const spObj = SPECIES_CONFIG.find(s => s.id === speciesId);
    const breedInput = document.getElementById('patientBreed');
    if (breedInput && (!breedInput.value || breedInput.value === 'Golden Retriever' || breedInput.value === 'Persian' || breedInput.value === 'Holstein Friesian')) {
      if (speciesId === 'dog') breedInput.value = 'Golden Retriever';
      else if (speciesId === 'cat') breedInput.value = 'Persian Mix';
      else if (speciesId === 'cattle') breedInput.value = 'Holstein Dairy Cow';
      else if (speciesId === 'horse') breedInput.value = 'Arabian Gelding';
      else breedInput.value = 'Mixed Breed';
      state.patient.breed = breedInput.value;
    }

    renderSpeciesSelector();
    runDiagnosticEngine();
  };

  // Symptoms Checklist Component
  function renderSymptomChecklist() {
    const container = document.getElementById('symptomCategoriesContainer');
    if (!container) return;

    container.innerHTML = SYMPTOM_CATEGORIES.map(cat => {
      const symptomsHtml = cat.symptoms.map(sym => {
        const isChecked = state.selectedSymptoms.has(sym.id);
        const severityBadge = sym.severity === 'critical'
          ? '<span class="text-[10px] uppercase font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">Emergency</span>'
          : sym.severity === 'high'
          ? '<span class="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">Urgent</span>'
          : '';

        return `
          <label class="relative flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
            isChecked 
              ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-medium' 
              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
          }">
            <div class="flex items-center space-x-3 pr-2">
              <input 
                type="checkbox" 
                value="${sym.id}" 
                ${isChecked ? 'checked' : ''}
                onchange="toggleSymptom('${sym.id}')"
                class="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span class="text-xs sm:text-sm select-none">${sym.name}</span>
            </div>
            ${severityBadge}
          </label>
        `;
      }).join('');

      return `
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4">
          <div class="flex items-center space-x-2.5 mb-3.5 pb-2 border-b border-slate-100">
            <span class="text-emerald-700 text-sm font-semibold flex items-center gap-1.5">
              ${cat.name}
            </span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            ${symptomsHtml}
          </div>
        </div>
      `;
    }).join('');
  }

  window.toggleSymptom = function(symptomId) {
    if (state.selectedSymptoms.has(symptomId)) {
      state.selectedSymptoms.delete(symptomId);
    } else {
      state.selectedSymptoms.add(symptomId);
    }
    renderSymptomChecklist();
    runDiagnosticEngine();
  };

  window.clearAllSymptoms = function() {
    state.selectedSymptoms.clear();
    renderSymptomChecklist();
    runDiagnosticEngine();
  };

  // Diagnostic Matcher Algorithm
  function runDiagnosticEngine() {
    const selected = Array.from(state.selectedSymptoms);
    const currentSpecies = state.selectedSpecies;

    // Filter relevant diseases by species
    const relevantDiseases = DISEASES_DATABASE.filter(d => 
      d.species.includes(currentSpecies) || d.species.includes('all')
    );

    const matches = relevantDiseases.map(disease => {
      const totalKey = disease.keySymptoms.length;
      const matchedSymptoms = disease.keySymptoms.filter(sym => state.selectedSymptoms.has(sym));
      const missingSymptoms = disease.keySymptoms.filter(sym => !state.selectedSymptoms.has(sym));
      
      const matchCount = matchedSymptoms.length;
      let matchRatio = totalKey > 0 ? (matchCount / totalKey) : 0;
      
      // Calculate weighted score based on symptom severity
      let weightedScore = 0;
      matchedSymptoms.forEach(symId => {
        let isCrit = false;
        SYMPTOM_CATEGORIES.forEach(cat => {
          const found = cat.symptoms.find(s => s.id === symId);
          if (found && (found.severity === 'critical' || found.severity === 'high')) isCrit = true;
        });
        weightedScore += isCrit ? 1.5 : 1.0;
      });

      // Calculate confidence percentage
      let confidence = 0;
      if (selected.length > 0 && matchCount > 0) {
        confidence = Math.min(98, Math.round((matchRatio * 70) + (Math.min(matchCount, 4) * 7)));
      }

      return {
        ...disease,
        matchCount,
        totalKey,
        matchedSymptoms,
        missingSymptoms,
        confidence
      };
    });

    // Sort by confidence descending
    matches.sort((a, b) => b.confidence - a.confidence);
    const topMatches = matches.filter(m => m.confidence > 15);

    // Evaluate Emergency Triage Status
    let triageStatus = {
      level: 'GREEN',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      title: 'Routine Care / Mild Urgency',
      message: 'No immediate red-flag indicators detected. Continue monitoring vitals and schedule a regular veterinary checkup if symptoms persist beyond 48 hours.',
      hasRedFlags: false,
      redFlagList: []
    };

    const criticalSymptoms = ['collapse', 'bloody_vomit', 'bloody_diarrhea', 'bloat_distension', 'dyspnea', 'cyanosis', 'anuria', 'seizures', 'paralysis', 'stiffness'];
    const activeCritical = selected.filter(s => criticalSymptoms.includes(s));

    if (activeCritical.length > 0 || (topMatches[0] && topMatches[0].urgencyLevel === 'CRITICAL' && topMatches[0].confidence >= 50)) {
      triageStatus = {
        level: 'RED',
        badgeClass: 'bg-red-100 text-red-800 border-red-300 badge-pulse-red',
        title: 'CRITICAL EMERGENCY - IMMEDIATE VET CARE',
        message: 'Potentially life-threatening conditions or severe clinical distress detected. Do not delay. Transport patient immediately to the nearest 24/7 veterinary hospital.',
        hasRedFlags: true,
        redFlagList: activeCritical.map(c => {
          for (const cat of SYMPTOM_CATEGORIES) {
            const sym = cat.symptoms.find(s => s.id === c);
            if (sym) return sym.name;
          }
          return c;
        })
      };
    } else if (selected.length >= 3 || (topMatches[0] && topMatches[0].confidence >= 40)) {
      triageStatus = {
        level: 'AMBER',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        title: 'URGENT - VET VISIT WITHIN 24 HOURS',
        message: 'Active symptoms indicate an acute infectious, inflammatory, or parasitic disease. Schedule a veterinary examination today.',
        hasRedFlags: false,
        redFlagList: []
      };
    }

    state.activeDiagnosis = {
      topMatches,
      triageStatus,
      selectedCount: selected.length,
      evaluatedAt: new Date().toLocaleTimeString()
    };

    renderDiagnosisResults();
  }

  // Render Diagnostic Results UI
  function renderDiagnosisResults() {
    const resultsContainer = document.getElementById('diagnosticResultsOutput');
    const triageBanner = document.getElementById('triageBannerContainer');
    if (!resultsContainer || !triageBanner) return;

    const { topMatches, triageStatus, selectedCount } = state.activeDiagnosis;

    // Triage Banner
    triageBanner.innerHTML = `
      <div class="p-4 rounded-xl border ${
        triageStatus.level === 'RED'
          ? 'bg-red-50/90 border-red-300 text-red-950'
          : triageStatus.level === 'AMBER'
          ? 'bg-amber-50/90 border-amber-300 text-amber-950'
          : 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
      }">
        <div class="flex items-start justify-between flex-wrap gap-2">
          <div class="flex items-center space-x-2.5">
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${triageStatus.badgeClass}">
              ● ${triageStatus.level} TRIAGE
            </span>
            <h3 class="text-base font-bold">${triageStatus.title}</h3>
          </div>
          <button 
            onclick="switchTab('clinics')"
            class="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              triageStatus.level === 'RED'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-slate-800 text-white hover:bg-slate-900'
            }"
          >
            Find Nearest Emergency Vet →
          </button>
        </div>
        <p class="text-xs sm:text-sm mt-2 text-slate-700">${triageStatus.message}</p>
        ${
          triageStatus.hasRedFlags && triageStatus.redFlagList.length > 0
            ? `
              <div class="mt-3 pt-2.5 border-t border-red-200">
                <span class="text-xs font-bold text-red-700 uppercase tracking-wider block mb-1">Detected Critical Red Flags:</span>
                <div class="flex flex-wrap gap-1.5">
                  ${triageStatus.redFlagList.map(rf => `<span class="bg-red-200/80 text-red-900 font-medium text-xs px-2 py-0.5 rounded">⚠️ ${rf}</span>`).join('')}
                </div>
              </div>
            `
            : ''
        }
      </div>
    `;

    if (selectedCount === 0) {
      resultsContainer.innerHTML = `
        <div class="text-center py-12 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <div class="text-4xl mb-2">🩺</div>
          <h4 class="text-sm font-semibold text-slate-700">No Symptoms Selected</h4>
          <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Select one or more symptoms from the checklist to run the differential AI diagnostic algorithm.
          </p>
        </div>
      `;
      return;
    }

    if (topMatches.length === 0) {
      resultsContainer.innerHTML = `
        <div class="text-center py-10 px-4 bg-white rounded-xl border border-slate-200">
          <div class="text-3xl mb-2">🔍</div>
          <h4 class="text-sm font-semibold text-slate-700">No Direct High-Probability Matches</h4>
          <p class="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            The selected symptoms may represent early-stage, non-specific malaise or a rare condition. Please consult a licensed veterinarian for specialized diagnostic bloodwork.
          </p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = topMatches.map((disease, idx) => {
      const badgeColor = disease.urgencyLevel === 'CRITICAL' 
        ? 'bg-red-100 text-red-800 border-red-200'
        : disease.urgencyLevel === 'URGENT'
        ? 'bg-amber-100 text-amber-800 border-amber-200'
        : 'bg-blue-100 text-blue-800 border-blue-200';

      const progressColor = disease.confidence > 75 
        ? 'bg-red-500' 
        : disease.confidence > 50 
        ? 'bg-amber-500' 
        : 'bg-emerald-500';

      return `
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 transition-all hover:border-emerald-300">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <div class="flex items-center space-x-2 flex-wrap gap-1">
                <span class="text-xs font-bold text-slate-400">#${idx + 1}</span>
                <h4 class="text-base font-bold text-slate-900">${disease.name}</h4>
                <span class="text-[11px] font-semibold px-2 py-0.5 rounded border ${badgeColor}">
                  ${disease.urgencyLevel}
                </span>
                ${disease.zoonotic ? '<span class="text-[11px] font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">☣️ Zoonotic (Humans at risk)</span>' : ''}
              </div>
              <p class="text-xs text-slate-500 mt-0.5">${disease.pathogenType} • Incubation: ${disease.incubationPeriod}</p>
            </div>
            
            <div class="text-right sm:min-w-[120px]">
              <div class="flex items-center justify-end space-x-1.5">
                <span class="text-xs text-slate-500">Confidence:</span>
                <span class="text-base font-black text-slate-900">${disease.confidence}%</span>
              </div>
              <div class="w-full bg-slate-100 h-2 rounded-full mt-1 overflow-hidden">
                <div class="${progressColor} h-full rounded-full transition-all duration-500" style="width: ${disease.confidence}%"></div>
              </div>
            </div>
          </div>

          <p class="text-xs sm:text-sm text-slate-700 mb-3.5 leading-relaxed">
            ${disease.description}
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3.5 bg-slate-50/80 p-3 rounded-lg border border-slate-100 text-xs">
            <div>
              <span class="font-bold text-slate-700 block mb-1">Matched Indicators (${disease.matchCount}/${disease.totalKey}):</span>
              <div class="flex flex-wrap gap-1">
                ${disease.matchedSymptoms.map(s => `<span class="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">✓ ${formatSymptomName(s)}</span>`).join('')}
              </div>
            </div>
            <div>
              <span class="font-bold text-slate-700 block mb-1">Key Unreported Indicators to Monitor:</span>
              <div class="flex flex-wrap gap-1">
                ${disease.missingSymptoms.slice(0, 4).map(s => `<span class="bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded font-medium">○ ${formatSymptomName(s)}</span>`).join('')}
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <div class="text-xs text-slate-500">
              <span class="font-semibold text-slate-700">Recommended Lab Diagnostics:</span> ${disease.clinicalDiagnostics.slice(0, 2).join('; ')}
            </div>
            <button 
              onclick="openDiseaseModal('${disease.id}')"
              class="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
            >
              View Full Clinical Protocol & Treatment →
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function formatSymptomName(symptomId) {
    for (const cat of SYMPTOM_CATEGORIES) {
      const found = cat.symptoms.find(s => s.id === symptomId);
      if (found) return found.name.split('/')[0].trim();
    }
    return symptomId.replace(/_/g, ' ');
  }

  // Visual AI Scanner Module
  function renderScannerPresets() {
    const container = document.getElementById('scannerPresetsContainer');
    if (!container) return;

    container.innerHTML = IMAGE_SCAN_PRESETS.map(preset => {
      return `
        <button 
          type="button"
          onclick="loadScanPreset('${preset.id}')"
          class="flex flex-col text-left p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-md transition-all group"
        >
          <div class="w-full h-24 rounded-lg overflow-hidden mb-2 bg-slate-100 flex items-center justify-center">
            <img src="${preset.thumbnail}" alt="${preset.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          </div>
          <span class="text-xs font-bold text-slate-900 group-hover:text-emerald-700">${preset.title}</span>
          <span class="text-[11px] text-slate-500">${preset.species} • ${preset.area}</span>
        </button>
      `;
    }).join('');
  }

  window.loadScanPreset = function(presetId) {
    const preset = IMAGE_SCAN_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    state.scanner.activePreset = preset;
    state.scanner.customImage = null;
    startScanSimulation(preset.thumbnail, preset);
  };

  function startScanSimulation(imgSrc, presetData) {
    const displayImg = document.getElementById('scannerPreviewImage');
    const scanOverlay = document.getElementById('scannerOverlay');
    const laserLine = document.getElementById('scannerLaser');
    const resultBox = document.getElementById('scannerResultOutput');
    const emptyState = document.getElementById('scannerEmptyState');

    if (!displayImg || !scanOverlay || !laserLine || !resultBox) return;

    displayImg.src = imgSrc;
    displayImg.classList.remove('hidden');
    if (emptyState) emptyState.classList.add('hidden');
    laserLine.classList.remove('hidden');
    scanOverlay.classList.remove('hidden');
    resultBox.innerHTML = `
      <div class="text-center py-10">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-3"></div>
        <h4 class="text-sm font-bold text-slate-800">Processing Neural Vision Models...</h4>
        <p class="text-xs text-slate-500 mt-1">Extracting dermal features, erythema index & lesion margins</p>
      </div>
    `;

    setTimeout(() => {
      laserLine.classList.add('hidden');
      renderScannerResults(presetData);
    }, 1800);
  }

  function renderScannerResults(preset) {
    const resultBox = document.getElementById('scannerResultOutput');
    if (!resultBox) return;

    resultBox.innerHTML = `
      <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-600">Visual AI Classification</span>
            <h3 class="text-lg font-bold text-slate-900">${preset.detectedDisease}</h3>
          </div>
          <div class="text-right">
            <span class="text-2xl font-black text-emerald-600">${preset.confidence}%</span>
            <span class="block text-[10px] text-slate-400 font-semibold">AI Confidence Score</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 text-xs">
          <div class="space-y-2">
            <div>
              <span class="text-slate-500 block">Lesion Characteristics:</span>
              <span class="font-semibold text-slate-800">${preset.lesionType}</span>
            </div>
            <div>
              <span class="text-slate-500 block">Urgency Classification:</span>
              <span class="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">${preset.severity}</span>
            </div>
          </div>
          <div class="space-y-2">
            <div>
              <span class="text-slate-500 block">Confirmatory Lab Diagnostic:</span>
              <span class="font-semibold text-slate-800">${preset.recommendedTest}</span>
            </div>
            <div>
              <span class="text-slate-500 block">Secondary Differential Probabilities:</span>
              <div class="space-y-1 mt-1">
                ${preset.secondaryMatches.map(m => `
                  <div class="flex justify-between items-center bg-slate-50 px-2 py-1 rounded">
                    <span>${m.name}</span>
                    <span class="font-bold text-slate-700">${m.conf}%</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <div class="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3.5 mt-4">
          <h4 class="text-xs font-bold text-emerald-950 uppercase tracking-wide mb-1">Recommended Veterinary Action Plan:</h4>
          <p class="text-xs text-emerald-900 leading-relaxed">${preset.actionPlan}</p>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
          <button 
            onclick="switchTab('clinics')"
            class="text-xs font-bold bg-slate-900 text-white px-3.5 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Consult a Dermatologist Vet →
          </button>
          <button 
            onclick="generateAndDownloadReport()"
            class="text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Save Scan to Report 📄
          </button>
        </div>
      </div>
    `;
  }

  // Handle Custom File Upload in Scanner
  const fileInput = document.getElementById('scannerFileInput');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const customPreset = {
          id: 'custom_upload',
          title: 'Custom Uploaded Image',
          species: state.patient.species || 'Canine',
          area: 'Dermal / Cutaneous Region',
          detectedDisease: 'Superficial Pyoderma / Focal Erythematous Dermatitis',
          confidence: 88.4,
          secondaryMatches: [
            { name: 'Allergic Contact Dermatitis', conf: 71.0 },
            { name: 'Demodicosis', conf: 58.2 }
          ],
          lesionType: 'Localized epidermal erythema, papular eruption with secondary excoriation',
          severity: 'MODERATE - SCHEDULE VET EXAM',
          recommendedTest: 'Impression smear skin cytology, Fungal DTM culture',
          actionPlan: 'Prevent patient from licking/scratching area (cone collar recommended). Cleanse with antiseptic 2% Chlorhexidine solution and seek veterinary confirmation.',
          thumbnail: event.target.result
        };
        startScanSimulation(event.target.result, customPreset);
      };
      reader.readAsDataURL(file);
    });
  }

  // Veterinary Disease Encyclopedia
  function renderEncyclopedia() {
    const container = document.getElementById('encyclopediaGrid');
    if (!container) return;

    const { search, species, pathogen, zoonoticOnly } = state.encyclopediaFilter;

    let filtered = DISEASES_DATABASE.filter(d => {
      const matchSearch = !search || 
        d.name.toLowerCase().includes(search.toLowerCase()) || 
        d.description.toLowerCase().includes(search.toLowerCase()) ||
        d.pathogenType.toLowerCase().includes(search.toLowerCase());

      const matchSpecies = species === 'all' || d.species.includes(species) || d.species.includes('all');
      const matchPathogen = pathogen === 'all' || d.pathogenType.toLowerCase().includes(pathogen.toLowerCase());
      const matchZoonotic = !zoonoticOnly || d.zoonotic === true;

      return matchSearch && matchSpecies && matchPathogen && matchZoonotic;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200">
          <div class="text-3xl mb-2">📚</div>
          <h4 class="text-sm font-bold text-slate-700">No Diseases Found</h4>
          <p class="text-xs text-slate-500 mt-1">Try broadening your search keywords or clearing active filters.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(d => {
      const speciesIcons = d.species.map(spId => {
        const conf = SPECIES_CONFIG.find(s => s.id === spId);
        return conf ? conf.icon : '🐾';
      }).join(' ');

      return `
        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between gap-2 mb-2">
              <span class="text-lg">${speciesIcons}</span>
              <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                d.urgencyLevel === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              }">${d.urgencyLevel}</span>
            </div>
            <h4 class="text-base font-bold text-slate-900 mb-1">${d.name}</h4>
            <span class="text-xs text-emerald-700 font-medium block mb-2">${d.pathogenType}</span>
            <p class="text-xs text-slate-600 line-clamp-3 mb-3 leading-relaxed">${d.description}</p>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="text-[11px] text-slate-400">${d.contagious.split(' ')[0]} contagious</span>
            <button 
              onclick="openDiseaseModal('${d.id}')"
              class="text-xs font-semibold text-emerald-600 hover:text-emerald-800 hover:underline"
            >
              Full Profile →
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Encyclopedia Filters Bindings
  const searchInput = document.getElementById('encyclopediaSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.encyclopediaFilter.search = e.target.value;
      renderEncyclopedia();
    });
  }

  const speciesFilter = document.getElementById('encyclopediaSpeciesFilter');
  if (speciesFilter) {
    speciesFilter.addEventListener('change', (e) => {
      state.encyclopediaFilter.species = e.target.value;
      renderEncyclopedia();
    });
  }

  const pathogenFilter = document.getElementById('encyclopediaPathogenFilter');
  if (pathogenFilter) {
    pathogenFilter.addEventListener('change', (e) => {
      state.encyclopediaFilter.pathogen = e.target.value;
      renderEncyclopedia();
    });
  }

  const zoonoticToggle = document.getElementById('encyclopediaZoonoticToggle');
  if (zoonoticToggle) {
    zoonoticToggle.addEventListener('change', (e) => {
      state.encyclopediaFilter.zoonoticOnly = e.target.checked;
      renderEncyclopedia();
    });
  }

  // Disease Modal View
  window.openDiseaseModal = function(diseaseId) {
    const disease = DISEASES_DATABASE.find(d => d.id === diseaseId);
    if (!disease) return;

    const modal = document.getElementById('diseaseDetailModal');
    const modalContent = document.getElementById('diseaseModalContent');
    if (!modal || !modalContent) return;

    modalContent.innerHTML = `
      <div class="p-6">
        <div class="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                disease.urgencyLevel === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
              }">${disease.urgencyLevel}</span>
              ${disease.zoonotic ? '<span class="text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded">☣️ Zoonotic (Human Risk)</span>' : ''}
            </div>
            <h2 class="text-xl font-black text-slate-900 mt-1">${disease.name}</h2>
            <p class="text-xs text-slate-500">${disease.pathogenType} • Incubation Period: ${disease.incubationPeriod}</p>
          </div>
          <button onclick="closeDiseaseModal()" class="text-slate-400 hover:text-slate-600 text-xl font-bold p-1">✕</button>
        </div>

        <div class="space-y-4 my-5 text-xs sm:text-sm text-slate-700">
          <div>
            <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider text-emerald-800 mb-1">Overview & Pathophysiology</h4>
            <p class="leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">${disease.description}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-red-50/60 p-3.5 rounded-lg border border-red-100">
              <h4 class="font-bold text-red-900 text-xs uppercase tracking-wider mb-2">Emergency First-Aid Instructions</h4>
              <ul class="space-y-1.5 list-disc list-inside text-xs text-red-950">
                ${disease.firstAidInstructions.map(step => `<li>${step}</li>`).join('')}
              </ul>
            </div>

            <div class="bg-blue-50/60 p-3.5 rounded-lg border border-blue-100">
              <h4 class="font-bold text-blue-900 text-xs uppercase tracking-wider mb-2">Clinical Diagnostics & Lab Tests</h4>
              <ul class="space-y-1.5 list-disc list-inside text-xs text-blue-950">
                ${disease.clinicalDiagnostics.map(test => `<li>${test}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div>
            <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider text-emerald-800 mb-1">Veterinary Treatment Protocol</h4>
            <p class="leading-relaxed bg-emerald-50/50 p-3 rounded-lg border border-emerald-100 text-xs text-emerald-950">${disease.treatmentProtocol}</p>
          </div>

          <div>
            <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-800 mb-1">Vaccination & Herd Biosecurity Prevention</h4>
            <p class="leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">${disease.prevention}</p>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 flex justify-end">
          <button 
            onclick="closeDiseaseModal()" 
            class="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
          >
            Close Profile
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
  };

  window.closeDiseaseModal = function() {
    const modal = document.getElementById('diseaseDetailModal');
    if (modal) modal.classList.add('hidden');
  };

  // Normal Vitals Reference Table
  function renderVitalsTable() {
    const container = document.getElementById('vitalsTableBody');
    if (!container) return;

    container.innerHTML = NORMAL_VITALS.map(v => `
      <tr class="border-b border-slate-100 hover:bg-slate-50 text-xs sm:text-sm">
        <td class="py-3 px-4 font-bold text-slate-800">${v.species}</td>
        <td class="py-3 px-4 font-medium text-emerald-700">${v.temp}</td>
        <td class="py-3 px-4 text-slate-700">${v.heartRate}</td>
        <td class="py-3 px-4 text-slate-700">${v.respRate}</td>
        <td class="py-3 px-4 text-slate-700">${v.crt}</td>
      </tr>
    `).join('');
  }

  // Toxicity Alerts
  function renderToxicityAlerts() {
    const container = document.getElementById('toxicityAlertsGrid');
    if (!container) return;

    container.innerHTML = TOXICITY_ALERTS.map(t => `
      <div class="bg-white rounded-xl border border-red-200 p-4 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-sm font-bold text-red-950">🚫 ${t.name}</h4>
          <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">${t.toxicTo}</span>
        </div>
        <p class="text-xs text-slate-700 mb-2 leading-relaxed"><span class="font-semibold text-slate-900">Symptoms & Effects:</span> ${t.effects}</p>
        <div class="bg-red-50 p-2.5 rounded-lg border border-red-100 text-xs text-red-900 font-medium">
          <span class="font-bold uppercase text-[10px] block text-red-700">Immediate Action:</span>
          ${t.emergencyAction}
        </div>
      </div>
    `).join('');
  }

  // Clinics List Component
  function renderClinicsList() {
    const container = document.getElementById('clinicsListContainer');
    if (!container) return;

    container.innerHTML = CLINICS_DATABASE.map(c => `
      <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-emerald-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center space-x-2">
            <h4 class="text-base font-bold text-slate-900">${c.name}</h4>
            <span class="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded">★ ${c.rating}</span>
          </div>
          <p class="text-xs text-emerald-700 font-medium mt-0.5">${c.type} • <span class="text-slate-500">${c.distance}</span></p>
          <p class="text-xs text-slate-600 mt-1.5">📍 ${c.address} | ⏰ ${c.openHours}</p>
          <div class="flex flex-wrap gap-1.5 mt-2.5">
            ${c.specialties.map(s => `<span class="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded">${s}</span>`).join('')}
          </div>
        </div>

        <div class="flex md:flex-col items-center md:items-end gap-2 shrink-0">
          <a href="tel:${c.phone}" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm">
            📞 ${c.phone}
          </a>
          <button 
            onclick="openBookingModal('${c.name}')"
            class="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Book Teleconsult
          </button>
        </div>
      </div>
    `).join('');
  }

  // Booking Modal
  window.openBookingModal = function(clinicName) {
    const clinicInput = document.getElementById('bookingClinicName');
    const modal = document.getElementById('bookingModal');
    if (clinicInput) clinicInput.value = clinicName;
    if (modal) modal.classList.remove('hidden');
  };

  window.closeBookingModal = function() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.classList.add('hidden');
  };

  window.handleBookingSubmit = function(e) {
    e.preventDefault();
    alert('Thank you! Your veterinary consultation request has been submitted. A veterinary triage nurse will call you back within 15 minutes.');
    closeBookingModal();
  };

  // Generate and Download Printable Triage Report
  window.generateAndDownloadReport = function() {
    const patientName = document.getElementById('patientName')?.value || state.patient.name || 'Patient';
    const patientBreed = document.getElementById('patientBreed')?.value || state.patient.breed || 'Unknown Breed';
    const patientAge = document.getElementById('patientAge')?.value || state.patient.age || '2 years';
    const patientWeight = document.getElementById('patientWeight')?.value || state.patient.weight || '25 kg';
    const vaccineStatus = document.getElementById('patientVaccine')?.value || state.patient.vaccineStatus;
    const duration = document.getElementById('symptomDuration')?.value || state.patient.duration;

    const printableArea = document.getElementById('printableReportArea');
    if (!printableArea) return;

    const { topMatches, triageStatus } = state.activeDiagnosis || { topMatches: [], triageStatus: { level: 'GREEN', title: 'Routine Care' } };

    printableArea.innerHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; border: 1px solid #ddd;">
        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #10b981; padding-bottom: 10px; margin-bottom: 20px;">
          <div>
            <h1 style="margin: 0; color: #065f46; font-size: 24px;">VetScan AI - Veterinary Triage Summary</h1>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">Clinical Symptom Evaluation & Differential Assessment Report</p>
          </div>
          <div style="text-align: right; font-size: 12px; color: #64748b;">
            <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p style="margin: 4px 0 0 0;"><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        <div style="background-color: #f8fafc; padding: 12px; border-radius: 6px; margin-bottom: 20px; font-size: 13px;">
          <h3 style="margin: 0 0 8px 0; color: #1e293b; font-size: 14px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Patient Information</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
            <div><strong>Patient Name:</strong> ${patientName}</div>
            <div><strong>Species:</strong> ${state.selectedSpecies.toUpperCase()}</div>
            <div><strong>Breed:</strong> ${patientBreed}</div>
            <div><strong>Age:</strong> ${patientAge}</div>
            <div><strong>Weight:</strong> ${patientWeight}</div>
            <div><strong>Vaccination:</strong> ${vaccineStatus}</div>
            <div><strong>Symptom Onset:</strong> ${duration}</div>
          </div>
        </div>

        <div style="padding: 12px; border-radius: 6px; margin-bottom: 20px; background-color: ${triageStatus.level === 'RED' ? '#fef2f2' : triageStatus.level === 'AMBER' ? '#fffbeb' : '#f0fdf4'}; border: 1px solid ${triageStatus.level === 'RED' ? '#fca5a5' : triageStatus.level === 'AMBER' ? '#fde68a' : '#86efac'};">
          <strong style="color: ${triageStatus.level === 'RED' ? '#991b1b' : triageStatus.level === 'AMBER' ? '#92400e' : '#166534'};">TRIAGE LEVEL: ${triageStatus.level} (${triageStatus.title})</strong>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #334155;">${triageStatus.message}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 8px 0; color: #1e293b; font-size: 14px;">Reported Clinical Symptoms</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${Array.from(state.selectedSymptoms).map(s => `<span style="background: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${formatSymptomName(s)}</span>`).join(' ')}
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 8px 0; color: #1e293b; font-size: 14px;">Top Differential Diagnoses</h3>
          ${topMatches.slice(0, 3).map((d, i) => `
            <div style="border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px; margin-bottom: 8px; font-size: 12px;">
              <div style="display: flex; justify-content: space-between; font-weight: bold;">
                <span>#${i+1} ${d.name} (${d.urgencyLevel})</span>
                <span>Confidence: ${d.confidence}%</span>
              </div>
              <p style="margin: 4px 0; color: #475569;">${d.description}</p>
              <p style="margin: 4px 0 0 0;"><strong>Recommended Diagnostics:</strong> ${d.clinicalDiagnostics.join(', ')}</p>
            </div>
          `).join('')}
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 11px; color: #94a3b8; text-align: center;">
          <p style="margin: 0;"><strong>VETERINARY MEDICAL DISCLAIMER:</strong> VetScan AI is an automated clinical decision-support and educational tool. This summary does not constitute an official veterinary diagnosis. Always present this report to a licensed veterinarian for physical examination and laboratory testing.</p>
        </div>
      </div>
    `;

    window.print();
  };

  // Bind Input Change Events
  function bindGlobalEvents() {
    const patientName = document.getElementById('patientName');
    if (patientName) {
      patientName.addEventListener('input', (e) => {
        state.patient.name = e.target.value;
      });
    }
  }
});
