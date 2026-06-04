import { rolldown as e } from "rolldown";
//#region src/index.ts
var t = "?audioworklet";
function n() {
	let n = "";
	return {
		name: "worklet-inline",
		enforce: "pre",
		configResolved(e) {
			n = e.mode;
		},
		async resolveId(e, n) {
			if (!e.endsWith(t)) return;
			let r = e.slice(0, -13), i = await this.resolve(r, n, { skipSelf: !0 });
			if (i) return {
				id: i.id + t,
				moduleSideEffects: !1
			};
		},
		async load(r) {
			if (!r.endsWith(t)) return;
			let i = r.slice(0, -13);
			this.addWatchFile && this.addWatchFile(i);
			let a = (await (await e({ input: i })).generate({
				format: "esm",
				minify: n !== "dev"
			})).output.filter((e) => e.type === "chunk").map((e) => e.code).join("");
			return {
				code: `
				let workletLoadedPromise = null;
				export default async function createAudioWorkletFactory(audioContext, options) {
					if (!workletLoadedPromise) {
						const code = ${JSON.stringify(a)};
						const blob = new Blob([code], { type: "application/javascript" });
						workletLoadedPromise = audioContext.audioWorklet.addModule(URL.createObjectURL(blob), options);
					}
					
					return workletLoadedPromise;
					
			}`,
				map: null
			};
		}
	};
}
//#endregion
export { n as vitePluginAudioWorklet };
