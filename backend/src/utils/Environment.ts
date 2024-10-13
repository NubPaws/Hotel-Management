import dotenv from 'dotenv';

dotenv.config();

export default {
	port: (process.env.PORT || 8000) as number,
	jwtSecret: process.env.JWT_SECRET || "example_jwt_secret",
	
	db: {
		host: process.env.MONGO_DB_IP || "localhost",
		port: (process.env.MONGO_DB_PORT || 27017) as number,
	},
	
	swaggerDir: process.env.SWAGGER_DIR || "/api-docs",
}
