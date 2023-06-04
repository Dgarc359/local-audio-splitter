import React from "react";
import { convertFile } from "../util/convert-file";
import {MessageEventPayload} from '../../util';
// import process for web worker
// import process from 'process'
// import path from "path";
import {join} from 'path-browserify'
// @ts-ignore

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
              
              // await execSync('demucs')
              // convertFile();
              // process.dlopen = () => {
              //   throw new Error('Load native module is not safe')
              // }
              // const worker = new Worker(Path.join(__dirname, 'src/util/script.js'))


              const blob = new Blob([unsplitFileState], { type: "audio/mpeg" });
              const postMessagePayload: MessageEventPayload = {
                type: 'convert',
                payload: unsplitFileState
              }
              window.postMessage(postMessagePayload)
              // console.log(blob);
              // download blob to local machine
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.setAttribute("download", filenameState);
              a.click();
              a.parentNode?.removeChild(a);
              setFileNameState(null);
            }
          } else {
            // alert user to upload file
            alert("Please upload a file");
          }
        }}
      >
        Convert
      </button>}

      
    </div>
  );
};
