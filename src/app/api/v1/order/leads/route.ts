import { NextRequest, NextResponse } from "next/server";
import { GetLeads } from "./GET";
import { CreateLead } from "./POST";




export const GET = (req: NextRequest, res: NextResponse) => GetLeads(req, res);
export const POST = (req: NextRequest, res: NextResponse) => CreateLead(req, res);