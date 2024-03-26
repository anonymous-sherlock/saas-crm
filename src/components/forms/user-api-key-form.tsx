"use client";
import { generateNewApiKey, generateNewBearerToken, getUserSecretKeys } from "@/lib/actions/user.action";
import { catchError, cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Label } from "@/ui/label";
import { Separator } from "@/ui/separator";
import Spinner from "@/ui/spinner";
import { Input } from "@nextui-org/react";
import { FC, useState, useTransition } from "react";
import { toast } from "sonner";
import { Icons } from "../Icons";
import { useRouter } from "next/navigation";

interface UserApiKeyFormProps {
  secretKeys: Awaited<ReturnType<typeof getUserSecretKeys>>;
  userId: string;
}
type GenerateKeyType = "API" | "BEARER";
const UserApiKeyForm: FC<UserApiKeyFormProps> = ({ secretKeys, userId }) => {
  const [apiKey, setApiKey] = useState(secretKeys && secretKeys.apiKeys.find((apiKey) => apiKey.active === true)?.key);
  const [bearerToken, setBearerToken] = useState(secretKeys && secretKeys.bearerTokens.find((bearerKey) => bearerKey.active === true)?.key);
  const [isGeneratingApi, startApiTransition] = useTransition();
  const [isGeneratingBearer, startBearerTransition] = useTransition();

  function handleCopy(name: "Api key" | "Bearer Token", valueToCopy: string | undefined | null) {
    if (!valueToCopy) {
      toast.error("Error", { description: `No ${name} Found.` });
      return;
    }
    navigator.clipboard.writeText(valueToCopy);
    toast.success("Copied", {
      description: `${name} copied to clipboard.`,
    });
  }

  const generateKey = async (type: GenerateKeyType) => {
    try {
      if (type === "API") {
        startApiTransition(async () => {
          await generateNewApiKey(userId).then((res) => {
            setApiKey(res.data?.key);
            if (res.success) {
              toast.success("Success", {
                description: "API Key Generated sucessfully",
              });
            } else {
              toast.error("Error", {
                description: res.error ?? `Uh oh! Something went wrong.`,
              });
            }
          });
        });
      } else if (type === "BEARER") {
        startBearerTransition(async () => {
          await generateNewBearerToken(userId).then((res) => {
            setBearerToken(res.data?.key);
            if (res.success) {
              toast.success("Success", {
                description: "Bearer Token Generated sucessfully",
              });
            } else {
              toast.error("Error", {
                description: res.error ?? `Uh oh! Something went wrong.`,
              });
            }
          });
        });
      }
    } catch (error) {
      catchError(error);
    }
  };
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>View and manage your Adscrush API keys.</CardDescription>
        <Separator className="mt-4" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:grid sm:grid-cols-1 lg:grid-cols-5 items-start md:gap-8 space-y-4 ">
          <div className="col-span-3 flex flex-col gap-4 items-start w-full">
            <div className="w-full space-y-2">
              <Label>Api Key</Label>
              <div className="flex justify-center items-center gap-4">
                <Input
                  readOnly
                  placeholder="Generate a new Api key..."
                  isDisabled={isGeneratingApi}
                  size="sm"
                  endContent={
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:border hover:border-primary hover:bg-white rounded-sm -mr-[5px] h-7 w-7"
                      onClick={() => {
                        handleCopy("Api key", apiKey);
                      }}
                    >
                      <Icons.CopyIcon className="text-xl w-7 h-7 text-default-400 flex-shrink-0 p-1" />
                    </Button>
                  }
                  classNames={{ inputWrapper: "border data-[hover=true]:bg-default-100 min-h-unit-6 h-10" }}
                  value={isGeneratingApi ? "Generating Api Key..." : apiKey ? apiKey : ""}
                />
                <Button
                  type="button"
                  className="w-44 mt-0 shrink-0"
                  disabled={isGeneratingApi}
                  onClick={(event) => {
                    event.preventDefault();
                    generateKey("API");
                  }}
                >
                  {isGeneratingApi ? <Spinner /> : "Request Api Key"}
                </Button>
              </div>
            </div>

            <div className="w-full space-y-2">
              <Label>Bearer Key</Label>
              <div className="flex justify-center items-center gap-4">
                <Input
                  readOnly
                  placeholder="Generate a new Bearer Token..."
                  isDisabled={isGeneratingBearer}
                  size="sm"
                  endContent={
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:border hover:border-primary hover:bg-white rounded-sm -mr-[5px] h-7 w-7"
                      onClick={() => {
                        handleCopy("Bearer Token", bearerToken);
                      }}
                    >
                      <Icons.CopyIcon className="text-xl w-7 h-7 text-default-400 flex-shrink-0 p-1" />
                    </Button>
                  }
                  classNames={{ inputWrapper: "border data-[hover=true]:bg-default-100 min-h-unit-6 h-10" }}
                  value={isGeneratingBearer ? "Generating Bearer Token..." : bearerToken ? bearerToken : ""}
                />
                <Button
                  type="button"
                  className="w-44 mt-0 shrink-0"
                  disabled={isGeneratingBearer}
                  onClick={(event) => {
                    event.preventDefault();
                    generateKey("BEARER");
                  }}
                >
                  {isGeneratingBearer ? <Spinner /> : "Request Bearer Token"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserApiKeyForm;
