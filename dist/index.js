import { rolldown as e } from "rolldown";
//#region src/index.ts
var t = "?audioworklet";
function n(e) {
	return `
		const code = ${JSON.stringify(e)};
		const blob = new Blob([code], { type: "application/javascript" });
	`;
}
function r(e) {
	return `
				let workletLoadedPromise = null;
				export default async function createAudioWorkletFactory(audioContext, options) {
					if (!workletLoadedPromise) {
						${n(e)};
						workletLoadedPromise = audioContext.audioWorklet.addModule(URL.createObjectURL(blob), options);
					}
					
					return workletLoadedPromise;
					
			}`;
}
function i(e) {
	return `
			${n(e)};
			export default URL.createObjectURL(blob);
		`;
}
function a(n) {
	let a = n && n.suffix || t, o = n && n.blobURL;
	return {
		name: "worklet-inline",
		enforce: "pre",
		configResolved(e) {
			e.mode;
		},
		async resolveId(e, t) {
			if (!e.endsWith(a)) return;
			let n = e.slice(0, -a.length), r = await this.resolve(n, t, { skipSelf: !0 });
			if (r) return {
				id: r.id + a,
				moduleSideEffects: !1
			};
		},
		async load(t) {
			if (!t.endsWith(a)) return;
			let n = t.slice(0, -a.length);
			this.addWatchFile && this.addWatchFile(n);
			let s = (await (await e({
				input: n,
				experimental: { attachDebugInfo: "none" }
			})).generate({
				format: "esm",
				minify: !0,
				comments: !1
			})).output.filter((e) => e.type === "chunk").map((e) => e.code).join("");
			return {
				code: o ? i(s) : r(s),
				map: null
			};
		}
	};
}
//#endregion
export { a as vitePluginAudioWorklet };
