/**
 * @typedef {Object} T_ImageCompose
 * @property {String} src
 */

/**
 * @typedef {Object} T_ItemCompose
 * @property {String} id
 * @property {String} label
 * @property {Number} weight
 * @property {Number} tough
 * @property {String} cat
 */

/**
 * @typedef {Object} T_UnitType
 * @property {Object} values
 * @property {Number} [values.id]
 * @property {String} values.label
 * @property {String} values.group
 * @property {String} values.type
 * @property {String} values.game
 * @property {Object} values.value
 * @property {(String|Number)} values.value.str
 * @property {(String|Number)} values.value.t_str
 * @property {(String|Number)} values.value.dex
 * @property {(String|Number)} values.value.t_dex
 * @property {(String|Number)} values.value.wit
 * @property {(String|Number)} values.value.t_wit
 * @property {(String|Number)} values.value.emp
 * @property {(String|Number)} values.value.t_emp
 * @property {T_ImageCompose[]} [values.value.images]
 * @property {(String|Number)} values.value.items_count
 * @property {Number} values.value.items_threshold
 * @property {T_ItemCompose[]} [values.value.items]
 */

module.exports = {};