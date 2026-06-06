export type WorkletMessage = { type: string };


export default class AudioProcessor extends AudioWorkletProcessor {


  constructor() {
    super();

    //get message to stop the worker
    this.port.onmessage = (event: MessageEvent<WorkletMessage>) => {
     
    };
  }

  /**
   * Worker process of audio data
   * @param {*} inputs
   * @param {*} outputs
   * @returns
   */
  process(inputs: Float32Array[][], outputs: Float32Array[][]) {
    const input: Float32Array[] = inputs[0];

    this.port.postMessage(outputs);

    return true;
  }
}

registerProcessor('audior-worklet', AudioProcessor);
