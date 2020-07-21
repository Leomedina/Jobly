/** Collection of methods related to companies
 * 
 * Functions
 *  -> Create   - Creates new company in database.
 *  -> Remove   - Deletes a single company from the database.
 *  -> FindAll  - Retrieves all companies in database.
 *  -> get      - Retrieves a single company in database.
 *  -> Update   - Updates a single company in database.
 * 
*/

const db = require("../db");

class Company {

  /** Creates a new company. Params: { handle, name, num_employees, description, logo_url } */
  static async create(data) {
    const result = await db.query(`
      INSERT INTO companies (
        handle,
        name,
        num_employees,
        description,
        logo_url
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING handle, name, num_employees, description, logo_url
    `, [
      data.handle,
      data.name,
      data.num_employees,
      data.description,
      data.logo_url
    ]);
    return result.rows[0];
  };

  /** Deletes a single company from the database */

  static async remove(handle) {
    const result = await db.query(`
      DELETE FROM companies
        WHERE handle = $1
        RETURNING handle
    `, [handle]);

    if (result.rowCount === 0) {
      throw { message: `There is no company with handle ${handle}`, status: 400 }
    }
  };

  /** Retrieve all companies in the database */
  static async findAll() {
    const results = await db.query(`
      SELECT handle,
             name,
             num_employees,
             description,
             logo_url
        FROM companies
        ORDER BY handle
    `);
    return results.rows;
  };

  /** Retrieves a single company from the database */
  static async get(handle) {
    const result = await db.query(`
      SELECT handle,
             name,
             num_employees,
             description,
             logo_url
      FROM companies
      WHERE handle=$1
      ORDER BY handle 
    `, [handle]);

    if (result.rowCount === 0) {
      throw { message: `No company with handle: ${handle}`, status: 400 }
    };

    return result.rows[0];
  };

  /** Updates a single company in teh database */
  static async update(handle, data) {
    const result = await db.query(`
      UPDATE companies SET
        handle=($1),
        name=($2),
        num_employees=($3),
        description=($4),
        logo_url=($5)
      WHERE handle=($6)
      RETURNING handle,
                name,
                num_employees,
                description,
                logo_url
    `,
      [
        data.handle,
        data.name,
        data.num_employees,
        data.description,
        data.logo_url,
        handle
      ]);

    if (result.rowCount === 0) {
      throw { message: `No company with handle: ${handle}`, status: 400 }
    };
    return result.rows[0];
  };
};

module.exports = Company;