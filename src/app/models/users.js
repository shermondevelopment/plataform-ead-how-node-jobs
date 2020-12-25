/* eslint-disable no-param-reassign */
const { Model } = require('sequelize');
const bcryptjs = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    class users extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of DataTypes lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate() {}
    }
    users.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: 'digite seu nome' },
                    notEmpty: { msg: 'campo nome não pode ser vazio' },
                },
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                validate: {
                    isEmail: { msg: 'Digite um email válido' },
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: { notEmpty: { msg: 'Digite sua senha!' } },
            },
            cpf: { type: DataTypes.STRING, unique: true },
            dateOfBirth: { type: DataTypes.DATE },
            passwordResetToken: { type: DataTypes.STRING },
            passwordResetExpired: { type: DataTypes.DATE },
            profile: { type: DataTypes.STRING, defaultValue: 'default.svg' },
            sexo: {
                type: DataTypes.ENUM,
                values: ['M', 'F'],
                allowNull: false,
            },
            zipcode: { type: DataTypes.STRING },
            state: { type: DataTypes.STRING(2) },
            city: { type: DataTypes.STRING },
            address: { type: DataTypes.STRING },
            number: { type: DataTypes.STRING },
            complement: { type: DataTypes.STRING },
            bairro: { type: DataTypes.STRING },
            phone: { type: DataTypes.STRING },
            status: { type: DataTypes.BOOLEAN, defaultValue: false },
            token: { type: DataTypes.STRING },
            private: { type: DataTypes.STRING },
            payment: { type: DataTypes.BOOLEAN, defaultValue: false },
            view_free: { type: DataTypes.DATE },
        },
        {
            sequelize,
            modelName: 'users',
            hooks: {
                beforeCreate: async (user) => {
                    const hash = await bcryptjs.hash(user.password, 10);
                    user.password = `${hash}`;
                },
                beforeUpdate: async (user) => {
                    const hash = await bcryptjs.hash(user.password, 10);
                    user.password = `${hash}`;
                    console.log(user.profile);
                },
            },
        }
    );
    return users;
};
