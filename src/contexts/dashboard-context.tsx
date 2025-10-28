'use client';

import { createContext, useContext, ReactNode } from 'react';

interface DashboardContextType {
  refreshResumes: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ 
  children, 
  refreshResumes 
}: { 
  children: ReactNode;
  refreshResumes: () => Promise<void>;
}) {
  return (
    <DashboardContext.Provider value={{ refreshResumes }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}
