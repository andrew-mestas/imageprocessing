var chartCanvas = document.getElementById('chart');
var ctx = chartCanvas.getContext('2d');
var barCanvas = document.getElementById('bar');
var barctx = barCanvas.getContext('2d');
 // Chart Functions
    var data = {
      labels: ['Maroon', 'Red', 'Green', 'Lime', 'Navy', 'Blue', 'Olive', 'Orange', 'Yellow', 'Teal', 'Cyan', 'Purple', 'Magenta', 'Black', 'White'],
      datasets: [
          {
              label: "Colors Detected",
              backgroundColor: "rgba(255,99,132,0.2)",
              borderColor: "rgba(255,99,132,1)",
              pointBackgroundColor: "rgba(255,99,132,1)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgba(255,99,132,1)",
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }
      ]
    };

    var bardata = {
      labels: ['Maroon', 'Red', 'Green', 'Lime', 'Navy', 'Blue', 'Olive', 'Orange', 'Yellow', 'Teal', 'Cyan', 'Purple', 'Magenta', 'Black', 'White'],
    datasets: [
        {
            label: "Colors Detected",
            backgroundColor: [
                'rgba(128, 0, 0, 0.2)',
                'rgba(255, 0, 0, 0.2)',
                'rgba(0, 128, 0, 0.2)',
                'rgba(0, 255, 0, 0.2)',
                'rgba(0, 0, 128, 0.2)',
                'rgba(0, 0, 255, 0.2)',
                'rgba(128, 128, 0, 0.2)',
                'rgba(255, 128, 0, 0.2)',
                'rgba(255, 255, 0, 0.2)',
                'rgba(0, 128, 128, 0.2)',
                'rgba(0, 255, 255, 0.2)',
                'rgba(128, 0, 128, 0.2)',
                'rgba(255, 0, 255)',
                'rgba(0, 0, 0, 0.2)',
                'rgba(255, 255, 255, 0.2)'
            ],
            borderColor: [
                'rgba(128, 0, 0, 1)',
                'rgba(255, 0, 0, 1)',
                'rgba(0, 128, 0, 1)',
                'rgba(0, 255, 0, 1)',
                'rgba(0, 0, 128, 1)',
                'rgba(0, 0, 255, 1)',
                'rgba(128, 128, 0, 1)',
                'rgba(255, 128, 0, 1)',
                'rgba(255, 255, 0, 1)',
                'rgba(0, 128, 128, 1)',
                'rgba(0, 255, 255, 1)',
                'rgba(128, 0, 128, 1)',
                'rgba(255, 0, 255)',
                'rgba(0, 0, 0, 1)',
                 'rgba(255, 255, 255, 1)'
            ],
            borderWidth: 1,
            data: [0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0]
        }
    ]
};

    var myLineChart = Chart.Line(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: false,
        scaleLabel: true,
        animation: {
            duration: 0
        },
       scales: {
            yAxes: [{
                ticks: {
                    max: 1,
                    min: 0,
                    stepSize: 0.1
                }
            }]
        }
      }
    }); 
    
    var myBarChart = new Chart(barctx, {
      type: 'bar',
      data: bardata,
      options: {
        responsive: false,
        animation: {
            duration: 0
        },
        scales: {
            yAxes: [{
                ticks: {
                    max: 1,
                    min: 0,
                    stepSize: 0.1
                }
            }]
        }
      }
    });