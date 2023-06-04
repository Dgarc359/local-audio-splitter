import { ipcRenderer } from "electron";
import { MessageEventPayload } from "../util";
console.log("preloading...");

process.once('loaded', () => {
  console.log("loaded... \nadding listeners...");
  window.addEventListener('message',  async (event: MessageEvent<MessageEventPayload>) => { 
    if(event.data.type === 'convert') {
      console.log("Got convert event"); 
      // event.payload.
      // console.log(JSON.stringify(event.data.payload.size));
      console.log(event.data.payload.name);
      const deepCloneEvent = JSON.parse(JSON.stringify(event.data.payload));
      const ipcRendererRes = ipcRenderer.send('convert', deepCloneEvent);
      ipcRenderer.on('convert-reply', (event, arg) => {
        console.log('finished converting')
      })
      // if(typeof event.data.payload === typeof File) {
      //   console.log("found file");
      // } else if (typeof event.data.payload === typeof Blob) {
      //   console.log("found blob");
      // } 
    }

  })
})
