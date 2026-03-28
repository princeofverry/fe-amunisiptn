"use client";

import { createContext, useContext, useState, useEffect, type PropsWithChildren } from "react";
import { Database, TestTube2 } from "lucide-react";

type DataMode = "dummy" | "backend";

interface DataModeContextType {
  mode: DataMode;
  setMode: (mode: DataMode) => void;
  isDummy: boolean;
  isBackend: boolean;
}

const DataModeContext = createContext<DataModeContextType>({
  mode: "dummy",
  setMode: () => {},
  isDummy: true,
  isBackend: false,
});

export function useDataMode() {
  return useContext(DataModeContext);
}

export function DataModeProvider({ children }: PropsWithChildren) {
  const [mode, setModeState] = useState<DataMode>("dummy");
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("amunisi_data_mode");
    if (saved === "backend" || saved === "dummy") {
      setModeState(saved);
    }
  }, []);

  const setMode = (newMode: DataMode) => {
    setModeState(newMode);
    localStorage.setItem("amunisi_data_mode", newMode);
    // Force refetch all queries
    window.location.reload();
  };

  const value: DataModeContextType = {
    mode,
    setMode,
    isDummy: mode === "dummy",
    isBackend: mode === "backend",
  };

  return (
    <DataModeContext.Provider value={value}>
      {children}

      {/* Floating Toggle Button */}
      {mounted && (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2">
          {/* Panel */}
          {isOpen && (
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-[260px] animate-in slide-in-from-bottom-2 fade-in duration-200">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2.5 h-2.5 rounded-full ${mode === "backend" ? "bg-green-500" : "bg-amber-500"} animate-pulse`} />
                <span className="font-bold text-sm text-gray-800">
                  Data Source
                </span>
              </div>

              <div className="space-y-2">
                {/* Dummy Option */}
                <button
                  onClick={() => setMode("dummy")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    mode === "dummy"
                      ? "bg-amber-50 border-2 border-amber-400 text-amber-800"
                      : "bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <TestTube2 className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">Dummy Data</div>
                    <div className="text-[11px] opacity-70">Data mock lokal</div>
                  </div>
                  {mode === "dummy" && (
                    <div className="ml-auto w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  )}
                </button>

                {/* Backend Option */}
                <button
                  onClick={() => setMode("backend")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    mode === "backend"
                      ? "bg-green-50 border-2 border-green-400 text-green-800"
                      : "bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Database className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">Backend API</div>
                    <div className="text-[11px] opacity-70">Data real dari server</div>
                  </div>
                  {mode === "backend" && (
                    <div className="ml-auto w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-gray-400 mt-3 text-center">
                Halaman akan reload saat mode berubah
              </p>
            </div>
          )}

          {/* FAB */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`group w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
              mode === "backend"
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-amber-500 hover:bg-amber-600 text-white"
            }`}
            title={`Mode: ${mode === "backend" ? "Backend API" : "Dummy Data"}`}
          >
            {mode === "backend" ? (
              <Database className="w-6 h-6" />
            ) : (
              <TestTube2 className="w-6 h-6" />
            )}
          </button>
        </div>
      )}
    </DataModeContext.Provider>
  );
}
