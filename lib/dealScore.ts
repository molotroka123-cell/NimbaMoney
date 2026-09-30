/**
 * Original 20-second score for the "A deal in 20 seconds" animation.
 * Pure WebAudio synthesis — no audio files, no licensing. Timed to the visual
 * beats (matching 2.5s, split 5.5–8s, execution 8–14.5s, settlement 14.5s,
 * receipt 17.5s). Works on a live AudioContext or an OfflineAudioContext.
 */
export const SCORE_DURATION = 20;
const BPM = 96;
const BEAT = 60 / BPM;

const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

/** Am → F → C → G → C (resolved) */
const CHORDS = [
  { from: 0, to: 5, bass: 45, pad: [57, 60, 64, 69] },
  { from: 5, to: 10, bass: 41, pad: [53, 57, 60, 65] },
  { from: 10, to: 15, bass: 36, pad: [55, 60, 64, 67] },
  { from: 15, to: 17.5, bass: 43, pad: [55, 59, 62, 67] },
  { from: 17.5, to: 20, bass: 36, pad: [60, 64, 67, 72, 76] },
];

type Ctx = BaseAudioContext;

export function scheduleScore(ctx: Ctx, dest: AudioNode, t0: number, from = 0) {
  const at = (t: number) => t0 + (t - from);

  /** one enveloped voice; clips itself when the score is started mid-way */
  const voice = (o: {
    type: OscillatorType;
    freq: number;
    start: number;
    dur: number;
    gain: number;
    attack?: number;
    release?: number;
    detune?: number;
    lp?: number;
    endFreq?: number;
  }) => {
    const end = o.start + o.dur;
    if (end <= from) return;
    const s = Math.max(o.start, from);
    const started = s > o.start;
    const attack = started ? 0.02 : o.attack ?? 0.01;
    const rel = Math.min(o.release ?? 0.2, Math.max(0.03, end - s));
    const osc = ctx.createOscillator();
    osc.type = o.type;
    osc.frequency.setValueAtTime(o.freq, at(s));
    if (o.endFreq) osc.frequency.exponentialRampToValueAtTime(o.endFreq, at(end));
    if (o.detune) osc.detune.value = o.detune;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at(s));
    g.gain.linearRampToValueAtTime(o.gain, at(s) + attack);
    g.gain.setValueAtTime(o.gain, at(Math.max(s + attack, end - rel)));
    g.gain.exponentialRampToValueAtTime(0.0001, at(end));
    let node: AudioNode = osc;
    if (o.lp) {
      const f = ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = o.lp;
      osc.connect(f);
      node = f;
    }
    node.connect(g).connect(dest);
    osc.start(at(s));
    osc.stop(at(end) + 0.05);
  };

  const bell = (t: number, midi: number, gain = 0.16, dur = 1.4) => {
    voice({ type: "sine", freq: hz(midi), start: t, dur, gain, attack: 0.004, release: dur * 0.9 });
    voice({ type: "sine", freq: hz(midi) * 2.01, start: t, dur: dur * 0.5, gain: gain * 0.35, attack: 0.004, release: dur * 0.45 });
    voice({ type: "triangle", freq: hz(midi) * 3.99, start: t, dur: dur * 0.25, gain: gain * 0.12, attack: 0.003, release: dur * 0.2 });
  };

  // shared noise buffer for hats / riser
  const noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.25), ctx.sampleRate);
  {
    const d = noiseBuf.getChannelData(0);
    let seed = 1337;
    for (let i = 0; i < d.length; i++) {
      seed = (seed * 16807) % 2147483647;
      d[i] = (seed / 2147483647) * 2 - 1;
    }
  }
  const hat = (t: number, gain: number) => {
    if (t < from) return;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 7500;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, at(t));
    g.gain.exponentialRampToValueAtTime(0.0001, at(t) + 0.06);
    src.connect(hp).connect(g).connect(dest);
    src.start(at(t));
    src.stop(at(t) + 0.1);
  };
  const kick = (t: number, gain: number) =>
    voice({ type: "sine", freq: 130, endFreq: 42, start: t, dur: 0.22, gain, attack: 0.002, release: 0.2 });

  // ── harmony ────────────────────────────────────────────────────────
  const PAD_LEVEL = [0.55, 0.7, 0.9, 0.95, 1.15];
  CHORDS.forEach((c, ci) => {
    const len = c.to - c.from + 0.6; // overlap for a legato pad
    const bright = c.from >= 17.5;
    c.pad.forEach((m, i) => {
      for (const det of [-7, 7]) {
        voice({
          type: "sawtooth",
          freq: hz(m),
          detune: det + i,
          start: c.from,
          dur: len,
          gain: (bright ? 0.032 : 0.024) * PAD_LEVEL[ci],
          attack: c.from === 0 ? 1.6 : 0.9,
          release: c.to >= 20 ? 1.4 : 0.8,
          lp: bright ? 2600 : 1500,
        });
      }
    });
    voice({ type: "sine", freq: hz(c.bass), start: Math.max(c.from, 2.5), dur: len, gain: ci < 2 ? 0.13 : 0.2, attack: 0.3, release: 0.6 });
  });

  // ── arpeggio (enters with the split, gets busier during execution) ──
  const step = BEAT / 2;
  for (let t = 5.5, k = 0; t < 17.5; t += step, k++) {
    const c = CHORDS.find((x) => t >= x.from && t < x.to) ?? CHORDS[0];
    const tones = c.pad.map((m) => m + 12);
    const m = tones[[0, 1, 2, 3, 2, 1][k % 6] % tones.length];
    const energy = t < 8 ? 0.05 : t < 14.5 ? 0.085 : 0.065;
    voice({ type: "triangle", freq: hz(m), start: t, dur: 0.34, gain: energy, attack: 0.004, release: 0.3, lp: 3200 });
  }

  // ── pulse (execution → settlement) ─────────────────────────────────
  for (let t = 8, k = 0; t < 17.5; t += BEAT, k++) {
    kick(t, k % 4 === 0 ? 0.42 : 0.3);
    hat(t + BEAT / 2, 0.06);
  }

  // ── sound cues locked to the visuals ───────────────────────────────
  bell(2.5, 76, 0.13);                         // matching begins
  [6.3, 7.0, 7.7].forEach((t, i) => bell(t, [81, 84, 88][i], 0.12, 0.9)); // providers appear
  [12.5, 13.5, 14.5].forEach((t, i) => bell(t, [84, 88, 91][i], 0.15, 1.2)); // confirmations
  // settlement riser
  for (let i = 0; i < 6; i++) voice({ type: "sine", freq: hz(72 + i * 2), start: 14.5 + i * 0.05, dur: 1.2, gain: 0.03, attack: 0.3, release: 0.9 });
  // receipt: bell arpeggio + sparkle
  [72, 76, 79, 84, 88].forEach((m, i) => bell(17.5 + i * 0.09, m, 0.17, 2.2));
  [18.3, 18.6, 18.9, 19.15, 19.4].forEach((t, i) => bell(t, [96, 91, 95, 88, 100][i], 0.06, 0.7));
}
