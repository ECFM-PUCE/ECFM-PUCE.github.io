function validateN() {
    const n = parseInt(document.forms[0].n.value);
    if (n < 1 || isNaN(n)) {
        alert('Error: El valor de n debe ser un entero mayor a 0.');
        document.forms[0].n.value = '';
    } else {
        document.forms[0].n.value = n;
    }
}

function validateP() {
    const p = parseFloat(document.forms[0].p.value);
    if (p < 0 || p > 1 || isNaN(p)) {
        alert('Error: La probabilidad debe estar entre 0 y 1');
        document.forms[0].p.value = '';
    } else {
        document.forms[0].p.value = p;
    }
}

function validateX() {
    const x = parseInt(document.forms[0].x.value);
    const n = parseInt(document.forms[0].n.value);
    if (x < 0 || x > n || isNaN(x)) {
        alert('Error: El valor de x debe ser un entero entre 0 y n.');
        document.forms[0].x.value = '';
    } else {
        document.forms[0].x.value = x;
    }
}

function binomialCoefficient(n, x) {
    let result = 1;
    for (let i = 0; i < x; i++) {
        result *= (n - i) / (i + 1);
    }
    return result;
}

function binomialPmf(n, x, p) {
    const coeff = binomialCoefficient(n, x);
    return coeff * Math.pow(p, x) * Math.pow(1 - p, n - x);
}

function binomialCdf(n, x, p) {
    let cdf = 0;
    for (let i = 0; i <= x; i++) {
        cdf += binomialPmf(n, i, p);
    }
    return cdf;
}

function updateProb() {
    const n = parseInt(document.forms[0].n.value);
    const p = parseFloat(document.forms[0].p.value);
    const x = parseInt(document.forms[0].x.value);

    if (isNaN(n) || isNaN(p) || isNaN(x) || n < 1 || x < 0 || x > n || p < 0 || p > 1) {
        return;
    }

    const dropdownValue = document.forms[0].mydropdown.value;

    let prob = 0;
    if (dropdownValue === 'eq') {
        prob = binomialPmf(n, x, p);
    } else if (dropdownValue === 'le') {
        prob = binomialCdf(n, x, p);
    } else if (dropdownValue === 'ge') {
        prob = 1 - binomialCdf(n, x - 1, p);
    }

    document.forms[0].prob.value = prob.toFixed(5);
}

function updatePlot() {
    const n = parseInt(document.forms[0].n.value);
    const p = parseFloat(document.forms[0].p.value);
    const x = parseInt(document.forms[0].x.value);

    if (isNaN(n) || isNaN(p) || n < 1 || p < 0 || p > 1) {
        return;
    }

    let mean = n * p;
    let sd = Math.sqrt(n * p * (1 - p));

    var data = new google.visualization.DataTable();
    data.addColumn('number', 'x');
    data.addColumn('number', 'P(X=x)');
    data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
    data.addColumn('number', 'P(X=x)');

    var xlo = 0, xhi = n + 0.5;
    if (n > 10) {
        xlo = Math.max(0, mean - 6 * sd);
        xhi = Math.min(n + 0.5, mean + 6 * sd);
    }

    data.addRows(n + 1);

    const dropdownValue = document.forms[0].mydropdown.value;

    for (var i = 0; i <= n; i++) {
        var pmfValue = binomialPmf(n, i, p);
        data.setCell(i, 0, i);
        data.setCell(i, 1, pmfValue);
        data.setCell(i, 2, 'P(X=' + i + ') = ' + pmfValue.toFixed(5));

        if ((dropdownValue == 'eq' && i == x) || (dropdownValue == 'le' && i <= x) || (dropdownValue == 'ge' && i >= x)) {
            data.setCell(i, 1, 0);
            data.setCell(i, 3, pmfValue);
        }
    }

    var options =
    {
        backgroundColor: 'transparent',
        hAxis: {
            title: 'x', titleTextStyle: { color: '#2a4861' },
            gridlines: { color: 'transparent' },
            viewWindow: { min: xlo - 0.5, max: xhi },
            baselineColor: 'transparent'
        },
        vAxis: {
            title: 'P(X=x)', titleTextStyle: { color: '#2a4861' },
            gridlines: { count: 5, color: 'transparent' },
            viewWindow: { min: 0 },
            viewWindowMode: 'explicit'
        },
        legend: { position: 'none' },
        seriesType: "bars",
        isStacked: true,
        colors: ['#2a4861', '#419693']
    };

    var chart = new google.visualization.ComboChart(document.getElementById('Plot'));
    chart.draw(data, options);

    var txt = "";

    txt += '\\( \\mu = E(X) = ' + mean.toFixed(3) + ';\\hspace{0.5cm}\\)';
    txt += '\\( \\sigma = ' + sd.toFixed(3) + ';\\hspace{0.5cm}\\)';
    txt += '\\( \\sigma^2 = \\text{Var}(X) = ' + Math.pow(sd, 2).toFixed(3) + '.\\)';

    document.getElementById("moments").innerHTML = txt;
    MathJax.typesetPromise(["#moments"]);

    updateTable()
}

// Función para actualizar la tabla de probabilidades
function updateTable() {
    const n = parseInt(document.getElementsByName('n')[0].value);
    const p = parseFloat(document.getElementsByName('p')[0].value);

    if (isNaN(n) || isNaN(p) || n <= 0 || p < 0 || p > 1) {
        return;
    }

    const tableBody = document.getElementById('probabilities-body');
    tableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla

    // Generar las filas de la tabla
    for (let x = 0; x <= n; x++) {
        const probability = binomialPmf(n, x, p).toFixed(5); // 

        const row = `<tr><td>${x}</td><td> ${probability} </td></tr>`;
        tableBody.innerHTML += row;
    }
}