'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, X, Check, Search } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  onSelectLocation: (location: string) => void;
}

const POPULAR_COUNTIES = [
  { county: 'Dublin', eircode: 'D02', area: 'Dublin City & South' },
  { county: 'Dublin', eircode: 'D04', area: 'Ballsbridge / Silicon Docks' },
  { county: 'Dublin', eircode: 'D15', area: 'Blanchardstown & North' },
  { county: 'Cork', eircode: 'T12', area: 'Cork City Centre' },
  { county: 'Cork', eircode: 'T23', area: 'New Mallow Rd / Northpoint' },
  { county: 'Galway', eircode: 'H91', area: 'Galway City & Salthill' },
  { county: 'Limerick', eircode: 'V94', area: 'Limerick City' },
  { county: 'Waterford', eircode: 'X91', area: 'Waterford City' },
  { county: 'Kildare', eircode: 'W91', area: 'Naas / Newbridge' },
  { county: 'Kerry', eircode: 'V92', area: 'Tralee / Killarney' },
  { county: 'Donegal', eircode: 'F92', area: 'Letterkenny' },
  { county: 'Belfast', eircode: 'BT1', area: 'Belfast & Co. Antrim' },
];

export default function LocationModal({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}: LocationModalProps) {
  const [customInput, setCustomInput] = useState('');
  const [filter, setFilter] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onSelectLocation(customInput.trim());
      onClose();
    }
  };

  const filteredCounties = POPULAR_COUNTIES.filter(
    (item) =>
      item.county.toLowerCase().includes(filter.toLowerCase()) ||
      item.area.toLowerCase().includes(filter.toLowerCase()) ||
      item.eircode.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-asian-terracotta-50 text-asian-terracotta-600 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-stone-900">Choose Delivery Location</h3>
            <p className="text-xs text-stone-500">Ireland nationwide courier delivery to all 32 counties</p>
          </div>
        </div>

        {/* Custom Eircode or Area Input */}
        <form onSubmit={handleCustomSubmit} className="mb-4">
          <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
            Enter County or Eircode
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Dublin 4, Cork, D04 V3P2"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 text-xs p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-asian-terracotta-500 font-medium"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-asian-terracotta-500 hover:bg-asian-terracotta-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Set
            </button>
          </div>
        </form>

        <div className="border-t border-stone-100 pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Popular Delivery Hubs
            </span>
            <input
              type="text"
              placeholder="Filter hubs..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-[11px] px-2 py-0.5 rounded-md border border-stone-200 bg-stone-50 w-28 focus:outline-none"
            />
          </div>

          <div className="max-h-56 overflow-y-auto divide-y divide-stone-100 pr-1 space-y-1">
            {filteredCounties.map((item, idx) => {
              const label = `${item.county} (${item.eircode}) - ${item.area}`;
              const isSelected = currentLocation.toLowerCase().includes(item.county.toLowerCase()) &&
                currentLocation.includes(item.eircode);

              return (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectLocation(`${item.county} (${item.eircode})`);
                    onClose();
                  }}
                  className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between text-xs transition ${
                    isSelected
                      ? 'bg-asian-terracotta-50 text-asian-terracotta-700 font-bold border border-asian-terracotta-200'
                      : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <div>
                      <span className="font-bold text-stone-900">{item.county}</span>{' '}
                      <span className="text-stone-400 font-mono text-[10px]">({item.eircode})</span>
                      <p className="text-[10px] text-stone-400 font-normal">{item.area}</p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-asian-terracotta-600" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
          <span>📦 Free Delivery over €50 across Ireland</span>
          <span className="font-semibold text-asian-jade-600">All 32 Counties</span>
        </div>
      </div>
    </div>
  );
}
