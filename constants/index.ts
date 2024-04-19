import { CampaignStatus, Icon, LeadStatus, Payment_Status, Role } from "@prisma/client";
import { CheckCircledIcon, CrossCircledIcon, ExclamationTriangleIcon, StopwatchIcon } from "@radix-ui/react-icons";
import { subDays } from "date-fns";
import { CheckCircle, CircleIcon, Info } from "lucide-react";

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

export type StatusType = {
  label: string;
  value: CampaignStatus | LeadStatus | Role | Payment_Status;
  icon?: React.ComponentType<{ className?: string }>;
  color?: {
    textColor: string;
    bgColor: string;
    ringColor: string;
  };
};
export type CampaignStatusProp = StatusType & {
  value: CampaignStatus;
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
      textColor: "text-blue-700",
      bgColor: "!bg-blue-50",
      ringColor: "ring-blue-600/20",
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

export type LeadStatusProp = StatusType & {
  value: LeadStatus;
};

export const LEADS_STATUS: LeadStatusProp[] = [
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
    label: "Paid",
    value: "Paid",
    icon: StopwatchIcon,
    color: {
      textColor: "text-green-700",
      bgColor: "!bg-green-50",
      ringColor: "ring-green-600/20",
    },
  },
  {
    label: "Approved",
    value: "Approved",
    icon: CheckCircledIcon,
    color: {
      textColor: "text-green-700",
      bgColor: "!bg-green-50",
      ringColor: "ring-green-600/20",
    },
  },
  {
    label: "Trashed",
    value: "Trashed",
    icon: CrossCircledIcon,
    color: {
      textColor: "text-red-700",
      bgColor: "!bg-red-50",
      ringColor: "ring-red-600/20",
    },
  },
];
export type PaymentStatusProps = StatusType & {
  value: Payment_Status;
};
export const PAYMENT_STATUS: PaymentStatusProps[] = [
  {
    value: "PENDING",
    label: "Pending",
    icon: CircleIcon,
    color: {
      textColor: "text-yellow-700",
      bgColor: "!bg-yellow-50",
      ringColor: "ring-yellow-600/20",
    },
  },

  {
    value: "COMPLETED",
    label: "Completed",
    icon: CheckCircledIcon,
    color: {
      textColor: "text-green-700",
      bgColor: "!bg-green-50",
      ringColor: "ring-green-600/20",
    },
  },
  {
    value: "FAILED",
    label: "Failed",
    icon: CrossCircledIcon,
    color: {
      textColor: "text-red-700",
      bgColor: "!bg-red-50",
      ringColor: "ring-red-600/20",
    },
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    icon: CrossCircledIcon,
    color: {
      textColor: "text-red-700",
      bgColor: "!bg-red-50",
      ringColor: "ring-red-600/20",
    },
  },
];
export type UserRoleType = StatusType & {
  value: Role;
};

export const USER_ROLE: UserRoleType[] = [
  {
    label: "Admin",
    value: "ADMIN",
    icon: CircleIcon,
    color: {
      textColor: "text-yellow-700",
      bgColor: "!bg-yellow-50",
      ringColor: "ring-yellow-600/20",
    },
  },
  {
    label: "Client",
    value: "CLIENT",
    icon: CircleIcon,
    color: {
      textColor: "text-green-700",
      bgColor: "!bg-green-50",
      ringColor: "ring-green-600/20",
    },
  },
  {
    label: "Customer",
    value: "CUSTOMER",
    icon: CircleIcon,
    color: {
      textColor: "text-green-700",
      bgColor: "!bg-green-50",
      ringColor: "ring-green-600/20",
    },
  },
  {
    label: "Super Admin",
    value: "SUPER_ADMIN",
    icon: CircleIcon,
    color: {
      textColor: "text-red-700",
      bgColor: "!bg-red-50",
      ringColor: "ring-red-600/20",
    },
  },
];

type NotificationIconTypt = {
  key: Icon;
  icon: React.ComponentType<{ className?: string }>;
  color?: {
    textColor: string;
    bgColor: string;
    ringColor: string;
  };
};
export const NOTIFICATION_ICON: NotificationIconTypt[] = [
  {
    key: "success",
    icon: CheckCircle,
    color: {
      bgColor: "bg-[#F0FDF4]",
      textColor: "text-green-600",
      ringColor: "ring-[#DCFCE7]",
    },
  },
  {
    key: "warning",
    icon: ExclamationTriangleIcon,
    color: {
      bgColor: "bg-[#FFFBEB]",
      textColor: "text-yellow-600",
      ringColor: "ring-[#FEF3C7]",
    },
  },
  {
    key: "info",
    icon: Info,
    color: {
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      ringColor: "ring-blue-100",
    },
  },
];

export const RESET_PASSWORD_STEP2_LINK: string = "/reset-password/step2";
export const RESET_PASSWORD_TOKEN_EXPIRE_TIME: number = 4 * 60 * 60 * 1000;
export const DEFAULT_PRICE_PER_LEAD: number = 120;
export const DEFAULT_LEAD_CHARGE_DAYS: number = 7 * 24 * 60 * 60 * 1000; // 7 days
export const DEFAULT_MAX_TRASHED_LEAD_COUNT: number = 1; //1 trashlead
