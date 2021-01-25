const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class courses extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasMany(models.disciplines, {
                throught: 'disciplines',
                as: 'discipline',
                foreignKey: 'id_course',
            });
        }
    }
    courses.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: { notEmpty: { msg: 'insira um título' } },
            },
            description: { type: DataTypes.STRING, allowNull: true },
            image: { type: DataTypes.STRING },
            slug: { type: DataTypes.STRING, allowNull: false },
            qt_disciplines: { type: DataTypes.NUMBER(2), allowNull: false },
            qt_concluded: { type: DataTypes.NUMBER(2), defaultValue: 0 },
            time: { type: DataTypes.INTEGER, allowNull: true },
        },
        {
            sequelize,
            modelName: 'courses',
        }
    );
    return courses;
};
