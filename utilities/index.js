const invModel = require("../models/inventory-model");

// ************************
// Utilities container
// ************************
const utilities = {};

// ************************
// Build navigation HTML
// ************************
utilities.getNav = async function () {
  const data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
  });
  list += "</ul>";
  return list;
};

// ************************
// Build classification grid
// ************************
utilities.buildClassificationGrid = async function (data) {
  let grid = "";
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach(vehicle => {
      grid += `<li>
        <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
        </a>
        <div class="namePrice">
          <hr />
          <h2>
            <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
        </div>
      </li>`;
    });
    grid += '</ul>';
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

// ************************
// Build vehicle detail HTML
// ************************
utilities.buildVehicleDetailHtml = function (vehicle) {
  if (!vehicle) return '';

  const make = vehicle.inv_make || '';
  const model = vehicle.inv_model || '';
  const year = vehicle.inv_year || '';
  const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(vehicle.inv_price || 0);
  const miles = vehicle.inv_miles != null ? new Intl.NumberFormat('en-US').format(vehicle.inv_miles) : 'N/A';
  const color = vehicle.inv_color || 'Unknown';
  const desc = vehicle.inv_description || 'No additional details available.';
  const img = vehicle.inv_image || '/images/no-image-available.png';
  const alt = `${make} ${model} ${year}`;

  return `
    <article class="vehicle-detail">
      <figure class="vehicle-image">
        <img src="${img}" alt="${alt}" loading="lazy" />
      </figure>
      <div class="vehicle-meta">
        <h1 class="vehicle-title">${make} ${model} <span class="year">(${year})</span></h1>
        <p class="vehicle-price"><strong>Price:</strong> ${price}</p>
        <p class="vehicle-mileage"><strong>Mileage:</strong> ${miles} miles</p>
        <p class="vehicle-color"><strong>Color:</strong> ${color}</p>
        <section class="vehicle-specs">
          <h2 class="visually-hidden">Vehicle Details</h2>
          <p class="vehicle-description">${desc}</p>
        </section>
        <a href="/inv" class="button-back">Back to Inventory</a>
      </div>
    </article>
  `;
};

// ************************
// Build classification select list (for add-inventory form)
// ************************
utilities.buildClassificationList = async function (selectedId = null) {
  const data = await invModel.getClassifications();
  let classificationList = '<select name="classification_id" id="classificationList" required>';
  classificationList += '<option value="">Choose a Classification</option>';
  data.rows.forEach(row => {
    classificationList += `<option value="${row.classification_id}"${row.classification_id == selectedId ? " selected" : ""}>${row.classification_name}</option>`;
  });
  classificationList += '</select>';
  return classificationList;
};

module.exports = utilities;
