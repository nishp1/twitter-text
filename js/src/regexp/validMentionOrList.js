// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import atSigns from './atSigns';
import regexSupplant from '../lib/regexSupplant';
import validMentionPrecedingChars from './validMentionPrecedingChars';

export default function (opts = {}) {
  let screenNameLength = 20
  if (opts.length) {
    screenNameLength = opts.length
  }

  let pathLength = 24
  if (opts.pathLength) {
    pathLength = opts.pathLength
  }

  let screenName = '[a-zA-Z0-9_]'
  let list = '[a-zA-Z0-9_-]'
  if (opts.includePeriod) {
    screenName = '[a-zA-Z0-9_.]'
    list = '[a-zA-Z0-9_.-]'
  }

  return regexSupplant(
    '(#{validMentionPrecedingChars})' + // $1: Preceding character
    '(#{atSigns})' + // $2: At mark
    `(${screenName}{1,${screenNameLength}})` + // $3: Screen name
    `(/[a-zA-Z]${list}{0,${pathLength}})?`, // $4: List (optional)
    { validMentionPrecedingChars, atSigns },
    'g'
  )
};
