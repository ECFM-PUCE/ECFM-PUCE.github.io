function validateL() {
    const l = parseFloat(document.forms[0].l.value);
    if (l <= 0  || isNaN(l)) {
        alert('Error: El valor de lambda debe ser mayor a 0.');
        document.forms[0].l.value = '';
    } else {
        document.forms[0].l.value = l;
    }
}

function validateX() {
    const x = parseInt(document.forms[0].x.value);
    if (isNaN(x) || x < 0) {
        alert('Error: El valor de x debe ser un entero mayor o igual a 0.');
        document.forms[0].x.value = '';
    } else {
        document.forms[0].x.value = x;
    }
}

function poissonPmf(l, x) {
    return Math.pow(l, x) * Math.exp(-l) / factorial(x);
}

function factorial(n) {
    if (n === 0) {
        return 1;
    }
    return n * factorial(n - 1);
}

function poissonCdf(l, x) {
    let cdf = 0;
    for (let i = 0; i <= x; i++) {
        cdf += poissonPmf(l, i);
    }
    return cdf;
}

function updateProb() {
    const l = parseFloat(document.forms[0].l.value);
    const x = parseInt(document.forms[0].x.value);

    if (isNaN(l) || isNaN(x) || l <= 0 || x < 0) {
        return;
    }

    const dropdownValue = document.forms[0].mydropdown.value;

    let prob = 0;
    if (dropdownValue === 'eq') {
        prob = poissonPmf(l, x);
    } else if (dropdownValue === 'le') {
        prob = poissonCdf(l, x);
    } else if (dropdownValue === 'ge') {
        prob = 1 - poissonCdf(l, x - 1);
    }

    document.forms[0].prob.value = prob.toFixed(5);
}

function updatePlot() {
    const l = parseFloat(document.forms[0].l.value);
    const x = parseInt(document.forms[0].x.value);

    if (isNaN(l) || l <= 0) {
        return;
    }
    

    let mean = l;
    let sd = Math.sqrt(l);

    var data = new google.visualization.DataTable();
    data.addColumn('number', 'x');
    data.addColumn('number', 'P(X=x)');
    data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
    data.addColumn('number', 'P(X=x)');

    var lo = Math.max(-0.5, Math.floor(mean - 4*sd));
    var hi;

    if(l < 0.5) hi = 4;
    if(l >= 0.5 & l < 1.0) hi = 6;
    if(l >= 1.0 & l < 20) hi = Math.floor(mean + 5*sd);
    if(l >= 20) hi = Math.floor(mean + 4*sd);

    var mywidth = 350;
    if(l >= 200) mywidth=350 + 14*Math.sqrt(l-200);

    data.addRows(hi+1);

    const dropdownValue = document.forms[0].mydropdown.value;

    for(var i=0; i<hi; i++) {
        var pmfValue = poissonPmf(l, i);
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
            title: 'x', titleTextStyle: { color: '#134383' },
            gridlines: { color: 'transparent' },
            viewWindow: { min: lo - 0.5, max: hi },
            baselineColor: 'transparent'
        },
        vAxis: {
            title: 'P(X=x)', titleTextStyle: { color: '#134383' },
            gridlines: { count: 5, color: 'transparent' },
            viewWindow: { min: 0 },
            viewWindowMode: 'explicit'
        },
        legend: { position: 'none' },
        seriesType: "bars",
        isStacked: true,
        colors: ['#134383', '#137b83']
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
    const l = parseFloat(document.forms[0].l.value);

    if (isNaN(l) || l <= 0 ) {
        return;
    }

    let mean = l;
    let sd = Math.sqrt(l);
    
    var lo = Math.max(0, Math.floor(mean - 4*sd));
    var hi;

    if(l < 0.5) hi = 4;
    if(l >= 0.5 & l < 1.0) hi = 6;
    if(l >= 1.0 & l < 20) hi = Math.floor(mean + 5*sd);
    if(l >= 20) hi = Math.floor(mean + 4*sd);

    var mywidth = 350;
    if(l >= 200) mywidth=350 + 14*Math.sqrt(l-200);

    const tableBody = document.getElementById('probabilities-body');
    tableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla

    // Generar las filas de la tabla
    for (let x = lo; x <= hi; x++) {
        const probability = poissonPmf(l, x).toFixed(5); // 

        const row = `<tr><td>${x}</td><td> ${probability} </td></tr>`;
        tableBody.innerHTML += row;
    }
}