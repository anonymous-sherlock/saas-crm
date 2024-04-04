import { CampaignStatus, LeadStatus } from "@prisma/client";

export function getFileExtension(fileName: string): string {
  return fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2);
}

export function parsePrice(productPrice: string) {
  const cleanedProductPrice = (productPrice as string).replace(/,/g, ""); // Remove commas
  let price = parseFloat(cleanedProductPrice);
  // Ensure the price always has two decimal places
  if (!isNaN(price)) {
    return (price = parseFloat(price.toFixed(2)));
  }
  return price;
}

type DetermineLeadStatusProps = {
  name: string
  phone: string
  email?: string;
  city?: string
  campaignStatus?: CampaignStatus
}


export function determineLeadStatus({ name, phone, email, city, campaignStatus }: DetermineLeadStatusProps): LeadStatus {
  const validPhoneRegex = /^\+?\d{10,15}$/;
  const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation regex


  if (!validPhoneRegex.test(phone)) return "Trashed"; // Invalid phone number format
  if (name.includes("test")) return "Trashed"; // Lead name or description contains 'test'
  if (name.length < 2 || name.length > 50) return "Trashed"; // Name length is too short or too long
  if (email && !validEmailRegex.test(email)) return "Trashed"; // Validate email if provided and it's not empty

  if (email && email.toLowerCase().includes("spam")) return "Trashed"; // Email address contains 'spam'
  if (city && (city.length < 2 || city.toLowerCase().includes("spam"))) return "Trashed"; // City contains 'spam'

  switch (campaignStatus) {
    case "OnHold":
      return "OnHold"
    case "Canceled":
      return "Trashed"
    default:
      break;
  }
  return "Approved"
}