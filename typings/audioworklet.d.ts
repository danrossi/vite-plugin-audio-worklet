export type AudioWorkletFactory = (audioContext: AudioContext) => Promise<void>;

declare module "*?audioworklet" {
	const registerMethodOrBlobURL: AudioWorkletFactory | string;
	export default registerMethodOrBlobURL;
}