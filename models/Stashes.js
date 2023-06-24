// Stashes.js
const knex = require('knex')(require('../knexfile').development);

class Stashes {

  static async createStash(stashData) {
    try {
        const [id] = await knex('stashes').insert(stashData, 'id');
        return id;

    } catch (error) {
      throw error;
    }
  }

  static async getStashesByUserId(userId) {
    try {
      const stashes = await knex('stashes').select().where('user_id', userId);
      return stashes;
    } catch (error) {
      throw error;
    }
  }

  static async getStashById(id) {
    try {
      const user = await knex('stashes').where('id', id).first();
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async getStashByCode(code) {
    try {
      const user = await knex('stashes').where('stash_code', code).first();
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async updateStash(id, updatedData) {
    try {
      await knex('stashes').where('id', id).update(updatedData);
    } catch (error) {
      throw error;
    }
  }

  static async deleteStash(id) {
    try {
      await knex('stashes').where('id', id).del();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Stashes;
