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


export function vitePluginAudioWorklet(): Plugin {
	let mode = '';
	return {
		name: "worklet-inline",
		enforce: "pre",

		configResolved(resolvedConfig) {
			mode = resolvedConfig.mode 
		},
		async resolveId(source, importer) {
			if (!source.endsWith(SUFFIX)) return;

			const cleanSource = source.slice(0, -SUFFIX.length);
			const resolved = await this.resolve(cleanSource, importer, { skipSelf: true });
			if (!resolved) return;

			return { id: resolved.id + SUFFIX, moduleSideEffects: false };
		},

		async load(id) {
			if (!id.endsWith(SUFFIX)) return;

			const filePath = id.slice(0, -SUFFIX.length);

			if (this.addWatchFile) {
				this.addWatchFile(filePath);
			}

			const bundle = await rolldown({
				input: filePath,
				
			});

			const result = await bundle.generate({
				format: 'esm',
				minify: mode !== 'dev'
			});

			const compiled = result.output.filter(chunk => chunk.type ==="chunk").map(chunk => chunk.code).join("");

			const generatedCode = `
				let workletLoadedPromise = null;
				export default async function createAudioWorkletFactory(audioContext, options) {
					if (!workletLoadedPromise) {
						const code = ${JSON.stringify(compiled)};
						const blob = new Blob([code], { type: "application/javascript" });
						workletLoadedPromise = audioContext.audioWorklet.addModule(URL.createObjectURL(blob), options);
					}
					
					return workletLoadedPromise;
					
			}`;

			return {
				code: generatedCode,
				map: null
			};

		},
	};
}
