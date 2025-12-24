// Data untuk setiap unit
const unitData = {
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

// Data bulan dengan mapping ke nomor bulan
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

// Fungsi untuk mendapatkan tahun yang sesuai
function getYearForMonth(monthNumber) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    if (monthNumber < currentMonth) {
        return currentYear + 1;
    } else {
        return currentYear;
    }
}

// Fungsi untuk update unit name di tabel
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

// Fungsi untuk update nama bulan di header tabel
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

// Add transition effect to cells
document.querySelector('.unit-cell').style.transition = 'opacity 0.3s ease';
document.querySelector('.info-header').style.transition = 'opacity 0.3s ease';
document.querySelector('.month-header').style.transition = 'opacity 0.3s ease';

// Event listeners
document.getElementById('month-select').addEventListener('change', function() {
    updateMonthName(this.value);
});

document.getElementById('unit-select').addEventListener('change', function() {
    updateUnitName(this.value);
});

// Initialize dengan unit dan month yang dipilih saat load
window.addEventListener('load', function() {
    const selectedUnit = document.getElementById('unit-select').value;
    const selectedMonth = document.getElementById('month-select').value;
    updateUnitName(selectedUnit);
    updateMonthName(selectedMonth);
});