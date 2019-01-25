export default composeName

/**
	 *	@param {Object} personObject
	 *	@param {Object} opts - maidenName - add maiden name to the final string
	 */
function nameComposer(personObject, opts = {}) {
    personObject[opts.targetProp] = (
        [personObject.name_prefix, personObject.name || ''].join(' ').trim()
        + ' ' + (personObject.middle_name ? personObject.middle_name + ' ' : '')
        + (personObject.surname || '')
        + (personObject.name_suffix ? ', ' + personObject.name_suffix : '')
        + ((opts.maidenName && personObject.maiden_name) ? ' (née\u00A0' + personObject.maiden_name + ')' : '')
    ).trim()
    return personObject[opts.targetProp]
}
// @param {Object} personObject
// @param {Object} opts - composeName function opts
function composeNameObjFinder(personObject, opts) {
    if (personObject === void 0 || personObject === null) throw new TypeError('personObject may not be undefined at composeNameObjFinder.')
    opts = opts || {}
    var o
    if (!opts.prop && !opts.dynamicProp) {
        o = personObject
    } else {
        if (opts.prop && isObject(personObject[opts.prop])) {
            o = personObject[opts.prop]
        } else if (opts.dynamicProp) {
            if (personObject.email) {
                o = personObject
            } else if (!personObject.email && personObject[opts.dynamicProp] && isObject(personObject[opts.dynamicProp])) {
                o = personObject[opts.dynamicProp]
            }
        }
    }
    if (o === void 0) {
        console.error('Error finding name components at composeNameObjFinder at "' + JSON.stringify(personObject) + '" with opts ' + JSON.stringify(opts))
        o = { email: 'not-even-an-email-found' }
    }
    return o
}
/*
 * 	@param {Array||Object} personObject
 *	@param {Object} opts
 *				- {String} prop - dont try to get the name from personObject itself, but from a certain property of it
 *				- {Boolean} force - always create (never reuse) and assign a new fullName (or `${opts.targetProp}`) prop
 *				- {String} dynamicProp - special case prop that first tries to find name in the personObject and if
 *										it fails it fallbacks to the property
 *				- {Boolean} maidenName
 *				- {String} targetProp - the property to which to bind the name. Defaults to `fullName`
 * 	@returns {String} name(s)(if available, email(s) otherwise) of person(s) given in personObject
 */
function composeName(personObject, opts = {}) {
    if (!personObject) return ''
    if (!(isObject(personObject) || personObject.length)) return ''

    if (!isObject(opts)) opts = {}
    opts.targetProp = opts.targetProp || 'fullName'

    var nameString = ''

    if (Array.isArray(personObject)) {
        for (var i = 0, l = personObject.length; i < l; i++) {
            var obj = composeNameObjFinder(personObject[i], opts)
            var personName = (obj[opts.targetProp] ? obj[opts.targetProp] : nameComposer(obj, opts))
            if (!personName.length) personName = obj.email
            nameString += personName + ', '
        }
        nameString = nameString.slice(0, -2)
    } else {
        const obj = composeNameObjFinder(personObject, opts)
        if (opts.force) {
            nameString = nameComposer(obj, opts)
        } else {
            nameString = obj[opts.targetProp] || nameComposer(obj, opts)
        }
        if (!nameString.length) nameString = obj.email
    }
    //if no name part available, try email instead
    return nameString
}