const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}


/**
 * Get vehicle by inv_id (parameterized query).
 * Note: your inventory table uses `inv_miles` (not inv_mileage).
 * Returns row or null.
 * @param {number|string} invId
 */
async function getVehicleById(invId) {
  const sql = `
    SELECT inv_id, inv_make, inv_model, inv_year, inv_description,
           inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    FROM inventory
    WHERE inv_id = $1
    LIMIT 1;
  `;
  const values = [invId];

  try {
    const result = await pool.query(sql, values);
    if (result.rows.length === 0) return null;
    return result.rows[0];
  } catch (err) {
    throw err; // controller's try/catch will forward to error middleware
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById};