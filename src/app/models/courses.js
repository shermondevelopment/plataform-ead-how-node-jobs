const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class courses extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasMany(models.areas, {
                throught: 'areas',
                as: 'areas',
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
        },
        {
            sequelize,
            modelName: 'courses',
        }
    );
    return courses;
};