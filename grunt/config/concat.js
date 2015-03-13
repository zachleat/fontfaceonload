module.exports = {
	options: {
		stripBanners: true
	},
	js: {
		src: ["src/fontfaceonload.js"],
		dest: "<%= pkg.config.dist %>/<%= pkg.name %>.js"
	},
	jstest: {
		src: ["test/tests.js"],
		dest: "<%= pkg.config.dist %>/test/tests.js"
	}
};
