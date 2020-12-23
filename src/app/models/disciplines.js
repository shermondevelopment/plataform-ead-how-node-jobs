const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class disciplines extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.courses, {
                throught: 'courses',
                as: 'course',
                foreignKey: 'id_course',
            });
            this.hasMany(models.modules, {
                throught: 'modules',
                as: 'modules',
                foreignKey: 'id_discipline',
            });
        }
    }
    disciplines.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: { notEmpty: { msg: 'insert a title' } },
            },
            slug: { type: DataTypes.STRING, allowNull: false },
            image: { type: DataTypes.STRING },
            qt_modules: { type: DataTypes.INTEGER(2), allowNull: false },
            qt_concluded: {
                type: DataTypes.INTEGER(2),
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            sequelize,
            modelName: 'disciplines',
        }
    );
    return disciplines;
};
