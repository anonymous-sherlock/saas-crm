"use client";
import { findCampaignByCode } from "@/lib/actions/campaign.action";
import { BulkUploadLeadsSchema, LeadSchema } from "@/schema/lead.schema";
import { ColDef, PaginationNumberFormatterParams, RowClassRules } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";

interface GridProps {
  data: z.infer<typeof BulkUploadLeadsSchema>[];
}
export const GridExample = ({ data }: GridProps) => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "85vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const undoRedoCellEditing = true;
  const undoRedoCellEditingLimit = 20;
  const [rowData, setRowData] = useState<z.infer<typeof BulkUploadLeadsSchema>[]>(data);
  const [invalidCampaignCodes, setInvalidCampaignCodes] = useState<string[]>([]);

  useEffect(() => {
    data.forEach(async (row) => {
      const campaign_code = row.campaign_code;
      if (!campaign_code) return;
      const campaign = await findCampaignByCode({ campaignCode: campaign_code });
      if (!campaign) {
        setInvalidCampaignCodes((prev) => [...prev, campaign_code]);
      } else {
        setInvalidCampaignCodes((prev) => prev.filter((c) => c !== campaign_code));
      }
    });
  }, [data]);

  const isValidCampaignCode = async (campaignCode: string): Promise<boolean> => {
    // Perform a database check here
    const campaign = await findCampaignByCode({ campaignCode: campaignCode });
    return !!campaign; // Return true if campaign exists, false otherwise
  };
  const checkCampaignCode = async (campaignCode: string): Promise<void> => {
    // Check if campaign code exists in the database
    const campaignExists = await isValidCampaignCode(campaignCode);
    if (campaignExists) {
      // Remove campaign code from local state
      setInvalidCampaignCodes((prev) => prev.filter((code) => code !== campaignCode));
    }
  };

  const [colDefs, setColDefs] = useState<ColDef<z.infer<typeof BulkUploadLeadsSchema>>[]>([
    {
      headerName: "Campaign Code",
      field: "campaign_code",
      pinned: "left",
      minWidth: 150,
      maxWidth: 200,
      sortable: false,
      
      onCellValueChanged: async (c) => {
        c.colDef.cellClass = () => {
          checkCampaignCode(c.newValue);
          if (invalidCampaignCodes.includes(c.newValue) || !c.newValue) return "bg-red-100/40 text-red-900";
          return "";
        };
      },
    },
    { field: "name", minWidth: 100 },
    {
      field: "phone",
      minWidth: 150,
      cellClass: (param) => {
        const parsedData = LeadSchema.shape.phone.safeParse(param.value);
        if (!parsedData.success) {
          return "bg-red-600 text-white";
        }
        return "";
      },
    },
    { field: "address", minWidth: 150 },
    { field: "country", minWidth: 150 },
    { field: "region", minWidth: 150 },
    { field: "city", minWidth: 150 },
    { field: "street", minWidth: 150 },
    { field: "zipcode", minWidth: 150 },
    {
      field: "email",
      minWidth: 150,
      onCellValueChanged(event) {
        event.colDef.cellClass = (param) => {
          const parsedData = LeadSchema.shape.email.safeParse(param.value);
          if (!parsedData.success) {
            return "bg-red-600 text-white";
          }
          return "";
        };
      },
      cellClass: (param) => {
        const parsedData = LeadSchema.shape.email.safeParse(param.value);
        if (!parsedData.success) {
          return "bg-red-100/40 text-red-900";
        }
        return "";
      },
    },
    { field: "website", minWidth: 150 },
    { field: "description", minWidth: 150 },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      filter: true,
    };
  }, []);

  const rowClassRules = useMemo<RowClassRules>(() => {
    return {
      "!bg-red-100/60": (params) => {
        if (invalidCampaignCodes.includes(params.data.campaign_code) || !params.data.campaign_code) {
          return true;
        }
        return false;
      },
    };
  }, [invalidCampaignCodes]);

  const paginationPageSizeSelector = useMemo<number[] | boolean>(() => {
    return [20, 50, 100, 500];
  }, []);
  const paginationNumberFormatter = useCallback((params: PaginationNumberFormatterParams) => {
    return "(" + params.value.toLocaleString() + ")";
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className={"ag-theme-quartz"}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          rowClassRules={rowClassRules}
          undoRedoCellEditing={undoRedoCellEditing}
          undoRedoCellEditingLimit={undoRedoCellEditingLimit}
          pagination={true}
          paginationPageSize={20}
          paginationPageSizeSelector={paginationPageSizeSelector}
          paginationNumberFormatter={paginationNumberFormatter}
        />
      </div>
    </div>
  );
};
