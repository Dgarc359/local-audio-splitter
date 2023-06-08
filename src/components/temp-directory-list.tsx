import { MessageEventPayload } from "../../util";
import React from "react";

export const TempDirectoryList = () => {
  const [filesList, setFilesList] = React.useState<string[] | null>(null);

  window.addEventListener("change", (event) => {
    // console.log("bubbled event", event.);
        
    // setFilesList(event.detail!)
    
  });

  return (
    <>
      <div
        style={{
          marginTop: "2rem",
        }}
      >
        {/* button that sends read-temp-dir event to window on click */}
        <button
          onClick={() => {
            console.log("reading temp dir");
            const postMessagePayload: MessageEventPayload = {
              type: "read-temp-dir",
            };
            window.postMessage(postMessagePayload);
          }}
        >
          Read Temp Directory
        </button>
        

        <h1>Files List</h1>

        <div id="files-list">
          {filesList &&
            filesList.map((file, index) => {
              return <div key={index}>{file}</div>;
            })}
        </div>
      </div>
    </>
  );
};
