HistorySchema = new SimpleSchema([BaseSchema, {
  action: {
    type: String, label: "액션",
    allowedValues: [
      Histories.ActionType.CREATE,
      Histories.ActionType.UPDATE,
      Histories.ActionType.DELETE
    ]
  },
  collection: {type: String, label: "컬렉션이름"},
  targetId: {type: String, label: "타겟아이디"},
  json: {type: Object, label: "json", optional: true, blackbox: true}
}]);
Histories.attachSchema(HistorySchema);

Histories.attachHistory = function(collection) {
  collection.after.insert(_.partialRight(insertByCreate, collection));
  collection.after.update(_.partialRight(insertByUpdate, collection));
  collection.after.remove(_.partialRight(insertByDelete, collection));
};
Meteor.publishComposite("historiesByQuery", historiesByQuery);

function insertByCreate(userId, doc, collection) {
  Histories.insert({
    action: Histories.ActionType.CREATE,
    collection: collection._name,
    json: doc,
    targetId: doc._id,
    userId: userId
  });
}
function insertByUpdate(userId, doc, fieldNames, modifier, options, collection) {
  //$log.debug("Vips.after.update", arguments);
  var diff = Npm.require('deep-diff').diff;
  var updatedValue = {};
  _.each(_.reject(diff(this.previous, doc), {path: ["updatedAt"]}), function(diff) {
    updatedValue[diff.path] = diff.rhs;
  });
  if(_.size(updatedValue) === 0) {
    return;
  }
  Histories.insert({
    action: Histories.ActionType.UPDATE,
    collection: collection._name,
    json: updatedValue,
    targetId: doc._id,
    userId: userId
  });
}
function insertByDelete(userId, doc, collection) {
  //$log.debug("Vips.after.remove", arguments);
  Histories.insert({
    action: Histories.ActionType.DELETE,
    collection: collection._name,
    json: doc,
    targetId: doc._id,
    userId: userId
  });
}

function historiesByQuery(query, limit) {
  $log.debug('[publish] historiesByQuery', arguments);
  check(query, Object);
  check(limit, Number);

  limit = NUTIL.normalizeLimit(limit, 200);

  return {
    find: function() {
      Counts.publish(this, 'histories-of-counter', Histories.findByQuery(query));
      return Histories.findByQuery(query, limit);
    },
    children: [
      {
        find: function userByUserId(item) {
          return Meteor.users.find(item.userId, {fields: {username: 1}});
        }
      }
    ]
  }
}