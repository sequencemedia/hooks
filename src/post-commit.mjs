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
  log('postCommit')

  try {
    if (await hasStagedChanges()) return

    if (await hasGitDiffHeadPackageVersionChanges(await getGitRemoteShowOriginHeadBranch())) return

    await patchPackageVersion()
  } catch ({
    message = 'No error message defined'
  }) {
    error(message)
  }
}
