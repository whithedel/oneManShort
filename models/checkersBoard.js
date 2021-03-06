module.exports = function(sequelize, DataTypes) {
  var Board = sequelize.define("Board", {
    color: DataTypes.STRING,
    positionX: DataTypes.INTEGER,
    positionY: DataTypes.INTEGER,
    user: DataTypes.STRING,
    isKing: DataTypes.BOOLEAN,
    hasPiece: DataTypes.BOOLEAN
  });

  Board.associate = function(models) {
    Board.belongsTo(models.Namepair, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Board;
};
