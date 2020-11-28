const { User } = require('.');

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Request',
        {
            hostId: {
                type: DataTypes.INTEGER,
                reference: {
                    model: User,
                    key: 'id',
                }
            }
        },
        {
            freezeTableName: true,
            timestamps: false
        }
    );
};