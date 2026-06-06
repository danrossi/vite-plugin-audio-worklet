import type { Plugin } from "vite";
export interface AudioWorkletPluginConfig {
    suffix?: string;
    blobURL?: boolean;
}
export declare function vitePluginAudioWorklet(config?: AudioWorkletPluginConfig): Plugin;
