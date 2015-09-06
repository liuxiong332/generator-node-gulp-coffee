
<%= safeSlugname %> = require '../lib/<%= slugname %>'
<% if (testFramework === 'mocha') { %>
should = require('chai').should() <% } %>

describe '<%= safeSlugname %>', ->

  it 'should be awesome', -> <% if (testFramework === 'jasmine') { %>
    expect(<%= safeSlugname %>()).toEqual('awesome')<% } %><% if (testFramework === 'mocha') { %>
    <%= safeSlugname %>().should.equal('awesome')<% } %>
