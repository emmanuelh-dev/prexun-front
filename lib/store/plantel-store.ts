import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Campus, Grupo, Caja } from '../types';
import { useAuthStore } from './auth-store';
import axiosInstance from '../api/axiosConfig';

interface ActiveCampusStore {
  activeCampus: Campus | null;
  activeCaja: Caja | null;
  setActiveCampus: (campus: Campus | null) => void;
  setActiveCaja: (caja: Caja | null) => void;
  updateGruposByCampus: (campusId: number) => Promise<void>;
}

export const useActiveCampusStore = create<ActiveCampusStore>()(
  persist(
    (set, get) => ({
      activeCampus: null,
      activeCaja: null,
      setActiveCampus: (campus) => {
        set({ activeCampus: campus });
        if (campus) {
          get().updateGruposByCampus(campus.id);
          if (campus.latest_cash_register) {
            set({ activeCaja: campus.latest_cash_register });
          }
        } else {
          useAuthStore.getState().setGrupos([]);
          set({ activeCaja: null });
        }
      },
      setActiveCaja: (caja) => set({ activeCaja: caja }),
      updateGruposByCampus: async (campusId: number) => {
        try {
          const response = await axiosInstance.get('/grupos', {
            params: {
              plantel_id: campusId,
            },
          });
          const grupos: Grupo[] = response.data;
          useAuthStore.getState().setGrupos(grupos);
        } catch (error) {
          console.error('Error fetching grupos by campus:', error);
          useAuthStore.getState().setGrupos([]);
        }
      },
    }),
    {
      name: 'active-campus-storage',
      partialize: (state) => ({
        activeCampus: state.activeCampus,
      }),
    }
  )
);
