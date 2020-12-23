const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class materials extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.modules, {
                throught: 'modules',
                as: 'material',
                foreignKey: 'id_module',
            });
        }
    }
    materials.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            title: {
                allowNull: false,
                type: DataTypes.STRING,
                validade: { notEmpty: { msg: 'insira um titulo' } },
            },
            url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            id_module: {
                type: DataTypes.UUID,
                references: {
                    model: 'modules',
                    key: 'id',
                    as: 'materials',
                },
            },
        },
        {
            sequelize,
            modelName: 'materials',
        }
    );
    return materials;
};
