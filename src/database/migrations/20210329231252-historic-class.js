module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('historicClass', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            id_user: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                    as: 'user',
                },
            },

            id_module: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'modules',
                    key: 'id',
                    as: 'module',
                },
            },
            id_class: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'classes',
                    key: 'id',
                    as: 'class',
                },
            },
            view: {
                type: Sequelize.BOOLEAN,
            },
        });
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('historicClass');
    },
};
