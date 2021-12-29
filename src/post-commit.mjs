import debug from 'debug'

import {
  hasStagedChanges,
  getGitRemoteShowOriginHeadBranch,
  hasGitDiffHeadPackageVersionChanges,
  patchPackageVersion
} from '#hooks/common'

const log = debug('@sequencemedia/hooks:post-commit')
const error = debug('@sequencemedia/hooks:post-commit:error')

log('`@sequencemedia/hooks` is awake')

export default async function postCommit () {
  log('post-commit')

  try {
    if (await hasStagedChanges()) return

    if (await hasGitDiffHeadPackageVersionChanges(await getGitRemoteShowOriginHeadBranch())) return

    await patchPackageVersion()
  } catch ({ code = 'NONE', message = 'No error message defined' }) {
    error({ code, message })
  }
}
