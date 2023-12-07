import axios from "axios";
import { IpInfoSchema } from "@/schema/ipInfoSchema";
import { z } from "zod";

type IpInfo = z.infer<typeof IpInfoSchema>;


export async function getIpInfo(ipAddress: string | null = null): Promise<IpInfo> {
  try {
    const response = await axios.get(`https://ipapi.co/${ipAddress || ''}/json`);
    const ipInfoData = IpInfoSchema.parse(response.data);
    return ipInfoData

  } catch (error) {
    console.error('Error getting IP information:', error);
    return {
      ip: ipAddress ?? "",
      country_name: "",
      city: "",
      region: ""
    };
  }
}