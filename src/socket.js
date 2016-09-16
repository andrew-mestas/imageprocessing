var socket = io.connect('https://10.83.100.132:443');
      socket.on('status', function (data) {
        console.log(data);
        socket.emit('data transmit', { my: 'data' });
      });

 socket.on('calculated data', function(totals){
      totalsC = totals.data;
      totals.data.map(function(v, i){return (v-whiteBalance[i] < 0) ? 0 : v-whiteBalance[i] });      
      myLineChart.data.datasets[0].data = totals.data;
      myBarChart.data.datasets[0].data = totals.data;
      myLineChart.update();
      myBarChart.update();
      updateChart(context);
    })