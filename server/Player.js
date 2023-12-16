const _ = require('lodash');

const Player = module.exports = function (_node) {
  _.extend(this, _node.properties);
  this.id = this.tmdbId;
  this.username = this.username;
};