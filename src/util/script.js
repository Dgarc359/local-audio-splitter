/* eslint-disable no-restricted-globals */
const path = require('path')

// Listen to messages from parent thread
self.addEventListener('message', (event) => {
  console.log('Worker received message:', event.data)
  // Do some calculations and send the result back to parent thread
  let parsedPath = path.parse('C:/test')
  self.postMessage({result: parsedPath})
})