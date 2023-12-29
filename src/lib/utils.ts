import { clsx, type ClassValue } from "clsx";
import { randomUUID } from "crypto";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";
import favicon from "@/public/favicon.png";
import { env } from "./env.mjs";
import crypto from "crypto"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// generate inticials from name
export function generateInitialFromName(fullName: string) {
  if (!fullName) {
    return "N/A";
  }

  // Check if the fullName is not empty and is a string
  if (typeof fullName === "string" && fullName.trim().length > 0) {
    // Split the fullName into an array of words
    const words = fullName.trim().split(" ");

    // Use map to extract the first letter of each word and convert it to uppercase
    const initials = words
      .filter((word): word is string => typeof word === "string")
      .map((word) => {
        if (typeof word === "string" && word.length > 0) {
          return word[0]!.toUpperCase();
        }
      });
    // Get the first two initials
    const firstTwoInitials = initials.slice(0, 2);

    if (firstTwoInitials.length > 0) {
      return firstTwoInitials.join(""); // Join the initials together
    }
  }
  // Handle invalid input
  return "N/A"; // You can return a default value like 'N/A' for invalid input
}

export function isMacOs() {
  if (typeof window === "undefined") return false;

  return window.navigator.userAgent.includes("Mac");
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (env.NEXT_PUBLIC_VERCEL_URL) return `https://${env.NEXT_PUBLIC_VERCEL_URL}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export function generateCampaignCodeID() {
  // Generate a UUID and use the first 8 characters as the alias
  const uuid = randomUUID();
  const alias = uuid.substring(0, 8);
  return alias;
}


export function formatPrice(
  price: number | string,
  options: {
    currency?: "INR" | "USD" | "EUR" | "GBP" | "BDT";
    notation?: Intl.NumberFormatOptions["notation"];
  } = {},
) {
  const { currency = "INR", notation = "standard" } = options; // Change here

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice);
}

export function constructMetadata({
  title = "Adscrush - the SaaS for leads management",
  description = "Adscrush CRM is an open-source software to easily manage your hot leads.",
  image = "/favicon.png",
  noIndex = true,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@adscrush",
    },
    icons: favicon.src,
    metadataBase: new URL("http://localhost:300"),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

export function calculatePercentage(previousValue: number, currentValue: number): number {
  if (previousValue === 0) {
    // Handle division by zero or initial value being zero
    return currentValue === 0 ? 0 : 100;
  }
  return ((currentValue - previousValue) / previousValue) * 100;
}


export function generateSecurePasswordResetCode() {
  const partLength = 5;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let resetCode = '';

  for (let i = 0; i < 4; i++) {
    if (i > 0) {
      resetCode += '-';
    }

    for (let j = 0; j < partLength; j++) {
      const randomIndex = crypto.randomInt(characters.length);
      resetCode += characters.charAt(randomIndex);
    }
  }

  return resetCode;
}