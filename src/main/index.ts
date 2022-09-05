import { Module } from 'node:module'
import { join, dirname } from 'node:path'
import electron from 'electron'
import ProxiedWindow from './browserWindow'

if (!require.main) throw new Error('Cannot find main NodeJS Module.')

const ELECTRON_PATH = require.resolve('electron')
const DISCORD_PATH = join(dirname(require.main.filename), '..', 'app.asar')

const electronCache = require.cache[ELECTRON_PATH]
require.main.filename = join(DISCORD_PATH, 'app_bootstrap/index.js')

if (!electronCache) throw new Error('No module cache entry for "electron"')

// This is a getter so we cannot overwrite it.
delete electronCache.exports
electronCache.exports = { ...electron, BrowserWindow: ProxiedWindow }

const discordPackage = require(join(DISCORD_PATH, 'package.json'))

// @ts-ignore
Module._load(join(discordPath, discordPackage.main), null, true)
