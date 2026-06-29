export type TariffRoleName = 'free' | 'base' | 'middle' | 'max';

export type TariffRole = {
  id: number;
  display_name: string;
  name: TariffRoleName;
};

export type Tariff = {
  id: number;
  name: string;
  description: string[];
  description_hover: string;
  terms: string;
  price: string;
  role: TariffRole;
};

export type SubscriptionTariffsResponse = {
  success: boolean;
  data: Tariff[];
  error: unknown;
};
