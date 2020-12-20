module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                validade: { notEmpty: { msg: 'Por Favor! Informe seu nome' } },
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                validate: {
                    isEmail: { msg: 'Digite um email válido' },
                    notEmpty: { msg: 'Por favor! digite um email' },
                },
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: { notEmpty: { msg: 'Digite sua senha!' } },
            },
            cpf: { type: Sequelize.STRING, unique: true },
            dateOfBirth: { type: Sequelize.DATE },
            passwordResetToken: { type: Sequelize.STRING },
            passwordResetExpired: { type: Sequelize.DATE },
            profile: { type: Sequelize.STRING, defaultValue: 'default.svg' },
            sexo: {
                type: Sequelize.ENUM,
                values: ['M', 'F'],
                allowNull: false,
            },
            zipcode: { type: Sequelize.STRING },
            state: { type: Sequelize.STRING(2) },
            city: { type: Sequelize.STRING },
            address: { type: Sequelize.STRING },
            number: { type: Sequelize.STRING },
            complement: { type: Sequelize.STRING },
            bairro: { type: Sequelize.STRING },
            phone: { type: Sequelize.STRING },
            status: { type: Sequelize.BOOLEAN, defaultValue: false },
            token: { type: Sequelize.STRING },
            private: { type: Sequelize.STRING },
            payment: { type: Sequelize.BOOLEAN, defaultValue: false },
            view_free: { type: Sequelize.DATE },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('users');
    },
};
