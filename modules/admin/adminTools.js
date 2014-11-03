/**
 * Created by sebastien on 30/10/14.
 */

/**
 * Function checkObjectProperty
 * Verifie un objet possède une propriété
 * @param obj
 * @param property
 * @returns {boolean}
 */
function checkObjectProperty(obj, property) {
    var result = false;
    if(obj.hasOwnProperty(property)) {
        result = true;
    }
    return result; /* @TODO RETURN bloquant => a modifier */
}

exports.checkObjectProperty = checkObjectProperty;