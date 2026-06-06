import registeAudioWorklet from './workers/AudioProcessor?audioworklet';

const context = new AudioContext();
registeAudioWorklet(context);