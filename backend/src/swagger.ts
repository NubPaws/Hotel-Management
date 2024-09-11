import swaggerJSDoc from "swagger-jsdoc";

const SwaggerSpecs = swaggerJSDoc({
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Hotel Management API",
			version: "1.0.0",
			description: "API documentations for the hotel management backend."
		}
	},
	apis: [
		"src/controllers/Tokens.ts",
		"src/controllers/Users.ts",
	],
});

export default SwaggerSpecs;
