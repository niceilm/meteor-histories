Package.describe({
  name: 'flynn:histories',
  version: '0.0.2',
  // Brief, one-line summary of the package.
  summary: 'collection histories',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  "deep-diff": "0.3.2"
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  api.export('Histories');
  api.use('ecmascript');
  api.use('mongo');
  api.use('matb33:collection-hooks@0.8.1');
  api.use('reywood:publish-composite@1.4.2');
  api.use('aldeed:simple-schema@1.3.3');
  api.use('tmeasday:publish-counts@0.7.2');
  api.use('flynn:logger@0.0.2');
  api.use('flynn:base-schema@0.0.1');
  api.addFiles('histories.js');
  api.addFiles('histories_server.js', "server");
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('flynn:histories');
  api.addFiles('histories-tests.js');
});
