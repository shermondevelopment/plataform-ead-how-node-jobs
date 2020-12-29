const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class payments extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate() {
            // define association here
        }
    }
    payments.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            payment_reference: { type: DataTypes.UUID, allowNull: false },
            id_payment_user: { type: DataTypes.UUID, allowNull: false },
            email_payment_user: { type: DataTypes.STRING, allowNull: false },
            status: {
                type: DataTypes.STRING,
                defaultValue: 'undefined',
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'payments',
        }
    );
    return payments;
};
