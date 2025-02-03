// Configuration
const LABEL_STYLE = {
  SELECTED_COLOR: '#000000',
  UNSELECTED_COLOR: '#808080',
  HOVER_SELECTED_COLOR: '#1a1a1a',
  HOVER_UNSELECTED_COLOR: '#666666'
};

// State Management
const selectedDistricts = {};


document.addEventListener('DOMContentLoaded', generateMap);

// Initialize Map
async function generateMap() {
  try {
    const response = await fetch('assets/copenhagen_districts.svg');
    const svgContent = await response.text();
    const container = document.getElementById('map-container');
    container.innerHTML = svgContent;

    // Create debug table
    const debugTable = document.createElement('table');
    debugTable.id = 'district-debug';
    debugTable.style.marginTop = '20px';
    debugTable.innerHTML = `
      <thead>
        <tr>
          <th>District</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    container.after(debugTable);

    setupDistricts();
  } catch (error) {
    console.error('Error loading map:', error);
  }
}

function setupDistricts() {
  // Get all district paths and their associated labels
  document.querySelectorAll('path[data-district], circle[data-district]').forEach(element => {
    const district = element.dataset.district;
    
    // Find associated label elements
    const labelRect = document.querySelector(`rect[data-district="${district}"]`);

    // Initialize state
    selectedDistricts[district] = true;
    
    // Initial styling
    updateDistrictStyle(element, true);
    
    // Event listeners
    element.addEventListener('click', () => toggleDistrict(element, labelRect));
    element.addEventListener('mouseenter', () => handleHover(element, true));
    element.addEventListener('mouseleave', () => handleHover(element, false));
  });

  updateDebugTable();
}

function updateDebugTable() {
  const tbody = document.querySelector('#district-debug tbody');
  tbody.innerHTML = '';
  
  Object.entries(selectedDistricts).forEach(([district, isSelected]) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${district}</td>
      <td>${isSelected ? 'On' : 'Off'}</td>
    `;
    tbody.appendChild(row);
  });
}

function toggleDistrict(path, labelRect) {
  const district = path.dataset.district;
  const isSelected = selectedDistricts[district];
  
  selectedDistricts[district] = !isSelected;
  
  updateDistrictStyle(path, !isSelected);
  if (labelRect) {
    labelRect.setAttribute('fill', LABEL_STYLE.UNSELECTED_COLOR);
    labelRect.setAttribute('fill-opacity', '0.9'); // Maintain opacity
  }

  updateDebugTable();
}

function updateDistrictStyle(path, isSelected) {
  console.log(path, isSelected);
  path.style.fill = isSelected ? LABEL_STYLE.SELECTED_COLOR : LABEL_STYLE.UNSELECTED_COLOR;
  path.style.cursor = 'pointer';
}

function handleHover(path, isHovering) {
  const isSelected = selectedDistricts[path.dataset.district];
  path.style.fill = isHovering
    ? isSelected ? LABEL_STYLE.HOVER_SELECTED_COLOR : LABEL_STYLE.HOVER_UNSELECTED_COLOR
    : isSelected ? LABEL_STYLE.SELECTED_COLOR : LABEL_STYLE.UNSELECTED_COLOR;
  
  // Add slight scale effect on hover
  if (isHovering) {
    path.style.transform = 'translateY(-5px)';
    path.style.transition = 'transform 0.1s ease';
  } else {
    path.style.transform = 'scale(1)';
  }
}