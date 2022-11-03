class UIElement {
    dom: any;

	constructor( dom:any ) {

		this.dom = dom;

	}

	add() {

		for ( let i = 0; i < arguments.length; i ++ ) {

			const argument = arguments[ i ];

			if ( argument instanceof UIElement ) {

				this.dom.appendChild( argument.dom );

			} else {

				console.error( 'UIElement:', argument, 'is not an instance of UIElement.' );

			}

		}

		return this;

	}

	remove() {

		for ( let i = 0; i < arguments.length; i ++ ) {

			const argument = arguments[ i ];

			if ( argument instanceof UIElement ) {

				this.dom.removeChild( argument.dom );

			} else {

				console.error( 'UIElement:', argument, 'is not an instance of UIElement.' );

			}

		}

		return this;

	}

	clear() {

		while ( this.dom.children.length ) {

			this.dom.removeChild( this.dom.lastChild );

		}

	}

	setId( id:any ) {

		this.dom.id = id;

		return this;

	}

	getId() {

		return this.dom.id;

	}

	setClass( name:any ) {

		this.dom.className = name;

		return this;

	}

	addClass( name:any ) {

		this.dom.classList.add( name );

		return this;

	}

	removeClass( name:any ) {

		this.dom.classList.remove( name );

		return this;

	}

	setStyle( style:any, array:any ) {

		for ( let i = 0; i < array.length; i ++ ) {

			this.dom.style[ style ] = array[ i ];

		}

		return this;

	}

	setDisabled( value:any ) {

		this.dom.disabled = value;

		return this;

	}

	setTextContent( value:any ) {

		this.dom.textContent = value;

		return this;

	}

	getIndexOfChild( element:any ) {

		return Array.prototype.indexOf.call( this.dom.children, element.dom );

	}

}

// properties

const properties = [ 'position', 'left', 'top', 'right', 'bottom', 'width', 'height', 'border', 'borderLeft',
	'borderTop', 'borderRight', 'borderBottom', 'borderColor', 'display', 'overflow', 'margin', 'marginLeft', 'marginTop', 'marginRight', 'marginBottom', 'padding', 'paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom', 'color',
	'background', 'backgroundColor', 'opacity', 'fontSize', 'fontWeight', 'textAlign', 'textDecoration', 'textTransform', 'cursor', 'zIndex' ];

properties.forEach( function ( property ) {

	const method:any = 'set' + property.substr( 0, 1 ).toUpperCase() + property.substr( 1, property.length );

	// UIElement.prototype[ method ] = function () {

	// 	this.setStyle( property, arguments );

	// 	return this;

	// };

} );

// events

const events = [ 'KeyUp', 'KeyDown', 'MouseOver', 'MouseOut', 'Click', 'DblClick', 'Change', 'Input' ];

events.forEach( function ( event ) {

	const method:any = 'on' + event;

	// UIElement.prototype[ method ] = function ( callback ) {

	// 	this.dom.addEventListener( event.toLowerCase(), callback.bind( this ), false );

	// 	return this;

	// };

} );



class UIDiv extends UIElement {

	constructor() {

		super( document.createElement( 'div' ) );

	}

}



class UIPanel extends UIDiv {

	constructor() {

		super();

		this.dom.className = 'Panel';

	}

}


export { UIElement,UIDiv,  UIPanel,};
