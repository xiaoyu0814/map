function glsl() {

	return {

		transform( code, id ) {

			if ( /\.glsl$/.test( id ) === false ) return;

			var transformedCode = 'export default ' + JSON.stringify(
				code
					.replace( /[ \t]*\/\/.*\n/g, '' ) // remove //
					.replace( /[ \t]*\/\*[\s\S]*?\*\//g, '' ) // remove /* */
					.replace( /\n{2,}/g, '\n' ) // # \n+ to \n
			) + ';';
			return {
				code: transformedCode,
				map: { mappings: '' }
			};

		}

	};

}

export default {
	input: 'src/Pie.js',
	indent: '\t',
	plugins: [
		glsl()
	],
	sourceMap: false,
	output: [
		{
			sourceMap: false,
			format: 'umd',
			name: 'PIE',
			file: 'build/PIEWEB.js'
		},
		{
			format: 'es',
			sourceMap: false,
			file: 'build/PIEWEB.module.js'
		}
	]
};
