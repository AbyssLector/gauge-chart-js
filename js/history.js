call_from_db(1);
let inc = 0;
// 1 = 1 hari
// 2 = 1 minggu

function call_from_db(params) {
    if (params == 1) {
        $("#btn_kolam1").removeClass("btn-secondary");
        $("#btn_kolam1").addClass("btn-primary");
        $("#btn_kolam2").removeClass("btn-primary");
        $("#btn_kolam2").addClass("btn-secondary");
    } else {
        $("#btn_kolam2").removeClass("btn-secondary");
        $("#btn_kolam2").addClass("btn-primary");
        $("#btn_kolam1").removeClass("btn-primary");
        $("#btn_kolam1").addClass("btn-secondary");
    }
    $.ajax({
        type: "GET",
        url: "api/history.php?p=" + params + "&q=0",
        success: function (response) {
            const res = JSON.parse(response);

            const kolam_1 = res[0];

            let arr_label = [];
            kolam_1.forEach(e => {
                arr_label.push(e.created_at);
            });
            $("canvas#chart_canvas").remove();
            $("div#chart").append('<canvas id="chart_canvas" class="bg-white shadow" width="400" height="200" class=""></canvas>');
            // $("div#scroll_bar").append('<canvas id="chart_canvas" class="bg-white shadow" width="" height="200" class=""></canvas>');
            let arr_suhu_air = [];
            let arr_ph = [];
            let arr_turbidity = [];
            let arr_suhu_udara = [];
            let arr_kelembapan = [];

            kolam_1.forEach(e => {
                arr_suhu_air.push(Number(e.data_suhu_air));
                arr_ph.push(Number(e.data_ph));
                arr_turbidity.push(Number(e.data_turbidity));
                arr_suhu_udara.push(Number(e.data_suhu_udara));
                arr_kelembapan.push(Number(e.data_kelembapan_udara));
            });

            // Make config for each canvas
            const config = {
                id: "chart_canvas",
                labels: arr_label,
                data: {
                    suhu_udara: arr_suhu_udara,
                    ph: arr_ph,
                    turbidity: arr_turbidity,
                    suhu_air: arr_suhu_air,
                    kelembapan: arr_kelembapan
                },
            };
            // console.log(config);
            chartLine(config, inc);
            let suhu_air_avg = (arr_suhu_air.reduce((a, b) => a + b, 0) / arr_suhu_air.length).toFixed(2);
            suhu_air_avg = suhu_air_avg !== Number ? suhu_air_avg : '-';
            let suhu_ph_avg = (arr_ph.reduce((a, b) => a + b, 0) / arr_ph.length).toFixed(2);
            suhu_ph_avg = suhu_ph_avg !== Number ? suhu_ph_avg : '-';
            let suhu_turbidity_avg = (arr_turbidity.reduce((a, b) => a + b, 0) / arr_turbidity.length).toFixed(2);
            suhu_turbidity_avg = suhu_turbidity_avg !== Number ? suhu_turbidity_avg : '-';
            let suhu_udara_avg = (arr_suhu_udara.reduce((a, b) => a + b, 0) / arr_suhu_udara.length).toFixed(2);
            suhu_udara_avg = suhu_udara_avg !== Number ? suhu_udara_avg : '-';
            let suhu_kelembapan_avg = (arr_kelembapan.reduce((a, b) => a + b, 0) / arr_kelembapan.length).toFixed(2);
            suhu_kelembapan_avg = suhu_kelembapan_avg !== Number ? suhu_kelembapan_avg : '-';
            $("#avg_suhu_air").html(suhu_air_avg.toString() + " °C");
            $("#avg_ph").html(suhu_ph_avg.toString() + " pH");
            $("#avg_turbidity").html(suhu_turbidity_avg.toString() + " NTU");
            $("#avg_suhu_udara").html(suhu_udara_avg.toString() + " °C");
            $("#avg_kelembapan").html(suhu_kelembapan_avg.toString() + " %");
        },
        fail: function (xhr, status, err) {
            console.log(err);
        }
    });
}

// warna
// suhu air : merah
// ph abu2
// turbidity biru
// oksigen terlarut hijau muda
// suhu udara cyan
// kelembapan kuning
function chartLine(myConf, inc) {
    const data = {
        labels: myConf.labels,
        datasets: [{
            label: 'Suhu Air',
            data: myConf.data.suhu_air,
            fill: false,
            borderColor: 'rgb(255, 0, 0)',
            tension: 0.1
        }, {
            label: 'pH',
            data: myConf.data.ph,
            fill: false,
            borderColor: 'rgb(128, 128, 128)',
            tension: 0.1
        }, {
            label: 'Kekeruhan',
            data: myConf.data.turbidity,
            fill: false,
            borderColor: 'rgb(0, 0, 255)',
            tension: 0.1
        },
        {
            label: 'Suhu Udara',
            data: myConf.data.suhu_udara,
            fill: false,
            borderColor: 'rgb(0, 255, 255)',
            tension: 0.1
        }, {
            label: 'Kelembapan Udara',
            data: myConf.data.kelembapan,
            fill: false,
            borderColor: 'rgb(255, 255, 102)',
            tension: 0.1
        }]
    };

    const moveChart = {
        id: 'moveChart',
        afterEvent(chart, args) {
            const { ctx, canvas, chartArea: { left, right, top, bottom, width, height } } = chart;

            canvas.addEventListener('mousemove', (event) => {
                const x = args.event.x;
                const y = args.event.y;
                const up = (height / 2) + top + 15;
                const down = (height / 2) + top - 15;
                if (x >= left - 15 && x <= left + 15 && y >= down && y <= up) {
                    canvas.style.cursor = 'pointer';
                } else if (x >= right - 15 && x <= right + 15 && y >= down && y <= up) {
                    canvas.style.cursor = 'pointer';
                }
                else {
                    canvas.style.cursor = 'default';
                }
            });
        },
        afterDatasetDraw(chart, args, pluginOptions) {
            const { ctx, chartArea: { left, right, top, bottom, width, height } } = chart;


            class CircleChevron {
                draw(ctx, x1, pixel) {
                    const angle = Math.PI / 180;

                    ctx.beginPath();
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = 'rgba(102,102,102,0.5)';
                    ctx.fillStyle = 'white';
                    ctx.arc(x1, (height / 2) + top, 15, angle * 0, angle * 360, false);
                    ctx.stroke();
                    ctx.fill();
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = 'rgba(64,64,64,1)';
                    ctx.moveTo(x1 + pixel, (height / 2) + top - 7.5);
                    ctx.lineTo(x1 - pixel, (height / 2) + top);
                    ctx.lineTo(x1 + pixel, (height / 2) + top + 7.5);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
            let drawCircleLeft = new CircleChevron();
            drawCircleLeft.draw(ctx, left, 5);
            let drawCircleRight = new CircleChevron();
            drawCircleRight.draw(ctx, right, -5);

        }
    }
    const conf = {
        type: 'line',
        data: data,
        options: {
            layout: {
                padding: {
                    right: 18
                }
            },
            scales: {
                x: {
                    min: 0,
                    max: 20
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 18
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 18
                        }
                    }
                }
            }
        },
        plugins: [moveChart]
    }

    const canva = document.getElementById(myConf.id);
    if (!inc) {
        const myChart = new Chart(canva, conf);
        function moveScroll() {
            const { ctx, canvas, chartArea: { left, right, top, bottom, width, height } } = myChart;
            const up = (height / 2) + top + 15;
            const down = (height / 2) + top - 15;

            canvas.addEventListener('click', (event) => {
                const rect = canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                // console.log(x + '-' + y);
                if (x >= left - 15 && x <= left + 15 && y >= down && y <= up) {
                    myChart.options.scales.x.min = myChart.options.scales.x.min - 7;
                    myChart.options.scales.x.max = myChart.options.scales.x.max - 7;
                    if (myChart.options.scales.x.min <= 0) {
                        myChart.options.scales.x.min = 0;
                        myChart.options.scales.x.max = 20;
                    }
                }

                if (x >= right - 15 && x <= right + 15 && y >= down && y <= up) {
                    myChart.options.scales.x.min = myChart.options.scales.x.min + 7;
                    myChart.options.scales.x.max = myChart.options.scales.x.max + 7;
                    if (myChart.options.scales.x.max >= data.datasets[0].data.length) {
                        myChart.options.scales.x.min = data.datasets[0].data.length - 20;
                        myChart.options.scales.x.max = data.datasets[0].data.length;
                    }
                }
                myChart.update();
            })
        }
        myChart.ctx.onclick = moveScroll();
    } else {
        myChart.update(conf);
    }
    inc = 1;
}