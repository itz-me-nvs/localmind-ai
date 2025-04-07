"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"


interface ComboboxProps<T extends string | {value: string, label: string}> {
    className?: string,
    comboBoxList: T[],
    selectedItemHandler: (item: string) => void,
    placeHolder?: string
}

export function Combobox<T extends string | {value: string, label: string}>({comboBoxList, className, placeHolder, selectedItemHandler}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("0")


  const normalizeList = comboBoxList.map(item => {
    if(typeof item == 'string'){
        return {
            value: item,
            label: item}
    }
    return item
  }) as {value: string, label: string}[]
  

  const selectedTool = normalizeList.find((framework) => framework.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? selectedTool?.label
            : placeHolder || 'Select'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No items found.</CommandEmpty>
            <CommandGroup>
              {normalizeList.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    selectedItemHandler(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
