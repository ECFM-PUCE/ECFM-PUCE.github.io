function validateL() {
    const l = parseFloat(document.forms[0].l.value);
    if (l <= 0 || isNaN(l)) {
        alert('Error: El valor de lambda debe ser mayor a 0.');
        document.forms[0].l.value = '';
    } else {
        document.forms[0].l.value = l;
    }
}

function validateX() {
    const x = parseFloat(document.forms[0].x.value);
    if (x < 0 || isNaN(x)) {
        alert('Error: El valor de x debe ser mayor a 0.');
        document.forms[0].x.value = '';
    } else {
        document.forms[0].x.value = x;
    }
}

function validateProb() {
    const prob = parseFloat(document.forms[0].prob.value);
    if (prob < 0 || prob > 1 || isNaN(prob)) {
        alert('Error: El valor de la probabilidad debe estar entre 0 y 1.');
        document.forms[0].prob.value = '';
    } else {
        document.forms[0].prob.value = prob;
    }
}

function updateProb() {
    const l = parseFloat(document.forms[0].l.value);
    const x = parseFloat(document.forms[0].x.value);

    if (isNaN(l) || isNaN(x) || l <= 0 || x <= 0) {
        return;
    }

    const dropdownValue = document.forms[0].mydropdown.value;

    let prob = 0;
    if (dropdownValue === 'le') {
        prob = exponentialCdf(l, x);
    } else if (dropdownValue === 'ge') {
        prob = 1 - exponentialCdf(l, x);
    }

    document.forms[0].prob.value = prob.toFixed(5);
}

function updateX() {
    const l = parseFloat(document.forms[0].l.value);
    const prob = parseFloat(document.forms[0].prob.value);

    if (isNaN(l) || isNaN(prob) || l <= 0 || prob < 0 || prob > 1) {
        return;
    }

    const dropdownValue = document.forms[0].mydropdown.value;

    let x = 0;
    if (dropdownValue === 'le') {
        x = -Math.log(1 - prob) / l;
    } else if (dropdownValue === 'ge') {
        x = -Math.log(prob) / l;
    }

    document.forms[0].x.value = x.toFixed(5);
}

function percentile(p, l) {
    p = eval(p);

    if (!isNaN(p)) return -Math.log(1 - p) / l;

    return '';
}

function exponentialCdf(lambda, x) {
    return 1 - Math.exp(-lambda * x);
}

function exponentialPdf(lambda, x) {
    return lambda * Math.exp(-lambda * x);
}

function updatePlot() {
    const lambda = parseFloat(document.forms[0].l.value);
    const x = parseFloat(document.forms[0].x.value);

    if (isNaN(lambda) || lambda <= 0) {
        return;
    }

    let mean = 1 / lambda;
    let sd = 1 / lambda;

    var data = new google.visualization.DataTable();

    data.addColumn('number', 'x');
    data.addColumn('number', 'f(x)');
    data.addColumn('number', 'f(x)');

    var lo = 0;
    var hi = percentile(0.999, lambda);

    data.addRows(401);

    const dropdownValue = document.forms[0].mydropdown.value;

    var i, grd;
    for (i = 0; i < 401; i++) {
        grd = lo + (hi - lo) * i / 400;
        data.setCell(i, 0, grd);
        data.setCell(i, 1, exponentialPdf(lambda, grd));
        if(!isNaN(x)) {
            if(grd < x) {
                if(dropdownValue === 'le') {
                    data.setCell(i, 2, exponentialPdf(lambda, grd));
                } 
            } else {
                if(dropdownValue === 'ge') {
                    data.setCell(i, 2, exponentialPdf(lambda, grd));
                } 
            }
        }

    };

    var options = {
        backgroundColor: 'transparent',
        areaOpacity: 0,
        hAxis: {
            title: 'x', titleTextStyle: { color: '#134383' },
            min: lo,
            max: hi,
            gridlines: { color: 'transparent', count: 7 },
            baseline: lo
        },
        vAxis: {
            title: 'f(x)', titleTextStyle: { color: '#134383' },
            gridlines: { count: 5, color: 'transparent' },
            viewWindow: { min: 0 },
            viewWindowMode: 'explicit'
        },
        legend: { position: 'none' },
        series: {
            0: { color: '#134383', areaOpacity: 0.2, lineWidth: 1.2 },
            1: { color: '#137b83', areaOpacity: 0.8, lineWidth: 0 }
        },
        tooltip: { trigger: 'none' }
    };

    var chart = new google.visualization.AreaChart(document.getElementById('Plot'));
    chart.draw(data, options);

    var txt = "";
    txt += '\\( \\mu = E(X) = ' + mean.toFixed(3) + ';\\hspace{0.5cm}\\)';
    txt += '\\( \\sigma = ' + sd.toFixed(3) + ';\\hspace{0.5cm}\\)';
    txt += '\\( \\sigma^2 = \\text{Var}(X) = ' + Math.pow(sd, 2).toFixed(3) + '.\\)';

    document.getElementById("moments").innerHTML = txt;
    MathJax.typesetPromise(["#moments"]);
}
