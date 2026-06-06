declare module "*?audioworklet" {
	const registerMethodOrBlobURL: ((audioContext: AudioContext) => Promise<void>) | string;
	export default registerMethodOrBlobURL;
}

declare module "*?worklet" {
	const url: string;
	export default url;
}
