call_from_db();

let infLoop = setInterval(() => {
    location.reload();
}, 300000);
// setInterval(call_from_db, 300000);
function call_from_db() {
    $.ajax({
        type: "GET",
        url: "api/index.php",
        success: function (response) {
            const res = JSON.parse(response);

            const kolam_1 = res[0];
            const kolam_2 = res[1];
            // Suhu air 20-28 C
            // ph 6-9 (7)
            // Suhu Udara 22-30 C
            // kelembapan udara 80-85% ?
            // Kekeruhan air 0-400 NTU
            // Make config for each canvas
            const kolam1 = {
                suhu_air: {
                    val: Number(Number(kolam_1.data_suhu_air).toFixed(2)),
                    id: "kolam_1_suhu_air_canvas",
                    data: [20, 8, 20],
                    totalData: 48,
                    label: "data suhu air",
                    suffix: '°C',
                },
                suhu_udara: {
                    val: Number(Number(kolam_1.data_suhu_udara).toFixed(2)),
                    id: "kolam_1_suhu_udara_canvas",
                    data: [22, 8, 22],
                    totalData: 50,
                    label: "data suhu udara",
                    suffix: '°C',
                },
                ph: {
                    val: Number(Number(kolam_1.data_ph).toFixed(2)),
                    id: "kolam_1_ph_canvas",
                    data: [6, 3, 5],
                    totalData: 14,
                    label: "data ph",
                    suffix: ' pH',
                },
                turbidity: {
                    val: Number(Number(kolam_1.data_turbidity).toFixed(2)),
                    id: "kolam_1_turbidity_canvas",
                    data: [0, 400, 400],
                    totalData: 800,
                    label: "data turbidity",
                    suffix: ' NTU',
                },
                kelembapan: {
                    val: Number(Number(kolam_1.data_kelembapan_udara).toFixed(2)),
                    id: "kolam_1_kelembapan_canvas",
                    data: [80, 5, 15],
                    totalData: 100,
                    label: "data ph",
                    suffix: ' %',
                },
            }
            const kolam2 = {
                suhu_air: {
                    val: Number(Number(kolam_2.data_suhu_air).toFixed(2)),
                    id: "kolam_2_suhu_air_canvas",
                    data: [20, 8, 20],
                    totalData: 48,
                    label: "data suhu air",
                    suffix: '°C',
                },
                suhu_udara: {
                    val: Number(Number(kolam_2.data_suhu_udara).toFixed(2)),
                    id: "kolam_2_suhu_udara_canvas",
                    data: [22, 8, 22],
                    totalData: 50,
                    label: "data suhu udara",
                    suffix: '°C',
                },
                ph: {
                    val: Number(Number(kolam_2.data_ph).toFixed(2)),
                    id: "kolam_2_ph_canvas",
                    data: [6, 3, 5],
                    totalData: 14,
                    label: "data ph",
                    suffix: ' pH',
                },
                turbidity: {
                    val: Number(Number(kolam_2.data_turbidity).toFixed(2)),
                    id: "kolam_2_turbidity_canvas",
                    data: [0, 400, 400],
                    totalData: 800,
                    label: "data turbidity",
                    suffix: ' NTU',
                },
                kelembapan: {
                    val: Number(Number(kolam_2.data_kelembapan_udara).toFixed(2)),
                    id: "kolam_2_kelembapan_canvas",
                    data: [80, 5, 15],
                    totalData: 100,
                    label: "data ph",
                    suffix: ' %',
                },
            }
            chartGauge(kolam1.suhu_air);
            chartGauge(kolam1.ph);
            chartGauge(kolam1.turbidity);
            chartGauge(kolam1.suhu_udara);
            chartGauge(kolam1.kelembapan);

            chartGauge(kolam2.suhu_air);
            chartGauge(kolam2.ph);
            chartGauge(kolam2.turbidity);
            chartGauge(kolam2.suhu_udara);
            chartGauge(kolam2.kelembapan);

        },
        error: function (response) {
            console.log(response.responseText);
            clearInterval(infLoop);
        }
    });
}

function chartGauge(myConf) {
    const data = {
        datasets: [{
            label: myConf.label,
            data: myConf.data,
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 99, 132)'
            ],
            borderColor: 'white',
            needleValue: myConf.val,
            cutout: '90%',
            circumference: 180,
            rotation: 270
        }]
    };

    // gaugeNeedle
    const gaugeNeedle = {
        id: 'gaugeNeedle',
        afterDatasetDraw(chart, args, options) {
            const { ctx, config, data, chartArea: { top, bottom, left, right, width, height } } = chart;

            ctx.save();
            const dataTotal = data.datasets[0].data.reduce((a, b) => a + b, 0);
            const needleValue = data.datasets[0].needleValue;
            const angle = Math.PI + (1 / dataTotal * needleValue * Math.PI)

            const cx = width / 2;
            const cy = chart._metasets[0].data[0].y;
            const needleArrow = ctx.canvas.offsetTop;

            // needle
            ctx.translate(cx, cy);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, -4);
            ctx.lineTo(height - (needleArrow + (height * 4 / 9)), 0);
            ctx.lineTo(0, 4);
            ctx.fillStyle = '#444';
            ctx.fill();

            // dots
            ctx.translate(-cx, -cy);
            ctx.beginPath();
            ctx.arc(cx, cy, 5, 0, 10);
            ctx.fill();
            ctx.restore();

            ctx.font = '30px Helvetica';
            ctx.fillStyle = '#444';
            ctx.fillText(needleValue + (myConf.suffix ? myConf.suffix : ""), cx, cy + 30);
            ctx.textAlign = 'center';
            ctx.restore();
        }
    }

    const ctx = document.getElementById(myConf.id);
    const myChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {},
        plugins: [gaugeNeedle]
    });
}