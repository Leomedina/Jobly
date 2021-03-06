/** Collection of flexible methods for a method
 * 
 * Class Methods:
 *  USER-ONLY: (remove this - move to util funcs)
 *  -> Register       - Registers a user to the user's table.
 *  -> Authenticate   - Authenticates a user to the table.
 * 
 * CRUD: (string queries into const move to utils)
 *  -> get            - retrieves single item from database.
 *  -> findAll        - retrieves all items from database or items matching query.
 *  -> create         - Creates a new item in the database.
 *  -> update         - Updates item in the database.
 *  -> delete         - Deletes item in the database.
 * 
 * Helper functions: (move to utils, non class dependant - utility class)
 *  -> WhereExpressions     - creates where expressions depending on query passed
 *  -> createquery          - creates SQL queries.
 *  -> partialupdatequery   - creates queries for update
 * 
*/
const db = require("../db");
const ExpressError = require("../helpers/expressError");
const bcrypt = require("bcrypt");
const BCRYPT_WORK_FACTOR = 12;

class Table {
  /**Creates the table MUST match PostgreSQL database*/
  constructor(table_name, primary_key, columns) {
    this.table_name = table_name;
    this.primary_key = primary_key;
    this.columns = [...columns];
  }
  //this is specifically for a user-table used to register and authenticate users
  async register({ email, password, name, photo_url, is_admin }) {
    const hashed_password = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const results = await db.query(`
          INSERT INTO users (
              email,
              password,
              name,
              photo_url, 
              is_admin)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING email, password, name, photo_url, is_admin
      `, [email, hashed_password, name, photo_url, is_admin]);
    return results.rows[0];
  }

  async authenticate(email, password) {
    const results = await db.query(`
        SELECT email, password
          FROM users
          WHERE email=$1
      `, [email]);
    const user = results.rows[0];
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        return true;
      }
    };
    throw new ExpressError("Invalid email or Password", 400);
  };

  /** Gets a single object in the DB based on primary key */
  async get(primary_key) {
    const cols = this.columns.join(", ");

    const results = await db.query(`
      SELECT ${cols} FROM ${this.table_name}
      WHERE ${this.primary_key}=$1
      `, [primary_key]);

    return results.rows[0];
  }

  /** handle search queries */
  async findAll(query) {
    let baseQuery = `SELECT ${this.columns} FROM ${this.table_name}`;
    let { whereExpressions, queryValues } = this.whereExpressions(query);

    if (whereExpressions.length > 0) {
      baseQuery += " WHERE ";
    }

    const new_query = baseQuery + whereExpressions.join(" AND ");
    const results = await db.query(new_query, queryValues);
    return results.rows;
  }

  /** Create a new object in the DB */
  async create(data) {
    const { query, values } = this.createQuery(data);
    const result = await db.query(query, values);

    return result.rows[0];
  };

  /** Updates item in the database */
  async update(primary_key, data) {
    const { query, values } = this.partialUpdateQuery(primary_key, data);
    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      throw { message: `No item with ${this.primary_key}: ${primary_key}`, status: 400 }
    };
    return result.rows[0];
  };

  /** Deletes a single object from DB */
  async remove(primary_key) {
    const result = await db.query(`
      DELETE FROM ${this.table_name}
        WHERE ${this.primary_key} = $1
        RETURNING ${this.primary_key}
    `, [primary_key]);

    if (result.rowCount === 0) {
      throw { message: `No item with ${this.primary_key}: ${primary_key}`, status: 400 }
    };
  };

  /**Helper function to build where expressions for querying data (move to utilities) */
  whereExpressions(query) {
    let min = null;
    let max = null;
    let whereExpressions = []
    let queryValues = []
    
    /** switch case on where to optimize - makes it easier to read */
    for (let item in query) {
      if (item.includes("min")) {
        min = [item, query[item]];
        queryValues.push(query[item])
      } else if (item.includes("max")) {
        max = [item, query[item]];
        queryValues.push(query[item])
      };
    };
    if (min && max) {
      if (max[1] < min[1]) {
        throw { message: "Min must be lower than max", status: 400 }
      };
    };
    if (min) {
      whereExpressions.push(`${min[0].slice(4)} >= $${queryValues.length}`)
    };
    if (max) {
      whereExpressions.push(`${max[0].slice(4)} <= $${queryValues.length}`)
    };
    if (query.search) {
      queryValues.push(`%${query.search}%`);
      whereExpressions.push(`${this.columns[1]} ILIKE $${queryValues.length}`);
    };
    return { whereExpressions, queryValues };
  };

  /** Helper Function for create */
  createQuery(data) {
    let idx = 1;
    let columns = [];
    let valuesVariable = []

    // filter out keys that start with "_" -- we don't want these in DB (see where i can use map or ES2015+ funcs)
    for (let column in data) {
      if (column.startsWith("_")) {
        delete data[column];
      }
    }
    for (let column in data) {
      columns.push(`${column}`);
      valuesVariable.push(`$${idx}`);
      idx += 1;
    }

    /** Build Query */
    let cols = columns.join(", ");
    let val = valuesVariable.join(", ");
    let query = `
          INSERT INTO ${this.table_name} (${cols}) 
            VALUES (${val})
          RETURNING ${cols}`;
    let values = Object.values(data);

    return { query, values };
  };

  /** Helper function for update */
  partialUpdateQuery(primary_key, data) {
    // keep track of item indexes
    // store all the columns we want to update and associate with vals

    let idx = 1;
    let columns = [];

    // filter out keys that start with "_" -- we don't want these in DB
    for (let column in data) {
      if (column.startsWith("_")) {
        delete data[column];
      }
    }

    for (let column in data) {
      columns.push(`${column}=$${idx}`);
      idx += 1;
    }

    // build query
    let cols = columns.join(", ");
    let query = `UPDATE ${this.table_name} SET ${cols} WHERE ${this.primary_key}=$${idx} RETURNING *`;

    let values = Object.values(data);
    values.push(primary_key);

    return { query, values };
  };
};

module.exports = Table;