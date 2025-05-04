import debug from 'debug'

import {
  exec
} from 'node:child_process'

const log = debug('@sequencemedia/hooks:common')

log('`@sequencemedia/hooks` is awake')

export const OPTIONS = {
  maxBuffer: 1024 * 500
}

export const BRANCH = 'master'

export const PACKAGE_VERSION_CHANGES = /\-+\s+"version":\s+"(\d+\.\d+\.\d+)",+\s+\++\s+"version":\s+"(\d+\.\d+\.\d+)",+\s+/ /* eslint-disable-line no-useless-escape */

export const HAS_STAGED_CHANGES = /Changes to be committed/s

export const NOT_STAGED_CHANGES = /Changes not staged for commit/s

export const trim = (v = '') => String(v).split('\n').map((v) => v.trimEnd()).join('\n').trim()

/**
 *  @param {string} key
 *  @returns {(v: string) => void}
 */
export function use (key) {
  const log = debug(`@sequencemedia/hooks:common:${key}`)

  /**
   *  @param {string} v
   *  @returns {void}
   */
  return function use (v) {
    log(trim(v))
  }
}

export function getGitRemoteShowOriginHeadBranch () {
  log('getGitRemoteShowOriginHeadBranch')

  return (
    new Promise((resolve, reject) => {
      const command = 'git remote show origin | awk \'/HEAD branch/ {print $NF}\''

      const {
        stdout,
        stderr
      } = exec(command, OPTIONS, (e, v) => (!e) ? resolve(trim(v)) : reject(e))

      if (stdout) stdout.on('data', use('git-remote-show-origin-head-branch'))
      if (stderr) stderr.on('data', use('git-remote-show-origin-head-branch'))
    })
  )
}

export function getGitRevParseAbbrevRefHead () {
  log('getGitRevParseAbbrevRefHead')

  return (
    new Promise((resolve, reject) => {
      const command = 'git rev-parse --abbrev-ref HEAD'

      const {
        stdout,
        stderr
      } = exec(command, OPTIONS, (e, v) => (!e) ? resolve(trim(v)) : reject(e))

      if (stdout) stdout.on('data', use('git-rev-parse-head'))
      if (stderr) stderr.on('data', use('git-rev-parse-head'))
    })
  )
}

export function hasGitDiffHeadPackageVersionChanges (branch = BRANCH) {
  log('hasGitDiffHeadPackageVersionChanges')

  return (
    new Promise((resolve, reject) => {
      exec(`git diff HEAD~1..HEAD~0 -- origin/${branch} package.json`, OPTIONS, async (e, v) => (!e) ? resolve(PACKAGE_VERSION_CHANGES.test(v) === true) : reject(e))
    })
  )
}

export function notGitDiffHeadPackageVersionChanges (branch = BRANCH) {
  log('notGitDiffHeadPackageVersionChanges')

  return (
    new Promise((resolve, reject) => {
      exec(`git diff HEAD~1..HEAD~0 -- origin/${branch} package.json`, OPTIONS, async (e, v) => (!e) ? resolve(PACKAGE_VERSION_CHANGES.test(v) !== true) : reject(e))
    })
  )
}

export function hasStagedChanges () {
  log('hasStagedChanges')

  return (
    new Promise((resolve, reject) => {
      exec('git status', OPTIONS, (e, v) => (!e) ? resolve(HAS_STAGED_CHANGES.test(v)) : reject(e))
    })
  )
}

export function notStagedChanges () {
  log('notStagedChanges')

  return (
    new Promise((resolve, reject) => {
      exec('git status', OPTIONS, (e, v) => (!e) ? resolve(NOT_STAGED_CHANGES.test(v)) : reject(e))
    })
  )
}

export function addPackageVersionChanges () {
  log('addPackageVersionChanges')

  return (
    new Promise((resolve, reject) => {
      exec('git add package.json package-lock.json', OPTIONS, (e, v) => (!e) ? resolve(v) : reject(e))
    })
  )
}

export function patchPackageVersion () {
  log('patchPackageVersion')

  return (
    new Promise((resolve, reject) => {
      exec('npm version patch -m "%s" -n --no-commit-hooks', OPTIONS, (e, v) => (!e) ? resolve(v) : reject(e))
    })
  )
}

export function gitTag (a = '0.0.0', m = a) {
  log('gitTag')

  return (
    new Promise((resolve, reject) => {
      exec(`git tag -a v${a} -m "${m}"`, OPTIONS, (e, v) => (!e) ? resolve(v) : reject(e))
    })
  )
}
