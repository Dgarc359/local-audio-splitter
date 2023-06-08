import { ipcRenderer } from "electron";
import { ConvertMessageEventPayload, MessageEventPayload } from "../util";
import * as _ from "lodash";
console.log("preloading...");

process.once("loaded", () => {
  console.log("loaded... \nadding listeners...");
  window.addEventListener(
    "message",
    async (
      event: MessageEvent<MessageEventPayload >
    ) => {
      if (event.data.type === "convert") {
        console.log("Got convert event");
        if (event.data.type && event.data.fileName) {
          console.log("event.data", event.data.base64File, event.data.fileName);

          // const payload = JSON.parse(event.data.payload);
          // console.log("payload", payload);
          const ipcRendererRes = ipcRenderer.send(
            "convert",
            event.data.base64File,
            event.data.fileName
          );
          ipcRenderer.on("convert-reply", (event, arg) => {
            console.log("finished converting");
          });
        }
        // if(typeof event.data.payload === typeof File) {
        //   console.log("found file");
        // } else if (typeof event.data.payload === typeof Blob) {
        //   console.log("found blob");
        // }
      }

      if (event.data.type === "read-temp-dir") {
        console.log("reading temp dir");
        const ipcRendererRes = ipcRenderer.send("read-temp-dir");
        ipcRenderer.on("read-temp-dir-reply", (event, arg) => {
          console.log("read temp dir", arg);
          document.getElementById('files-list')?.dispatchEvent(new window.CustomEvent('change', {detail: arg, bubbles: true}))
        });
      }
    }
  );
});
