const { v4: uuid } = require('uuid');

const logger = require('../../../../helpers/lib/logger');
const response = require('../../../../helpers/utils/response');

const User = require('../models/User');
const Crypt = require('../../../../helpers/utils/crypt');

const { CODE } = require('../../../../helpers/lib/httpCode');
const url = new Map();

/**
 * @class
 * UserCommand
 * 
 * @function createUsers - A function to create a user.
 * Check {@link ../models/User.js} for the list of payloads needed.
 * 
 * @function loginUsers
 * @param {string} req.body.email - User email
 * @param {string} req.body.password - User password
 * 
 * @function updateUsers - A function to update a user.
 * @param {string} req.params.userId - UserId
 * Check {@link ../models/User.js} - for the list of payloads needed.
 * 
 * @function deleteUsers - A function to delete a user.
 * @param {string} req.params.userId - UserId
 */

class UserCommand {
  static async createUsers(req, res) {
    const cx = 'users-createUsers';

    const payload = { ...req.body };
    const findByEmail = await User.findOne({ email: payload.email });
    if (findByEmail) {
      logger.error(cx, 'Email already registered.');
      return response.error(res, 'Email already registered!', CODE.BAD_REQUEST);
    }

    const password = await Crypt.hash(payload.password);

    const user = await User.create({
      ...payload,
      userId: uuid(),
      email: payload.email.toLowerCase(),
      password: password,
    });

    return response.data(res, 'User created successfully!', user);
  }

  static async loginUsers(req, res) {
    const cx = 'users-loginUsers';

    const payload = { ...req.body };
    const user = await User.findOne({ email: payload.email });

    if (!user) {
      logger.error(cx, 'Email not found.');
      return response.error(res, 'Email not found!', CODE.NOT_FOUND);
    }

    const token = await Crypt.signToken(res, user, payload);

    const result = {
      userId: user._doc.userId,
      email: payload.email,
      expiresIn: 86400,
      accessToken: token
    };
    return response.data(res, 'You have logged in!', result);
  }

  static async updateUsers(req, res) {
    const cx = 'users-updateUsers';

    const payload = { ...req.params, ...req.body };
    const findByUserId = await User.findOne({ userId: payload.userId });

    if (!findByUserId) {
      logger.error(cx, 'User not found.');
      return response.error(res, 'User not found!', CODE.NOT_FOUND);
    }

    const data = {
      name: payload.name,
      email: payload.email,
      address: payload.address
    };

    const user = await User.updateOne({ userId: payload.userId }, data);
    if (!user) {
      logger.error(cx, 'Failed to update user data.');
      return response.error(res, 'Failed to update user data!', CODE.INTERNAL_ERROR);
    }

    return response.data(res, 'User updated successfully!', user);
  }

  static async deleteUsers(req, res) {
    const cx = 'users-deleteUsers';
    const payload = { ...req.params };

    const findByUserId = await User.findOne({ userId: payload.userId });

    if (!findByUserId) {
      logger.error(cx, 'User not found.');
      return response.error(res, 'User not found!', CODE.NOT_FOUND);
    }

    const user = await User.deleteOne({ userId: payload.userId });
    if (!user) {
      logger.error(cx, 'Failed to delete user.');
      return response.error(res, 'Failed to delete user!', CODE.INTERNAL_ERROR);
    }

    return response.data(res, 'User deleted successfully!', user);

  }

  static async shortener(req, res) {
    const cx = 'users-createUsers';

    const payload = {
      ...req.query
    };

    let linkUniq = uuid();

    url.set(linkUniq, {
      original: payload.realUrl,
      total: 0
    });

    console.log(`http://localhost:8080/${linkUniq}`);

    return response.data(res, 'User created successfully!', {
      uniq: linkUniq
    });
  }

  static async getShortener(req, res) {
    const cx = 'users-createUsers';

    const payload = {
      ...req.params
    };
    // console.log(payload);

    // console.log(`http://localhost:8080/${linkUniq}`);
    const original = url.get(payload.linkUniq);
    let total = original.total + 1;
    url.set(payload.linkUniq, {
      total: total,
      original: original.original
    })
    res.redirect(`https://${original.original}`);

    // return response.data(res, 'User created successfully!', {
    //   original: original
    // });
  }

  static async checkShortener(req, res) {
    const cx = 'users-createUsers';

    const payload = {
      ...req.params
    };
    // console.log(payload);

    // console.log(`http://localhost:8080/${linkUniq}`);
    // const original = url.get(payload.linkUniq);
    // let total = original.total + 1;
    // url.set(payload.linkUniq, {
    //   total: total,
    //   original: payload.original
    // })
    // res.redirect(`https://${original.original}`);
    const original = url.get(payload.linkUniq);

    return response.data(res, 'User created successfully!', {
      original: original
    });
  }
}

module.exports = UserCommand;
