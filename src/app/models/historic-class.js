const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class historicClass extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.modules, {
                throught: 'modules',
                as: 'classes',
                foreignKey: 'id_module',
            });
        }
    }
    historicClass.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            id_user: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            id_module: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            id_class: {
                type: DataTypes.UUID,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'classes',
        }
    );
    return historicClass;
};
