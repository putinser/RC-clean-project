import {create} from 'zustand';

type LandingScrollState = {
  pendingAnchor: string | null;
  setPendingAnchor: (anchor: string | null) => void;
};

export const useLandingScrollStore = create<LandingScrollState>((set) => ({
  pendingAnchor: null,
  setPendingAnchor: (anchor) => set({pendingAnchor: anchor}),
}));
