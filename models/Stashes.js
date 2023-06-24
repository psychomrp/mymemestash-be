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

  static async updateStash(stash_code, updatedData) {
    try {
      await knex('stashes').where('stash_code', stash_code).update(updatedData);
    } catch (error) {
      throw error;
    }
  }

  static async deleteStash(stash_code) {
    try {
      await knex('stashes').where('stash_code', stash_code).del();
    } catch (error) {
      throw error;
    }
  }

  static async checkThatStashBelongsToUser(userId, stashCode) {
    try {
        const stash = await knex('stashes').where('stash_code', stashCode).where('user_id', userId).first();
        if(stash) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw error;
    }
  }
}

module.exports = Stashes;
