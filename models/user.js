var Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING.BINARY,
    lastLogin: { type: Sequelize.DATE },
    status: {
      type: Sequelize.ENUM("active", "inactive"),
      defaultValue: "active"
    }
  });
  return User;
};
