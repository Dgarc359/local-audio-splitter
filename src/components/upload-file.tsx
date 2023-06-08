import React from "react";
import {ConvertMessageEventPayload, MessageEventPayload} from '../../util';
import { TempDirectoryList } from "./temp-directory-list";

export const UploadFile = () => {
  const inputFileRef = React.useRef<HTMLInputElement>(null);
  const [filenameState, setFileNameState] = React.useState<string | null>(null);
  const [unsplitFileState, setUnsplitFileState] = React.useState<File | null>(null);
  const [splitFileState, setSplitFileState] = React.useState<File | null>(null);

  return (
    <div
      style={{
        marginTop: "1rem",
        marginBottom: "1rem",
      }}
    >
      {/* upload file */}
      <input
        type="file"
        ref={inputFileRef}
        style={{ display: "none" }}
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            const file = files[0];
            console.log(file);
            // check if file is .mp3, if it is, set state, else alert user
            if (file.type === "audio/mpeg") {
              setFileNameState(file.name);
              setUnsplitFileState(file);
            } else {
              alert("Please upload an .mp3 file");
            }
          }
        }}
      />
      <button
        onClick={() => {
          if (inputFileRef.current) {
            inputFileRef.current.click();
          }
        }}
      >
        Upload File
      </button>
      {/* display uploaded file name if one is uploaded */}
      {filenameState && <div
        style={{
          marginTop: "1rem",
          marginBottom: "1rem",
        }}
      >Uploaded file: {filenameState}</div>}

      {/* confirm file upload with a button that says 'convert' */}
      {filenameState && <button
        onClick={async () => {
          // check if file is uploaded
          if (filenameState) {
            // convert file
            // alert user that file is being converted
            alert("File is being converted");
            // convert fileState to blob if not null
            if (unsplitFileState) {
              const blob = new Blob([unsplitFileState], { type: "audio/mpeg" });
              console.log("blob", structuredClone(blob));
              
              // encode blob to base64
              const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                  resolve(reader.result);
                };
                reader.onerror = reject;
              }).then(res => res);

              const postMessagePayload: MessageEventPayload = {
                type: 'convert',
                base64File: base64 as string,
                fileName: String(unsplitFileState.name)
              }
              window.postMessage(postMessagePayload)
            }
          } else {
            // alert user to upload file
            alert("Please upload a file");
          }
        }}
      >
        Convert
      </button>}

      { unsplitFileState && <TempDirectoryList />}
    </div>
  );
};
