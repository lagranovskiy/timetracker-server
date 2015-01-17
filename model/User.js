/**
* User entity
****/

var User = function(dbUser){
    var userGroups = [];
    
    return {    
        getUid : function() {
            return dbUser.data.uid;
        },
        
        getPwdHash : function(){
            return dbUser.data.passwordMD5;
        },
        
        getData : function(){
            return dbUser.data;    
        }
    
    }
}
module.exports = User;