const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class classes extends Model {
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
    classes.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
                notNull: false,
                validate: { notEmpty: { msg: 'Preencha um titulo' } },
            },
            slug: { type: DataTypes.STRING, allowNull: false },
            url: {
                type: DataTypes.STRING,
                notNull: false,
                validae: { notEmpty: { msg: 'Preencha um video' } },
            },
            order: { type: DataTypes.INTEGER(10), notNull: false },
        },
        {
            sequelize,
            modelName: 'classes',
        }
    );
    return classes;
};
