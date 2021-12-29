import gulp from 'gulp'

import postCommit from '#hooks/post-commit'

gulp
  .task('post-commit', postCommit)

gulp
  .task('default', gulp.series('post-commit'))
