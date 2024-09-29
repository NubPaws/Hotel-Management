import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.OAS3Options = {
	definition: {
		openapi: "3.0.3",
		info: {
			title: "Hotel Management API",
			version: "1.0.0",
			description: "API documentations for the hotel management backend."
		},
		components: {
			securitySchemes: {
				"bearerAuth": {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
					value: "Bearer <JWT token here>",
					description: "Enter the token with the 'Bearer ' prefix, e.g. 'Bearer abcde12345'.",
				},
			},
		},
		security: [
			{ "bearerAuth": [] }
		]
	},
	apis: [
		"src/controllers/*.ts",
		"src/models/*.ts",
	],
}

export const SwaggerSpecs = swaggerJSDoc(options);

export const SwaggerUiOptions = {
	explorer: true,
};
