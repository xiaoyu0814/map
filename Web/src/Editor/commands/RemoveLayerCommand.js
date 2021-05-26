/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object Layer
 * @constructor
 */

var RemoveLayerCommand = function ( object ) {

	PIE.Command.call( this );

	this.type = 'RemoveLayerCommand';
	this.name = 'Remove Object';

	this.object = object;
	

};

RemoveLayerCommand.prototype = {

	execute: function () {

		this.editor.remove( this.object );

	},

	undo: function () {

		this.editor.add( this.object );

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );
		output.object = this.object.toJSON();
		output.index = this.index;
		output.parentUuid = this.parent.uuid;

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.parent = this.editor.objectByUuid( json.parentUuid );
		if ( this.parent === undefined ) {

			this.parent = this.editor.scene;

		}

		this.index = json.index;

		this.object = this.editor.objectByUuid( json.object.object.uuid );
		if ( this.object === undefined ) {

			var loader = new THREE.ObjectLoader();
			this.object = loader.parse( json.object );

		}

	}

};
export {RemoveLayerCommand}