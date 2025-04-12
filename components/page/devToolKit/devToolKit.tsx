"use client";

import { Combobox } from "@/components/ui/comboBox";
import React from "react";
import APIRequestBuilder from "./tools/apiCallBuilder";
import Base64EncoderTool from "./tools/base64Encoder";
import CommonSnippets from "./tools/commonSnippets";
import EncryptionTester from "./tools/encryptionTool";
import FileToBase64Converter from "./tools/fileToBase64Convertor";
import GitCommandGenerator from "./tools/gitCommandGenerator";
import JSONFormatter from "./tools/jsonFormater";
import JWTDecoder from "./tools/jwtEncoder";
import MockDataGenerator from "./tools/mockGenerator";
import TextCaseConverter from "./tools/textCaseConvertor";
import UUIDGenerator from "./tools/UUIDGenerator";

import { AnimatePresence, motion } from "framer-motion";

export default function DevToolKit() {
  const [selectedTool, setSelectedTool] = React.useState("0");

  const devToolList = [
    { value: "0", label: "JSON Formatter", description: "Format & validate JSON data" },
    { value: "1", label: "JWT Encoder/Decoder", description: "Decode or encode JWT tokens" },
    { value: "2", label: "Base64 Encoder/Decoder", description: "Convert text to/from Base64" },
    { value: "3", label: "Text Case Converter", description: "Change text to camelCase, snake_case, etc." },
    { value: "4", label: "UUID Generator", description: "Generate universally unique IDs" },
    { value: "5", label: "Encryption/Decryption Tester", description: "Encrypt or decrypt strings using keys" },
    { value: "6", label: "Mock Data Generator", description: "Generate test data for APIs and UI" },
    { value: "7", label: "API Call Builder", description: "Build and test API requests" },
    { value: "8", label: "Git Command Generator", description: "Get Git commands based on actions" },
    { value: "9", label: "File to Base64 Converter", description: "Convert files to base64 string" },
    { value: "10", label: "Code Snippet Generator", description: "Generate reusable code snippets" },
  ];

  const handleSelectedTool = (value: any) => {
    setSelectedTool(value);
  };

  const SelectedToolComponent = () => {
    switch (selectedTool) {
      case "0":
        return <JSONFormatter />;
      case "1":
        return <JWTDecoder />;
      case "2":
        return <Base64EncoderTool />;
      case "3":
        return <TextCaseConverter />;
      case "4":
        return <UUIDGenerator />;
      case "5":
        return <EncryptionTester />;
      case "6":
        return <MockDataGenerator />;
      case "7":
        return <APIRequestBuilder />;
      case "8":
        return <GitCommandGenerator />;
      case "9":
        return <FileToBase64Converter />;
      case "10":
        return <CommonSnippets />;
      default:
        return null;
    }
  };

  const selectedToolMeta = devToolList.find((tool) => tool.value === selectedTool);

  return (
    <div className="w-full mx-auto p-2 ">
      <div className="space-y-2 flex items-center justify-end">
        <Combobox
          defaultValue="0"
          comboBoxList={devToolList.map(({ value, label }) => ({ value, label }))}
          selectedItemHandler={handleSelectedTool}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
        className="w-full"
          key={selectedTool}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
        >
         <SelectedToolComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
