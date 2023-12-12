import { create } from "zustand";

type DashboardChartStore = {
  firstCampaignId: string;
  secondCampaignId: string;
  setFirstCampaignId: (value: string) => void;
  setSecondCampaignId: (value: string) => void;
};

export const useDashboardChartStore = create<DashboardChartStore>((set) => ({
    firstCampaignId: '',
    secondCampaignId: '',
    setFirstCampaignId: (value) => set({ firstCampaignId: value }),
    setSecondCampaignId: (value) => set({ secondCampaignId: value }),
  }));