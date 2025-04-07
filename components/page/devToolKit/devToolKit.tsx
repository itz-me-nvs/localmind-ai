import { Combobox } from "@/components/ui/comboBox";
import { Label } from "@/components/ui/label";
import React from "react";
import APIRequestBuilder from "./tools/apiCallBuilder";
import Base64EncoderTool from "./tools/base64Encoder";
import EncryptionTester from "./tools/encryptionTool";
import FileToBase64Converter from "./tools/fileToBase64Convertor";
import GitCommandGenerator from "./tools/gitCommandGenerator";
import JSONFormatter from "./tools/jsonFormater";
import JWTDecoder from "./tools/jwtEncoder";
import MockDataGenerator from "./tools/mockGenerator";
import TextCaseConverter from "./tools/testCaseConvertor";
import UUIDGenerator from "./tools/UUIDGenerator";

export default function DevToolKit() {
    const [selectedTool, setSelectedTool] = React.useState('0');

    const devToolList = [{
        value: '0',
        label: "JSON Formatter"
    }
,
{
    value: '1',
    label: "JWT Encoder/Decoder"
},
{
    value: '2',
    label: "Base64 Encoder/Decoder"
},
{
    value: '3',
    label: "Text case convertor"
},
{
    value: '4',
    label: "UUID generator"
},
{
    value: '5',
    label: "Encryption/Decryption tester"
},
{
    value: '6',
    label: "Mock data generator"
},
{
    value: '7',
    label: "API call builder"
},
{
    value: '8',
    label: "Git command generator"  
},
{
    value: '9',
    label: "File to base64 converter"  
},
]

    const handleSelectedTool = (value: any) => {
        console.log("value", value);
        setSelectedTool(value);
    }

    return (
        <div>
            <div className="flex flex-col gap-3">
                <Label className="text-sm text-gray-500"> Select Tool</Label>
                <Combobox comboBoxList={devToolList} selectedItemHandler={handleSelectedTool} />

                <div className="">
                    {selectedTool == '0' && <JSONFormatter />}
                    {selectedTool == '1' && <JWTDecoder />}
                    {selectedTool == '2' && <Base64EncoderTool />}
                    {selectedTool == '3' && <TextCaseConverter />}
                    {selectedTool == '4' && <UUIDGenerator />}
                    {selectedTool == '5' && <EncryptionTester />}
                    {selectedTool == '6' && <MockDataGenerator />}
                    {selectedTool == '7' && <APIRequestBuilder />}
                    {selectedTool == '8' && <GitCommandGenerator />}
                    {selectedTool == '9' && <FileToBase64Converter />}
                </div>
            </div>
        </div>
    )
}