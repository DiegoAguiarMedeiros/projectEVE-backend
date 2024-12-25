const runner = require("../runner");

const { Sequelize } = require('sequelize');

const migration = {
  up: async (queryInterface) => {
    const CREATE_USER = () => {
      return queryInterface.createTable('user', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true
        },
        email: {
          type: Sequelize.STRING(250),
          allowNull: false,
          unique: true
        },
        is_email_verified: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        name: {
          type: Sequelize.STRING(250),
          allowNull: false
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        is_admin_user: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        is_deleted: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        }
      })
    }



    const CREATE_ENVELOPE = () => (
      queryInterface.createTable('envelope', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true
        },
        name: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        balance: {
          type: Sequelize.FLOAT,
          allowNull: true
        },
        disable: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        is_disable: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        }
      })
    )

    const CREATE_USER_ENVELOPE = () => (
      queryInterface.createTable('user_envelope', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'user',
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
        envelope_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'envelope',
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        }
      })
    )

    const CREATE_TRANSATION = () => (
      queryInterface.createTable('transation', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true
        },
        envelope_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'envelope',
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
        payment_method_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'user_payment_method',
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
        type: {
          type: Sequelize.ENUM('Crétido', 'Débito'),
          allowNull: false
        },
        due_date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        payment_date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        }
      })
    )

    const CREATE_USER_PAYMENT_METHOD = () => (
      queryInterface.createTable('user_payment_method', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'user',
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
        payment_method: {
          type: Sequelize.STRING(10),
          allowNull: false
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        }
      })
    )

    const CREATE_CREDIT_CARDS = () => (
      queryInterface.createTable('credit_cards', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true
        },
        name: {
          type: Sequelize.STRING(20),
          allowNull: false
        },
        flag: {
          type: Sequelize.STRING(10),
          allowNull: false
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        }
      })
    )
    const CREATE_USER_CREDIT_CARDS = () => (
      queryInterface.createTable('user_credit_cards', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'user',
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
        credit_cards_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'credit_cards',
            key: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        }
      })
    )

    await runner([
      () => CREATE_USER(),
      () => CREATE_ENVELOPE(),
      () => CREATE_USER_ENVELOPE(),
      () => CREATE_USER_PAYMENT_METHOD(), 
      () => CREATE_TRANSATION(),
      () => CREATE_CREDIT_CARDS(),
      () => CREATE_USER_CREDIT_CARDS()
    ])
  },

  down: (queryInterface) => {
    return runner([
      () => queryInterface.dropTable('user')
    ])
  }
};


module.exports = migration;