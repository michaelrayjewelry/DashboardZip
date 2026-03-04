// =============================================================================
// XML Import/Export Engine for Zip Jeweler Dashboard
//
// Handles serialization/deserialization of all data types to/from XML format.
// Designed for interoperability with jewelry management systems.
// =============================================================================

/**
 * Export full application state to XML string
 */
export function exportToXml(state) {
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>'];
  lines.push('<ZipJewelerExport version="1.0" exportDate="' + new Date().toISOString() + '">');

  // Inventory
  lines.push('  <Inventory>');
  state.inventory.forEach(item => {
    lines.push('    <Item>');
    Object.entries(item).forEach(([key, value]) => {
      if (key === 'images') return;
      lines.push(`      <${key}>${escapeXml(String(value))}</${key}>`);
    });
    lines.push('    </Item>');
  });
  lines.push('  </Inventory>');

  // Orders
  lines.push('  <Orders>');
  state.orders.forEach(order => {
    lines.push('    <Order>');
    Object.entries(order).forEach(([key, value]) => {
      if (key === 'items') {
        lines.push('      <Items>');
        value.forEach(item => {
          lines.push('        <OrderItem>');
          Object.entries(item).forEach(([ik, iv]) => {
            lines.push(`          <${ik}>${escapeXml(String(iv))}</${ik}>`);
          });
          lines.push('        </OrderItem>');
        });
        lines.push('      </Items>');
      } else {
        lines.push(`      <${key}>${escapeXml(String(value ?? ''))}</${key}>`);
      }
    });
    lines.push('    </Order>');
  });
  lines.push('  </Orders>');

  // Customers
  lines.push('  <Customers>');
  state.customers.forEach(customer => {
    lines.push('    <Customer>');
    Object.entries(customer).forEach(([key, value]) => {
      lines.push(`      <${key}>${escapeXml(String(value))}</${key}>`);
    });
    lines.push('    </Customer>');
  });
  lines.push('  </Customers>');

  // Repairs
  lines.push('  <Repairs>');
  state.repairs.forEach(repair => {
    lines.push('    <Repair>');
    Object.entries(repair).forEach(([key, value]) => {
      lines.push(`      <${key}>${escapeXml(String(value ?? ''))}</${key}>`);
    });
    lines.push('    </Repair>');
  });
  lines.push('  </Repairs>');

  // Appraisals
  lines.push('  <Appraisals>');
  state.appraisals.forEach(appraisal => {
    lines.push('    <Appraisal>');
    Object.entries(appraisal).forEach(([key, value]) => {
      lines.push(`      <${key}>${escapeXml(String(value ?? ''))}</${key}>`);
    });
    lines.push('    </Appraisal>');
  });
  lines.push('  </Appraisals>');

  // Custom Orders
  lines.push('  <CustomOrders>');
  state.customOrders.forEach(co => {
    lines.push('    <CustomOrder>');
    Object.entries(co).forEach(([key, value]) => {
      lines.push(`      <${key}>${escapeXml(String(value ?? ''))}</${key}>`);
    });
    lines.push('    </CustomOrder>');
  });
  lines.push('  </CustomOrders>');

  lines.push('</ZipJewelerExport>');
  return lines.join('\n');
}

/**
 * Parse XML string and return state-compatible data objects
 */
export function parseXmlImport(xmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');

  const error = doc.querySelector('parsererror');
  if (error) {
    throw new Error('Invalid XML: ' + error.textContent);
  }

  const result = {};

  // Parse Inventory
  const inventoryItems = doc.querySelectorAll('Inventory > Item');
  if (inventoryItems.length > 0) {
    result.inventory = Array.from(inventoryItems).map(node => nodeToObject(node, {
      costPrice: 'number', retailPrice: 'number', quantity: 'number', caratWeight: 'number',
    }));
  }

  // Parse Orders
  const orderNodes = doc.querySelectorAll('Orders > Order');
  if (orderNodes.length > 0) {
    result.orders = Array.from(orderNodes).map(node => {
      const obj = nodeToObject(node, {
        subtotal: 'number', tax: 'number', total: 'number',
      });
      // Parse nested items
      const itemNodes = node.querySelectorAll('Items > OrderItem');
      if (itemNodes.length > 0) {
        obj.items = Array.from(itemNodes).map(itemNode =>
          nodeToObject(itemNode, { quantity: 'number', price: 'number' })
        );
      }
      return obj;
    });
  }

  // Parse Customers
  const customerNodes = doc.querySelectorAll('Customers > Customer');
  if (customerNodes.length > 0) {
    result.customers = Array.from(customerNodes).map(node => nodeToObject(node, {
      totalSpent: 'number', orderCount: 'number',
    }));
  }

  // Parse Repairs
  const repairNodes = doc.querySelectorAll('Repairs > Repair');
  if (repairNodes.length > 0) {
    result.repairs = Array.from(repairNodes).map(node => nodeToObject(node, {
      cost: 'number',
    }));
  }

  // Parse Appraisals
  const appraisalNodes = doc.querySelectorAll('Appraisals > Appraisal');
  if (appraisalNodes.length > 0) {
    result.appraisals = Array.from(appraisalNodes).map(node => nodeToObject(node, {
      appraisedValue: 'number',
    }));
  }

  // Parse Custom Orders
  const coNodes = doc.querySelectorAll('CustomOrders > CustomOrder');
  if (coNodes.length > 0) {
    result.customOrders = Array.from(coNodes).map(node => nodeToObject(node, {
      estimatedCost: 'number', deposit: 'number', depositPaid: 'boolean',
    }));
  }

  return result;
}

/**
 * Convert XML element's children to a JS object
 */
function nodeToObject(node, typeMap = {}) {
  const obj = {};
  Array.from(node.children).forEach(child => {
    if (child.children.length > 0 && child.tagName !== 'Items') return;
    const key = child.tagName;
    let value = child.textContent;

    if (typeMap[key] === 'number') {
      value = parseFloat(value) || 0;
    } else if (typeMap[key] === 'boolean') {
      value = value === 'true';
    } else if (value === 'null' || value === 'undefined') {
      value = null;
    }

    obj[key] = value;
  });
  return obj;
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate a sample XML template for data import
 */
export function generateXmlTemplate() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<ZipJewelerExport version="1.0">
  <Inventory>
    <Item>
      <id>INV-001</id>
      <sku>MRJ-RNG-001</sku>
      <name>Sample Ring</name>
      <category>Rings</category>
      <subcategory>Engagement</subcategory>
      <metal>14K Yellow Gold</metal>
      <gemstone>Diamond</gemstone>
      <caratWeight>1.0</caratWeight>
      <clarity>VS1</clarity>
      <color>F</color>
      <cut>Excellent</cut>
      <costPrice>1000</costPrice>
      <retailPrice>2500</retailPrice>
      <quantity>1</quantity>
      <supplier>Supplier Name</supplier>
      <location>Display Case 1</location>
      <status>In Stock</status>
      <certNumber></certNumber>
      <description>Description here</description>
    </Item>
  </Inventory>
  <Customers>
    <Customer>
      <id>CUS-001</id>
      <firstName>First</firstName>
      <lastName>Last</lastName>
      <email>email@example.com</email>
      <phone>(555) 000-0000</phone>
      <address>123 Main St</address>
      <tier>Standard</tier>
    </Customer>
  </Customers>
</ZipJewelerExport>`;
}
