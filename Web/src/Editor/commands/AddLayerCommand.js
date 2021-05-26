/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @constructor
 */

var AddLayerCommand = function ( object ) {

	PIE.Command.call( this );

	this.type = 'AddLayerCommand';

	this.object = object;
	if ( object !== undefined ) {

		this.name = 'Add Object: ' + object.id;

	}

};

AddLayerCommand.prototype = {

	execute: function () {

		this.editor.add( this.object );
	},

	undo: function () {

		this.editor.remove( this.object );

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );
		output.object = this.object.toJSON();

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		// this.object = this.editor.objectByUuid( json.object.object.uuid );

		// if ( this.object === undefined ) {

		// 	var loader = new THREE.ObjectLoader();
		// 	this.object = loader.parse( json.object );

		// }

	}

};
export {AddLayerCommand}
