const db = require("../db");

/** Collection of methods related to companies
 * 
 * Functions
 *  -> Create   - Creates new company in database.
 *  -> FindAll  - (TDB)
 *  -> FindOne  - (TDB)
 *  -> Update   - (TDB)
 * 
*/

class Company {
  /**  
   * The following function creates a new company in the database.
   * 
   * Params: { handle, name, num_employees, description, logo_url }
   * Returns: { handle, name, num_employees, description, logo_url }
   * 
   */
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

  static async findAll() {
    const results = await db.query(`
      SELECT handle,
             name,
             num_employees,
             description,
             logo_url
        FROM companies
        ORDER BY handle
    `)

    return results.rows;
  }
}

module.exports = Company;