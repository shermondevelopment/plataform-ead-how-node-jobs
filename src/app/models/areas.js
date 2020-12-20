const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class areas extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.courses);
            this.hasMany(models.disciplines, {
                throught: 'disciplines',
                as: 'areas',
                foreignKey: 'id_areas',
            });
        }
    }
    areas.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                validade: { notEmpty: { msg: 'Insira um título' } },
            },
        },
        {
            sequelize,
            modelName: 'areas',
        }
    );
    return areas;
};
