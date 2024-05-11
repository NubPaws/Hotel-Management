"use strict";
exports.__esModule = true;
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
exports["default"] = {
    port: (process.env.PORT || 8000),
    jwtSecret: process.env.JWT_SECRET || "example_jwt_secret",
    db: {
        host: process.env.MONGO_DB_IP || "localhost",
        port: (process.env.MONGO_DB_PORT || 27017)
    }
};
