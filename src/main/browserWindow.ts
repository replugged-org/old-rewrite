import { join } from 'node:path'
import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'

export enum DiscordWindowEnv {
  Unknown,
  Client,
  Popout,
  Splash,
  Overlay,
}

export function getDiscordWindowEnv(windowOptions: BrowserWindowConstructorOptions) {
  if ('webContents' in windowOptions) return DiscordWindowEnv.Popout
  if (windowOptions.webPreferences?.nodeIntegration) return DiscordWindowEnv.Splash
  if (windowOptions.webPreferences?.offscreen) return DiscordWindowEnv.Overlay
  if (windowOptions.webPreferences?.preload) {
    if (windowOptions.webPreferences.nativeWindowOpen) return DiscordWindowEnv.Client
    return DiscordWindowEnv.Splash
  }
  return DiscordWindowEnv.Unknown
}

export const ProxiedWindow = new Proxy(BrowserWindow, {
  construct(target, [windowOptions]: [BrowserWindowConstructorOptions], _) {
    const windowEnv = getDiscordWindowEnv(windowOptions)

    if (windowEnv === DiscordWindowEnv.Client) {
      // TODO: store original preload
      windowOptions.webPreferences!.preload = join(__dirname, './preload.js')
    }

    const win = new target(windowOptions)
    return win
  }
})

export default ProxiedWindow
