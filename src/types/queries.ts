import { LeadApi } from "@/server/api/lead";
import { ProductApi } from "@/server/api/product";

export type GetAllProductsType = Awaited<ReturnType<ProductApi["getAllProducts"]>>;
export type GetSingleProductType = Awaited<ReturnType<ProductApi["getSingleProduct"]>>;
export type GetAllUsersLeads = Awaited<ReturnType<LeadApi["getAllUsersLeads"]>>;
