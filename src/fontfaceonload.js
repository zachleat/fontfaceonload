;(function( win, doc ) {
	"use strict";

	var DELAY = 100,
		TEST_STRING = 'AxmTYklsjo190QW',
		TOLERANCE = 2, // px

		SANS_SERIF_FONTS = 'sans-serif',
		SERIF_FONTS = 'serif',

		parent,
		/**
		 * See https://github.com/typekit/webfontloader/blob/master/src/core/fontruler.js#L41
		 */
		style = [
			'display:block',
			'position:absolute',
			'top:-999px',
			'left:-999px',
			'font-size:300px',
			'width:auto',
			'height:auto',
			'line-height:normal',
			'margin:0',
			'padding:0',
			'font-variant:normal',
			'white-space:nowrap',
			'font-family:%s'
		].join(';'),
		html = '<div style="' + style + '">' + TEST_STRING + '</div>',
		sansSerif,
		serif,
		dimensions,
		appended = false;

	var FontFaceOnloadInstance = function () {
		this.appended = false;
		this.dimensions = undefined;
		this.serif = undefined;
		this.sansSerif = undefined;
		this.parent = undefined;
	};

	FontFaceOnloadInstance.prototype.initialMeasurements = function ( fontFamily ) {
		var sansSerif = this.sansSerif;
		var serif = this.serif;

		this.dimensions = {
			sansSerif: {
				width: sansSerif.offsetWidth,
				height: sansSerif.offsetHeight
			},
			serif: {
				width: serif.offsetWidth,
				height: serif.offsetHeight
			}
		};

		// Make sure we set the new font-family after we take our initial dimensions:
		// handles the case where FontFaceOnload is called after the font has already
		// loaded.
		sansSerif.style.fontFamily = fontFamily + ', ' + SANS_SERIF_FONTS;
		serif.style.fontFamily = fontFamily + ', ' + SERIF_FONTS;
	}

	FontFaceOnloadInstance.prototype.load = function ( fontFamily, options ) {
		var startTime = new Date();
		var that = this;
		var serif = that.serif;
		var sansSerif = that.sansSerif;
		var parent = that.parent;
		var appended = that.appended;
		var dimensions = that.dimensions;

		if( !parent ) {
			parent = that.parent = doc.createElement( 'div' );
		}

		parent.innerHTML = html.replace(/\%s/, SANS_SERIF_FONTS ) + html.replace(/\%s/, SERIF_FONTS );
		sansSerif = that.sansSerif = parent.firstChild;
		serif = that.serif = sansSerif.nextSibling;

		if( options.glyphs ) {
			sansSerif.innerHTML += options.glyphs;
			serif.innerHTML += options.glyphs;
		}

		(function checkDimensions() {
			if( !appended && doc.body ) {
				appended = that.appended = true;
				doc.body.appendChild( parent );

				that.initialMeasurements( fontFamily );
			}

			dimensions = that.dimensions;

			if( appended && dimensions &&
				( Math.abs( dimensions.sansSerif.width - sansSerif.offsetWidth ) > TOLERANCE ||
					Math.abs( dimensions.sansSerif.height - sansSerif.offsetHeight ) > TOLERANCE ||
					Math.abs( dimensions.serif.width - serif.offsetWidth ) > TOLERANCE ||
					Math.abs( dimensions.serif.height - serif.offsetHeight ) > TOLERANCE ) ) {
				options.success();
			} else if( ( new Date() ).getTime() - startTime.getTime() > options.timeout ) {
				options.error();
			} else {
				setTimeout(function() {
					checkDimensions();
				}, DELAY);
			}
		})();
	} // end load()

	FontFaceOnloadInstance.prototype.init = function( fontFamily, options ) {
		var that = this;
		var defaultOptions = {
				glyphs: '',
				success: function() {},
				error: function() {},
				timeout: 10000
			},
			timeout;

		if( !options ) {
			options = {};
		}

		for( var j in defaultOptions ) {
			if( !options.hasOwnProperty( j ) ) {
				options[ j ] = defaultOptions[ j ];
			}
		}

		if( "fonts" in doc ) {
			doc.fonts.load( "1em " + fontFamily ).then(function() {
				options.success();

				win.clearTimeout( timeout );
			});

			if( options.timeout ) {
				timeout = win.setTimeout(function() {
					options.error();
				}, options.timeout );
			}
		} else {
			that.load( fontFamily, options );
		}
	};

	var FontFaceOnload = function( fontFamily, options ) {
		var instance = new FontFaceOnloadInstance();
		instance.init(fontFamily, options);
	};

	// intentional global
	win.FontFaceOnload = FontFaceOnload;
})( this, this.document );
