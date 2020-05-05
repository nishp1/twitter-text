// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import clone from './lib/clone';
import extractHtmlAttrsFromOptions from './extractHtmlAttrsFromOptions';
import htmlEscape from './htmlEscape';
import linkToCashtag from './linkToCashtag';
import linkToHashtag from './linkToHashtag';
import linkToUrl from './linkToUrl';
import linkToMentionAndList from './linkToMentionAndList';

// Default CSS class for auto-linked lists (along with the url class)
const DEFAULT_LIST_CLASS = 'tweet-url list-slug';
// Default CSS class for auto-linked usernames (along with the url class)
const DEFAULT_USERNAME_CLASS = 'tweet-url username';
// Default CSS class for auto-linked hashtags (along with the url class)
const DEFAULT_HASHTAG_CLASS = 'tweet-url hashtag';
// Default CSS class for auto-linked cashtags (along with the url class)
const DEFAULT_CASHTAG_CLASS = 'tweet-url cashtag';

export default function(text, entities, options, supportUnicode) {
  var UnicodeUtils = require('fbjs/lib/UnicodeUtils')
  var options = clone(options || {});
  supportUnicode = supportUnicode || false
  options.hashtagClass = options.hashtagClass || DEFAULT_HASHTAG_CLASS;
  options.hashtagUrlBase = options.hashtagUrlBase || 'https://twitter.com/search?q=%23';
  options.cashtagClass = options.cashtagClass || DEFAULT_CASHTAG_CLASS;
  options.cashtagUrlBase = options.cashtagUrlBase || 'https://twitter.com/search?q=%24';
  options.listClass = options.listClass || DEFAULT_LIST_CLASS;
  options.usernameClass = options.usernameClass || DEFAULT_USERNAME_CLASS;
  options.usernameUrlBase = options.usernameUrlBase || 'https://twitter.com/';
  options.listUrlBase = options.listUrlBase || 'https://twitter.com/';
  options.htmlAttrs = extractHtmlAttrsFromOptions(options);
  options.invisibleTagAttrs = options.invisibleTagAttrs || "style='position:absolute;left:-9999px;'";

  // remap url entities to hash
  var urlEntities, i, len;
  if (options.urlEntities) {
    urlEntities = {};
    for (i = 0, len = options.urlEntities.length; i < len; i++) {
      urlEntities[options.urlEntities[i].url] = options.urlEntities[i];
    }
    options.urlEntities = urlEntities;
  }

  let result = '';
  let beginIndex = 0;

  // sort entities by start index
  entities.sort(function(a, b) {
    return a.indices[0] - b.indices[0];
  });

  const nonEntity = options.htmlEscapeNonEntities
    ? htmlEscape
    : function(text) {
        return text;
      };

  for (var i = 0; i < entities.length; i++) {
    const entity = entities[i];
    result += nonEntity(
      supportUnicode ? UnicodeUtils.substring(text, beginIndex, entity.indices[0]) : text.substring(beginIndex, entity.indices[0])
    );
    if (entity.url) {
      result += linkToUrl(entity, text, options);
    } else if (entity.hashtag) {
      result += linkToHashtag(entity, text, options, supportUnicode);
    } else if (entity.screenName) {
      result += linkToMentionAndList(entity, text, options, supportUnicode);
    } else if (entity.cashtag) {
      result += linkToCashtag(entity, text, options);
    }
    beginIndex = entity.indices[1];
  }
  result += nonEntity(
    supportUnicode ? UnicodeUtils.substring(text, beginIndex, text.length) : text.substring(beginIndex, text.length)
  );
  return result;
}
