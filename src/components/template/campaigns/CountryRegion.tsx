"use client";
import { cn } from "@/lib/utils";
import { CampaignFormType } from "@/schema/campaign.schema";
import { Autocomplete, AutocompleteItem, Avatar, Checkbox } from "@nextui-org/react";
import { Country, State } from "country-state-city";
import { ChevronsUpDown } from "lucide-react";
import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "../../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../ui/command";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";

const CountryRegion = () => {
  const [regionOpen, setRegionOpen] = useState(false);
  const { control, getValues, watch, setValue, clearErrors, formState, setError, resetField } = useFormContext<CampaignFormType>();
  const [countryCode, setCountryCode] = useState<string | undefined>(Country.getAllCountries().find((country) => country.name === getValues("targetCountry"))?.isoCode);
  const [stateCode, setStateCode] = useState<string | undefined>("");

  const selectedRegionRef = useRef<Array<string>>(getValues("targetRegion"));
  const handleRegionSelect = (region: string) => {
    const selected = (selectedRegionRef.current = selectedRegionRef.current.includes(region) ? selectedRegionRef.current.filter((r) => r !== region) : [...selectedRegionRef.current, region]);
    const selectedForValidation: [string, ...string[]] = [selected[0], ...selected.slice(1)];
    setValue("targetRegion", selectedForValidation);

    if (selectedRegionRef.current.length === 0) {
      setError("targetRegion", {
        type: "required",
        message: "Please select at least one region.",
      });
    } else {
      clearErrors("targetRegion"); // Remove the error
    }
  };

  function handleCountrySelect(countryName: string) {
    if (countryName === "null" || !countryName) {
      setStateCode("");
      setCountryCode("");
      selectedRegionRef.current = [];
      resetField("targetCountry");
      resetField("targetRegion");
      return;
    }
    const CountryCodeValue = Country.getAllCountries().find((country) => country.name === countryName)?.isoCode;
    setCountryCode(CountryCodeValue);
  }
  const myFilter = (textValue: string, inputValue: string) => {
    if (inputValue.length === 0) {
      return true;
    }
    textValue = textValue.normalize("NFC").toLocaleLowerCase();
    inputValue = inputValue.normalize("NFC").toLocaleLowerCase();
    return textValue.slice(0, inputValue.length) === inputValue;
  };

  return (
    <>
      {/* target country */}
      <FormField
        control={control}
        name="targetCountry"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-card-foreground text-sm">Country</FormLabel>
            <FormControl>
              <Autocomplete
                defaultItems={Country.getAllCountries()}
                defaultFilter={myFilter}
                size="sm"
                variant="faded"
                placeholder="Select Country"
                defaultSelectedKey={countryCode && Country.getCountryByCode(countryCode)?.name}
                aria-label="select a Country"
                startContent={
                  countryCode && (
                    <Avatar
                      alt="country logo"
                      className="text-xl !w-5 !h-5 shrink-0"
                      src={`https://flagcdn.com/${Country.getAllCountries()
                        .find((c) => c.name === getValues("targetCountry"))
                        ?.isoCode.toLowerCase()}.svg`}
                    />
                  )
                }
                onKeyDown={(e: any) => e.continuePropagation()}
                onInputChange={(val) => {
                  if (val === "") {
                    resetField("targetCountry");
                    resetField("targetRegion");
                    selectedRegionRef.current = [];
                  }
                }}
                onSelectionChange={(val) => {
                  val ? setValue("targetCountry", val.toString()) : resetField("targetCountry");
                  resetField("targetRegion");
                  handleCountrySelect(String(val));
                }}
                {...field}
              >
                {(country) => (
                  <AutocompleteItem
                    key={country.name}
                    textValue={country.name}
                    aria-label={country.name}
                    startContent={<Avatar alt={country.name} className="w-6 h-6" src={`https://flagcdn.com/${country.isoCode.toLowerCase()}.svg`} />}
                  >
                    {country.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* target region */}
      <FormField
        control={control}
        name="targetRegion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Target Region</FormLabel>
            <FormControl>
              <Popover isOpen={regionOpen} onOpenChange={setRegionOpen}>
                <PopoverTrigger>
                  <FormControl data-slot="main-wrapper">
                    <Button
                      data-slot="input-wrapper"
                      variant="outline"
                      role="combobox"
                      aria-expanded={regionOpen}
                      className={cn(
                        "relative items-center justify-between w-full flex tap-highlight-transparent shadow-sm border-2  border-default-200 bg-default-100 hover:bg-default-100 text-foreground-500 hover:text-foreground-500 font-normal hover:font-normal focus-visible:bg-default-100 hover:border-default-400 min-h-unit-8 rounded-small gap-0 transition-background !duration-150 transition-colors motion-reduce:transition-none outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background h-12 px-3 py-1 is-filled",
                      )}
                    >
                      {selectedRegionRef.current.length > 0 ? `${selectedRegionRef.current.length}${" "}region selected` : "Select a Region"}
                      <ChevronsUpDown className=" h-3 w-3 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 max-w-[300px] overflow-hidden shadow-small rounded-medium">
                  <Command className="m-0 h-full w-full p-0">
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                      <CommandEmpty>No region found.</CommandEmpty>
                      <CommandGroup heading="Region">
                        {State.getStatesOfCountry(countryCode).map((state, index) => (
                          <CommandItem
                            key={index}
                            value={state.name.toString()}
                            className={cn("capitalize my-2 aria-selected:bg-default-300", selectedRegionRef.current.includes(state.name) && "")}
                            onSelect={() => {
                              handleRegionSelect(state.name);
                            }}
                          >
                            <Checkbox defaultSelected={selectedRegionRef.current.includes(state.name)} isSelected={selectedRegionRef.current.includes(state.name)} size="sm" onChange={() => handleRegionSelect(state.name)} className="w-full">
                              {state.name}
                            </Checkbox>
                            <span className="ml-auto">({state.isoCode})</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default CountryRegion;
