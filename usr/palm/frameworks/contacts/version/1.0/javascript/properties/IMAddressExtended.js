// LICENSE@@@
//
//      Copyright (c) 2009-2012 Hewlett-Packard Development Company, L.P.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// @@@LICENSE

/*jslint white: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true,
regexp: true, newcap: true, immed: true, nomen: false, maxerr: 500 */
/*global _, Class, IMAddress, PropertyBase, FavoritableIMAddress*/

/**
* @class
* @augments IMAddress
* @param {object} obj the raw database object
* @example
* var im = new IMAddress({
*	value: "donaldTrump",
*	type: "",
*	primary: false
* });
*
* var imString = im.getValue();
* var imStringAgain = im.x_value; // This is for use in widgets. Code should always call the getter rather than accessing the property.
* var normalizedValue = im.getNormalizedValue();
*/
var IMAddressExtended = PropertyBase.create({
	/**
	* @lends IMAddressExtended#
	* @property {string} x_normalizedValue
	*/
	superClass: FavoritableIMAddress,
	data: [
		{	// Override value so we can implement a beforeSet method that sets a boolean to
			// indicate that the normalizedValue needs to be generated.  If this 'true', we
			// will set the normalizedValue when getNormalizedValue() is called or getDBObject()
			dbFieldName: "value",
			defaultValue: "",
			/**
			* @name IMAddressExtended#setValue
			* @function
			* @param {string} value
			*/
			setterName: "setValue",
			/**
			* @name IMAddressExtended#getValue
			* @function
			* @returns {string}
			*/
			getterName: "getValue",
			beforeSet: function (value) {
				this.doGenerateNormalizedValue = true;
				return value;
			}
		},
		{
			dbFieldName: "normalizedValue",
			defaultValue: "",
			/**
			* @name IMAddressExtended#setNormalizedValue
			* @function
			* @param {string} value
			*/
			setterName: "setNormalizedValue",
			/**
			* @name IMAddressExtended#getNormalizedValue
			* @function
			* @returns {string}
			*/
			getterName: "getNormalizedValue",
			beforeGet: function (origNormalizedValue) {
				var normalizedValue = origNormalizedValue,
					value = this.getValue();

				// only generate the normalizedValue if the value has been set
				if (!value || this.doGenerateNormalizedValue) {
					normalizedValue = IMAddress.normalizeIm(value);
					this.setNormalizedValue(normalizedValue);
					this.doGenerateNormalizedValue = false;
				}
				return normalizedValue;
			}
		}
	]
});

IMAddressExtended.prototype._extendedGetDBObject = function (dbObject) {
	// make sure that the normalizedValue is up to date since we delay calculating it until it is read
	dbObject.normalizedValue = this.getNormalizedValue();
	return dbObject;
};