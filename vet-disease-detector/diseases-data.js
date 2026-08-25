/**
 * VetScan AI - Comprehensive Veterinary Disease Knowledge Base
 * Covers companion animals, livestock, equines, poultry, and birds.
 */

const SPECIES_CONFIG = [
  { id: 'dog', name: 'Canine (Dog)', icon: '🐶', category: 'companion', desc: 'Dogs, puppies, working dogs' },
  { id: 'cat', name: 'Feline (Cat)', icon: '🐱', category: 'companion', desc: 'Cats, kittens' },
  { id: 'cattle', name: 'Bovine (Cattle / Cow)', icon: '🐄', category: 'livestock', desc: 'Dairy, beef cows, calves' },
  { id: 'horse', name: 'Equine (Horse)', icon: '🐎', category: 'equine', desc: 'Horses, ponies, foals' },
  { id: 'sheep_goat', name: 'Caprine / Ovine (Goat & Sheep)', icon: '🐐', category: 'livestock', desc: 'Goats, sheep, lambs' },
  { id: 'poultry', name: 'Poultry (Chicken / Duck / Bird)', icon: '🐔', category: 'poultry', desc: 'Broilers, layers, ducks' },
  { id: 'pig', name: 'Swine (Pig)', icon: '🐷', category: 'livestock', desc: 'Pigs, piglets, hogs' },
  { id: 'rabbit_exotic', name: 'Small Mammal & Exotic', icon: '🐰', category: 'exotic', desc: 'Rabbits, guinea pigs, ferrets' }
];

const SYMPTOM_CATEGORIES = [
  {
    id: 'general',
    name: 'General & Systemic',
    icon: 'activity',
    symptoms: [
      { id: 'fever', name: 'High Fever / Elevated Temperature', severity: 'moderate' },
      { id: 'hypothermia', name: 'Subnormal Temperature / Shivering', severity: 'high' },
      { id: 'lethargy', name: 'Severe Lethargy / Depression / Weakness', severity: 'moderate' },
      { id: 'anorexia', name: 'Loss of Appetite / Refusal to Eat', severity: 'moderate' },
      { id: 'weight_loss', name: 'Rapid Weight Loss / Emaciation', severity: 'moderate' },
      { id: 'dehydration', name: 'Severe Dehydration / Sunken Eyes', severity: 'high' },
      { id: 'collapse', name: 'Sudden Collapse / Inability to Stand', severity: 'critical' },
      { id: 'polydipsia', name: 'Excessive Thirst / Frequent Urination', severity: 'mild' }
    ]
  },
  {
    id: 'gastrointestinal',
    name: 'Digestive & Gastrointestinal',
    icon: 'utensils',
    symptoms: [
      { id: 'vomiting', name: 'Persistent Vomiting', severity: 'high' },
      { id: 'bloody_vomit', name: 'Vomiting Blood / Coffee-Ground Vomit', severity: 'critical' },
      { id: 'diarrhea', name: 'Watery Diarrhea / Loose Stools', severity: 'moderate' },
      { id: 'bloody_diarrhea', name: 'Bloody Diarrhea (Hemorrhagic)', severity: 'critical' },
      { id: 'bloat_distension', name: 'Abdominal Swelling / Bloat / Tympany', severity: 'critical' },
      { id: 'abdominal_pain', name: 'Abdominal Pain / Hunched Posture / Grunting', severity: 'high' },
      { id: 'constipation', name: 'Straining to Defecate / Tenesmus', severity: 'mild' },
      { id: 'salivation', name: 'Excessive Drooling / Frothing at Mouth', severity: 'high' }
    ]
  },
  {
    id: 'respiratory',
    name: 'Respiratory & Chest',
    icon: 'wind',
    symptoms: [
      { id: 'cough', name: 'Persistent Harsh Cough / Honking Cough', severity: 'moderate' },
      { id: 'dyspnea', name: 'Labored / Rapid / Open-Mouth Breathing', severity: 'critical' },
      { id: 'nasal_discharge', name: 'Nasal Discharge (Mucopurulent / Bloody)', severity: 'moderate' },
      { id: 'sneezing', name: 'Frequent Sneezing / Reverse Sneezing', severity: 'mild' },
      { id: 'wheezing', name: 'Wheezing / Stridor / Rattling Lungs', severity: 'high' },
      { id: 'cyanosis', name: 'Blue / Purple / Pale Gums & Tongue', severity: 'critical' }
    ]
  },
  {
    id: 'dermatological',
    name: 'Skin, Coat & Mucosa',
    icon: 'sparkles',
    symptoms: [
      { id: 'severe_itching', name: 'Severe Itching / Scratching / Chewing Skin', severity: 'moderate' },
      { id: 'alopecia', name: 'Patchy or Circular Hair Loss (Alopecia)', severity: 'mild' },
      { id: 'skin_nodules', name: 'Nodules, Pustules or Hard Lumps on Skin', severity: 'high' },
      { id: 'crusting_scabs', name: 'Crusting, Flaking Scabs & Dandruff', severity: 'mild' },
      { id: 'erythema_hotspots', name: 'Red, Oozing, Inflamed Patches (Hot Spots)', severity: 'moderate' },
      { id: 'ticks_fleas', name: 'Visible Ticks, Fleas, Mites or Parasites', severity: 'moderate' },
      { id: 'mouth_ulcers', name: 'Blisters / Ulcers on Tongue, Gums, Teats, Hooves', severity: 'critical' },
      { id: 'foul_odor_skin', name: 'Yeasty / Foul Odor from Skin or Ears', severity: 'mild' }
    ]
  },
  {
    id: 'neurological_musculoskeletal',
    name: 'Musculoskeletal & Neurological',
    icon: 'zap',
    symptoms: [
      { id: 'lameness', name: 'Limping / Lameness / Inability to Bear Weight', severity: 'moderate' },
      { id: 'ataxia', name: 'Wobbly Gait / Incoordination / Loss of Balance', severity: 'high' },
      { id: 'seizures', name: 'Tremors / Muscle Spasms / Seizures / Convulsions', severity: 'critical' },
      { id: 'head_tilt', name: 'Head Tilt / Circling / Disorientation', severity: 'high' },
      { id: 'paralysis', name: 'Hind Limb Weakness / Sudden Paralysis', severity: 'critical' },
      { id: 'stiffness', name: 'Stiff Stilted Walk / Sawhorse Stance (Tetanic)', severity: 'critical' }
    ]
  },
  {
    id: 'ocular_ent_urinary',
    name: 'Eyes, Ears & Urinary',
    icon: 'eye',
    symptoms: [
      { id: 'eye_discharge', name: 'Cloudy Eye / Thick Yellow-Green Ocular Discharge', severity: 'moderate' },
      { id: 'squinting_photophobia', name: 'Eye Squinting / Blepharospasm / Pain', severity: 'moderate' },
      { id: 'ear_shaking', name: 'Ear Flapping / Dark Discharge in Canal', severity: 'mild' },
      { id: 'hematuria', name: 'Blood in Urine / Frequent Straining to Urinate', severity: 'critical' },
      { id: 'anuria', name: 'Total Inability to Urinate (Urethral Block)', severity: 'critical' },
      { id: 'jaundice', name: 'Yellowish Gums / Eyes / Skin (Icterus)', severity: 'high' }
    ]
  }
];

const DISEASES_DATABASE = [
  {
    id: 'canine_parvovirus',
    name: 'Canine Parvovirus (CPV-2)',
    species: ['dog'],
    pathogenType: 'Viral (Parvoviridae)',
    urgencyLevel: 'CRITICAL',
    dangerScore: 96,
    contagious: 'Extremely Contagious via feces & fomites',
    zoonotic: false,
    incubationPeriod: '3 - 7 days',
    commonAge: 'Puppies (6 weeks - 6 months) & Unvaccinated',
    keySymptoms: ['bloody_diarrhea', 'vomiting', 'lethargy', 'anorexia', 'fever', 'dehydration', 'hypothermia', 'abdominal_pain'],
    description: 'A life-threatening viral disease attacking rapidly dividing cells in intestinal crypts, bone marrow, and myocardium, leading to severe hemorrhagic gastroenteritis and septic shock.',
    clinicalDiagnostics: ['Fecal Parvo SNAP Antigen ELISA', 'Complete Blood Count (CBC showing severe Leukopenia)', 'Electrolytes & Blood Gas Panel'],
    firstAidInstructions: [
      'Isolate animal immediately from all other dogs.',
      'DO NOT force solid food or milk into vomiting dog.',
      'Transport immediately to an emergency 24/7 veterinary ICU.',
      'Keep patient warm with blankets to prevent hypothermic shock.'
    ],
    treatmentProtocol: 'Aggressive IV fluid therapy (balanced crystalloids + potassium supplementation), broad-spectrum IV antibiotics (Ampicillin/Enrofloxacin for secondary sepsis), antiemetics (Maropitant/Cerenia, Ondansetron), plasma transfusion, nutritional tube feeding.',
    prevention: 'Core vaccination protocol at 6, 8, 12, and 16 weeks of age, followed by booster at 1 year. Disinfect environment with 1:30 diluted sodium hypochlorite (bleach).'
  },
  {
    id: 'canine_distemper',
    name: 'Canine Distemper Virus (CDV)',
    species: ['dog'],
    pathogenType: 'Viral (Paramyxovirus)',
    urgencyLevel: 'CRITICAL',
    dangerScore: 92,
    contagious: 'Highly Contagious via airborne respiratory droplets',
    zoonotic: false,
    incubationPeriod: '1 - 2 weeks',
    commonAge: 'Any age, highest in unvaccinated puppies',
    keySymptoms: ['fever', 'cough', 'nasal_discharge', 'eye_discharge', 'vomiting', 'diarrhea', 'seizures', 'ataxia', 'crusting_scabs', 'skin_nodules'],
    description: 'Systemic multisystemic viral infection attacking respiratory, gastrointestinal, and central nervous systems, often progressing to permanent neurological twitching (myoclonus) and hard pad disease.',
    clinicalDiagnostics: ['RT-PCR of conjunctival/nasal swabs', 'CDV IgM/IgG antibody titers', 'CSF analysis'],
    firstAidInstructions: [
      'Quarantine strictly to stop airborne spread.',
      'Gently clean ocular and nasal crusting with warm saline wipes.',
      'Rush to veterinary hospital for intensive supportive care.'
    ],
    treatmentProtocol: 'Strict supportive care: IV fluids, broad-spectrum antibiotics for secondary pneumonia, anticonvulsants (Phenobarbital/Levetiracetam) for seizures, nebulization therapy.',
    prevention: 'DHPP / DA2PP core combination vaccine administered according to WSAVA guidelines.'
  },
  {
    id: 'rabies',
    name: 'Rabies Virus (Lyssavirus)',
    species: ['dog', 'cat', 'cattle', 'horse', 'sheep_goat', 'pig'],
    pathogenType: 'Viral (Rhabdoviridae)',
    urgencyLevel: 'CRITICAL',
    dangerScore: 100,
    contagious: 'Direct bite transmission via saliva',
    zoonotic: true,
    incubationPeriod: '2 weeks to several months',
    commonAge: 'All species and ages without vaccination',
    keySymptoms: ['salivation', 'seizures', 'ataxia', 'head_tilt', 'paralysis', 'collapse', 'fever', 'stiffness'],
    description: 'Fatal acute encephalomyelitis causing behavioral alterations (furious or dumb/paralytic rabies), hydrophobic spasms, hydrophobia, throat paralysis, and rapid death.',
    clinicalDiagnostics: ['Direct Fluorescent Antibody (dFA) test post-mortem', 'Public Health mandatory notification'],
    firstAidInstructions: [
      'DO NOT handle or touch the animal with bare hands.',
      'Confine animal safely in an escape-proof enclosure.',
      'Immediately contact local Veterinary / Animal Control authorities.',
      'If bitten, wash wound immediately with copious soap and water for 15 minutes and seek urgent human PEP rabies vaccine.'
    ],
    treatmentProtocol: 'No curative medical treatment once symptoms appear. Euthanasia and strict biosecurity quarantine as mandated by global public health laws.',
    prevention: 'Mandatory annual/triennial Rabies vaccination for all companion and farm animals.'
  },
  {
    id: 'feline_panleukopenia',
    name: 'Feline Panleukopenia (Feline Distemper / FPV)',
    species: ['cat'],
    pathogenType: 'Viral (Parvovirus)',
    urgencyLevel: 'CRITICAL',
    dangerScore: 94,
    contagious: 'Extremely Contagious via all secretions',
    zoonotic: false,
    incubationPeriod: '2 - 7 days',
    commonAge: 'Kittens & unvaccinated indoor/outdoor cats',
    keySymptoms: ['vomiting', 'diarrhea', 'bloody_diarrhea', 'lethargy', 'anorexia', 'fever', 'dehydration', 'hypothermia'],
    description: 'High-mortality feline parvovirus causing near-total depletion of white blood cells (panleukopenia) and severe sloughing of the intestinal lining.',
    clinicalDiagnostics: ['Feline Parvo FPV Antigen SNAP', 'CBC showing profound Leukopenia (< 2,000 cells/uL)'],
    firstAidInstructions: [
      'Keep warm, place on thermal heating pad (covered with towels).',
      'Seek emergency veterinary critical care without delay.'
    ],
    treatmentProtocol: 'Intensive IV fluid rehydration with potassium & glucose, broad-spectrum IV antibiotics (Ampicillin-Sulbactam), antiemetics, enteral micro-nutrition, recombinant feline interferon omega.',
    prevention: 'FVRCP core vaccine protocol for all felines.'
  },
  {
    id: 'feline_urinary_obstruction',
    name: 'Feline Lower Urinary Tract Disease (FLUTD / Blocked Cat)',
    species: ['cat'],
    pathogenType: 'Metabolic / Mechanical Obstructive',
    urgencyLevel: 'CRITICAL',
    dangerScore: 98,
    contagious: 'Non-contagious',
    zoonotic: false,
    incubationPeriod: 'Acute onset (< 24 hours)',
    commonAge: 'Adult male cats (struvite/calcium oxalate crystals or mucus plugs)',
    keySymptoms: ['anuria', 'hematuria', 'abdominal_pain', 'vomiting', 'lethargy', 'collapse', 'hypothermia'],
    description: 'Life-threatening urethral obstruction in male cats causing bladder rupture, severe hyperkalemia, cardiac arrest, and death within 24–48 hours if uncatheterized.',
    clinicalDiagnostics: ['Palpation of hard turgid bladder', 'Serum potassium (K+) check', 'Urinalysis & Ultrasound/X-Ray'],
    firstAidInstructions: [
      'DO NOT press firmly on the hard abdomen (risk of bladder rupture).',
      'RUSH to the nearest emergency clinic immediately. Every hour is critical.'
    ],
    treatmentProtocol: 'Emergency sedation, unblocking urethral catheterization, retrograde hydropulsion, IV fluids to flush toxins, calcium gluconate to stabilize cardiac rhythm against hyperkalemia, prazosin/alfuzosin for urethral spasms.',
    prevention: 'High moisture wet diet, urinary therapeutic diets (c/d, s/o), multiple fresh water fountains, stress reduction.'
  },
  {
    id: 'canine_gdv_bloat',
    name: 'Gastric Dilatation-Volvulus (GDV / Canine Bloat)',
    species: ['dog'],
    pathogenType: 'Mechanical / Surgical Emergency',
    urgencyLevel: 'CRITICAL',
    dangerScore: 99,
    contagious: 'Non-contagious',
    zoonotic: false,
    incubationPeriod: 'Minutes to hours post-meal/exercise',
    commonAge: 'Large / Deep-chested breeds (Great Danes, German Shepherds, Labs, Dobermans)',
    keySymptoms: ['bloat_distension', 'abdominal_pain', 'salivation', 'dyspnea', 'cyanosis', 'collapse', 'lethargy'],
    description: 'Stomach fills with gas and twists on its mesenteric axis, blocking venous blood return (vena cava compression), resulting in stomach necrosis, cardiac arrhythmias, and rapid death.',
    clinicalDiagnostics: ['Right lateral abdominal radiograph (Double-bubble / Popeye sign)', 'Lactate level'],
    firstAidInstructions: [
      'Do not wait or attempt home remedies. Immediate surgical emergency.',
      'Keep dog calm and transport standing or lying on side without rolling.'
    ],
    treatmentProtocol: 'Immediate trocharization/orogastric decompression, aggressive shock fluid resuscitation, emergency exploratory laparotomy with stomach derotation and gastropexy.',
    prevention: 'Prophylactic gastropexy in deep-chested breeds, avoid single large meals, avoid heavy exercise right after meals, use slow-feeder bowls.'
  },
  {
    id: 'bovine_lumpy_skin_disease',
    name: 'Lumpy Skin Disease (LSDV)',
    species: ['cattle'],
    pathogenType: 'Viral (Capripoxvirus)',
    urgencyLevel: 'URGENT',
    dangerScore: 84,
    contagious: 'Vector-borne (mosquitoes, biting flies, ticks) and direct contact',
    zoonotic: false,
    incubationPeriod: '1 - 4 weeks',
    commonAge: 'All cattle, especially dairy cows & high-yield breeds',
    keySymptoms: ['skin_nodules', 'fever', 'salivation', 'nasal_discharge', 'anorexia', 'lethargy', 'lameness'],
    description: 'Poxviral disease of cattle characterized by fever and sudden appearance of firm, circumscribed nodules (2-5 cm) on the entire body skin, mucous membranes, and internal organs, causing drastic milk loss.',
    clinicalDiagnostics: ['PCR assay on skin nodule biopsy', 'ELISA antibody test'],
    firstAidInstructions: [
      'Quarantine infected cattle from healthy herd.',
      'Apply antiseptic/insect-repellent sprays to lesions to stop secondary flystrike (myiasis).',
      'Provide soft, palatable feed and fresh cool water.'
    ],
    treatmentProtocol: 'Supportive care: NSAIDs (Meloxicam/Flunixin) for fever & pain, broad-spectrum antibiotics to prevent secondary bacterial infection, wound antiseptics, multivitamin tonics.',
    prevention: 'Homologous/heterologous live attenuated LSD/Goat Pox vaccines, vector control (mosquito/fly management), quarantine protocols.'
  },
  {
    id: 'bovine_mastitis',
    name: 'Bovine Mastitis (Clinical / Subclinical)',
    species: ['cattle', 'sheep_goat'],
    pathogenType: 'Bacterial (Staph. aureus, Strep. uberis, E. coli)',
    urgencyLevel: 'URGENT',
    dangerScore: 78,
    contagious: 'Contagious via milking machines or environmental bedding',
    zoonotic: false,
    incubationPeriod: '24 hours - 5 days',
    commonAge: 'Lactating cows & dairy goats',
    keySymptoms: ['fever', 'erythema_hotspots', 'anorexia', 'lethargy', 'abdominal_pain', 'dehydration'],
    description: 'Inflammatory infection of the mammary gland/udder tissue causing clots, flakes, or watery discolored milk, swollen hard painful quarter, and potential systemic endotoxemia.',
    clinicalDiagnostics: ['California Mastitis Test (CMT)', 'Somatic Cell Count (SCC)', 'Milk Bacterial Culture & Sensitivity'],
    firstAidInstructions: [
      'Frequent stripping of affected quarter to evacuate bacterial toxins.',
      'Apply cold compress to hot swollen udder.',
      'Do not mix affected milk with bulk tank supply.'
    ],
    treatmentProtocol: 'Intramammary antibiotic infusion targeted to pathogen, systemic NSAIDs, supportive fluids, oxytocin to facilitate milk letdown.',
    prevention: 'Post-milking teat dipping with iodine/chlorhexidine, dry cow therapy, clean dry stall bedding, regular milking machine maintenance.'
  },
  {
    id: 'bovine_fmd',
    name: 'Foot and Mouth Disease (FMD / Aphthous Fever)',
    species: ['cattle', 'sheep_goat', 'pig'],
    pathogenType: 'Viral (Aphthovirus - Picornaviridae)',
    urgencyLevel: 'CRITICAL',
    dangerScore: 95,
    contagious: 'Extremely Contagious via aerosols, contact, swill feed',
    zoonotic: false,
    incubationPeriod: '2 - 14 days',
    commonAge: 'All cloven-hoofed animals',
    keySymptoms: ['mouth_ulcers', 'salivation', 'fever', 'lameness', 'anorexia', 'lethargy', 'skin_nodules'],
    description: 'High-consequence transboundary animal disease causing painful vesicles and ulcerations in the oral cavity, dental pad, tongue, interdigital space of hooves, and teats.',
    clinicalDiagnostics: ['Epithelial suspension RT-PCR', 'Antigen detection ELISA', 'Mandatory regulatory reporting'],
    firstAidInstructions: [
      'Notify State/National Veterinary Services immediately.',
      'Enforce complete farm movement lockdown.',
      'Provide soft gruel and clean mouth with 2% sodium carbonate or mild antiseptic wash.'
    ],
    treatmentProtocol: 'Symptomatic supportive therapy: Antiseptic footbaths (copper sulfate/formalin), NSAIDs for pain, systemic antibiotics for secondary infection. Regulatory slaughter/vaccination rings per national policy.',
    prevention: 'Inactivated multi-strain FMD oil-adjuvant vaccine administered every 6 months, strict biosecurity and swill feeding bans.'
  },
  {
    id: 'equine_colic',
    name: 'Equine Acute Colic (Spasmodic / Impaction / Strangulation)',
    species: ['horse'],
    pathogenType: 'Gastrointestinal Disorder',
    urgencyLevel: 'CRITICAL',
    dangerScore: 97,
    contagious: 'Non-contagious',
    zoonotic: false,
    incubationPeriod: 'Sudden acute onset',
    commonAge: 'All horses and equines',
    keySymptoms: ['abdominal_pain', 'bloat_distension', 'constipation', 'collapse', 'lethargy', 'fever'],
    description: 'Acute severe abdominal crisis in horses caused by gas, spasmodic contractions, pelvic flexure impaction, or life-threatening volvulus/strangulated intestine.',
    clinicalDiagnostics: ['Nasogastric intubation (reflux check)', 'Transrectal palpation', 'Abdominal ultrasound', 'Abdominocentesis (peritoneal fluid analysis)'],
    firstAidInstructions: [
      'Remove all food and grain immediately.',
      'Walk horse gently to prevent violent rolling and self-trauma.',
      'Do not administer unprescribed pain medication before veterinary examination.'
    ],
    treatmentProtocol: 'Enteral hydration with electrolytes and mineral oil via nasogastric tube, Flunixin Meglumine (Banamine), Buscopan, IV fluids, or emergency surgical exploratory laparotomy for strangulating lesions.',
    prevention: 'Consistent high-fiber forage diet, constant access to clean water, gradual diet changes, regular dental floating and anthelmintic deworming.'
  },
  {
    id: 'feline_upper_respiratory_infection',
    name: 'Feline Upper Respiratory Infection (Cat Flu / FHV-1 & FCV)',
    species: ['cat'],
    pathogenType: 'Viral (Herpesvirus-1 & Calicivirus) + Chlamydia',
    urgencyLevel: 'MODERATE',
    dangerScore: 68,
    contagious: 'Highly Contagious via sneezed droplets and fomites',
    zoonotic: false,
    incubationPeriod: '2 - 10 days',
    commonAge: 'Shelter cats, kittens, multi-cat households',
    keySymptoms: ['sneezing', 'nasal_discharge', 'eye_discharge', 'squinting_photophobia', 'mouth_ulcers', 'fever', 'anorexia', 'salivation'],
    description: 'Complex viral infection causing rhinitis, conjunctivitis, severe nasal discharge, painful oral ulcers (calicivirus), and corneal dendritic ulcers (herpesvirus).',
    clinicalDiagnostics: ['PCR respiratory feline panel', 'Fluorescein eye stain to check corneal ulcers'],
    firstAidInstructions: [
      'Gently clean eyes and nose with warm wet gauze.',
      'Offer warm, strong-smelling wet food (e.g. warmed sardines or recovery diet) since blocked nose prevents scent detection.',
      'Use bathroom steam therapy for 10-15 minutes.'
    ],
    treatmentProtocol: 'Ophthalmic antivirals (Idoxuridine/Cidofovir) or antibiotics (Terramycin), systemic Doxycycline for secondary Mycoplasma/Chlamydia, L-Lysine, aerosol nebulization.',
    prevention: 'FVRCP vaccination, low-stress environment, quarantine of incoming cats.'
  },
  {
    id: 'canine_kennel_cough',
    name: 'Infectious Canine Tracheobronchitis (Kennel Cough)',
    species: ['dog'],
    pathogenType: 'Bacterial & Viral (Bordetella bronchiseptica, CPIV, CAV-2)',
    urgencyLevel: 'MODERATE',
    dangerScore: 52,
    contagious: 'Highly Contagious via airborne respiratory droplets & boarding',
    zoonotic: false,
    incubationPeriod: '3 - 10 days',
    commonAge: 'Dogs visiting dog parks, boarding kennels, or groomers',
    keySymptoms: ['cough', 'sneezing', 'nasal_discharge', 'fever', 'lethargy'],
    description: 'Highly contagious upper respiratory infection causing a distinct dry, hacking, "honking" cough that sounds like a bone stuck in the throat.',
    clinicalDiagnostics: ['Tracheal palpation cough reflex test', 'Chest X-Rays if systemic pneumonia suspected'],
    firstAidInstructions: [
      'Switch from neck collar to a chest harness to avoid pressure on inflamed trachea.',
      'Keep in a humidified environment or steamy bathroom.',
      'Keep away from other dogs for at least 14 days.'
    ],
    treatmentProtocol: 'Antitussives/cough suppressants (Hydrocodone/Butorphanol), bronchodilators, Doxycycline or Clavamox for bacterial component.',
    prevention: 'Intranasal/oral or injectable Bordetella bronchiseptica vaccine before boarding.'
  },
  {
    id: 'ringworm_dermatophytosis',
    name: 'Dermatophytosis (Ringworm)',
    species: ['dog', 'cat', 'cattle', 'horse', 'rabbit_exotic'],
    pathogenType: 'Fungal (Microsporum canis, Trichophyton verrucosum)',
    urgencyLevel: 'MILD_MODERATE',
    dangerScore: 42,
    contagious: 'Extremely Contagious & Resilient spores on hair & brushes',
    zoonotic: true,
    incubationPeriod: '7 - 21 days',
    commonAge: 'Young animals, long-haired Persian cats, calves',
    keySymptoms: ['alopecia', 'crusting_scabs', 'severe_itching', 'erythema_hotspots'],
    description: 'Fungal skin infection characterized by circular patches of hair loss, scaling, crusting, and broken stubbly hairs. Highly transmissible to humans.',
    clinicalDiagnostics: ["Wood's Lamp UV fluorescence examination", 'Direct trichogram (microscopic hair exam)', 'Fungal Culture (DTM) or PCR'],
    firstAidInstructions: [
      'Wear gloves when handling affected animal.',
      'Isolate animal in an easily sanitized room.',
      'Wash bedding in hot water with bleach.'
    ],
    treatmentProtocol: 'Topical antifungal dips (Lime sulfur 1:16, Miconazole/Chlorhexidine shampoos), combined with systemic Itraconazole or Terbinafine for refractory cases.',
    prevention: 'Disinfection of grooming tools, environmental decontamination with accelerated hydrogen peroxide, isolation of newly adopted kittens.'
  },
  {
    id: 'sarcoptic_mange_scabies',
    name: 'Sarcoptic Mange (Canine Scabies / Mites)',
    species: ['dog', 'pig', 'sheep_goat'],
    pathogenType: 'Parasitic Mite (Sarcoptes scabiei var. canis)',
    urgencyLevel: 'MODERATE',
    dangerScore: 58,
    contagious: 'Direct contact and fomites',
    zoonotic: true,
    incubationPeriod: '10 days - 8 weeks',
    commonAge: 'All ages, strays, shelter dogs',
    keySymptoms: ['severe_itching', 'alopecia', 'crusting_scabs', 'erythema_hotspots', 'foul_odor_skin'],
    description: 'Microscopic burrowing mites in the epidermis causing unbearable pruritus, pinnal-pedal reflex, severe hair loss, thick yellowish crusts on ear tips, elbows, and hocks.',
    clinicalDiagnostics: ['Pinnal-pedal scratch reflex test', 'Multiple superficial skin scrapings in mineral oil', 'Response to trial isoxazoline therapy'],
    firstAidInstructions: [
      'Prevent dog from excessively self-mutilating by using an Elizabethan cone collar.',
      'Bathe in soothing medicated shampoo to relieve crusting.'
    ],
    treatmentProtocol: 'Isoxazoline parasiticides (Sarolaner/Fluralaner/Afoxolaner orally), or Selamectin/Moxidectin spot-on, environmental treatment, short course of Prednisone or Apoquel for severe itch.',
    prevention: 'Monthly veterinary isoxazoline flea & tick preventative.'
  },
  {
    id: 'canine_tick_borne_fever',
    name: 'Canine Tick-Borne Illness (Ehrlichiosis / Babesiosis / Lyme)',
    species: ['dog', 'horse', 'cattle'],
    pathogenType: 'Vector Parasitic / Rickettsial (Ehrlichia, Babesia, Borrelia)',
    urgencyLevel: 'URGENT',
    dangerScore: 86,
    contagious: 'Transmitted via Brown Dog Tick (Rhipicephalus sanguineus) & Ixodes',
    zoonotic: true,
    incubationPeriod: '1 - 3 weeks',
    commonAge: 'Dogs in tick-endemic regions',
    keySymptoms: ['fever', 'lethargy', 'anorexia', 'weight_loss', 'lameness', 'hematuria', 'jaundice', 'ticks_fleas', 'squinting_photophobia'],
    description: 'Systemic tick-transmitted infection causing thrombocytopenia (low platelets), severe anemia, hemolytic jaundice, joint swelling, and bleeding tendencies.',
    clinicalDiagnostics: ['Vector-borne 4Dx Plus SNAP test (Ehrlichia/Lyme/Anaplasma/Heartworm)', 'Blood smear for intra-erythrocytic Babesia piroplasms', 'CBC (Thrombocytopenia check)'],
    firstAidInstructions: [
      'Carefully remove visible ticks using tick tweezers without crushing tick body.',
      'Check gums: if very pale or yellow, rush to vet immediately.'
    ],
    treatmentProtocol: 'Doxycycline (10 mg/kg/day for 28 days for Ehrlichiosis/Lyme) or Imidocarb Dipropionate injections for Babesiosis, blood transfusions if hematocrit < 15%.',
    prevention: 'Strict year-round tick prevention (Bravecto, Simparica, NexGard, Seresto collar).'
  },
  {
    id: 'feline_infectious_peritonitis',
    name: 'Feline Infectious Peritonitis (FIP)',
    species: ['cat'],
    pathogenType: 'Viral (Mutated Feline Enteric Coronavirus - FCoV)',
    urgencyLevel: 'HIGH',
    dangerScore: 89,
    contagious: 'FCoV is contagious; mutated FIP form rarely transmits directly',
    zoonotic: false,
    incubationPeriod: 'Weeks to months',
    commonAge: 'Cats under 2 years old, purebreds, shelter cats',
    keySymptoms: ['fever', 'bloat_distension', 'weight_loss', 'lethargy', 'anorexia', 'dyspnea', 'jaundice', 'squinting_photophobia', 'ataxia'],
    description: 'Immune-mediated vasculitis occurring in wet (effusive with straw-colored abdominal/pleural fluid) or dry (granulomatous in organs/eyes/CNS) forms.',
    clinicalDiagnostics: ['Rivalta test on peritoneal/pleural fluid', 'Albumin-to-Globulin (A:G) ratio (<0.6)', 'RT-PCR on effusions / biopsy'],
    firstAidInstructions: [
      'Ensure comfortable, warm, stress-free environment.',
      'Seek specialist feline veterinary consultation regarding novel antivirals.'
    ],
    treatmentProtocol: 'Antiviral therapy with GS-441524 or Remdesivir / Molnupiravir protocols, abdominocentesis/thoracocentesis if respiratory distress, supportive steroids and vitamins.',
    prevention: 'Litter box hygiene, avoiding overcrowding, reducing kitten stress.'
  },
  {
    id: 'avian_influenza_bird_flu',
    name: 'Highly Pathogenic Avian Influenza (HPAI / Bird Flu H5N1)',
    species: ['poultry', 'rabbit_exotic'],
    pathogenType: 'Viral (Orthomyxoviridae - Influenza A)',
    urgencyLevel: 'CRITICAL',
    dangerScore: 99,
    contagious: 'Extremely Contagious via wild waterfowl, feces, air',
    zoonotic: true,
    incubationPeriod: '24 hours - 5 days',
    commonAge: 'Chickens, turkeys, waterfowl, backyard flocks',
    keySymptoms: ['cyanosis', 'nasal_discharge', 'cough', 'diarrhea', 'collapse', 'ataxia', 'head_tilt', 'fever'],
    description: 'Catastrophic systemic infection causing severe cyanosis of comb and wattles, facial edema, nervous tremors, and sudden near-100% mortality in poultry flocks.',
    clinicalDiagnostics: ['Oropharyngeal/cloacal swab RT-PCR', 'National Agriculture / Veterinary agency alert'],
    firstAidInstructions: [
      'DO NOT touch dead birds without PPE (gloves, N95 mask, eye protection).',
      'Notify State Veterinary Authority or Poultry Extension officer immediately.'
    ],
    treatmentProtocol: 'No treatment allowed in poultry; strict biosecurity culling, quarantine zones, and mandatory safe carcass disposal.',
    prevention: 'Strict commercial biosecurity, indoor housing to prevent contact with wild migratory birds, clean water sources.'
  },
  {
    id: 'canine_acute_pancreatitis',
    name: 'Canine Acute Pancreatitis',
    species: ['dog', 'cat'],
    pathogenType: 'Inflammatory / Metabolic (Dietary indiscretion)',
    urgencyLevel: 'CRITICAL',
    dangerScore: 88,
    contagious: 'Non-contagious',
    zoonotic: false,
    incubationPeriod: 'Hours after fatty meal ingestion',
    commonAge: 'Middle-aged to older dogs (Miniature Schnauzers, Cocker Spaniels, Labs)',
    keySymptoms: ['abdominal_pain', 'vomiting', 'diarrhea', 'lethargy', 'anorexia', 'fever', 'dehydration', 'hypothermia'],
    description: 'Premature activation of pancreatic digestive enzymes within the pancreas itself, autodigesting pancreatic tissue and triggering intense pain and systemic inflammatory response syndrome (SIRS).',
    clinicalDiagnostics: ['Spec cPL (Canine Pancreatic Lipase) ELISA', 'Abdominal Ultrasound (hypoechoic pancreas with hyperechoic peripancreatic fat)', 'Serum Lipase/Amylase'],
    firstAidInstructions: [
      'Fast animal from food immediately until assessed by a veterinarian.',
      'Do not give any home fatty table scraps or broth.',
      'Seek prompt veterinary hospitalization.'
    ],
    treatmentProtocol: 'Aggressive IV fluid therapy, potent analgesia (Methadone/Fentanyl/Buprenorphine), antiemetics (Cerenia + Ondansetron), early ultra-low-fat enteral nutrition once vomiting controlled.',
    prevention: 'Strict low-fat diet, avoid giving fatty table scraps (bacon, turkey skin, fried foods), weight management.'
  }
];

const NORMAL_VITALS = [
  { species: 'Dog (Canine)', temp: '38.3 - 39.2 °C (101.0 - 102.5 °F)', heartRate: '60 - 140 bpm', respRate: '10 - 30 bpm', crt: '< 2 seconds' },
  { species: 'Cat (Feline)', temp: '38.1 - 39.2 °C (100.5 - 102.5 °F)', heartRate: '140 - 220 bpm', respRate: '20 - 30 bpm', crt: '< 2 seconds' },
  { species: 'Cattle (Bovine)', temp: '38.5 - 39.5 °C (101.5 - 103.5 °F)', heartRate: '48 - 84 bpm', respRate: '26 - 50 bpm', crt: '< 2 seconds' },
  { species: 'Horse (Equine)', temp: '37.2 - 38.3 °C (99.0 - 101.0 °F)', heartRate: '28 - 44 bpm', respRate: '8 - 16 bpm', crt: '< 2 seconds' },
  { species: 'Goat / Sheep', temp: '38.5 - 40.0 °C (101.5 - 104.0 °F)', heartRate: '70 - 90 bpm', respRate: '12 - 20 bpm', crt: '< 2 seconds' },
  { species: 'Poultry / Chicken', temp: '40.6 - 41.7 °C (105.0 - 107.0 °F)', heartRate: '250 - 350 bpm', respRate: '15 - 30 bpm', crt: '< 2 seconds' },
  { species: 'Swine (Pig)', temp: '38.7 - 39.8 °C (101.6 - 103.6 °F)', heartRate: '70 - 120 bpm', respRate: '13 - 18 bpm', crt: '< 2 seconds' }
];

const TOXICITY_ALERTS = [
  {
    name: 'Acetaminophen / Paracetamol',
    toxicTo: 'Extremely Lethal to Cats, Toxic to Dogs',
    effects: 'Methemoglobinemia (chocolate brown blood), liver necrosis, facial edema, cyanosis, asphyxiation.',
    emergencyAction: 'Urgent vet hospital! Requires N-Acetylcysteine (NAC), IV fluids, oxygen support.'
  },
  {
    name: 'Xylitol (Artificial Sweetener)',
    toxicTo: 'Dogs',
    effects: 'Massive surge of insulin causing severe hypoglycemia (collapse, seizures) and acute hepatic failure within hours.',
    emergencyAction: 'IV Dextrose infusion, continuous liver monitoring, urgent emergency admission.'
  },
  {
    name: 'Lilies (Lilium & Hemerocallis spp.)',
    toxicTo: 'Extremely Lethal to Cats',
    effects: 'Even pollen licking or water from vase causes acute irreversible renal failure within 36-72 hours.',
    emergencyAction: 'Aggressive IV fluid diuresis within 18 hours is critical before acute kidney injury is irreversible.'
  },
  {
    name: 'Theobromine / Chocolate',
    toxicTo: 'Dogs & Cats',
    effects: 'Tachycardia, cardiac arrhythmias, muscle rigidity, seizures, internal bleeding.',
    emergencyAction: 'Veterinary induction of emesis if ingested within 2 hours, activated charcoal, antiarrhythmics.'
  },
  {
    name: 'Antifreeze (Ethylene Glycol)',
    toxicTo: 'All Animals',
    effects: 'Sweet taste leads to rapid ingestion; metabolizes to oxalic acid, causing calcium oxalate kidney crystallization and renal death.',
    emergencyAction: 'Antidote 4-Methylpyrazole (Fomepizole) or medical ethanol IV within 3-8 hours of ingestion.'
  }
];

const IMAGE_SCAN_PRESETS = [
  {
    id: 'preset_hotspot',
    title: 'Canine Moist Dermatitis (Hot Spot)',
    species: 'Canine (Dog)',
    area: 'Neck & Flank area',
    detectedDisease: 'Acute Moist Dermatitis / Pyotraumatic Dermatitis',
    confidence: 94.2,
    secondaryMatches: [
      { name: 'Flea Allergy Dermatitis (FAD)', conf: 76.5 },
      { name: 'Superficial Bacterial Folliculitis', conf: 62.0 }
    ],
    lesionType: 'Erythematous, exudative, alopecia with sharp borders',
    severity: 'MODERATE',
    recommendedTest: 'Skin cytology (Gram stain for Staph cocci), Flea comb examination',
    actionPlan: 'Clip fur around lesion, cleanse with Chlorhexidine 2%, apply topical astringent/antibiotic-steroid cream, fit Elizabethan cone collar.',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23c4a482"/><circle cx="150" cy="100" r="45" fill="%23d32f2f" opacity="0.85"/><circle cx="150" cy="100" r="30" fill="%23b71c1c"/><ellipse cx="145" cy="95" rx="15" ry="10" fill="%23ffebee" opacity="0.6"/><text x="150" y="180" font-family="sans-serif" font-size="12" fill="white" font-weight="bold" text-anchor="middle">Canine Hot Spot Area</text></svg>'
  },
  {
    id: 'preset_ringworm',
    title: 'Feline Dermatophytosis (Ringworm)',
    species: 'Feline (Cat)',
    area: 'Face, Ears & Paws',
    detectedDisease: 'Microsporum Canis (Ringworm)',
    confidence: 91.8,
    secondaryMatches: [
      { name: 'Demodex Cati Mange', conf: 68.3 },
      { name: 'Eosinophilic Plaque', conf: 54.1 }
    ],
    lesionType: 'Annular alopecia with peripheral scaling and erythematous edge',
    severity: 'MILD_MODERATE (ZOONOTIC)',
    recommendedTest: "Wood's Lamp UV fluorescence, Dermatophyte Test Medium (DTM) fungal culture",
    actionPlan: 'Isolate cat in sanitized area. Initiate topical miconazole/lime sulfur baths and veterinary oral itraconazole if indicated. Wear gloves.',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%239e9e9e"/><circle cx="150" cy="95" r="40" fill="%23f5f5f5" stroke="%23ff7043" stroke-width="6"/><circle cx="150" cy="95" r="28" fill="%23ffe0b2" opacity="0.8"/><text x="150" y="175" font-family="sans-serif" font-size="12" fill="white" font-weight="bold" text-anchor="middle">Annular Circular Lesion</text></svg>'
  },
  {
    id: 'preset_lsd',
    title: 'Bovine Lumpy Skin Disease Nodules',
    species: 'Bovine (Cattle)',
    area: 'Neck, Flank & Perineum',
    detectedDisease: 'Bovine Lumpy Skin Disease (Capripoxvirus)',
    confidence: 96.5,
    secondaryMatches: [
      { name: 'Pseudo-Lumpy Skin Disease (Bovine Herpesvirus-2)', conf: 64.2 },
      { name: 'Demodicosis Nodules', conf: 41.0 }
    ],
    lesionType: 'Multiple firm, circumscribed cutis nodules (2-5cm) with central indentation',
    severity: 'URGENT (HERD CONTAGIOUS)',
    recommendedTest: 'Skin nodule PCR biopsy, Serum neutralization test',
    actionPlan: 'Quarantine animal from herd immediately. Administer systemic antipyretics and broad-spectrum antibiotics to prevent secondary bacterial infection. Report to local veterinary authorities.',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%238d6e63"/><circle cx="110" cy="80" r="18" fill="%234e342e" stroke="%23ffab91" stroke-width="3"/><circle cx="170" cy="70" r="22" fill="%234e342e" stroke="%23ffab91" stroke-width="3"/><circle cx="140" cy="120" r="16" fill="%234e342e" stroke="%23ffab91" stroke-width="3"/><circle cx="210" cy="115" r="19" fill="%234e342e" stroke="%23ffab91" stroke-width="3"/><text x="150" y="180" font-family="sans-serif" font-size="12" fill="white" font-weight="bold" text-anchor="middle">Circumscribed Bovine Nodules</text></svg>'
  },
  {
    id: 'preset_ticks',
    title: 'Severe Canine Tick Infestation',
    species: 'Canine (Dog)',
    area: 'Ears, Toes & Neck',
    detectedDisease: 'Rhipicephalus Sanguineus (Brown Dog Tick Cluster)',
    confidence: 95.0,
    secondaryMatches: [
      { name: 'Tick-Borne Ehrlichiosis Co-infection Risk', conf: 88.0 },
      { name: 'Babesiosis Anemia Risk', conf: 74.0 }
    ],
    lesionType: 'Engorged ectoparasites embedded in dermal tissue with local inflammation',
    severity: 'URGENT (VECTOR TRANSMISSION)',
    recommendedTest: 'Canine 4Dx SNAP blood test (Ehrlichia/Anaplasma/Lyme), CBC platelet count',
    actionPlan: 'Immediate manual tick removal with tick hook tool. Administer fast-acting isoxazoline (Simparica/Bravecto/NexGard). Screen for thrombocytopenia.',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23d7ccc8"/><ellipse cx="130" cy="90" rx="14" ry="20" fill="%233e2723"/><line x1="120" y1="80" x2="105" y2="75" stroke="%233e2723" stroke-width="3"/><line x1="120" y1="95" x2="105" y2="100" stroke="%233e2723" stroke-width="3"/><ellipse cx="175" cy="100" rx="16" ry="22" fill="%233e2723"/><line x1="185" y1="90" x2="200" y2="85" stroke="%233e2723" stroke-width="3"/><text x="150" y="175" font-family="sans-serif" font-size="12" fill="%233e2723" font-weight="bold" text-anchor="middle">Engorged Parasite Cluster</text></svg>'
  }
];

const CLINICS_DATABASE = [
  {
    name: 'Metropolitan 24/7 Veterinary Emergency Hospital',
    type: 'Emergency & Specialty Trauma Center',
    phone: '+1 (800) 555-VET-911',
    address: '742 Evergreen Healthcare Blvd',
    openHours: 'Open 24 Hours / 7 Days a Week',
    specialties: ['Canine & Feline ICU', 'Emergency Surgery', 'Blood Bank', 'Oxygen Therapy'],
    distance: '2.4 miles away',
    rating: 4.9
  },
  {
    name: 'AgriCare Large Animal & Livestock Mobile Clinic',
    type: 'Livestock & Farm Veterinary Service',
    phone: '+1 (800) 555-FARM-VET',
    address: 'State Highway 12, Rural District',
    openHours: 'Daily: 06:00 AM - 10:00 PM (Emergency On-Call 24/7)',
    specialties: ['Bovine Herd Health', 'Equine Colic & Lameness', 'Vaccination Drives', 'Ultrasound'],
    distance: '6.1 miles away',
    rating: 4.8
  },
  {
    name: 'Companion Pet Wellness & Dermatology Center',
    type: 'General Practice & Dermatology Clinic',
    phone: '+1 (800) 555-PET-DOCS',
    address: '104 Oak Ridge Veterinary Plaza',
    openHours: 'Mon-Sat: 08:00 AM - 08:00 PM',
    specialties: ['Skin Allergies', 'Dental Care', 'Wellness Exams', 'Telehealth Video Visits'],
    distance: '1.8 miles away',
    rating: 4.7
  }
];
