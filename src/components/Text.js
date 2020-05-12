/*
	Job: Keep a Three.Object3D to contain text mesh. Triggers updates
	Knows: This text, its geometries and meshes
*/

import { ShapeBufferGeometry, Mesh, Object3D } from 'three';

import InlineComponent from '../core/InlineComponent';
import DeepDelete from '../utils/DeepDelete';

function Text( options ) {

	const text = Object.create( InlineComponent() );

	text.type = "Text";

	text.threeOBJ = new Object3D();
    text.threeOBJ.uiComponent = text;

	text.parseParams = function parseParams( resolve, reject ) {

		//////////////////////////
		/// GET CHARS GEOMETRIES
		//////////////////////////

		// Abort condition
		
		if ( !this.content || this.content.length === 0 ) return

		// Get font style

		const FONT = this.getFontFamily();
		if ( !FONT ) return

		const FONT_SIZE = this.getFontSize();

		// Make array of objects containing each character and its length, for later concatenation

		let chars = Array.from ? Array.from( this.content ) : String( this.content ).split( '' );

		text.chars = chars.map( (glyph)=> {

			const shape = FONT.generateShapes( glyph, FONT_SIZE );

			const width = FONT.data.glyphs[ glyph ] ? FONT.data.glyphs[ glyph ].ha * ( FONT_SIZE / FONT.data.resolution ) : 0 ;

			const height = FONT.data.glyphs[ glyph ] ? FONT.data.lineHeight * ( FONT_SIZE / FONT.data.resolution ) : 0 ;

			const ascender = FONT.data.glyphs[ glyph ] ? FONT.data.ascender * ( FONT_SIZE / FONT.data.resolution ) : 0 ;

			return {
				geometry: new ShapeBufferGeometry( shape ),
				height,
				ascender,
				width,
				glyph
			};

		});

		//

		resolve();

	};

	text.updateLayout = function updateLayout() {

		// DELETE PREVIOUS MESH + CREATE NEW ONE

		if ( !this.parent ) return

		const INFO = this.parent.inlinesInfo[ this.id ];

		if ( !INFO ) return

		const MATERIAL = this.getFontMaterial();

		const textMesh = new Mesh( INFO.geometry, MATERIAL );

		DeepDelete( text.threeOBJ );

		text.threeOBJ.add( textMesh );

	};

	text.updateInner = function updateInner() {

		text.threeOBJ.position.z = text.getOffset();

	};

	text.set( options );

	return text

};

export default Text
