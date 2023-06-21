// User.js
const knex = require('knex')(require('../knexfile').development);
const bcrypt = require('bcrypt');
const { promisify } = require('util');

class User {

  static async createUser(userData) {
    try {
        const hash = await promisify(bcrypt.hash)(userData.pass, 10);
        const userFilledData = {
            username: userData.username, 
            email: userData.email, 
            password: hash
        };
        const [userId] = await knex('users').insert(userFilledData, 'id');
        return userId;

    } catch (error) {
      throw error;
    }
  }

  static async getUserById(userId) {
    try {
      const user = await knex('users').where('id', userId).first();
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async getUserByEmail(userEmail) {
    try {
      const user = await knex('users').where('email', userEmail).orWhere('username', userEmail).first();
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async getUserByUsername(userName) {
    try {
      const user = await knex('users').where('username', userName).first();
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(userId, updatedData) {
    try {
      await knex('users').where('id', userId).update(updatedData);
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(userId) {
    try {
      await knex('users').where('id', userId).del();
    } catch (error) {
      throw error;
    }
  }

  static async hashPassword(pass) {
    try {
      const hash = await promisify(bcrypt.hash)(pass, 10);
      return hash;
    } catch (error) {
      throw error;
    }
  }

  static async verifyPassword(hash, pass) {
    try {
        bcrypt.compare(pass, hash, (err, isValid) => {
            if (err) {
                throw err;
            } else if (isValid) {
                return true;
            } else {
                return false;
            }
        });
    } catch (error) {
        throw error;
    }
  }

}

module.exports = User;
