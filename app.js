const API_BASE_URL = 'http://127.0.0.1:8000/api';

// DOM elementlar
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const loading = document.getElementById('loading');
const resultsSection = document.getElementById('resultsSection');
const tableBody = document.getElementById('tableBody');
const rawText = document.getElementById('rawText');

// Upload area event listeners
uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});
uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});
uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        handleUpload();
    }
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        handleUpload();
    }
});

uploadBtn.addEventListener('click', handleUpload);

// Upload funksiyasi
async function handleUpload() {
    const file = fileInput.files[0];
    if (!file) {
        alert('Iltimos, rasm tanlang!');
        return;
    }

    const fileType = document.getElementById('fileType').value;
    const language = document.getElementById('language').value;
    const userRole = localStorage.getItem('user_role') || 'user'; // Default: user

    const formData = new FormData();
    formData.append('file', file);

    loading.style.display = 'block';
    resultsSection.style.display = 'none';

    try {
        const response = await fetch(
            `${API_BASE_URL}/ocr/upload?file_type=${fileType}&language=${language}&user_role=${userRole}`,
            {
                method: 'POST',
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error('Xato:', error);
        alert('Xato yuz berdi: ' + error.message);
    } finally {
        loading.style.display = 'none';
    }
}

// Natijalarni ko'rsatish
function displayResults(data) {
    // Document info
    const extractedData = data.extracted_data || {};
    const docData = extractedData.document || {};  // document o'rniga docData
    const table = extractedData.table || {};

    document.getElementById('detectedLanguage').textContent = 
        extractedData.detected_language || docData.language || '-';
    document.getElementById('confidence').textContent = 
        data.confidence ? `${data.confidence}%` : 
        (docData.confidence ? `${(docData.confidence * 100).toFixed(1)}%` : '-');
    document.getElementById('title').textContent = 
        docData.title || extractedData.title || '-';
    document.getElementById('year').textContent = 
        docData.year || extractedData.year || '-';

    // File type ga qarab ko'rsatish
    const fileType = document.getElementById('fileType').value;
    
    if (fileType === 'passport') {
        // Passport ma'lumotlarini ko'rsatish
        renderPassportData(extractedData);
    } else if (table.rows && table.rows.length > 0) {
        // Jadvalni render qilish
        renderTable(table.rows);
    } else {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;">Jadval ma\'lumotlari topilmadi</td></tr>';
    }

    // Raw text
    rawText.textContent = data.extracted_text || 'Matn topilmadi';

    resultsSection.style.display = 'block';
}

// Passport ma'lumotlarini render qilish (Professional format - confidence score bilan)
function renderPassportData(extractedData) {
    tableBody.innerHTML = '';
    
    // Jadval header'ni yashirish
    const tableHeader = document.getElementById('tableHeader');
    if (tableHeader) {
        tableHeader.style.display = 'none';
    }
    
    // Professional format: fields object
    const fields = extractedData.fields || {};
    
    const passportFields = [
        { label: 'Familiya', keys: ['surname', 'familiya'] },
        { label: 'Ism', keys: ['given_names', 'ism'] },
        { label: 'Otasining ismi', keys: ['patronymic', 'otasining_ismi'] },
        { label: 'Jins', keys: ['sex', 'jins'] },
        { label: 'Millati', keys: ['nationality', 'millati'] },
        { label: 'Tug\'ilgan sana', keys: ['date_of_birth', 'tugilgan_sanasi'] },
        { label: 'Tug\'ilgan joyi', keys: ['place_of_birth', 'tugilgan_joyi'] },
        { label: 'Berilgan vaqti', keys: ['date_of_issue', 'berilgan_vaqti'] },
        { label: 'Amal qilish muddati', keys: ['date_of_expiry', 'amal_qilish_muddati'] },
        { label: 'Passport raqami', keys: ['passport_number', 'passport_raqami'] },
        { label: 'Kim tomonidan berilgan', keys: ['authority', 'kim_tomonidan_berilgan'] },
    ];
    
    passportFields.forEach(field => {
        // Field ni topish
        let fieldData = null;
        for (const key of field.keys) {
            if (fields[key]) {
                fieldData = fields[key];
                break;
            }
        }
        
        const value = fieldData?.value || '-';
        const confidence = fieldData?.confidence || 0;
        const mrzVerified = fieldData?.mrz_verified;
        const warning = fieldData?.warning;
        const isMasked = fieldData?.masked || false;
        
        // Confidence rangini aniqlash
        let confidenceClass = 'confidence-high';
        let confidenceColor = '#28a745';
        if (confidence < 0.7) {
            confidenceClass = 'confidence-low';
            confidenceColor = '#dc3545';
        } else if (confidence < 0.9) {
            confidenceClass = 'confidence-medium';
            confidenceColor = '#ffc107';
        }
        
        // MRZ verified badge
        let mrzBadge = '';
        if (mrzVerified === true) {
            mrzBadge = '<span style="background: #28a745; color: white; padding: 2px 6px; border-radius: 8px; font-size: 0.75em; margin-left: 5px;">MRZ ✓</span>';
        } else if (mrzVerified === false) {
            mrzBadge = '<span style="background: #dc3545; color: white; padding: 2px 6px; border-radius: 8px; font-size: 0.75em; margin-left: 5px;">MRZ ✗</span>';
        }
        
        // Masked badge
        let maskedBadge = '';
        if (isMasked) {
            maskedBadge = '<span style="background: #6c757d; color: white; padding: 2px 6px; border-radius: 8px; font-size: 0.75em; margin-left: 5px;" title="PII Masked">🔒</span>';
        }
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: 600; width: 200px;">${field.label}:</td>
            <td style="font-weight: 600; font-family: ${isMasked ? 'monospace' : 'inherit'};">
                ${value} ${mrzBadge} ${maskedBadge}
            </td>
            <td style="color: ${confidenceColor}; font-size: 0.9em;">
                <span class="confidence-badge" style="background: ${confidenceColor}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.85em;">
                    ${(confidence * 100).toFixed(0)}%
                </span>
            </td>
            <td colspan="2">
                ${warning ? `<span style="color: #ffc107; font-size: 0.85em;">⚠️ ${warning}</span>` : ''}
            </td>
        `;
        tableBody.appendChild(tr);
    });
    
    // MRZ ni ko'rsatish (Professional format + Validatsiya)
    if (extractedData.mrz) {
        const mrz = extractedData.mrz;
        const validation = mrz.validation || {};
        const crossCheck = extractedData.cross_check || {};
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: 600; vertical-align: top;">MRZ:</td>
            <td colspan="4">
                <div style="font-family: monospace; background: #2d2d2d; color: #f8f8f2; padding: 10px; border-radius: 4px; margin-top: 5px;">
                    <div>${mrz.line1 || mrz}</div>
                    ${mrz.line2 ? `<div>${mrz.line2}</div>` : ''}
                ${mrz.masked ? `<div style="margin-top: 5px; font-size: 0.85em; color: #6c757d;">🔒 PII Masked</div>` : ''}
                </div>
                
                ${validation.valid !== undefined ? `
                    <div style="margin-top: 10px;">
                        <div style="font-weight: 600; margin-bottom: 5px;">MRZ Validatsiya:</div>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            ${validation.checksums ? `
                                <span style="color: ${validation.checksums.passport_number_valid ? '#28a745' : '#dc3545'};">
                                    ${validation.checksums.passport_number_valid ? '✓' : '✗'} Passport Number
                                </span>
                                <span style="color: ${validation.checksums.date_of_birth_valid ? '#28a745' : '#dc3545'};">
                                    ${validation.checksums.date_of_birth_valid ? '✓' : '✗'} DOB
                                </span>
                                <span style="color: ${validation.checksums.date_of_expiry_valid ? '#28a745' : '#dc3545'};">
                                    ${validation.checksums.date_of_expiry_valid ? '✓' : '✗'} Expiry
                                </span>
                            ` : ''}
                            <span style="color: ${validation.valid ? '#28a745' : '#dc3545'}; font-weight: 600;">
                                ${validation.valid ? '✓ Valid' : '✗ Invalid'}
                            </span>
                        </div>
                        ${validation.errors && validation.errors.length > 0 ? `
                            <div style="margin-top: 5px; color: #dc3545; font-size: 0.9em;">
                                ${validation.errors.map(e => `⚠️ ${e}`).join('<br>')}
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
                
                ${crossCheck.matches ? `
                    <div style="margin-top: 10px;">
                        <div style="font-weight: 600; margin-bottom: 5px;">OCR ↔ MRZ Cross-Check:</div>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            ${Object.entries(crossCheck.matches).map(([key, match]) => {
                                if (match === null) return '';
                                const color = match ? '#28a745' : '#dc3545';
                                const icon = match ? '✓' : '✗';
                                return `<span style="color: ${color};">
                                    ${icon} ${key.replace('_', ' ')}
                                </span>`;
                            }).join('')}
                        </div>
                        <div style="margin-top: 5px; font-size: 0.9em;">
                            Confidence: <strong>${(crossCheck.confidence * 100).toFixed(0)}%</strong>
                        </div>
                        ${crossCheck.warnings && crossCheck.warnings.length > 0 ? `
                            <div style="margin-top: 5px; color: #ffc107; font-size: 0.9em;">
                                ${crossCheck.warnings.map(w => `⚠️ ${w}`).join('<br>')}
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
            </td>
        `;
        tableBody.appendChild(tr);
    }
}

// Jadvalni render qilish
function renderTable(rows) {
    tableBody.innerHTML = '';
    
    // Jadval header'ni ko'rsatish
    const tableHeader = document.getElementById('tableHeader');
    if (tableHeader) {
        tableHeader.innerHTML = `
            <tr>
                <th>Sana</th>
                <th>Temir (철)</th>
                <th>Mis (동)</th>
                <th>Jami</th>
                <th>Harakatlar</th>
            </tr>
        `;
        tableHeader.style.display = '';
    }

    rows.forEach((row, index) => {
        const tr = document.createElement('tr');
        const meta = row.meta || {};

        // Sana
        const dateCell = createCell(row.date || '-', meta, 'date');
        tr.appendChild(dateCell);

        // Iron (Temir)
        const ironCell = createCell(
            row.iron !== null && row.iron !== undefined ? row.iron : '-',
            meta,
            'iron',
            row.iron,
            meta.original_value?.iron
        );
        tr.appendChild(ironCell);

        // Copper (Mis)
        const copperCell = createCell(
            row.copper !== null && row.copper !== undefined ? row.copper : '-',
            meta,
            'copper',
            row.copper,
            meta.original_value?.copper
        );
        tr.appendChild(copperCell);

        // Total (Jami)
        const totalCell = createCell(
            row.total !== null && row.total !== undefined ? row.total : '-',
            meta,
            'total',
            row.total,
            meta.original_value?.total
        );
        tr.appendChild(totalCell);

        // Harakatlar
        const actionsCell = document.createElement('td');
        actionsCell.innerHTML = `
            <button class="btn-edit" onclick="editRow(${index})">✏️ Tahrirlash</button>
        `;
        tr.appendChild(actionsCell);

        tableBody.appendChild(tr);
    });
}

// Cell yaratish (meta ma'lumotlariga qarab)
function createCell(value, meta, fieldType, currentValue, originalValue) {
    const td = document.createElement('td');
    td.className = 'cell-value';
    td.dataset.field = fieldType;
    td.dataset.index = tableBody.children.length;

    // Confidence past bo'lsa highlight
    if (meta.confidence && meta.confidence < 0.7) {
        td.classList.add('cell-low-confidence');
    }

    // Qizil rang
    if (meta.color === 'red') {
        td.classList.add('cell-red');
    }

    // Crossed out (chizilgan) - original value va current value mavjud bo'lsa
    if (meta.crossed_out && originalValue !== null && originalValue !== undefined) {
        const finalValue = currentValue !== null && currentValue !== undefined ? currentValue : value;
        
        // Agar original va final qiymatlar farq qilsa
        if (originalValue != finalValue && finalValue !== '-') {
            td.classList.add('cell-crossed');
            td.innerHTML = `
                <span style="text-decoration: line-through; color: #999; font-size: 0.9em;">${originalValue}</span>
                <span style="margin-left: 10px; font-weight: 600; color: #333;">${finalValue}</span>
            `;
        } else if (originalValue) {
            // Faqat original value ko'rsatish (chizilgan)
            td.classList.add('cell-crossed');
            td.innerHTML = `
                <span style="text-decoration: line-through; color: #999;">${originalValue}</span>
            `;
        } else {
            td.textContent = value;
        }
    } else {
        td.textContent = value;
    }

    return td;
}

// Row tahrirlash
let editingIndex = null;
let originalRowData = null;

function editRow(index) {
    if (editingIndex !== null) {
        alert('Avval boshqa qatorni saqlang!');
        return;
    }

    editingIndex = index;
    const row = tableBody.children[index];
    const cells = row.querySelectorAll('td:not(:last-child)');
    
    originalRowData = {
        date: cells[0].textContent,
        iron: cells[1].textContent,
        copper: cells[2].textContent,
        total: cells[3].textContent
    };

    // Har bir cell ni input ga aylantirish
    cells.forEach((cell, i) => {
        if (i === 0) return; // Sana tahrirlash mumkin emas (keyinroq qo'shiladi)
        
        const currentValue = cell.textContent.trim();
        if (currentValue !== '-') {
            cell.classList.add('cell-editing');
            cell.innerHTML = `<input type="number" value="${currentValue}" />`;
        }
    });

    // Harakatlar tugmalarini o'zgartirish
    const actionsCell = row.querySelector('td:last-child');
    actionsCell.innerHTML = `
        <button class="btn-save" onclick="saveRow(${index})">💾 Saqlash</button>
        <button class="btn-cancel" onclick="cancelEdit(${index})">❌ Bekor qilish</button>
    `;
}

// Row saqlash
function saveRow(index) {
    const row = tableBody.children[index];
    const cells = row.querySelectorAll('td:not(:last-child)');
    const inputs = row.querySelectorAll('input');

    const newData = {
        date: cells[0].textContent,
        iron: inputs[0] ? inputs[0].value : cells[1].textContent,
        copper: inputs[1] ? inputs[1].value : cells[2].textContent,
        total: inputs[2] ? inputs[2].value : cells[3].textContent
    };

    // Cell larni yangilash
    cells[1].textContent = newData.iron || '-';
    cells[2].textContent = newData.copper || '-';
    cells[3].textContent = newData.total || '-';

    // Editing class ni olib tashlash
    cells.forEach(cell => {
        cell.classList.remove('cell-editing');
    });

    // Harakatlar tugmalarini qaytarish
    const actionsCell = row.querySelector('td:last-child');
    actionsCell.innerHTML = `
        <button class="btn-edit" onclick="editRow(${index})">✏️ Tahrirlash</button>
    `;

    editingIndex = null;
    originalRowData = null;

    // Bu yerda API ga yangilangan ma'lumotlarni yuborish mumkin
    console.log('Yangilangan ma\'lumotlar:', newData);
}

// Tahrirlashni bekor qilish
function cancelEdit(index) {
    if (originalRowData) {
        const row = tableBody.children[index];
        const cells = row.querySelectorAll('td:not(:last-child)');

        cells[1].textContent = originalRowData.iron;
        cells[2].textContent = originalRowData.copper;
        cells[3].textContent = originalRowData.total;

        cells.forEach(cell => {
            cell.classList.remove('cell-editing');
        });
    }

    // Harakatlar tugmalarini qaytarish
    const row = tableBody.children[index];
    const actionsCell = row.querySelector('td:last-child');
    actionsCell.innerHTML = `
        <button class="btn-edit" onclick="editRow(${index})">✏️ Tahrirlash</button>
    `;

    editingIndex = null;
    originalRowData = null;
}
