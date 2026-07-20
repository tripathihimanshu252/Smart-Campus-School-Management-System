// Author: Himanshu Tripathi
// Department: AI and DS

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios'; 
import { 
  Truck, MapPin, Users, Play, Square, 
  ShieldAlert, Timer, Gauge, Megaphone, CheckCircle2 
} from 'lucide-react';

const DriverDashboard = () => {
  const activeTenantId = useSelector((state) => state.auth?.schoolId) || localStorage.getItem('tenantId') || "test-01";

  const [isTripActive, setIsTripActive] = useState(() => localStorage.getItem(`driver_trip_active_${activeTenantId}`) === 'true');
  const [currentStop, setCurrentStop] = useState(() => localStorage.getItem(`driver_stop_${activeTenantId}`) || 'Bus Depot / Yard');
  const [passengerCount, setPassengerCount] = useState(() => Number(localStorage.getItem(`driver_passengers_${activeTenantId}`)) || 0);
  const [speed, setSpeed] = useState(() => Number(localStorage.getItem(`driver_speed_${activeTenantId}`)) || 0);
  const [routeIndex, setRouteIndex] = useState(0);

  // DRIVER & BUS DETAILS
  const busDetails = {
    driverName: "Ashok Kumar", 
    busNo: "UP-16-AT-9845",
    route: "Route-01 (Alpha to School)",
    capacity: 40 
  };

  const routesRegistry = [
    "Bus Depot / Yard",
    "Pari Chowk Central Circle",
    "Alpha 1 Commercial Complex",
    "Sector 62 Noida Intersect",
    "School Main Gate Terminal"
  ];

  const updateGlobalTransitMesh = async (active, stop, passengers, velocity) => {
    localStorage.setItem(`driver_trip_active_${activeTenantId}`, active);
    localStorage.setItem(`driver_stop_${activeTenantId}`, stop);
    localStorage.setItem(`driver_passengers_${activeTenantId}`, passengers);
    localStorage.setItem(`driver_speed_${activeTenantId}`, velocity);

    setIsTripActive(active);
    setCurrentStop(stop);
    setPassengerCount(passengers);
    setSpeed(velocity);

    try {
      const token = localStorage.getItem('userToken');
      const payload = {
        busNo: busDetails.busNo, 
        currentStop: stop,
        status: active ? 'In-Transit' : 'Off-Duty',
        velocity: velocity,
        passengers: passengers
      };

      await axios.put('https://smart-campus-school-management-system-1.onrender.com/api/fleets/location', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.warn("⚠️ Telemetry sync delayed, relying on local cache.", error);
    }
  };

  const handleToggleTrip = () => {
    if (!isTripActive) {
      setRouteIndex(1);
      updateGlobalTransitMesh(true, routesRegistry[1], 12, 45); // Mock 12 students for demo
    } else {
      setRouteIndex(0);
      updateGlobalTransitMesh(false, routesRegistry[0], 0, 0);
    }
  };

  const handleAdvanceRouteNode = () => {
    if (!isTripActive) return;
    const nextIndex = (routeIndex + 1) % routesRegistry.length;
    setRouteIndex(nextIndex);
    
    const nextSpeed = nextIndex === 0 || nextIndex === routesRegistry.length - 1 ? 0 : Math.floor(Math.random() * (50 - 30 + 1)) + 30;
    const nextCount = nextIndex === 0 ? 0 : Math.max(0, passengerCount - Math.floor(Math.random() * 2));
    
    updateGlobalTransitMesh(true, routesRegistry[nextIndex], nextCount, nextSpeed);
  };

  return (
    // Clean light gray background to make white cards pop
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-4 md:p-6 lg:p-8 font-sans overflow-x-hidden">
      
      {/* 🟢 TOP HEADER CARD */}
      <div className="bg-white border border-slate-200/60 p-4 md:p-6 rounded-xl shadow-sm mb-4 md:mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
        <div className="w-full md:w-auto">
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight break-words">SCHOOL TRANSIT CONSOLE</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
            Driver: <span className="font-bold text-blue-600">{busDetails.driverName}</span> <span className="mx-1 md:mx-2 text-slate-300">|</span> <span className="block sm:inline">{busDetails.route}</span>
          </p>
        </div>
        <div className="bg-slate-50 px-4 py-3 md:py-2 rounded-lg border border-slate-100 text-left md:text-right w-full md:w-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Campus Domain</span>
          <span className="text-xs md:text-sm font-black text-slate-700 uppercase tracking-widest break-all">{activeTenantId}</span>
        </div>
      </div>

      {/* 🔵 MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* LEFT: TELEMETRY DASHBOARD */}
        <div className="bg-white border border-slate-200/60 p-4 md:p-6 rounded-xl shadow-sm lg:col-span-2 flex flex-col justify-between w-full">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 mb-4 md:mb-6 gap-3 sm:gap-0">
            <h3 className="text-sm md:text-base font-bold text-slate-800 flex items-center gap-2">
              <Truck className="text-blue-500 shrink-0" size={20} />
              Fleet: {busDetails.busNo}
            </h3>
            <span className={`inline-flex items-center gap-1.5 text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full border w-full sm:w-auto justify-center ${isTripActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
              {isTripActive ? <><CheckCircle2 size={14} className="shrink-0"/> Broadcast Active</> : 'Offline'}
            </span>
          </div>

          {/* METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="bg-slate-50/50 p-4 md:p-5 rounded-xl border border-slate-100 hover:border-blue-100 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100/50 text-blue-600 rounded-lg shrink-0"><MapPin size={16}/></div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Current Node</span>
              </div>
              <span className="text-xs md:text-sm font-bold text-slate-900 leading-tight block break-words">{currentStop}</span>
            </div>

            <div className="bg-slate-50/50 p-4 md:p-5 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-100/50 text-indigo-600 rounded-lg shrink-0"><Users size={16}/></div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Load Capacity</span>
              </div>
              <span className="text-lg md:text-xl font-black text-indigo-700 block">
                {passengerCount} <span className="text-[10px] md:text-xs text-slate-500 font-semibold">/ {busDetails.capacity} Seats</span>
              </span>
            </div>

            <div className="bg-slate-50/50 p-4 md:p-5 rounded-xl border border-slate-100 hover:border-emerald-100 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-100/50 text-emerald-600 rounded-lg shrink-0"><Gauge size={16}/></div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Velocity</span>
              </div>
              <span className="text-lg md:text-xl font-black text-emerald-700 block">
                {speed} <span className="text-[10px] md:text-xs text-slate-500 font-semibold">KM/H</span>
              </span>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-auto">
            <button onClick={handleToggleTrip} className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 md:py-3.5 px-4 rounded-xl text-xs md:text-sm transition-all shadow-sm w-full sm:w-auto ${isTripActive ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'}`}>
              {isTripActive ? (
                <> <Square size={16} className="shrink-0" /> Terminate Broadcast </>
              ) : (
                <> <Play size={16} fill="currentColor" className="shrink-0" /> Initiate Transit Stream </>
              )}
            </button>
            
            {isTripActive && (
              <button onClick={handleAdvanceRouteNode} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 md:py-3.5 px-4 rounded-xl text-xs md:text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 w-full sm:w-auto">
                <Timer size={16} className="shrink-0" /> Log Next Checkpoint &rarr;
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: NOTICES & SOS */}
        <div className="flex flex-col gap-4 md:gap-6 w-full">
          
          {/* SOS CARD */}
          <div className="bg-white border border-red-100 p-4 md:p-6 rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <div>
              <h4 className="text-[11px] md:text-xs font-black uppercase tracking-widest text-red-600 flex items-center gap-2 mb-2">
                <ShieldAlert size={16} className="shrink-0" /> Emergency Override
              </h4>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium mb-4 md:mb-6 mt-2 md:mt-3">
                Trigger system alert to notify Reception and Transport Admin regarding gridlocks or breakdowns instantly.
              </p>
            </div>
            <button 
              disabled={!isTripActive}
              onClick={() => window.alert('🚨 SYSTEM PANIC OVERRIDE TRIGGERED!')}
              className="w-full bg-red-600 hover:bg-red-700 text-white disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed font-bold py-2.5 md:py-3 rounded-lg text-[10px] md:text-xs uppercase tracking-widest transition-all shadow-sm"
            >
              Trigger SOS Alert
            </button>
          </div>

          {/* ADMIN NOTICE */}
          <div className="bg-white border border-amber-100 p-4 md:p-6 rounded-xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
            <h4 className="text-[11px] md:text-xs font-black uppercase tracking-widest text-amber-600 flex items-center gap-2 mb-3">
              <Megaphone size={16} className="shrink-0" /> Dispatch Directives
            </h4>
            <div className="bg-amber-50/50 p-3 md:p-4 rounded-lg border border-amber-100/50">
              <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed">
                <span className="font-extrabold text-amber-700 mr-1 block sm:inline">ROUTE UPDATE:</span> 
                Sector 62 has heavy traffic currently. Utilize the elevated bridge for drop-offs today.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;