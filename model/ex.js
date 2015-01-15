var async = require('async'),
    config = require('../config/config'),
    neo4j = require('neo4j'),
    UserRepository = require('../model/UserRepository'),
    userRepository = new UserRepository(),
    Favorite = require('./Favorite'),
    db = new neo4j.GraphDatabase(config.db.url);

function FavoriteRepository() {}

/**
 * Returns a list of all nodes that are linked as _favors_ from a given user node.
 *
 * @param muid
 * @param {Function} callback Is called when the operation completes or an error occurs
 * @param {Error} callback.err Error object if an error occured, otherwise null
 * @param {Node} callback.node The node from the database that was saved
 */
FavoriteRepository.prototype.list = function (muid, callback) {
    var query = [
        "START n=node:INDEX_NAME(INDEX_KEY='INDEX_VALUE')",
        "MATCH n-[:FAVORS_REL]->f",
        "WHERE n.muid! = {muid}",
        "RETURN f"
    ]
    .join('\n')
    .replace(/INDEX_NAME/g, config.db.index.name)
    .replace(/INDEX_KEY/g, config.db.index.key)
    .replace(/INDEX_VALUE/g, config.db.index.value.user)
    .replace(/FAVORS_REL/g, config.db.relationships.favors);

    var params = {
        muid: muid
    };

    async.waterfall([
        function (callback) {
            db.query(query, params, callback);
        },
        function (results, callback) {
            var i, favorite, favorites = [];

            if (results.length > 0) {
                for (i = 0; favorite = results[i]; i++) {
                    favorites.push(new Favorite(favorite.f));
                }
            }

            callback(null, favorites);
        }
    ], callback);
};

/**
 * Deletes a _favors_ link between a given user node and another node.
 *
 * @param muid
 * @param favoredDbId
 * @param {Function} callback Is called when the operation completes or an error occurs
 * @param {Error} callback.err Error object if an error occured, otherwise null
 * @param {Node} callback.node The node from the database that was saved
 */
FavoriteRepository.prototype.delete = function (muid, favoredDbId, callback) {
    var query = [
        "START n=node:INDEX_NAME(INDEX_KEY='INDEX_VALUE')",
        "MATCH n-[r:FAVORS_REL]->f",
        "WHERE n.muid! = {muid} and id(f) = {favoredDbId}",
        "DELETE r"
    ]
    .join('\n')
    .replace(/INDEX_NAME/g, config.db.index.name)
    .replace(/INDEX_KEY/g, config.db.index.key)
    .replace(/INDEX_VALUE/g, config.db.index.value.user)
    .replace(/FAVORS_REL/g, config.db.relationships.favors);

    var params = {
        muid: muid,
        favoredDbId: favoredDbId
    };

    async.waterfall([
        function (callback) {
            db.query(query, params, callback);
        },
        function (results, callback) {
            callback(null);
        }
    ],callback);
};

/**
 * Creates a _favors_ link between a given user node and a given node.
 *
 * @param muid
 * @param favoredDbId
 * @param {Function} callback Is called when the operation completes or an error occurs
 * @param {Error} callback.err Error object if an error occured, otherwise null
 * @param {Node} callback.node The node from the database that was saved
 */
FavoriteRepository.prototype.create = function (muid, favoredDbId, callback) {
    async.waterfall([
        function (callback) {
            async.parallel({
                userNode: function (callback) {
                    userRepository.getUserNodeByMuid(muid, callback);
                },
                entityNode: function (callback) {
                    db.getNodeById(favoredDbId, callback);
                }
            }, callback);
        },
        function (results, callback) {
            results.userNode.createRelationshipTo(results.entityNode, config.db.relationships.favors, {}, callback);

            var favorite = new Favorite(results.entityNode);

            callback(null, favorite);
        }
    ], callback);
};

module.exports = FavoriteRepository;