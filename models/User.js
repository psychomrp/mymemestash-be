// User.js
const knex = require('knex')(require('../knexfile').development);

class User {
  static async createUser(userData) {
    try {
      const [userId] = await knex('users').insert(userData, 'id');
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
      const user = await knex('users').where('email', userEmail).first();
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
}

module.exports = User;
