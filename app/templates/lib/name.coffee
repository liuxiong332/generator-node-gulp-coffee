###
 <%= props.name %>
 <%= props.homepage %>

 Copyright (c) <%= currentYear %><% if (props.authorName) { %> <%= props.authorName %><% } %>
 Licensed under the <%= props.license %> license.
###


module.exports = ->
  'awesome'
