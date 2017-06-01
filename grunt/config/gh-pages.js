module.exports = {
	options: {
		branch: "gh-pages",
		message: "fontfaceonload <%= pkg.version %> [ci skip]"
	},
	src: [
		"bower.json",
		"<%= pkg.config.dist %>/**/*",
		"<%= pkg.config.test %>/**/*",
		"<%= pkg.config.demo %>/**/*",
		"<%= pkg.config.bower %>/**/*"
	]
};
