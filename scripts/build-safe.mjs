/**
 * Production builds run inside /var/www. A previous build often leaves dist
 * owned by root, so Vite's emptyDir step dies with EACCES on unlink.
 * When dist is writable, this is a normal `vite build`. When it is not,
 * the new output is written to a fresh folder and the old dist directory
 * is renamed aside. Renaming does not need permission to delete the files inside.
 */
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const root = process.cwd()
const dist = path.join(root, 'dist')
const extraArgs = process.argv.slice(2)

function canWrite(dir) {
  try {
    fs.accessSync(dir, fs.constants.W_OK)
    return true
  } catch {
    return false
  }
}

function distIsWritable() {
  if (!fs.existsSync(dist)) return true
  if (!canWrite(dist)) return false
  const assets = path.join(dist, 'assets')
  if (fs.existsSync(assets) && !canWrite(assets)) return false
  return true
}

function viteBin() {
  const viteDir = path.dirname(require.resolve('vite/package.json'))
  return path.join(viteDir, 'bin', 'vite.js')
}

function runVite(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [viteBin(), 'build', ...args], {
      cwd: root,
      stdio: 'inherit',
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`vite build exited with ${code ?? 1}`))
    })
  })
}

async function removeDir(dir) {
  await fs.promises.rm(dir, { recursive: true, force: true })
}

async function buildInPlace() {
  await runVite(extraArgs)
}

async function buildBySwap() {
  if (!canWrite(root)) {
    console.error(
      `\nThis user cannot write in ${root}, so dist cannot be replaced.\n` +
        'Run this once on the server, then build again:\n' +
        `  sudo chown -R "$(whoami)" ${dist}\n`,
    )
    process.exit(1)
  }

  const next = path.join(root, 'dist-next')
  try {
    await removeDir(next)
  } catch (err) {
    console.error(
      `\nCould not clear ${next}.\n  ${err.message}\n` +
        `Remove it once with: sudo rm -rf ${next}\n`,
    )
    process.exit(1)
  }

  await runVite([...extraArgs, '--outDir', 'dist-next', '--emptyOutDir'])

  const prev = path.join(root, `dist-prev-${Date.now()}`)
  if (fs.existsSync(dist)) {
    try {
      await fs.promises.rename(dist, prev)
    } catch (err) {
      console.error(
        `\nThe new build is in dist-next, but the old dist folder could not be moved aside.\n` +
          `  ${err.message}\n` +
          'Run this once on the server, then build again:\n' +
          `  sudo chown -R "$(whoami)" ${dist}\n`,
      )
      process.exit(1)
    }
  }

  await fs.promises.rename(next, dist)

  try {
    await removeDir(prev)
  } catch {
    console.warn(
      `\nNew build is live in dist. Previous files remain in ${path.basename(prev)} ` +
        'because this user cannot delete them.\n' +
        `Remove them once with: sudo rm -rf ${prev}\n`,
    )
  }
}

if (distIsWritable()) {
  await buildInPlace()
} else {
  console.warn(
    'dist is not writable by this user. Building into a new folder and swapping it into place.',
  )
  await buildBySwap()
}
