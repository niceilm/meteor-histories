Histories = new Mongo.Collection("histories");
Histories.helpers({
  getUser: function() {
    return Meteor.users.findOne(this.userId);
  },
  convertActionToLabel: function() {
    return _.result(_.find(Histories.actionTypes, {value: this.action}), 'label');
  }
});

Histories.collectionTypes = [
  {value: "vip", label: "VIP"},
  {value: "channel", label: "CHANNEL"}
];

Histories.ActionType = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete"
};

Histories.actionTypes = [
  {value: Histories.ActionType.CREATE, label: "생성"},
  {value: Histories.ActionType.UPDATE, label: "수정"},
  {value: Histories.ActionType.DELETE, label: "삭제"}
];

Histories.findByQuery = findByQuery;

/**
 *
 * @param {Object} query
 * @param {Number} limit
 * @returns {*}
 */
function findByQuery(query, limit) {
  check(query, Object);
  check(limit, Match.Optional(Number));
  var searchQuery = {};
  var searchSort = [["createdAt", "desc"]];

  //if(query.order && query.order !== "createdAt") {
  //  searchSort.unshift([query.order, "desc"]);
  //}
  //
  if(query.collection && query.collection != "-1") {
    searchQuery.collection = query.collection;
  }

  if(query.action && query.action != "-1") {
    searchQuery.action = query.action;
  }

  if(query.userId && query.userId != "-1") {
    searchQuery.userId = query.userId;
  }

  if(query.targetId && query.targetId != "-1") {
    searchQuery.targetId = query.targetId;
  }

  $log.debug("searchQuery : ", searchQuery);
  return Histories.find(searchQuery, {limit: limit || 0, sort: searchSort});
}