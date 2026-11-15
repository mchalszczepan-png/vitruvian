// dictation:transcribe {audioBase64, mimeType, mode}: one recorded clip to Gemini, back as {language, note, english}.
// The audio is passed through and never stored (Gemini is called with store:false). GEMINI_API_KEY stays in Convex env.
// Security: no auth yet (prototype). Research prototype. Not a medical device. Not for clinical use.
import { v } from 'convex/values';
import { action } from './_generated/server';
import { medgemmaCfg } from './core/ports';
import { checkTerms as checkTermsWith, MEDICINE_CHECK_MODEL, transcribe as transcribeClip, type Dictation } from './model/dictation';

/** About 6 min of 16 kbps Opus, as base64. */
const MAX_AUDIO_CHARS = 1_000_000;

export const transcribe = action({
  args: {
    audioBase64: v.string(),
    mimeType: v.string(),
    mode: v.union(v.literal('dictate'), v.literal('visit')),
  },
  returns: v.object({ language: v.union(v.literal('fi'), v.literal('en')), note: v.string(), english: v.string() }),
  handler: async (_ctx, { audioBase64, mimeType, mode }): Promise<Dictation> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('Dictation is not set up (GEMINI_API_KEY)');
    if (!audioBase64) throw new Error('No audio');
    if (audioBase64.length > MAX_AUDIO_CHARS) throw new Error('Recording too long');
    if (!/^audio\/[\w.+-]+(;.*)?$/.test(mimeType)) throw new Error('Not an audio clip');
    // Gemini wants the bare type (no ";codecs=opus").
    return transcribeClip({ audioBase64, mimeType: mimeType.split(';')[0], mode, apiKey });
  },
});

/**
 * dictation:checkTerms {note}: MedGemma 27B lists doubtful medicine or medical terms. Called after the note is shown, so the
 * note never waits on it. 8 s, one try; cold, slow or failed returns no flags. Only the cleaned text is sent, never audio.
 */
export const checkTerms = action({
  args: { note: v.string() },
  returns: v.object({
    model: v.string(),
    flags: v.array(v.object({ text: v.string(), suggestion: v.string(), reason: v.string() })),
  }),
  handler: async (_ctx, { note }) => {
    const cfg = medgemmaCfg(process.env);
    if (!cfg || note.length > 8000) return { model: MEDICINE_CHECK_MODEL, flags: [] };
    const flags = await checkTermsWith(note, { ...cfg, model: MEDICINE_CHECK_MODEL });
    return { model: MEDICINE_CHECK_MODEL, flags };
  },
});
