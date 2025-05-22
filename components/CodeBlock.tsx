import React from "react";
import { NodeViewWrapper } from "@tiptap/react";

const CustomCodeBlock = ({ node }: any) => {
  const codeText = node.textContent;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeText);
  };

  return (
    <NodeViewWrapper className="relative border p-4 rounded bg-gray-100 font-mono my-4">
      <div className="text-sm font-semibold text-gray-600 mb-2">
        Code Block:
      </div>
      <pre className="whitespace-pre-wrap break-words">{codeText}</pre>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded hover:bg-blue-600"
      >
        Copy
      </button>
    </NodeViewWrapper>
  );
};

export default CustomCodeBlock;
