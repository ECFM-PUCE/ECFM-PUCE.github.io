function validateMu() {
    const mu = parseFloat(document.forms[0].mu.value);
    if (isNaN(mu)) {
        alert('Error: El valor de mu no es válido.');
        document.forms[0].mu.value = 0;
    } else {
        document.forms[0].mu.value = mu;
    }
}

function validateSigma() {
    const sigma = parseFloat(document.forms[0].sigma.value);
    if (sigma <= 0 || isNaN(sigma)) {
        alert('Error: El valor de sigma debe ser mayor a 0.');
        document.forms[0].sigma.value = '';
    } else {
        document.forms[0].sigma.value = sigma;
    }
}

function validateX() {
    const x = parseFloat(document.forms[0].x.value);
    if (isNaN(x)) {
        alert('Error: El valor de x no es válido.');
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
    const mu = parseFloat(document.forms[0].mu.value);
    const sigma = parseFloat(document.forms[0].sigma.value);
    const x = parseFloat(document.forms[0].x.value);

    if (isNaN(mu) || isNaN(sigma) || sigma <= 0 || isNaN(x)) {
        return;
    }

    const dropdownValue = document.forms[0].mydropdown.value;

    let prob = 0;
    if (dropdownValue === 'le') {
        prob = normalCdf(mu, sigma, x);  // P(X ≤ x)
    } else if (dropdownValue === 'ge') {
        prob = 1 - normalCdf(mu, sigma, x);  // P(X ≥ x)
    }

    document.forms[0].prob.value = prob.toFixed(5);
}

function updateX() {
    const mu = parseFloat(document.forms[0].mu.value);
    const sigma = parseFloat(document.forms[0].sigma.value);
    const prob = parseFloat(document.forms[0].prob.value);

    if (isNaN(mu) || isNaN(sigma) || sigma <= 0 || isNaN(prob) || prob < 0 || prob > 1) {
        return;
    }

    const dropdownValue = document.forms[0].mydropdown.value;

    let x = 0;
    if (dropdownValue === 'le') {
        x = normalInvCdf(mu, sigma, prob);  // Inversa de P(X ≤ x)
    } else if (dropdownValue === 'ge') {
        x = normalInvCdf(mu, sigma, 1 - prob);  // Inversa de P(X ≥ x)
    }

    document.forms[0].x.value = x.toFixed(5);
}

function normalCdf(mu, sigma, x) {
    return (1 + erf((x - mu) / (Math.sqrt(2) * sigma))) / 2;
}

function normalInvCdf(mu, sigma, p) {
    return mu + sigma * Math.sqrt(2) * inverseErf(2 * p - 1);
}

// Aproximación de la función de error (erf) y su inversa
function erf(x) {
    // Fórmula de aproximación de erf
    const sign = (x >= 0) ? 1 : -1;
    x = Math.abs(x);

    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const t = 1 / (1 + p * x);
    const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
}

function inverseErf(x) {
    const a = 0.147;  // Constante para la aproximación

    // Fórmula de aproximación de la inversa de erf
    const ln1MinusXSqrd = Math.log(1 - x * x);
    const part1 = 2 / (Math.PI * a) + ln1MinusXSqrd / 2;
    const part2 = ln1MinusXSqrd / a;
    return Math.sign(x) * Math.sqrt(Math.sqrt(part1 * part1 - part2) - part1);
}

function updatePlot() {
    const mu = parseFloat(document.forms[0].mu.value);
    const sigma = parseFloat(document.forms[0].sigma.value);
    const x = parseFloat(document.forms[0].x.value);

    if (isNaN(mu) || isNaN(sigma) || sigma <= 0) {
        return;
    }

    const mean = mu;
    const sd = sigma;

    var data = new google.visualization.DataTable();

    data.addColumn('number', 'x');
    data.addColumn('number', 'f(x)');
    data.addColumn('number', 'f(x)');

    const lo = mu - 4 * sigma;
    const hi = mu + 4 * sigma;

    data.addRows(401);

    const dropdownValue = document.forms[0].mydropdown.value;

    var i, grd;
    for (i = 0; i < 401; i++) {
        grd = lo + (hi - lo) * i / 400;
        data.setCell(i, 0, grd);
        data.setCell(i, 1, normalPdf(mu, sigma, grd));
        if (!isNaN(x)) {
            if (grd < x && dropdownValue === 'le') {
                data.setCell(i, 2, normalPdf(mu, sigma, grd));
            } else if (grd >= x && dropdownValue === 'ge') {
                data.setCell(i, 2, normalPdf(mu, sigma, grd));
            }
        }
    }

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

function normalPdf(mu, sigma, x) {
    const z = (x - mu) / sigma;
    return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
}
