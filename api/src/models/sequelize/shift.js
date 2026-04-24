module.exports = function (sequelize, DataTypes) {
  const Model = sequelize.define('Shift',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: true
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: true
      },
      total_minutes: {
        type: DataTypes.TIME,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        get() {
          return this.getDataValue('createdAt')
            ? this.getDataValue('createdAt').toISOString().split('T')[0]
            : null
        }
      },
      updatedAt: {
        type: DataTypes.DATE,
        get() {
          return this.getDataValue('updatedAt')
            ? this.getDataValue('updatedAt').toISOString().split('T')[0]
            : null
        }
      }
    }, {
    sequelize,
    tableName: 'shifts',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'id' }
        ]
      }
    ]
  }
  )

  Model.associate = function (models) {
    Model.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' })
  }

  return Model
}
