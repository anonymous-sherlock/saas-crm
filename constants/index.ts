import { CampaignStatus } from "@prisma/client";
import { CheckCircledIcon, CrossCircledIcon, StopwatchIcon } from "@radix-ui/react-icons";
import { CircleIcon } from "lucide-react";

type ProductCategory = {
  label: string;
  value: string;
};
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  { label: "Body Care", value: "BodyCare" as const },
  { label: "Amulets", value: "Amulets" as const },
  { label: "Cystitis", value: "Cystitis" as const },
  { label: "WhiteHat", value: "WhiteHat" as const },
  { label: "Hearing disease", value: "HearingDisease" as const },
  { label: "CBD", value: "CBD" as const },
  { label: "Cellulite", value: "Cellulite" as const },
  { label: "Cholesterol", value: "Cholesterol" as const },
  { label: "Buttocks enlargement", value: "ButtocksEnlargement" as const },
  { label: "Penis enlargement", value: "PenisEnlargement" as const },
  { label: "Breast enlargement", value: "BreastEnlargement" as const },
  { label: "Testosterone", value: "Testosterone" as const },
  { label: "Joints", value: "Joints" as const },
  { label: "Sleep", value: "Sleep" as const },
  { label: "General health", value: "GeneralHealth" as const },
  { label: "Rehab", value: "Rehab" as const },
  { label: "Psoriasis", value: "Psoriasis" as const },
  { label: "Acne", value: "Acne" as const },
  { label: "Prostatitis", value: "Prostatitis" as const },
  { label: "Probiotics", value: "Probiotics" as const },
  { label: "Diet - Weight Loss", value: "DietWeightLoss" as const },
  { label: "Enhancement", value: "Enhancement" as const },
  { label: "Liver", value: "Liver" as const },
  { label: "Parasites", value: "Parasites" as const },
  { label: "Papillomas", value: "Papillomas" as const },
  { label: "Teeth whitening", value: "TeethWhitening" as const },
  { label: "Pain relief", value: "PainRelief" as const },
  { label: "Mood", value: "Mood" as const },
  { label: "Muscle", value: "Muscle" as const },
  { label: "Wrinkles", value: "Wrinkles" as const },
  { label: "Brain", value: "Brain" as const },
  { label: "Medical cosmetics", value: "MedicalCosmetics" as const },
  { label: "Smoking", value: "Smoking" as const },
  { label: "Correctors", value: "Correctors" as const },
  { label: "Immunity", value: "Immunity" as const },
  { label: "Eyesight", value: "Eyesight" as const },
  { label: "Women's Health", value: "WomensHealth" as const },
  { label: "Diabetes", value: "Diabetes" as const },
  { label: "Detox", value: "Detox" as const },
  { label: "Depilation", value: "Depilation" as const },
  { label: "Make-up", value: "Makeup" as const },
  { label: "Fungus", value: "Fungus" as const },
  { label: "Hypertension", value: "Hypertension" as const },
  { label: "Haemorrhoids", value: "Haemorrhoids" as const },
  { label: "Gastritis", value: "Gastritis" as const },
  { label: "Hair", value: "Hair" as const },
  { label: "Aphrodisiacs", value: "Aphrodisiacs" as const },
  { label: "Vitamins", value: "Vitamins" as const },
  { label: "Varicose", value: "Varicose" as const },
  { label: "Valgus", value: "Valgus" as const },
  { label: "Beard", value: "Beard" as const },
  { label: "No niche", value: "NoNiche" as const },
  { label: "Anti-aging cosmetics", value: "AntiAgingCosmetics" as const },
  { label: "Allergy", value: "Allergy" as const },
  { label: "Alcoholism", value: "Alcoholism" as const },
];
type CampaignStatusProp = {
  label: string;
  value: CampaignStatus;
  icon?: React.ComponentType<{ className?: string }>;
  color?: {
    textColor: string;
    bgColor: string;
    ringColor: string;
  };
};

export const CAMPAIGN_STATUS: CampaignStatusProp[] = [
  {
    label: "On Hold",
    value: "OnHold",
    icon: CircleIcon,
    color: {
      textColor: "text-yellow-700",
      bgColor: "!bg-yellow-50",
      ringColor: "ring-yellow-600/20",
    },
  },
  {
    label: "In Progress",
    value: "InProgress",
    icon: StopwatchIcon,
    color: {
      textColor: "text-green-700",
      bgColor: "!bg-green-50",
      ringColor: "ring-green-600/20",
    },
  },
  {
    value: "Done",
    label: "Done",
    icon: CheckCircledIcon,
    color: {
      textColor: "text-green-700",
      bgColor: "!bg-green-50",
      ringColor: "ring-green-600/20",
    },
  },
  {
    value: "Canceled",
    label: "Canceled",
    icon: CrossCircledIcon,
    color: {
      textColor: "text-red-700",
      bgColor: "!bg-red-50",
      ringColor: "ring-red-600/20",
    },
  },
];
