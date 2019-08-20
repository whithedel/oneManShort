module.exports = function(sequelize, DataTypes) {
  var Namepair = sequelize.define("Namepair", {
    namepair: { type: DataTypes.STRING, unique: true }
  });

  Namepair.associate = function(models) {
    Namepair.hasOne(models.Board, {
      onDelete: "cascade"
    });
  };

  return Namepair;
};
