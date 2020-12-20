const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class modules extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.disciplines);
            this.hasMany(models.classes, {
                throught: 'classes',
                as: 'module',
                foreignKey: 'id_module',
            });
        }
    }
    modules.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: { notEmpty: { msg: 'Preencha um titulo' } },
            },
            slug: { type: DataTypes.STRING, allowNull: false },
            qt_class: { type: DataTypes.INTEGER, allowNull: false },
            qt_concluded: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            order: { type: DataTypes.INTEGER(10), allowNull: false },
        },
        {
            sequelize,
            modelName: 'modules',
        }
    );
    return modules;
};
