// Sample dictations: synthetic audio in public/samples, and the saved result of one real Gemini + MedGemma run.
// Research prototype. Not a medical device. Not for clinical use.
import type { SampleDictation } from '../dictation';
import matti from './matti-dictation.json';

export const SAMPLE_DICTATIONS: SampleDictation[] = [matti as SampleDictation];
