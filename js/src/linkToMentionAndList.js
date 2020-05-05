// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import clone from './lib/clone';
import htmlEscape from './htmlEscape';
import linkToTextWithSymbol from './linkToTextWithSymbol';

export default function(entity, text, options, supportUnicode) {
  var UnicodeUtils = require('fbjs/lib/UnicodeUtils')
  supportUnicode = supportUnicode || false;
  var at = supportUnicode ? UnicodeUtils.substring(text, entity.indices[0], entity.indices[0] + 1) : text.substring(entity.indices[0], entity.indices[0] + 1);
  const user = htmlEscape(entity.screenName);
  const slashListname = htmlEscape(entity.listSlug);
  const isList = entity.listSlug && !options.suppressLists;
  const attrs = clone(options.htmlAttrs || {});
  attrs['class'] = isList ? options.listClass : options.usernameClass;
  attrs.href = isList ? options.listUrlBase + user + slashListname : options.usernameUrlBase + user;
  if (!isList && !options.suppressDataScreenName) {
    attrs['data-screen-name'] = user;
  }
  if (options.targetBlank) {
    attrs.target = '_blank';
  }

  return linkToTextWithSymbol(entity, at, isList ? user + slashListname : user, attrs, options);
}
