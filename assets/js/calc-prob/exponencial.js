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
    if (x <= 0 || isNaN(x)) {
        alert('Error: El valor de x debe ser mayor a 0.');
        document.forms[0].x.value = '';
    } else {
        document.forms[0].x.value = x;
    }
}

function exponencialDcf(l, x) {
    return 1 - Math.exp(-l * x);
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
        prob = exponencialDcf(l, x);
    } else if (dropdownValue === 'ge') {
        prob = 1 - exponencialDcf(l, x);
    }

    document.forms[0].prob.value = prob.toFixed(5);
}

function percentile(p,l)
	{
		p = eval(p);

		if(!isNaN(p)) return -Math.log(1-p)/l;

		return '';
	}


function updatePlot() {
    const l = parseFloat(document.forms[0].l.value);
    const x = parseFloat(document.forms[0].x.value);

    if (isNaN(l) || l <= 0) {
        return;
    }

    let mean = 1 / l;
    let sd = 1 / l;

    var data = new google.visualization.DataTable();

    data.addColumn('number', 'x');
    data.addColumn('number', 'f(x)');
    data.addColumn('number', 'f(x)');
    data.addColumn('number', 'f(x)');

    // x = eval(x);

    var lo = 0;
    var hi = percentile(0.999,l);

    data.addRows(401);

    const dropdownValue = document.forms[0].mydropdown.value;

    var i, grd;
    for (i = 0; i < 401; i++) {
        grd = lo + (hi - lo) * i / 400;
        data.setCell(i, 0, grd);
        data.setCell(i, 1, exponencialDcf(grd));

        if (!isNaN(x)) {
            if (grd < x) {
                if (dropdownValue == 'le')
                    data.setCell(i, 2, exponencialDcf(grd));
            }
            else {
                if (dropdownValue == 'ge')
                    data.setCell(i, 2, exponencialDcf(grd));
            }
        }

        var xdelta = (hi - lo) / 140;
        if (grd > x - xdelta && grd < x + xdelta) {
            data.setCell(i, 3, exponencialDcf(grd));
        }
    }

    var options = {
        backgroundColor: 'transparent',
        areaOpacity: 0,
        hAxis: {
            title: 'x', titleTextStyle: { color: '#000000' },
            min: lo,
            max: hi,
            gridlines: { color: 'transparent', count: 7 },
            baseline: lo
        },
        vAxis: {
            title: 'f(x)', titleTextStyle: { color: '#000000' },
            gridlines: { count: 5, color: 'transparent' },
            viewWindow: { min: 0 },
            viewWindowMode: 'explicit'
        },
        legend: { position: 'none' },
        series: {
            0: { color: 'black', areaOpacity: 0, lineWidth: 1.2 },
            1: { color: '#e7b0b0', areaOpacity: 1, lineWidth: 0 },
            2: { color: '#83aaf1', areaOpacity: 1, lineWidth: 0 },
            3: { color: '#E8E8E8', areaOpacity: 1, lineWidth: 0 }
        },
        tooltip: { trigger: 'none' }
    };

    var chart = new google.visualization.ComboChart(document.getElementById('Plot'));
    chart.draw(data, options);
}