const Sales = require('../models/Sales');

const logger = require('../../../../helpers/lib/logger');
const response = require('../../../../helpers/utils/response');

const { CODE } = require('../../../../helpers/lib/httpCode');

const pool = require('../../../../database/dbPostgre');

class SalesQuery {
  static async getSales(req, res) {

    try {
      const result = await pool.query(`
        SELECT p."Product Name", s.product_id, SUM(s."Quantity") AS total_quantity_sold
        FROM sales s
        JOIN products p ON s.product_id = p.product_id
        GROUP BY s.product_id, p."Product Name" 
        ORDER BY total_quantity_sold DESC
        LIMIT 5;`);

      return response.data(res, 'Data successfully fetched', result.rows);
    } catch (error) {
      return response.error(res, 'Failed to fetch database', CODE.INTERNAL_ERROR);
    }
  }

  static async getMostSoldByCountry(req, res) {

    try {
      const result = await pool.query(`
        SELECT
            ranked."Country"  ,
            ranked."Product Name" ,
            total_quantity_sold
        FROM (
            SELECT
                c."Country" ,
                p."Product Name" ,
                SUM(s."Quantity") AS total_quantity_sold,
                ROW_NUMBER() OVER (
                    PARTITION BY c."Country" 
                    ORDER BY SUM(s."Quantity") DESC
                ) AS rn
            FROM 
                sales s
            JOIN 
                customers c ON s.customer_id = c.customer_id
            JOIN 
                products p ON s.product_id = p.product_id
            GROUP BY 
                c."Country", p."Product Name"
        ) ranked
        WHERE rn <= 5
        ORDER BY ranked."Country";`);

      return response.data(res, 'Data successfully fetched', result.rows);
    } catch (error) {
      return response.error(res, 'Failed to fetch database', CODE.INTERNAL_ERROR);
    }
  }

  static async getCorellation(req, res) {

    try {
      const result = await pool.query(`
        SELECT
            c."State",
            s."Discount" ,
            s."Quantity"
        FROM
            sales s
        JOIN
            customers c ON s.customer_id = c.customer_id
        WHERE
            s."Discount" IS NOT NULL
            AND s."Quantity" IS NOT NULL;`);

      return response.data(res, 'Data successfully fetched', result.rows);
    } catch (error) {
      return response.error(res, 'Failed to fetch database', CODE.INTERNAL_ERROR);
    }
  }
}

module.exports = SalesQuery;
