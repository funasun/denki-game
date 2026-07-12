// 全音源をWeb Audioで合成する(外部ファイルなし)。
// ambience系は stop 関数を返し、one-shot系は再生秒数を返す。

export type AmbienceFactory = (ctx: AudioContext, dest: AudioNode) => () => void

function noiseBuffer(ctx: AudioContext, seconds = 2): AudioBuffer {
  const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return buf
}

function noiseLoop(ctx: AudioContext): AudioBufferSourceNode {
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer(ctx)
  src.loop = true
  return src
}

const brook: AmbienceFactory = (ctx, dest) => {
  const src = noiseLoop(ctx)
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 550
  bp.Q.value = 0.7
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 2400
  const g = ctx.createGain()
  g.gain.value = 0.05
  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.13
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 120
  lfo.connect(lfoGain).connect(bp.frequency)
  src.connect(bp).connect(lp).connect(g).connect(dest)
  src.start()
  lfo.start()
  return () => {
    src.stop()
    lfo.stop()
  }
}

const wind: AmbienceFactory = (ctx, dest) => {
  const src = noiseLoop(ctx)
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 260
  const g = ctx.createGain()
  g.gain.value = 0.07
  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.07
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 130
  lfo.connect(lfoGain).connect(lp.frequency)
  src.connect(lp).connect(g).connect(dest)
  src.start()
  lfo.start()
  return () => {
    src.stop()
    lfo.stop()
  }
}

const roomtone: AmbienceFactory = (ctx, dest) => {
  const src = noiseLoop(ctx)
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 140
  const g = ctx.createGain()
  g.gain.value = 0.025
  src.connect(lp).connect(g).connect(dest)
  src.start()
  return () => src.stop()
}

function chirp(ctx: AudioContext, dest: AudioNode, t: number) {
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  const base = 2300 + Math.random() * 1700
  const dur = 0.12 + Math.random() * 0.2
  osc.frequency.setValueAtTime(base, t)
  osc.frequency.exponentialRampToValueAtTime(base * (0.7 + Math.random() * 0.7), t + dur)
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(0.035, t + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(g).connect(dest)
  osc.start(t)
  osc.stop(t + dur + 0.05)
}

const birds: AmbienceFactory = (ctx, dest) => {
  let alive = true
  const schedule = () => {
    if (!alive) return
    const t = ctx.currentTime + 0.05
    const n = 1 + Math.floor(Math.random() * 3)
    for (let i = 0; i < n; i++) chirp(ctx, dest, t + i * (0.15 + Math.random() * 0.12))
    timer = window.setTimeout(schedule, 1200 + Math.random() * 2800)
  }
  let timer = window.setTimeout(schedule, 300)
  return () => {
    alive = false
    clearTimeout(timer)
  }
}

const crickets: AmbienceFactory = (ctx, dest) => {
  let alive = true
  const burst = () => {
    if (!alive) return
    const t = ctx.currentTime + 0.05
    const n = 4 + Math.floor(Math.random() * 3)
    for (let i = 0; i < n; i++) {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.frequency.value = 4100 + Math.random() * 300
      const start = t + i * 0.07
      g.gain.setValueAtTime(0, start)
      g.gain.linearRampToValueAtTime(0.012, start + 0.01)
      g.gain.linearRampToValueAtTime(0, start + 0.04)
      osc.connect(g).connect(dest)
      osc.start(start)
      osc.stop(start + 0.06)
    }
    timer = window.setTimeout(burst, 700 + Math.random() * 900)
  }
  let timer = window.setTimeout(burst, 200)
  return () => {
    alive = false
    clearTimeout(timer)
  }
}

const crowd: AmbienceFactory = (ctx, dest) => {
  // 開演前のざわめき(帯域ノイズ+ゆらぎ)
  const src = noiseLoop(ctx)
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 520
  bp.Q.value = 0.6
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 1400
  const g = ctx.createGain()
  g.gain.value = 0.045
  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.21
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 0.014
  lfo.connect(lfoGain).connect(g.gain)
  src.connect(bp).connect(lp).connect(g).connect(dest)
  src.start()
  lfo.start()
  return () => {
    src.stop()
    lfo.stop()
  }
}

const storm: AmbienceFactory = (ctx, dest) => {
  // 雨(高めのノイズ)+ときどき遠雷
  const rain = noiseLoop(ctx)
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 2800
  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 500
  const g = ctx.createGain()
  g.gain.value = 0.035
  rain.connect(hp).connect(lp).connect(g).connect(dest)
  rain.start()

  let alive = true
  let timer = 0
  const rumble = () => {
    if (!alive) return
    const src = ctx.createBufferSource()
    src.buffer = noiseBuffer(ctx, 3)
    const rlp = ctx.createBiquadFilter()
    rlp.type = 'lowpass'
    rlp.frequency.value = 110
    const rg = ctx.createGain()
    const t = ctx.currentTime + 0.05
    rg.gain.setValueAtTime(0, t)
    rg.gain.linearRampToValueAtTime(0.22, t + 0.5)
    rg.gain.exponentialRampToValueAtTime(0.0001, t + 2.8)
    src.connect(rlp).connect(rg).connect(dest)
    src.start(t)
    src.stop(t + 3)
    timer = window.setTimeout(rumble, 7000 + Math.random() * 12000)
  }
  timer = window.setTimeout(rumble, 2500)
  return () => {
    alive = false
    clearTimeout(timer)
    rain.stop()
  }
}

export const AMBIENCES: Record<string, AmbienceFactory> = {
  brook,
  wind,
  birds,
  crickets,
  roomtone,
  crowd,
  storm,
}

// ---- one-shots ----

function pianoNote(
  ctx: AudioContext,
  dest: AudioNode,
  freq: number,
  t: number,
  dur: number,
  vel = 1,
) {
  const partials: [number, number][] = [
    [1, 0.5],
    [2, 0.18],
    [3, 0.07],
    [4.2, 0.02],
  ]
  for (const [mult, amp] of partials) {
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.frequency.value = freq * mult
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(amp * vel * 0.22, t + 0.008)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.connect(g).connect(dest)
    osc.start(t)
    osc.stop(t + dur + 0.1)
  }
}

const NOTE: Record<string, number> = {
  C3: 130.81, 'C#3': 138.59, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, G3: 196.0,
  'G#3': 207.65, A3: 220.0, Bb3: 233.08, B3: 246.94,
  C4: 261.63, 'C#4': 277.18, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, 'F#4': 369.99,
  G4: 392.0, 'G#4': 415.3, A4: 440.0, Bb4: 466.16, B4: 493.88,
  C5: 523.25, 'C#5': 554.37, D5: 587.33, 'D#5': 622.25, E5: 659.25, F5: 698.46,
}

// 単音のピアノ ── その場で鍵盤を押す行為(ActivityDef.piano)用。
// dest に聴力チェーンの input を渡すので、耳が悪ければこの一音もこもって遠ざかる。
export function playPianoTone(
  ctx: AudioContext,
  dest: AudioNode,
  noteName: string,
  dur = 1.6,
  vel = 0.9,
): number {
  const freq = NOTE[noteName]
  if (!freq) return 0
  pianoNote(ctx, dest, freq, ctx.currentTime + 0.02, dur, vel)
  return dur
}

function pianoFragment(ctx: AudioContext, dest: AudioNode): number {
  // ニ短調の静かな分散和音 → 和音(自作の短い断片)
  const t0 = ctx.currentTime + 0.05
  const seq: [string, number, number][] = [
    ['D3', 0.0, 2.0],
    ['A3', 0.5, 1.8],
    ['D4', 1.0, 1.6],
    ['F4', 1.5, 1.6],
    ['A4', 2.0, 1.8],
    ['F4', 2.6, 1.4],
    ['E4', 3.2, 1.4],
    ['D4', 3.8, 2.6],
    ['D3', 4.4, 3.0],
    ['A3', 4.4, 3.0],
    ['F4', 4.42, 3.0],
  ]
  for (const [n, dt, dur] of seq) pianoNote(ctx, dest, NOTE[n], t0 + dt, dur)
  return 7.6
}

function fluteMelody(ctx: AudioContext, dest: AudioNode): number {
  // 羊飼いの笛 — 牧歌的な旋律(三角波)。聴力チェーンを通るため、耳が悪いとほぼ聞こえない
  const t0 = ctx.currentTime + 0.05
  const seq: [string, number, number][] = [
    ['F5', 0.0, 0.5], ['A4', 0.5, 0.4], ['C5', 0.9, 0.5], ['D5', 1.5, 0.4],
    ['C5', 1.9, 0.4], ['A4', 2.3, 0.6], ['F5', 3.0, 0.5], ['E5', 3.5, 0.4],
    ['D5', 3.9, 0.4], ['C5', 4.3, 0.9],
  ]
  for (const [n, dt, dur] of seq) {
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.value = NOTE[n]
    const t = t0 + dt
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.05, t + 0.05)
    g.gain.setValueAtTime(0.05, t + dur - 0.08)
    g.gain.linearRampToValueAtTime(0, t + dur)
    osc.connect(g).connect(dest)
    osc.start(t)
    osc.stop(t + dur + 0.05)
  }
  return 5.4
}

function quill(ctx: AudioContext, dest: AudioNode): number {
  const t0 = ctx.currentTime + 0.05
  for (let i = 0; i < 6; i++) {
    const src = ctx.createBufferSource()
    src.buffer = noiseBuffer(ctx, 0.5)
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 1600 + Math.random() * 600
    bp.Q.value = 1.2
    const g = ctx.createGain()
    const t = t0 + i * 0.45 + Math.random() * 0.1
    const dur = 0.25 + Math.random() * 0.15
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.03, t + 0.05)
    g.gain.linearRampToValueAtTime(0, t + dur)
    src.connect(bp).connect(g).connect(dest)
    src.start(t)
    src.stop(t + dur + 0.05)
  }
  return 3.2
}

function pianoLesson(ctx: AudioContext, dest: AudioNode): number {
  // 幼年期の練習曲(ハ長調の音階)── 最後に「楽譜にない」和音をひとつ重ねる
  const t0 = ctx.currentTime + 0.05
  const scale: [string, number][] = [
    ['C4', 0.0], ['D4', 0.28], ['E4', 0.56], ['F4', 0.84], ['G4', 1.12],
    ['A4', 1.4], ['G4', 1.75], ['E4', 2.03], ['C4', 2.31],
  ]
  for (const [n, dt] of scale) pianoNote(ctx, dest, NOTE[n], t0 + dt, 0.8, 0.85)
  // 即興の和音(叱られる音)
  for (const n of ['C4', 'E4', 'A4', 'D5']) pianoNote(ctx, dest, NOTE[n], t0 + 3.1, 2.4, 0.9)
  return 5.6
}

function stringsNote(
  ctx: AudioContext,
  dest: AudioNode,
  freq: number,
  t: number,
  dur: number,
  vel = 1,
) {
  // 弦楽合奏風: デチューンした鋸波の束+1オクターブ下
  for (const [mult, det, amp] of [
    [1, -4, 0.09], [1, 3, 0.09], [1, 0, 0.1], [0.5, 0, 0.12],
  ] as const) {
    const osc = ctx.createOscillator()
    const lp = ctx.createBiquadFilter()
    const g = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.value = freq * mult
    osc.detune.value = det
    lp.type = 'lowpass'
    lp.frequency.value = 1900
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(amp * vel, t + 0.04)
    g.gain.setValueAtTime(amp * vel, t + Math.max(0.05, dur - 0.12))
    g.gain.linearRampToValueAtTime(0, t + dur)
    osc.connect(lp).connect(g).connect(dest)
    osc.start(t)
    osc.stop(t + dur + 0.05)
  }
}

function fifthMotif(ctx: AudioContext, dest: AudioNode): number {
  // ハ短調交響曲の冒頭動機(タ・タ・タ・ター)
  const t0 = ctx.currentTime + 0.1
  const hit = (n: string, dt: number, dur: number) =>
    stringsNote(ctx, dest, NOTE[n], t0 + dt, dur, 1)
  hit('G4', 0.0, 0.22)
  hit('G4', 0.26, 0.22)
  hit('G4', 0.52, 0.22)
  hit('Eb4', 0.78, 1.9)
  hit('Eb3', 0.78, 1.9)
  hit('F4', 3.0, 0.22)
  hit('F4', 3.26, 0.22)
  hit('F4', 3.52, 0.22)
  hit('D4', 3.78, 2.4)
  hit('D3', 3.78, 2.4)
  return 6.6
}

function odeFragment(ctx: AudioContext, dest: AudioNode): number {
  // 「歓喜の歌」主題の断片(ニ長調)── 遠くの合奏のように柔らかく
  const t0 = ctx.currentTime + 0.1
  const b = 0.42
  const melody: [string, number, number][] = [
    ['F#4', 0, 1], ['F#4', 1, 1], ['G4', 2, 1], ['A4', 3, 1],
    ['A4', 4, 1], ['G4', 5, 1], ['F#4', 6, 1], ['E4', 7, 1],
    ['D4', 8, 1], ['D4', 9, 1], ['E4', 10, 1], ['F#4', 11, 1],
    ['F#4', 12, 1.5], ['E4', 13.5, 0.5], ['E4', 14, 2],
  ]
  for (const [n, beat, len] of melody) {
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.value = NOTE[n]
    const t = t0 + beat * b
    const dur = len * b
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.07, t + 0.05)
    g.gain.setValueAtTime(0.07, t + Math.max(0.06, dur - 0.09))
    g.gain.linearRampToValueAtTime(0, t + dur)
    osc.connect(g).connect(dest)
    osc.start(t)
    osc.stop(t + dur + 0.05)
  }
  // 低弦の持続音
  stringsNote(ctx, dest, NOTE['D3'], t0, 16 * b, 0.45)
  return 16 * b + 0.4
}

function applause(ctx: AudioContext, dest: AudioNode): number {
  // 万雷の拍手 ── 聴力チェーンを通るため、耳が閉ざされていればほぼ無音になる
  const t0 = ctx.currentTime + 0.05
  const total = 6.5
  for (let i = 0; i < 220; i++) {
    const src = ctx.createBufferSource()
    src.buffer = noiseBuffer(ctx, 0.06)
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 1400 + Math.random() * 2200
    bp.Q.value = 2.5
    const g = ctx.createGain()
    const t = t0 + Math.random() * total
    const env = Math.min(1, (t - t0) / 0.8) * Math.min(1, (t0 + total - t) / 1.2)
    g.gain.setValueAtTime(0.05 * env, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
    src.connect(bp).connect(g).connect(dest)
    src.start(t)
    src.stop(t + 0.06)
  }
  // 歓声のうねり
  const roar = ctx.createBufferSource()
  roar.buffer = noiseBuffer(ctx, total)
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 900
  const rg = ctx.createGain()
  rg.gain.setValueAtTime(0, t0)
  rg.gain.linearRampToValueAtTime(0.05, t0 + 1.2)
  rg.gain.linearRampToValueAtTime(0, t0 + total)
  roar.connect(lp).connect(rg).connect(dest)
  roar.start(t0)
  roar.stop(t0 + total)
  return total
}

function thunder(ctx: AudioContext, dest: AudioNode): number {
  const t0 = ctx.currentTime + 0.05
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer(ctx, 4)
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 140
  const g = ctx.createGain()
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(0.55, t0 + 0.12)
  g.gain.exponentialRampToValueAtTime(0.12, t0 + 1.2)
  g.gain.linearRampToValueAtTime(0.3, t0 + 1.6)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 3.6)
  src.connect(lp).connect(g).connect(dest)
  src.start(t0)
  src.stop(t0 + 3.8)
  return 3.8
}

function moonlightFragment(ctx: AudioContext, dest: AudioNode): number {
  // 嬰ハ短調ソナタ第1楽章 ── 三連符の波と低い持続音
  const t0 = ctx.currentTime + 0.05
  pianoNote(ctx, dest, NOTE['C#3'], t0, 4.4, 0.8)
  const triplet = ['G#3', 'C#4', 'E4']
  for (let i = 0; i < 9; i++) {
    pianoNote(ctx, dest, NOTE[triplet[i % 3]], t0 + i * 0.47, 0.9, 0.55)
  }
  pianoNote(ctx, dest, NOTE['A3'], t0 + 4.23, 3.4, 0.75)
  for (let i = 0; i < 6; i++) {
    pianoNote(ctx, dest, NOTE[['A3', 'C#4', 'E4'][i % 3]], t0 + 4.23 + i * 0.47, 0.9, 0.5)
  }
  pianoNote(ctx, dest, NOTE['G#4'], t0 + 4.5, 0.4, 0.7)
  pianoNote(ctx, dest, NOTE['G#4'], t0 + 4.94, 2.6, 0.75)
  return 7.8
}

function pathetiqueFragment(ctx: AudioContext, dest: AudioNode): number {
  // 変イ長調の緩徐楽章 ── 歌うような主題と静かな伴奏
  const t0 = ctx.currentTime + 0.05
  const melody: [string, number, number][] = [
    ['C5', 0.0, 1.1], ['Bb4', 1.1, 0.55], ['G#4', 1.65, 1.1], ['Bb4', 2.75, 0.55],
    ['C5', 3.3, 0.55], ['C#5', 3.85, 0.55], ['C5', 4.4, 0.55], ['Bb4', 4.95, 1.8],
  ]
  for (const [n, dt, dur] of melody) pianoNote(ctx, dest, NOTE[n], t0 + dt, dur, 0.85)
  for (let i = 0; i < 12; i++) {
    pianoNote(ctx, dest, NOTE[i % 2 === 0 ? 'G#3' : 'Eb4'], t0 + i * 0.55, 0.7, 0.32)
  }
  return 7.2
}

function eroicaFragment(ctx: AudioContext, dest: AudioNode): number {
  // 変ホ長調交響曲の第一主題 ── 低弦の分散和音と、逸脱する半音
  const t0 = ctx.currentTime + 0.1
  stringsNote(ctx, dest, NOTE['Eb3'], t0, 2.2, 0.5)
  const melody: [string, number, number][] = [
    ['Eb4', 0.0, 0.55], ['G4', 0.55, 0.55], ['Eb4', 1.1, 0.55], ['Bb3', 1.65, 0.55],
    ['Eb4', 2.2, 0.55], ['G4', 2.75, 0.55], ['Bb4', 3.3, 0.85],
    ['D4', 4.15, 0.6], ['C#4', 4.75, 1.9],
  ]
  for (const [n, dt, dur] of melody) stringsNote(ctx, dest, NOTE[n], t0 + dt, dur, 0.9)
  stringsNote(ctx, dest, NOTE['Eb3'], t0 + 2.2, 1.9, 0.5)
  return 7.0
}

function furEliseFragment(ctx: AudioContext, dest: AudioNode): number {
  // イ短調のバガテル ── ためらうような半音のゆらぎ
  const t0 = ctx.currentTime + 0.05
  const s = 0.32
  const melody: [string, number, number][] = [
    ['E5', 0, 1], ['D#5', 1, 1], ['E5', 2, 1], ['D#5', 3, 1], ['E5', 4, 1],
    ['B4', 5, 1], ['D5', 6, 1], ['C5', 7, 1], ['A4', 8, 2.6],
    ['C4', 11, 1], ['E4', 12, 1], ['A4', 13, 1], ['B4', 14, 2.6],
    ['E4', 17, 1], ['G#4', 18, 1], ['B4', 19, 1], ['C5', 20, 3.4],
  ]
  for (const [n, beat, len] of melody)
    pianoNote(ctx, dest, NOTE[n], t0 + beat * s, Math.max(0.5, len * s * 1.4), 0.8)
  pianoNote(ctx, dest, NOTE['A3'], t0 + 8 * s, 1.0, 0.55)
  pianoNote(ctx, dest, NOTE['E3'], t0 + 14 * s, 1.0, 0.55)
  pianoNote(ctx, dest, NOTE['A3'], t0 + 20 * s, 1.6, 0.55)
  return 20 * s + 1.8
}

export const ONESHOTS: Record<string, (ctx: AudioContext, dest: AudioNode) => number> = {
  'piano-fragment': pianoFragment,
  'flute-melody': fluteMelody,
  quill,
  'piano-lesson': pianoLesson,
  'fifth-motif': fifthMotif,
  'ode-fragment': odeFragment,
  applause,
  thunder,
  moonlight: moonlightFragment,
  pathetique: pathetiqueFragment,
  eroica: eroicaFragment,
  'fur-elise': furEliseFragment,
}

export function footstep(ctx: AudioContext, dest: AudioNode) {
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer(ctx, 0.1)
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 380
  const g = ctx.createGain()
  const t = ctx.currentTime
  g.gain.setValueAtTime(0.09, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09)
  src.connect(lp).connect(g).connect(dest)
  src.start(t)
  src.stop(t + 0.1)
}
