"use client";
import { BulkUploadLeadsSchema, CSVLeadsColumnMapping, CustomCSVLeadType, LeadSchema } from "@/schema/lead.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { Column, ReactGrid, Row } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import xlsx, { IJsonSheet } from "json-as-xlsx";
import { UploadIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FileWithPath } from "react-dropzone";
import { useForm } from "react-hook-form";
import * as xlsxSheetToJson from "xlsx";
import { z } from "zod";
import { FileUploadWithoutUT } from "../global/file-upload-without-ut";
import { FormError } from "../global/form-error";
import { FormSuccess } from "../global/form-success";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { Separator } from "../ui/separator";

const getPeople = (): z.infer<typeof BulkUploadLeadsSchema>[] => [{ campaign_code: "hi", name: "Thomas", city: "Goldman", address: "", phone: "", country: "" }];

const getColumns = (): Column[] =>
  CSVLeadsColumnMapping.map((column) => ({
    columnId: column.value,
    width: 150,
    reorderable: false,
  }));

const headerRow: Row = {
  rowId: "header",
  cells: CSVLeadsColumnMapping.map((column) => ({
    type: "header",
    text: column.value,
  })),
};

const getRows = (people: z.infer<typeof BulkUploadLeadsSchema>[]): Row[] => [
  headerRow,
  ...people.map<Row>((person, idx) => ({
    rowId: idx,
    cells: [
      { type: "text", text: person.campaign_code ?? "" },
      { type: "text", text: person.name ?? "" },
      { type: "text", text: person.phone ?? "" },
      { type: "text", text: person.email ?? "" },
      { type: "text", text: person.address ?? "" },
      { type: "text", text: person.country ?? "" },
      { type: "text", text: person.region ?? "" },
      { type: "text", text: person.street ?? "" },
      { type: "text", text: person.city ?? "" },
      { type: "text", text: person.website ?? "" },
      { type: "text", text: person.zipcode ?? "" },
      { type: "text", text: person.description ?? "" },
    ],
  })),
];

const formSchema = z.object({ name: z.string().optional() });
const DEFAULT_REACT_TABLE_COLUMN_WIDTH = 150;

interface ValidationResult {
  validRowsCount: number;
  invalidRowsCount: number;
  data: z.infer<typeof formSchema>[];
  errors: z.ZodError[];
}

const UploadLeadFromExcel = () => {
  const [people] = React.useState<z.infer<typeof BulkUploadLeadsSchema>[]>(getPeople());
  const columns = getColumns();
  const rows = getRows(people);
  const [filterValue, setFilterValue] = React.useState("");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<CustomCSVLeadType[]>([]);
  const [openTableModal, setOpenTableModal] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<FileWithPath | undefined>();
  const [inValidRows, setInValidRows] = useState<string[]>([]); // State variable to store indices of invalid rows
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const mapDataKeys = (data: any[]) => {
    return data.map((row) => {
      const mappedRow: Record<string, any> = {};
      CSVLeadsColumnMapping.forEach(({ label, value }) => {
        mappedRow[value] = row[label];
      });
      return mappedRow;
    });
  };

  const ValidateFile = async () => {
    setError("");
    let validRowsCount = 0;
    let invalidRowsCount = 0;
    let result: ValidationResult["data"] = [];
    const errors: z.ZodError[] = [];

    const promise = new Promise<ValidationResult>((resolve, reject) => {
      const fileReader = new FileReader();
      if (!selectedFile) return;
      fileReader.readAsArrayBuffer(selectedFile);
      fileReader.onload = (event) => {
        const arrayBuffer = event.target?.result;
        const workbook = xlsxSheetToJson.read(arrayBuffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data: { [key: string]: string | number }[] = xlsxSheetToJson.utils.sheet_to_json(sheet, { defval: "" });
        const keys = Object.keys(data[0] as any);

        // Converting data array into the format of dataDum
        const newData = data.map((obj: { [key: string]: string | number }) => {
          return keys.map((key) => {
            return { value: obj[key] ? obj[key].toString() : "" };
          });
        });

        const mappedData = mapDataKeys(data);
        const dataMapedArray = mappedData.map((item: Record<string, any>) => ({
          campaign_code: item.campaign_code ?? "",
          name: item.name || "",
          phone: String(item.phone) || "",
          address: item.address || "",
          email: item.email || "",
          description: item.description || "",
          country: item.country || "",
          region: item.region || "",
          city: item.city || "",
          street: item.street || "",
          zipcode: item.zipcode || "",
          website: item.website || "",
        }));
        setData(dataMapedArray);
        const parsedData = dataMapedArray.filter((val, index) => {
          const parsed = LeadSchema.safeParse(val);
          if (parsed.success) {
            validRowsCount++;
            result.push(parsed.data);
            return true;
          } else {
            invalidRowsCount++;
            errors.push(parsed.error);
            console.error("Parsing problem with row:", val);
            setInValidRows((prev) => [...prev, index.toString() ?? ""]);
            return false;
          }
        });
        resolve({ validRowsCount, invalidRowsCount, data: parsedData as ValidationResult["data"], errors });
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    const response = await promise;
    console.log(response.errors);
    if (response.invalidRowsCount > 0) {
      setError(`There are ${response.invalidRowsCount} rows which are invalid. Please fix them before uploading, otherwise they won't be processed.`);
    }
  };

  useEffect(() => {
    ValidateFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile]);

  async function onSubmit(values: z.infer<typeof formSchema>) {}

  const downloadSampleLeadFile = () => {
    let columns: IJsonSheet[] = [
      {
        sheet: "leads_template",
        columns: CSVLeadsColumnMapping,
        content: [],
      },
    ];
    let settings = {
      fileName: `Sample Leads Template`.toLocaleLowerCase().replaceAll(" ", "-"),
    };
    xlsx(columns, settings);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <UploadIcon className="w-5 h-5 mr-2" />
        Upload Leads
      </Button>
      <Modal
        backdrop="opaque"
        isOpen={open}
        size="lg"
        onOpenChange={setOpen}
        scrollBehavior="inside"
        classNames={{ backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20", wrapper: "[--slide-exit:0px]" }}
        placement="auto"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3>Upload Leads</h3>
                <p className="text-xs text-muted-foreground flex flex-wrap justify-between items-center gap-2">
                  <span>Upload excel or csv file to upload leads.</span>
                  <Button variant="link" className="!text-sm inline-flex p-0 md:ml-auto !h-10" onClick={downloadSampleLeadFile}>
                    Downlaod sample CSV
                  </Button>
                </p>
                <Separator className="mt-4" />
              </ModalHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} method="post" className="flex flex-col gap-4 mb-4">
                  <ModalBody>
                    <FileUploadWithoutUT selectedFile={selectedFile} setSelectedFile={setSelectedFile} fakeSimulationTime={1000} />
                    <FormSuccess message={success} classname="col-span-3 !mt-0" />
                    <FormError message={error} classname="col-span-3 !mt-0" />
                    <Button type="submit" disabled={!selectedFile}>
                      Upload File
                    </Button>
                    {data?.length > 0 && (
                      <Button
                        onClick={() => {
                          setOpenTableModal(true);
                        }}
                        variant="outline"
                      >
                        Edit Data
                      </Button>
                    )}
                  </ModalBody>
                </form>
              </Form>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        backdrop="opaque"
        isOpen={openTableModal}
        size="5xl"
        onOpenChange={setOpenTableModal}
        scrollBehavior="inside"
        classNames={{ backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20", wrapper: "[--slide-exit:0px]" }}
        placement="auto"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3>Edit Data</h3>
                <p className="text-xs text-muted-foreground flex flex-wrap justify-between items-center gap-2">
                  <span>Edit Lead Details Before uploading leads.</span>
                </p>
                <Separator className="mt-4" />
              </ModalHeader>
              <ModalBody>
                <ReactGrid rows={rows} columns={columns} />

                <Button ></Button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UploadLeadFromExcel;
