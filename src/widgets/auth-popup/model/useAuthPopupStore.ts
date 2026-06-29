import {create} from 'zustand';

type AuthPopupStoreState = {
  isFormInvalid: boolean;
  setFormInvalid: (value: boolean) => void;
};

export const useAuthPopupStore = create<AuthPopupStoreState>((set) => ({
  isFormInvalid: false,
  setFormInvalid: (value) => set({isFormInvalid: value}),
}));
