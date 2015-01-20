/**
* Person data entity
****/

var Person = function(dbPerson){

    return {    
        /**
         * Returns node id
         */
        getDbId: function(){
            return dbUser.id;
        },
        
        /**
         * Returns original userdata object
         * @returns {[[Type]]} [[Description]]
         */
        getData : function(){
            return dbUser.data;    
        }
    
    }
}
module.exports = User;