declare module '@sequencemedia/hooks' {
  export function postCommit(): string
  export const common: {
    OPTIONS: {
      maxBuffer: number
    },
    BRANCH: string,
    PACKAGE_VERSION_CHANGES: RegExp,
    HAS_STAGED_CHANGES: RegExp,
    NOT_STAGED_CHANGES: RegExp,
    use (): Promise<void>,
    trim (): string,
    getGitRemoteShowOriginHeadBranch (): Promise<void>,
    hasGitDiffHeadPackageVersionChanges (): Promise<void>,
    notGitDiffHeadPackageVersionChanges (): Promise<void>,
    hasStagedChanges (): Promise<void>,
    notStagedChanges (): Promise<void>,
    addPackageVersionChanges (): Promise<void>,
    patchPackageVersion (): Promise<void>,
    gitTag (a:string, m?:string): Promise<void>
  }
}
