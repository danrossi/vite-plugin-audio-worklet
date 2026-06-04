# vite-plugin-audio-worklet
Vite plugin that inlines audio worklets with a helper method for registering them.

This should be universal with rollup-plugin-web-worker-loader apart from the change in the import syntax.

## Basic

```ts
import { defineConfig } from "vite";
import { vitePluginAudioWorklet } from "vite-plugin-audio-worklet";

export default defineConfig({
  plugins: [
    vitePluginAudioWorklet()
  ]
});
```

## Code Usage

### Example Worklet processor

```js
export default class AudioProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super(options);
  }

  process(inputs, outputs) {
    const input = inputs[0];
    let output = [];
    this.port.postMessage(output);
    return true;
  }
}

try {
registerProcessor("audioworklet", AudioProcessor);
} catch (e) {}
```

### Example Worklet Register

```js
import registerWorklet from './worklet.ts?audioworklet';

class AudioWorklet extends AudioWorkletNode {
  constructor(audioContext) {
    super(audioContext, 'audioworklet');
  }
}

//Inernally checks if already registered
await registerWorklet(audioContext);
const worklet = new AudioWorklet(audioContext);
```

### Audio Worklet Module

Include the `worklet.d.ts` typings into the typescript config to recognise the audioworklet source

```
"include": [
    "src",
    "./node_modules/vite-plugin-audio-worklet/typings/worklet.d.ts",
  ]
  ```