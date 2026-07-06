import { AMBIENCES, ONESHOTS, footstep } from './synth'

// 運命パラメータ(聴力 0-1)を音響写像に変換する共通エンジン。
// 全音源は input → lowpass → hearingGain → master を必ず通る。
// hearing が下がると: カットオフ低下(こもる)・音量低下(遠ざかる)・耳鳴りが浮上。
class AudioEngine {
  private ctx: AudioContext | null = null
  private input!: GainNode
  private lowpass!: BiquadFilterNode
  private hearingGain!: GainNode
  private tinnitusGain!: GainNode
  private ambienceStops: Array<{ stop: () => void; gain: GainNode }> = []
  private ambienceKey = ''
  private hearing = 1

  ensureStarted() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume()
      return
    }
    const ctx = new AudioContext()
    this.ctx = ctx
    this.input = ctx.createGain()
    this.lowpass = ctx.createBiquadFilter()
    this.lowpass.type = 'lowpass'
    this.hearingGain = ctx.createGain()
    const master = ctx.createGain()
    master.gain.value = 1
    this.input.connect(this.lowpass).connect(this.hearingGain).connect(master)
    master.connect(ctx.destination)

    // 耳鳴り(聴力チェーンを通らず、頭の中で直接鳴る)
    const tinnitus = ctx.createOscillator()
    tinnitus.frequency.value = 3600
    this.tinnitusGain = ctx.createGain()
    this.tinnitusGain.gain.value = 0
    tinnitus.connect(this.tinnitusGain).connect(master)
    tinnitus.start()

    this.applyHearing(this.hearing, 0.01)
  }

  get started() {
    return !!this.ctx
  }

  setHearing(h: number, rampSec = 0.8) {
    this.hearing = h
    if (this.ctx) this.applyHearing(h, rampSec)
  }

  private applyHearing(h: number, rampSec: number) {
    const ctx = this.ctx!
    const t = ctx.currentTime + Math.max(0.01, rampSec)
    const cutoff = 150 + 7850 * h * h
    const gain = 0.15 + 0.85 * h
    const tinn = Math.max(0, 0.8 - h) ** 2 * 0.15
    this.lowpass.frequency.exponentialRampToValueAtTime(Math.max(cutoff, 60), t)
    this.hearingGain.gain.linearRampToValueAtTime(gain, t)
    this.tinnitusGain.gain.linearRampToValueAtTime(tinn, t)
  }

  setAmbience(ids: string[]) {
    const key = ids.slice().sort().join(',')
    if (!this.ctx || key === this.ambienceKey) return
    this.ambienceKey = key
    const ctx = this.ctx
    for (const { stop, gain } of this.ambienceStops) {
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5)
      setTimeout(stop, 1700)
    }
    this.ambienceStops = []
    for (const id of ids) {
      const factory = AMBIENCES[id]
      if (!factory) continue
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.5)
      gain.connect(this.input)
      const stop = factory(ctx, gain)
      this.ambienceStops.push({ stop, gain })
    }
  }

  playOneShot(id: string): number {
    if (!this.ctx) return 0
    const fn = ONESHOTS[id]
    if (!fn) return 0
    return fn(this.ctx, this.input)
  }

  footstep() {
    if (this.ctx) footstep(this.ctx, this.input)
  }
}

export const audio = new AudioEngine()
