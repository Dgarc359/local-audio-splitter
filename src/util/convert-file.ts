
import { fork } from "child_process";
import { join } from "path";

export const convertFile = () => {
  fork(
    join(__dirname, 'child.js'), 
    ['demucs', '--two-stems=vocals', 'input.mp3'], 
    {
      stdio: 'pipe'
    }
  )
}

