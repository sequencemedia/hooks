import debug from 'debug'

import {
  hasStagedChanges,
  getGitRemoteShowOriginHeadBranch,
  getGitRevParseAbbrevRefHead,
  hasGitDiffHeadPackageVersionChanges,
  patchPackageVersion
} from '#hooks/common'

const log = debug('@sequencemedia/hooks:post-commit')
const error = debug('@sequencemedia/hooks:post-commit:error')

log('`@sequencemedia/hooks` is awake')

function handleError ({
  code = 'NONE',
  message = 'NONE'
}) {
  error({ code, message })
}

export default async function postCommit () {
  log('postCommit')

  try {
    if (await hasStagedChanges()) return

    const originHeadBranch = await getGitRemoteShowOriginHeadBranch()
    if (originHeadBranch === await getGitRevParseAbbrevRefHead()) {
      if (await hasGitDiffHeadPackageVersionChanges(originHeadBranch)) return

      await patchPackageVersion()
    }
  } catch (e) { // @ts-expect-error
    handleError(e)
  }
}
