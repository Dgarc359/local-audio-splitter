import { ipcRenderer } from "electron";
import { MessageEventPayload } from "../util";
import * as _ from 'lodash';
console.log("preloading...");

process.once('loaded', () => {
  console.log("loaded... \nadding listeners...");
  window.addEventListener('message',  async (event: MessageEvent<MessageEventPayload>) => { 
    if(event.data.type === 'convert') {
      console.log("Got convert event"); 
      console.log("event.data", event.data.payload)
   
      // const payload = JSON.parse(event.data.payload);
      // console.log("payload", payload);
      
      const ipcRendererRes = ipcRenderer.send('convert', event.data.payload);
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
