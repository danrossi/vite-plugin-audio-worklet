/**
 * Vite Plugin Inline Audio Worklet
 * A Vite plugin that compiles AudioWorklet files and inlines them as blob URLs.
 * 
 * Inspired by https://github.com/moq-dev/moq/blob/main/js/common/vite-plugin-worklet.ts
 *
 * Usage: import registerWorklet from "./my-worklet.ts?audioworklet"
 *
 * The worklet file is compiled to JS with all dependencies bundled via rolldown,
 * then inlined as a string. At runtime, a blob URL is created and exported.
 * Register the workiet with the imported function await registerWorklet(aUdioContext);
 * 
 * @author danielr <danielr@electroteque.org>
 */
import { rolldown } from 'rolldown';

import type { Plugin } from "vite";


const SUFFIX = "?audioworklet";

export interface AudioWorkletPluginConfig {
	//customise the suffix
	suffix?: string;
	//return blob url instead of factory method
	blobURL?: boolean;
}

function generateWorkletBlob(compiled: string) {
	return `
		const code = ${JSON.stringify(compiled)};
		const blob = new Blob([code], { type: "application/javascript" });
	`;
}

function generateWorkletFactory(compiled: string) {
	return `
				let workletLoadedPromise = null;
				export default async function createAudioWorkletFactory(audioContext, options) {
					if (!workletLoadedPromise) {
						${generateWorkletBlob(compiled)};
						workletLoadedPromise = audioContext.audioWorklet.addModule(URL.createObjectURL(blob), options);
					}
					
					return workletLoadedPromise;
					
			}`
}

function generateWorkletURL(compiled: string) {
	return `
			${generateWorkletBlob(compiled)};
			export default URL.createObjectURL(blob);
		`;
}


export function vitePluginAudioWorklet(config?: AudioWorkletPluginConfig): Plugin {
	let mode = '';
	let suffix = config && config.suffix || SUFFIX;
	//use the blob url string if set
	let useBlobURL = config && config.blobURL;

	return {
		name: "worklet-inline",
		enforce: "pre",

		configResolved(resolvedConfig) {
			mode = resolvedConfig.mode 
		},
		async resolveId(source, importer) {
			if (!source.endsWith(suffix)) return;

			const cleanSource = source.slice(0, -suffix.length);
			const resolved = await this.resolve(cleanSource, importer, { skipSelf: true });
			if (!resolved) return;

			return { id: resolved.id + suffix, moduleSideEffects: false };
		},

		async load(id) {
			if (!id.endsWith(suffix)) return;

			const filePath = id.slice(0, -suffix.length);

			if (this.addWatchFile) {
				this.addWatchFile(filePath);
			}

			const bundle = await rolldown({
				input: filePath,
				experimental: {
					attachDebugInfo: 'none',
				}
			});

			const result = await bundle.generate({
				format: 'esm',
				minify: true,
				comments: false
			});

			const compiled = result.output.filter(chunk => chunk.type ==="chunk").map(chunk => chunk.code).join("");

			//return a blob url string if set or return a factory method
			const generatedCode = useBlobURL ? generateWorkletURL(compiled) : generateWorkletFactory(compiled);

			
			return {
				code: generatedCode,
				map: null
			};

		},
	};
}
