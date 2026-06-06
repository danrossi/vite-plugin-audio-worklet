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
	let a = n && n.suffix || t, o = n && n.blobURL, s, c = RegExp(`\\${a}$`);
	return {
		name: "worklet-inline",
		enforce: "pre",
		configResolved(e) {
			s = e;
		},
		resolveId: {
			filter: { id: c },
			async handler(e, t, n) {
				let r = e.slice(0, -a.length), i = await this.resolve(r, t, { skipSelf: !0 });
				if (i) return {
					id: i.id + a,
					moduleSideEffects: !1
				};
			}
		},
		load: {
			filter: { id: c },
			async handler(t) {
				let n = t.slice(0, -a.length);
				this.addWatchFile && this.addWatchFile(n);
				let c = (await (await e({
					...s.build.rolldownOptions,
					input: n,
					experimental: { attachDebugInfo: "none" }
				})).generate({
					format: "esm",
					minify: !0,
					comments: !1
				})).output.filter((e) => e.type === "chunk").map((e) => e.code).join("");
				return {
					code: o ? i(c) : r(c),
					map: null
				};
			}
		}
	};
}
//#endregion
export { a as vitePluginAudioWorklet };
