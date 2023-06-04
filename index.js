(async () => {

    const topology = await fetch(
      'kecamatan_semarang.json'
    ).then(response => response.json());
  
    const data = await fetch(
      'rumahsakit.json'
    ).then(response => response.json());
  
    data.forEach(p => {
      p.z = p.case;
    });
  
    const H = Highcharts;
  
    const chart = Highcharts.mapChart('container', {
      title: {
        text: 'Peta Persebaran Rumah Sakit Rujukan Pasien AH'
      },
  
      tooltip: {
        pointFormat: '{point.hospital}, {point.parentKecamatan}<br>' +
          'Lon: {point.lon}<br>' +
          'Lat: {point.lat}<br>' +
          'Kasus: {point.case}'
      },
  
      xAxis: {
        crosshair: {
          zIndex: 5,
          dashStyle: 'dot',
          snap: false,
          color: 'gray'
        }
      },
  
      yAxis: {
        crosshair: {
          zIndex: 5,
          dashStyle: 'dot',
          snap: false,
          color: 'gray'
        }
      },
  
      series: [{
        name: 'Basemap',
        mapData: topology,
        accessibility: {
          exposeAsGroupOnly: true
        },
        borderColor: '#606060',
        nullColor: 'rgba(200, 200, 200, 0.2)',
        showInLegend: false
      }, {
        type: 'mapbubble',
        dataLabels: {
          enabled: true,
          format: '{point.hospital} ({point.case})'
        },
        accessibility: {
          point: {
            valueDescriptionFormat: '{point.hospital}, {point.parentKecamatan}. Case {point.case}. Latitude {point.lat:.2f}, longitude {point.lon:.2f}.'
          }
        },
        name: 'State capital cities',
        data: data,
        maxSize: '12%',
        color: H.getOptions().colors[0]
      }]
    });

    const bhaktiWiraData = data.find(p => p.abbrev === 'BHKTI WIRATMTM');
    bhaktiWiraData.color = '#FF0000';
  
    chart.update({
      series: [{
        name: 'State capital cities',
        data: data
      }]
    });
  
    // Display custom label with lat/lon next to crosshairs
    document.getElementById('container').addEventListener('mousemove', e => {
      if (!chart.lbl) {
        chart.lbl = chart.renderer.text('', 0, 0)
          .attr({
            zIndex: 5
          })
          .css({
            color: '#505050'
          })
          .add();
      }
  
      e = chart.pointer.normalize(e);
  
      chart.lbl.attr({
        x: e.chartX + 5,
        y: e.chartY - 22,
        text: 'Lat: ' + e.lat.toFixed(2) + '<br>Lon: ' + e.lon.toFixed(2)
      });
    });
  
  })();