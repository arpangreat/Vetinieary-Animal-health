import React, { useState } from 'react';

export default function DiseaseInfo({ diseasesDatabase, speciesList, onOpenDiseaseModal }) {
  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [pathogenFilter, setPathogenFilter] = useState('all');
  const [zoonoticOnly, setZoonoticOnly] = useState(false);

  const filtered = diseasesDatabase.filter(d => {
    const matchSearch = !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase()) ||
      d.pathogenType.toLowerCase().includes(search.toLowerCase());

    const matchSpecies = speciesFilter === 'all' || d.species.includes(speciesFilter) || d.species.includes('all');
    const matchPathogen = pathogenFilter === 'all' || d.pathogenType.toLowerCase().includes(pathogenFilter.toLowerCase());
    const matchZoonotic = !zoonoticOnly || d.zoonotic === true;

    return matchSearch && matchSpecies && matchPathogen && matchZoonotic;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase">
            Veterinary Medical Knowledge Base
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Disease Encyclopedia</h1>
          <p className="text-xs text-slate-500">Comprehensive clinical references for companion animals, livestock, and equines</p>
        </div>

        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Search diseases, pathogens..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Species:</span>
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none font-medium"
          >
            <option value="all">All Species</option>
            <option value="dog">Canine (Dog)</option>
            <option value="cat">Feline (Cat)</option>
            <option value="cattle">Bovine (Cattle)</option>
            <option value="horse">Equine (Horse)</option>
            <option value="sheep_goat">Sheep & Goat</option>
            <option value="poultry">Poultry</option>
            <option value="pig">Swine (Pig)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Pathogen Type:</span>
          <select
            value={pathogenFilter}
            onChange={(e) => setPathogenFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none font-medium"
          >
            <option value="all">All Pathogens</option>
            <option value="viral">Viral</option>
            <option value="bacterial">Bacterial</option>
            <option value="fungal">Fungal</option>
            <option value="parasitic">Parasitic / Vector</option>
            <option value="metabolic">Metabolic / Obstructive</option>
          </select>
        </div>

        <label className="flex items-center space-x-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={zoonoticOnly}
            onChange={(e) => setZoonoticOnly(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded border-slate-300"
          />
          <span className="font-bold text-purple-900">☣️ Show Zoonotic (Human Contagion) Only</span>
        </label>
      </div>

      {/* Grid of Disease Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          <div className="text-4xl mb-2">📚</div>
          No disease profiles match the selected keywords or filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(d => (
            <div
              key={d.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full border bg-slate-50 text-slate-700">
                    {d.urgencyLevel}
                  </span>
                  {d.zoonotic && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                      ☣️ Zoonotic
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{d.name}</h3>
                <span className="text-xs text-emerald-700 font-semibold block mb-2">{d.pathogenType}</span>
                <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">{d.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-400 text-[11px]">Incubation: {d.incubationPeriod}</span>
                <button
                  type="button"
                  onClick={() => onOpenDiseaseModal && onOpenDiseaseModal(d)}
                  className="font-bold text-emerald-600 hover:text-emerald-800 hover:underline"
                >
                  Full Clinical Profile →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
