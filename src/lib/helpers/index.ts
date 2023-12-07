import { LeadStatus } from "@prisma/client";

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
}


export function determineLeadStatus({ name, phone }: DetermineLeadStatusProps): LeadStatus {
  if (name.includes("test")) {
    return "Trashed";
  } else if (phone.length < 10 || phone.length > 15) {
    return "Trashed";
  } else {
    return "OnHold";
  }
}