;(function( win, doc ) {
	"use strict";

	var TEST_STRING = 'AxmTYklsjo190QW',
		SANS_SERIF_FONTS = 'sans-serif',
		SERIF_FONTS = 'serif',

		defaultOptions = {
			tolerance: 2, // px
			delay: 100,
			weights: 1, // total number of font-weights
			glyphs: '',
			success: function() {},
			error: function() {},
			timeout: 5000
		},

		// See https://github.com/typekit/webfontloader/blob/master/src/core/fontruler.js#L41
		style = [
			'display:block',
			'position:absolute',
			'top:-999px',
			'left:-999px',
			'font-size:48px',
			'width:auto',
			'height:auto',
			'line-height:normal',
			'margin:0',
			'padding:0',
			'font-variant:normal',
			'white-space:nowrap'
		],
		html = document.createElement("div");
		html.appendChild( document.createTextNode( TEST_STRING ) );

	var FontFaceOnloadInstance = function() {
		this.fontFamily = '';
		this.appended = false;
		this.serif = undefined;
		this.sansSerif = undefined;
		this.parent = undefined;
		this.options = {};
	};

	FontFaceOnloadInstance.prototype.getMeasurements = function () {
		return {
			sansSerif: {
				width: this.sansSerif.offsetWidth,
				height: this.sansSerif.offsetHeight
			},
			serif: {
				width: this.serif.offsetWidth,
				height: this.serif.offsetHeight
			}
		};
	};

	FontFaceOnloadInstance.prototype.load = function () {
		var startTime = new Date(),
			that = this,
			serif = that.serif,
			sansSerif = that.sansSerif,
			parent = that.parent,
			appended = that.appended,
			dimensions,
			options = this.options,
			ref = options.reference;

		function getStyle( family ) {      
			var styleAttribute = style.concat( "font-family:" + family ).join( ";" );

			return styleAttribute;
		}

		var sansSerifHtml = html.cloneNode( true ),
			serifHtml = html.cloneNode( true );

		sansSerifHtml.setAttribute( 'style', getStyle( SANS_SERIF_FONTS ) );
		serifHtml.setAttribute( 'style', getStyle( SERIF_FONTS ) );

    	sansSerifHtml.styleAttributeNode( getStyle( SANS_SERIF_FONTS ) );
    	serifHtml.styleAttributeNode( getStyle( SERIF_FONTS ) );

		if( !parent ) {
			parent = that.parent = doc.createElement( "div" );
		}

		parent.appendChild( sansSerifHtml );
		parent.appendChild( serifHtml );

		sansSerif = that.sansSerif = parent.firstChild;
		serif = that.serif = sansSerif.nextSibling;

		if( options.glyphs ) {
			sansSerif.appendChild( document.createTextNode( options.glyphs ) );
			serif.appendChild( document.createTextNode( options.glyphs ) );
		}

		function hasNewDimensions( dims, el, tolerance ) {
			return Math.abs( dims.width - el.offsetWidth ) > tolerance ||
					Math.abs( dims.height - el.offsetHeight ) > tolerance;
		}

		function isTimeout() {
			return ( new Date() ).getTime() - startTime.getTime() > options.timeout;
		}

		function checkWeights() {
			var j = 100,
				k,
				weightCount = 1;

			sansSerif.style.fontWeight = serif.style.fontWeight = j;

			for( j = 200, k = 900; j <= k; j += 100 ) {
				dimensions = that.getMeasurements();
				sansSerif.style.fontWeight = serif.style.fontWeight = j;

				if( hasNewDimensions( dimensions.sansSerif, sansSerif, 0 ) ||
						hasNewDimensions( dimensions.serif, serif, 0 ) ) {
					weightCount++;

					if( weightCount >= options.weights ) {
						break;
					}
				}
			}

			if( weightCount >= options.weights ) {
				options.success();
				ref.removeChild( parent );
			} else if( isTimeout() ) {
				options.error();
			} else {
				win.setTimeout(function() {
					checkWeights();
				}, options.delay );
			}
		}

		(function checkDimensions() {
			if( !ref ) {
				ref = doc.body;
			}
			if( !appended && ref ) {
				ref.appendChild( parent );
				appended = that.appended = true;

				dimensions = that.getMeasurements();

				// Make sure we set the new font-family after we take our initial dimensions:
				// handles the case where FontFaceOnload is called after the font has already
				// loaded.
				sansSerif.style.fontFamily = that.fontFamily + ', ' + SANS_SERIF_FONTS;
				serif.style.fontFamily = that.fontFamily + ', ' + SERIF_FONTS;
			}

			if( appended && dimensions &&
				( hasNewDimensions( dimensions.sansSerif, sansSerif, options.tolerance ) ||
					hasNewDimensions( dimensions.serif, serif, options.tolerance ) ) ) {

				// short circuit if only one weight, we already know the dimensions changed.
				if( options.weights === 1 ) {
					options.success();
				} else {
					checkWeights();
				}
			} else if( isTimeout() ) {
				options.error();
			} else {
				if( !appended && "requestAnimationFrame" in window ) {
					win.requestAnimationFrame( checkDimensions );
				} else {
					win.setTimeout( checkDimensions, options.delay );
				}
			}
		})();
	}; // end load()

	FontFaceOnloadInstance.prototype.checkFontFaces = function( timeout ) {
		var _t = this,
			uniqueWeightsCount = 0,
			uniqueWeights = {},
			promises = [];

		doc.fonts.forEach(function( font ) {
			if( font.family.toLowerCase() === _t.fontFamily.toLowerCase() ) {
				if( !uniqueWeights[ font.weight ] ) {
					uniqueWeightsCount++;
					uniqueWeights[ font.weight ] = true;
				}

				promises.push( font.load() );
			}
		});

		Promise.all( promises ).then(function() {
			_t.options.success();
			win.clearTimeout( timeout );
		});

		// If a stylesheet is added asynchronously later
		if( uniqueWeightsCount !== _t.options.weights ) {
			win.setTimeout(function() {
				_t.checkFontFaces( timeout );
			}, _t.options.delay );
		}
	};

	FontFaceOnloadInstance.prototype.init = function( fontFamily, options ) {
		var timeout;

		for( var j in defaultOptions ) {
			if( !options.hasOwnProperty( j ) ) {
				options[ j ] = defaultOptions[ j ];
			}
		}

		this.options = options;
		this.fontFamily = fontFamily;

		// For some reason this was failing on afontgarde + icon fonts.
		if( !options.glyphs && "fonts" in doc ) {
			if( options.timeout ) {
				timeout = win.setTimeout(function() {
					options.error();
				}, options.timeout );
			}

			this.checkFontFaces( timeout );
		} else {
			this.load();
		}
	};

	var FontFaceOnload = function( fontFamily, options ) {
		var instance = new FontFaceOnloadInstance();
		instance.init(fontFamily, options);

		return instance;
	};

	// intentional global
	win.FontFaceOnload = FontFaceOnload;
})( this, this.document );
