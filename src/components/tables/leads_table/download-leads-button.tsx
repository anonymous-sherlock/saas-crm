import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import xlsx, { IJsonSheet } from "json-as-xlsx";
import { DownloadIcon } from "lucide-react";
import { LeadColumnType, DataLeadSchema } from "./schema";


interface DownloadLeadsBtnProps<TData> {
  table: Table<TData>,
}
export function DownloadLeadsBtn<TData>({ table, }: DownloadLeadsBtnProps<TData>) {
  function downloadToExcel() {
    const rows = table.getFilteredSelectedRowModel().rows;
    const parsedData = DataLeadSchema.array().safeParse(rows.map(row => row.original))
    if (!parsedData.success) return null

    let columns: IJsonSheet[] = [
      {
        sheet: parsedData.data[0].campaign.name,
        columns: [
          { label: "Lead Id", value: "id" },
          { label: "Person Name", value: "name" },
          { label: "Person Phone", value: "phone" },
          { label: "Country", value: "country" },
          { label: "Region", value: "region" },
          { label: "City", value: "city" },
          { label: "Zipcode", value: "zipcode" },
          { label: "Address", value: "address" },
          { label: "IP", value: "ip" },
          { label: "Lead Status", value: "status" },
          { label: "Date", value: "createdAt" },
        ] satisfies { label: string, value: keyof LeadColumnType }[],
        content: parsedData.data,
      },
    ];

    let settings = {
      fileName: `${parsedData.data[0].campaign.name} Leads`.toLocaleLowerCase().replaceAll(" ", "-"),
    };
    xlsx(columns, settings);
    table.toggleAllPageRowsSelected(false)

  }

  return (
    <>
      {
        table.getFilteredSelectedRowModel().rows.length > 0 && (
          <Button className="h-8 px-2 lg:px-3 text-sm relative" onClick={() => downloadToExcel()}>
            <DownloadIcon className="w-4 h-4 mr-2" />
            Download
            <span className="w-5 h-5 flex justify-center items-center bg-white text-primary border absolute rounded-full -top-1 -right-1 text-xs">{table.getFilteredSelectedRowModel().rows.length}</span>
          </Button>
        )
      }
    </>

  );
};

