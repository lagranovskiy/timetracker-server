var util = require('util'),
    Entity = require('./Entity'),
    extend = require('object-extend');

/**
 * Person data entity
 **/
var Person = function(personId, personData) {
    var data = {};
    if (personData) {
        extend(data, personData);
    }


    return extend(Person.super_(personId, personData), {

        /**
         * Forename of the person1
         */
        get forename() {
            return data.forename;
        },

        /**
         * Surname of person
         */
        get surname() {
            return data.surname;
        },


        /**
         * Birthday of person
         */
        get birthday() {
            return data.birthday;
        },


        /**
         * Email of person
         */
        get email() {
            return data.email;
        },


        /**
         * Contact phone
         */
        get phone() {
            return data.phone;
        }

    });
};

util.inherits(Person, Entity);

module.exports = Person;