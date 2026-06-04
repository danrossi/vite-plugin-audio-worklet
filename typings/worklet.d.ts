declare module "*?audioworklet" {
	const registerMethod: (audioContext: AudioContext) => Promise<void>;
	export default registerMethod;
}
