import React, { useMemo, useState } from 'react';
import { HomeIcon, MapPinIcon, RadioIcon, AlertTriangleIcon, PhoneIcon, CalendarIcon, ChevronDownIcon, ChevronUpIcon, EditIcon, PlusIcon, MapIcon, ShieldIcon, ActivityIcon, SearchIcon, FilterIcon, SortAscIcon, UsersIcon, ZapIcon } from 'lucide-react';
import { EditHouseholdModal } from '../components/EditHouseholdModal';
import { AddDeviceToHouseholdModal } from '../components/AddDeviceToHouseholdModal';
import { HouseholdMapModal } from '../components/HouseholdMapModal';
import { useHouseholds } from '../hooks/useHouseholds';
import { Household } from '../types';
export function HouseholdMonitoring() {
  const { households, stats } = useHouseholds();
  const [expandedHousehold, setExpandedHousehold] = useState<string | null>(null);
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  // Modal States
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addDeviceModalOpen, setAddDeviceModalOpen] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null);
  const toggleExpand = (id: string) => {
    setExpandedHousehold(expandedHousehold === id ? null : id);
  };
  // Handlers
  const handleEditClick = (e: React.MouseEvent, household: Household) => {
    e.stopPropagation();
    setSelectedHousehold(household);
    setEditModalOpen(true);
  };
  const handleAddDeviceClick = (e: React.MouseEvent, household: Household) => {
    e.stopPropagation();
    setSelectedHousehold(household);
    setAddDeviceModalOpen(true);
  };
  const handleMapClick = (e: React.MouseEvent, household: Household) => {
    e.stopPropagation();
    setSelectedHousehold(household);
    setMapModalOpen(true);
  };
  const handleSaveHousehold = (updatedData: Partial<Household>) => {
    console.log('Saving household data:', updatedData);
  };
  const handleSaveDevice = (deviceData: any) => {
    console.log('Adding device:', deviceData);
  };
  // Derived Data
  const highRiskCount = stats.high;
  const lowRiskCount = stats.low;
  const totalHouseholds = stats.total;
  const activeDevices = stats.activeDevices;
  // Filter Logic
  const filteredHouseholds = useMemo(() => {
    return households.filter(h => {
      const matchesSearch = h.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) || h.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || h.riskLevel === statusFilter;
      const matchesLocation = locationFilter === 'all' || h.address.includes(locationFilter);
      return matchesSearch && matchesStatus && matchesLocation;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.ownerName.localeCompare(b.ownerName);
        case 'name-desc':
          return b.ownerName.localeCompare(a.ownerName);
        case 'risk-high':
          const riskOrder = {
            high: 3,
            medium: 2,
            low: 1
          };
          return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
        case 'risk-low':
          const riskOrder2 = {
            high: 3,
            medium: 2,
            low: 1
          };
          return riskOrder2[a.riskLevel] - riskOrder2[b.riskLevel];
        default:
          return 0;
      }
    });
  }, [households, searchQuery, statusFilter, locationFilter, sortBy]);
  // Helpers
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'high':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };
  const getSafetyScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-orange-500';
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden pb-20">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-br from-orange-600 to-red-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-50 animate-pulse"></div>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold">
              <span className="text-white">Household</span>
              <span className="text-gradient-cyan ml-2 sm:ml-3">
                Monitoring
              </span>
            </h1>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-slate-400 ml-5 sm:ml-7">
            Monitor registered households and safety status
          </p>
        </div>

        {/* 1. TOP SUMMARY CARDS (2x2 Mobile, 4-col Desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 animate-slide-up delay-100">
          {/* Total Households */}
          <div className="glass rounded-xl p-4 sm:p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all card-lift">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <UsersIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-white self-end sm:self-auto">
                {totalHouseholds}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Total Households
            </p>
          </div>

          {/* High Risk */}
          <div className="glass rounded-xl p-4 sm:p-6 border border-red-700/50 hover:border-red-500/50 transition-all card-lift">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <AlertTriangleIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-white self-end sm:self-auto">
                {highRiskCount}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              High Risk
            </p>
          </div>

          {/* Active Devices */}
          <div className="glass rounded-xl p-4 sm:p-6 border border-yellow-700/50 hover:border-yellow-500/50 transition-all card-lift">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <ZapIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-white self-end sm:self-auto">
                {activeDevices}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Devices Active
            </p>
          </div>

          {/* Low Risk */}
          <div className="glass rounded-xl p-4 sm:p-6 border border-green-700/50 hover:border-green-500/50 transition-all card-lift">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <HomeIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-white self-end sm:self-auto">
                {lowRiskCount}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Low Risk
            </p>
          </div>
        </div>

        {/* 2. STICKY FILTER BAR */}
        <div className="sticky top-0 z-20 -mx-4 sm:mx-0 px-4 sm:px-0 py-2 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sm:border-none sm:bg-transparent sm:backdrop-blur-none">
          <div className="glass rounded-xl p-3 sm:p-4 border border-slate-700 flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search households..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>

            {/* Filters Group */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-0">
              {/* Status Filter */}
              <div className="relative min-w-[140px]">
                <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full pl-8 pr-8 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer">
                  <option value="all">All Status</option>
                  <option value="high">High Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="low">Low Risk</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
              </div>

              {/* Location Filter */}
              <div className="relative min-w-[140px]">
                <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className="w-full pl-8 pr-8 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer">
                  <option value="all">All Locations</option>
                  <option value="Rizal St">Rizal St</option>
                  <option value="Bonifacio Ave">Bonifacio Ave</option>
                  <option value="Quezon Blvd">Quezon Blvd</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
              </div>

              {/* Sort */}
              <div className="relative min-w-[140px]">
                <SortAscIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full pl-8 pr-8 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer">
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="risk-high">Risk (High-Low)</option>
                  <option value="risk-low">Risk (Low-High)</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. HOUSEHOLD LIST (Mobile First) */}
        <div className="space-y-3 animate-slide-up delay-200">
          {filteredHouseholds.length === 0 ? <div className="text-center py-12 text-slate-400">
              <HomeIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No households found matching your filters.</p>
            </div> : filteredHouseholds.map(household => <div key={household.id} onClick={() => toggleExpand(household.id)} className={`glass rounded-xl border transition-all cursor-pointer overflow-hidden ${expandedHousehold === household.id ? 'border-cyan-500/50 bg-slate-800/40' : 'border-slate-700 hover:border-slate-600'}`}>
                {/* Compact Row Header */}
                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${household.riskLevel === 'high' ? 'bg-red-500/20 text-red-400' : household.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                      <HomeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-white truncate">
                        {household.ownerName}
                      </h3>
                      {/* Show address on tablet+ only in collapsed state */}
                      <p className="hidden sm:block text-xs text-slate-400 truncate max-w-[200px] lg:max-w-md">
                        {household.address}
                      </p>
                      {/* Show risk badge text on mobile in collapsed state */}
                      <div className="sm:hidden mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getRiskColor(household.riskLevel)}`}>
                          {household.riskLevel.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Risk Badge (Tablet+) */}
                    <div className={`hidden sm:block px-3 py-1 rounded-full border ${getRiskColor(household.riskLevel)}`}>
                      <span className="text-xs font-semibold uppercase">
                        {household.riskLevel} Risk
                      </span>
                    </div>

                    {expandedHousehold === household.id ? <ChevronUpIcon className="w-5 h-5 text-cyan-400" /> : <ChevronDownIcon className="w-5 h-5 text-slate-500" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedHousehold === household.id && <div className="border-t border-slate-700/50 bg-slate-900/30 p-4 animate-slide-down">
                    {/* Address & Contact (Mobile mainly) */}
                    <div className="mb-4 space-y-2 sm:hidden">
                      <div className="flex items-start gap-2 text-xs text-slate-300">
                        <MapPinIcon className="w-3.5 h-3.5 text-slate-500 mt-0.5" />
                        <span>{household.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <PhoneIcon className="w-3.5 h-3.5 text-slate-500" />
                        <span>{household.contactNumber}</span>
                      </div>
                    </div>

                    {/* Safety Score (Tablet+ only to save space on mobile, or simplified) */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <ShieldIcon className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs sm:text-sm font-semibold text-white">
                            Safety Score
                          </span>
                        </div>
                        <span className="text-lg sm:text-xl font-bold text-white">
                          {household.safetyScore}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${getSafetyScoreColor(household.safetyScore || 0)}`} style={{
                  width: `${household.safetyScore}%`
                }}></div>
                      </div>
                    </div>

                    {/* Device Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
                      <div className="bg-slate-800/50 rounded-lg p-2 sm:p-3 text-center border border-slate-700">
                        <RadioIcon className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                        <div className="text-lg font-bold text-white">
                          {household.deviceCount}
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-400">
                          Devices
                        </div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-2 sm:p-3 text-center border border-slate-700">
                        <AlertTriangleIcon className="w-4 h-4 text-red-400 mx-auto mb-1" />
                        <div className="text-lg font-bold text-white">
                          {household.fireExtinguishers}
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-400">
                          Extinguishers
                        </div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-2 sm:p-3 text-center border border-slate-700">
                        <ActivityIcon className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                        <div className="text-lg font-bold text-white">
                          {household.smokeDetectors}
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-400">
                          Detectors
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                      <button onClick={e => handleEditClick(e, household)} className="flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-all shadow-lg active:scale-95">
                        <EditIcon className="w-3.5 h-3.5" />
                        Edit Details
                      </button>
                      <button onClick={e => handleAddDeviceClick(e, household)} className="flex items-center justify-center gap-2 px-3 py-2 glass border border-slate-700 hover:border-green-500/50 text-white rounded-lg text-xs sm:text-sm font-medium transition-all active:scale-95">
                        <PlusIcon className="w-3.5 h-3.5" />
                        Add Device
                      </button>
                      <button onClick={e => handleMapClick(e, household)} className="flex items-center justify-center gap-2 px-3 py-2 glass border border-slate-700 hover:border-purple-500/50 text-white rounded-lg text-xs sm:text-sm font-medium transition-all active:scale-95">
                        <MapIcon className="w-3.5 h-3.5" />
                        View on Map
                      </button>
                    </div>
                  </div>}
              </div>)}
        </div>
      </div>

      {/* Modals */}
      {editModalOpen && selectedHousehold && <EditHouseholdModal household={selectedHousehold} onClose={() => setEditModalOpen(false)} onSave={handleSaveHousehold} />}

      {addDeviceModalOpen && selectedHousehold && <AddDeviceToHouseholdModal householdId={selectedHousehold.id} householdName={selectedHousehold.ownerName} onClose={() => setAddDeviceModalOpen(false)} onSave={handleSaveDevice} />}

      {mapModalOpen && selectedHousehold && <HouseholdMapModal household={selectedHousehold} onClose={() => setMapModalOpen(false)} />}
    </div>;
}