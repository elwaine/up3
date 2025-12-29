// ==================== DATA CONFIGURATION ====================
// Ganti dengan URL Google Apps Script kamu
const GOOGLE_APPS_SCRIPT_URL = 'YOUR_DEPLOYED_WEB_APP_URL_HERE';

// Data untuk setiap unit
const unitData = {
    'up3-makassar-selatan': {
        name: 'UP3 MAKASSAR SELATAN',
        targetGangguan: '1000 kali gangguan menjadi 900 kali gangguan'
    },
    malino: {
        name: 'MALINO',
        targetGangguan: '185 kali gangguan menjadi 167 kali gangguan'
    },
    kalebajeng: {
        name: 'KALEBAJENG',
        targetGangguan: '150 kali gangguan menjadi 135 kali gangguan'
    },
    mattoanging: {
        name: 'MATTOANGING',
        targetGangguan: '170 kali gangguan menjadi 155 kali gangguan'
    },
    sungguminasa: {
        name: 'SUNGGUMINASA',
        targetGangguan: '200 kali gangguan menjadi 180 kali gangguan'
    },
    takalar: {
        name: 'TAKALAR',
        targetGangguan: '160 kali gangguan menjadi 145 kali gangguan'
    },
    panakkukang: {
        name: 'PANAKKUKANG',
        targetGangguan: '190 kali gangguan menjadi 175 kali gangguan'
    }
};

// Data bulan
const monthData = {
    januari: { name: 'JANUARI', number: 1 },
    februari: { name: 'FEBRUARI', number: 2 },
    maret: { name: 'MARET', number: 3 },
    april: { name: 'APRIL', number: 4 },
    mei: { name: 'MEI', number: 5 },
    juni: { name: 'JUNI', number: 6 },
    juli: { name: 'JULI', number: 7 },
    agustus: { name: 'AGUSTUS', number: 8 },
    september: { name: 'SEPTEMBER', number: 9 },
    oktober: { name: 'OKTOBER', number: 10 },
    november: { name: 'NOVEMBER', number: 11 },
    desember: { name: 'DESEMBER', number: 12 }
};

// SAMPLE DATA - Replace this with Google Sheets data
const sampleTableData = [
    {
        leadMeasure: 'Inspeksi JTM sebanyak 364,99 kms s.d 31 Desember 2025',
        metric: 'kms',
        pekan1: { target: 15.00, realisasi: 41.73, persen: 278.20, status: 'baik' },
        pekan2: { target: 15.00, realisasi: 46.49, persen: 309.93, status: 'baik' },
        pekan3: { target: 15.00, realisasi: 37.35, persen: 249.00, status: 'baik' },
        pekan4: { target: 15.00, realisasi: 93.30, persen: 622.00, status: 'baik' },
        kumulatif: { target: 60.00, realisasi: 218.87, persen: 364.78, status: 'baik' }
    },
    {
        leadMeasure: 'Tindak Lanjut temuan JTM s.d 31 Desember 2025',
        metric: 'Titik',
        pekan1: { target: 5.00, realisasi: 1.00, persen: 20.00, status: 'kurang' },
        pekan2: { target: 5.00, realisasi: 0.00, persen: 0.00, status: 'kurang' },
        pekan3: { target: 5.00, realisasi: 0.00, persen: 0.00, status: 'kurang' },
        pekan4: { target: 5.00, realisasi: 2.00, persen: 40.00, status: 'kurang' },
        kumulatif: { target: 20.00, realisasi: 3.00, persen: 15.00, status: 'kurang' }
    },
    {
        leadMeasure: 'Inspeksi Gardu Distribusi sebanyak 282 gardu s.d 31 Desember 2025',
        metric: 'Gardu',
        pekan1: { target: 12.00, realisasi: 1.00, persen: 8.33, status: 'kurang' },
        pekan2: { target: 12.00, realisasi: 0.00, persen: 0.00, status: 'kurang' },
        pekan3: { target: 12.00, realisasi: 12.00, persen: 100.00, status: 'baik' },
        pekan4: { target: 12.00, realisasi: 22.00, persen: 183.33, status: 'baik' },
        kumulatif: { target: 48.00, realisasi: 35.00, persen: 72.92, status: 'kurang' }
    },
    {
        leadMeasure: 'Tindak Lanjut temuan Gardu Distribusi s.d 31 Desember 2025',
        metric: 'Gardu',
        pekan1: { target: 6.00, realisasi: 2.00, persen: 33.33, status: 'kurang' },
        pekan2: { target: 6.00, realisasi: 7.00, persen: 116.67, status: 'baik' },
        pekan3: { target: 6.00, realisasi: 0.00, persen: 0.00, status: 'kurang' },
        pekan4: { target: 6.00, realisasi: 1.00, persen: 16.67, status: 'kurang' },
        kumulatif: { target: 24.00, realisasi: 10.00, persen: 41.67, status: 'kurang' }
    }
];

// ==================== HELPER FUNCTIONS ====================
function getYearForMonth(monthNumber) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    return monthNumber < currentMonth ? currentYear + 1 : currentYear;
}

function formatNumber(num) {
    return parseFloat(num).toFixed(2);
}

function formatPercent(num) {
    return parseFloat(num).toFixed(2) + '%';
}

function getStatusEmoji(status) {
    return (status === 'baik' || status === 'good') ? '😊' : '😞';
}

function getPercentageClass(persen) {
    const p = parseFloat(persen);
    if (p >= 100) return 'percentage-green';
    if (p >= 80) return 'percentage-yellow';
    return 'percentage-red';
}

// ==================== TABLE FUNCTIONS ====================
function populateTable(data) {
    const tbody = document.getElementById('table-body');
    const unitCell = document.querySelector('.unit-cell');
    
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="14" style="text-align: center; padding: 40px;">Tidak ada data</td></tr>';
        return;
    }
    
    let html = '';
    const rowspan = data.length * 3;
    
    data.forEach((row, index) => {
        const isFirst = index === 0;
        
        // Row 1: Target
        html += '<tr>';
        if (isFirst) {
            const unitName = unitCell ? unitCell.textContent : 'MALINO';
            html += `<td rowspan="${rowspan}" class="unit-cell">${unitName}</td>`;
        }
        html += `
            <td rowspan="2" class="lead-measure-cell">${row.leadMeasure}</td>
            <td class="metric-label">Target (${row.metric})</td>
            <td class="value-cell pekan-col">${formatNumber(row.pekan1.target)}</td>
            <td rowspan="2" class="emoji-cell status-col">${getStatusEmoji(row.pekan1.status)}</td>
            <td class="value-cell pekan-col">${formatNumber(row.pekan2.target)}</td>
            <td rowspan="2" class="emoji-cell status-col">${getStatusEmoji(row.pekan2.status)}</td>
            <td class="value-cell pekan-col">${formatNumber(row.pekan3.target)}</td>
            <td rowspan="2" class="emoji-cell status-col">${getStatusEmoji(row.pekan3.status)}</td>
            <td class="value-cell pekan-col">${formatNumber(row.pekan4.target)}</td>
            <td rowspan="2" class="emoji-cell status-col">${getStatusEmoji(row.pekan4.status)}</td>
            <td class="value-cell pekan-col" style="font-weight: 900; color: #1b6176;">${formatNumber(row.kumulatif.target)}</td>
            <td rowspan="2" class="emoji-cell status-col">${getStatusEmoji(row.kumulatif.status)}</td>
        </tr>`;
        
        // Row 2: Realisasi
        const getColor = (p) => parseFloat(p) >= 100 ? '#28a745' : '#dc3545';
        html += `<tr>
            <td class="metric-label">Realisasi (${row.metric})</td>
            <td class="value-cell pekan-col" style="color: ${getColor(row.pekan1.persen)};">${formatNumber(row.pekan1.realisasi)}</td>
            <td class="value-cell pekan-col" style="color: ${getColor(row.pekan2.persen)};">${formatNumber(row.pekan2.realisasi)}</td>
            <td class="value-cell pekan-col" style="color: ${getColor(row.pekan3.persen)};">${formatNumber(row.pekan3.realisasi)}</td>
            <td class="value-cell pekan-col" style="color: ${getColor(row.pekan4.persen)};">${formatNumber(row.pekan4.realisasi)}</td>
            <td class="value-cell pekan-col" style="font-weight: 900; color: ${getColor(row.kumulatif.persen)};">${formatNumber(row.kumulatif.realisasi)}</td>
        </tr>`;
        
        // Row 3: Persentase
        html += `<tr>
            <td colspan="2" class="metric-label" style="text-align: right; padding-right: 20px;">Persentase</td>
            <td colspan="2" class="${getPercentageClass(row.pekan1.persen)}">${formatPercent(row.pekan1.persen)}</td>
            <td colspan="2" class="${getPercentageClass(row.pekan2.persen)}">${formatPercent(row.pekan2.persen)}</td>
            <td colspan="2" class="${getPercentageClass(row.pekan3.persen)}">${formatPercent(row.pekan3.persen)}</td>
            <td colspan="2" class="${getPercentageClass(row.pekan4.persen)}">${formatPercent(row.pekan4.persen)}</td>
            <td colspan="2" class="${getPercentageClass(row.kumulatif.persen)}">${formatPercent(row.kumulatif.persen)}</td>
        </tr>`;
    });
    
    tbody.innerHTML = html;
}

// ==================== CHART FUNCTIONS ====================
let myChart = null;

function createChart(measureIndex, chartType, data) {
    if (!data || !data[measureIndex]) return;
    
    const row = data[measureIndex];
    const ctx = document.getElementById('myChart').getContext('2d');
    
    document.getElementById('chart-title').textContent = row.leadMeasure;
    
    if (myChart) myChart.destroy();
    
    const labels = ['Pekan 1', 'Pekan 2', 'Pekan 3', 'Pekan 4'];
    const realisasi = [row.pekan1.realisasi, row.pekan2.realisasi, row.pekan3.realisasi, row.pekan4.realisasi];
    const target = row.pekan1.target;
    
    if (chartType === 'bar') {
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Realisasi',
                        data: realisasi,
                        backgroundColor: 'rgba(66, 133, 244, 0.8)',
                        borderColor: 'rgba(66, 133, 244, 1)',
                        borderWidth: 2,
                        borderRadius: 8
                    },
                    {
                        label: 'Target',
                        data: [target, target, target, target],
                        type: 'line',
                        borderColor: 'rgba(234, 67, 53, 1)',
                        backgroundColor: 'rgba(234, 67, 53, 0.1)',
                        borderWidth: 3,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: { font: { size: 14, weight: 'bold' }, padding: 20 }
                    }
                },
                scales: {
                    y: { beginAtZero: true },
                    x: { grid: { display: false } }
                }
            },
            plugins: [{
                afterDatasetsDraw: function(chart) {
                    const ctx = chart.ctx;
                    chart.data.datasets.forEach((dataset, i) => {
                        if (dataset.type !== 'line') {
                            const meta = chart.getDatasetMeta(i);
                            meta.data.forEach((bar, index) => {
                                const data = dataset.data[index];
                                ctx.fillStyle = '#fff';
                                ctx.font = 'bold 13px Arial';
                                ctx.textAlign = 'center';
                                ctx.fillText(data.toFixed(2), bar.x, bar.y - 10);
                            });
                        } else {
                            const meta = chart.getDatasetMeta(i);
                            [0, meta.data.length - 1].forEach(index => {
                                const point = meta.data[index];
                                const data = dataset.data[index];
                                ctx.fillStyle = '#d32f2f';
                                ctx.font = 'bold 12px Arial';
                                ctx.textAlign = 'center';
                                ctx.fillText(data.toFixed(2), point.x, point.y - 5);
                            });
                        }
                    });
                }
            }]
        });
    } else {
        const totalRealisasi = realisasi.reduce((a, b) => a + b, 0);
        myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: realisasi,
                    backgroundColor: [
                        'rgba(66, 133, 244, 0.8)',
                        'rgba(52, 168, 83, 0.8)',
                        'rgba(251, 188, 5, 0.8)',
                        'rgba(234, 67, 53, 0.8)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { font: { size: 14 }, padding: 15 } }
                }
            },
            plugins: [{
                afterDatasetsDraw: function(chart) {
                    const ctx = chart.ctx;
                    const meta = chart.getDatasetMeta(0);
                    meta.data.forEach((arc, index) => {
                        const data = chart.data.datasets[0].data[index];
                        const percentage = ((data / totalRealisasi) * 100).toFixed(1);
                        const midAngle = (arc.startAngle + arc.endAngle) / 2;
                        const x = arc.x + Math.cos(midAngle) * (arc.outerRadius * 0.7);
                        const y = arc.y + Math.sin(midAngle) * (arc.outerRadius * 0.7);
                        ctx.fillStyle = '#fff';
                        ctx.font = 'bold 14px Arial';
                        ctx.textAlign = 'center';
                        ctx.fillText(`${data}`, x, y - 8);
                        ctx.font = 'bold 11px Arial';
                        ctx.fillText(`(${percentage}%)`, x, y + 8);
                    });
                }
            }]
        });
    }
}

// ==================== UI UPDATE FUNCTIONS ====================
function updateUnitName(unitKey) {
    const unit = unitData[unitKey];
    const unitCell = document.querySelector('.unit-cell');
    const infoHeader = document.querySelector('.info-header');
    
    if (unitCell && unit) {
        unitCell.style.opacity = '0';
        setTimeout(() => {
            unitCell.textContent = unit.name;
            unitCell.style.opacity = '1';
        }, 150);
    }
    
    if (infoHeader && unit) {
        infoHeader.style.opacity = '0';
        setTimeout(() => {
            infoHeader.textContent = `Menurunkan gangguan permanen dan temporer dari ${unit.targetGangguan} pada 31 Desember 2025`;
            infoHeader.style.opacity = '1';
        }, 150);
    }
}

function updateMonthName(monthKey) {
    const month = monthData[monthKey];
    const monthHeader = document.querySelector('.month-header');
    
    if (monthHeader && month) {
        const year = getYearForMonth(month.number);
        const displayText = `${month.name} ${year}`;
        
        monthHeader.style.opacity = '0';
        setTimeout(() => {
            monthHeader.textContent = displayText;
            monthHeader.style.opacity = '1';
        }, 150);
    }
}

function toggleView(view) {
    const tableView = document.getElementById('table-view');
    const chartView = document.getElementById('chart-view');
    
    if (view === 'table') {
        tableView.style.display = 'block';
        chartView.style.display = 'none';
    } else {
        tableView.style.display = 'none';
        chartView.style.display = 'block';
        const measureIndex = parseInt(document.getElementById('measure-select').value);
        const chartType = document.getElementById('chart-type').value;
        createChart(measureIndex, chartType, sampleTableData);
    }
}

// ==================== EVENT LISTENERS ====================
document.getElementById('month-select').addEventListener('change', function() {
    updateMonthName(this.value);
});

document.getElementById('unit-select').addEventListener('change', function() {
    updateUnitName(this.value);
});

document.getElementById('view-select').addEventListener('change', function() {
    toggleView(this.value);
});

document.getElementById('measure-select').addEventListener('change', function() {
    const chartType = document.getElementById('chart-type').value;
    createChart(parseInt(this.value), chartType, sampleTableData);
});

document.getElementById('chart-type').addEventListener('change', function() {
    const measureIndex = parseInt(document.getElementById('measure-select').value);
    createChart(measureIndex, this.value, sampleTableData);
});

// ==================== INITIALIZATION ====================
document.querySelector('.unit-cell') && (document.querySelector('.unit-cell').style.transition = 'opacity 0.3s ease');
document.querySelector('.info-header') && (document.querySelector('.info-header').style.transition = 'opacity 0.3s ease');
document.querySelector('.month-header') && (document.querySelector('.month-header').style.transition = 'opacity 0.3s ease');

window.addEventListener('load', function() {
    const selectedUnit = document.getElementById('unit-select').value;
    const selectedMonth = document.getElementById('month-select').value;
    
    // Populate table with sample data
    populateTable(sampleTableData);
    
    updateUnitName(selectedUnit);
    updateMonthName(selectedMonth);
});