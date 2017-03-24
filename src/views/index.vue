<template>
<div>
  <section class="picker">
    <label for="picker">Forecasting from:</label>
    <input v-model="date" v-on:keyup.enter="getForecast" id="picker" placeholder="YYYYMMDD"></input>
    <button v-on:click.stop="getForecast">Submit</button>
    <p v-if="errorMsg" class="warn">{{ errorMsg }}</p>
  </section>

  <section>
    <div class="forecast ct-major-sixth"></div>
  </section>

  <section class="options">

    <label for="checkbox">
      <input type="checkbox" id="checkbox" v-model="darkSkyEnabled"></input>
      Enable Dark Sky data?
      <p class="warn">Warning: will use up any available Dark Sky API quota VERY quickly.</p>
    </label>
  </section>
</div>
</template>

<script>
  const axios = require('axios');
  const Chartist = require('chartist');

  module.exports = {
    data: () => {
      return {
        date: currentDateString(),
        darkSkyEnabled: false,
        errorMsg: '',
        forecasts: ''
      };
    },
    methods: {
      getDarkSky: function() {
        this.forecasts.forEach((forecast, index, array) => {
          axios.get(`/darksky/${forecast.DATE}`)
            .then((res) => {
              this.forecasts[index] = Object.assign({
                dsTmax: res.data.temperatureMax,
                dsTmin: res.data.temperatureMin
              }, forecast);
              if (index + 1 === array.length) {
                this.errorMsg = '';
                this.plotForecast();
              }
            })
            .catch((err) => {
              this.errorMsg = err.response.data;
              console.error(err);
            });
        });
      },
      getForecast: function() {
        axios.get(`/forecast/${this.date}`)
          .then((res) => {
            this.forecasts = res.data;
            this.errorMsg = '';
            if (this.darkSkyEnabled) {
              this.getDarkSky();
            } else {
              this.plotForecast();
            }
          })
          .catch((err) => {
            this.errorMsg = err.response.data;
            console.error(err);
          });
      },
      plotForecast: function() {
        let dates   = this.forecasts.map((f) => f.DATE);
        let tmins   = this.forecasts.map((f) => f.TMIN);
        let tmaxes  = this.forecasts.map((f) => f.TMAX);
        let dsMins  = this.forecasts.map((f) => f.dsTmin);
        let dsMaxes = this.forecasts.map((f) => f.dsTmax);

        new Chartist.Line('.forecast', {
          labels: dates,
          series: [{
            name: 'ds-tmaxes',
            className: 'ds-tmaxes',
            data: dsMaxes
          }, {
            name: 'ds-tmins',
            className: 'ds-tmins',
            data: dsMins
          }, {
            name: 'tmaxes',
            className: 'tmaxes',
            data: tmaxes
          }, {
            name: 'tmins',
            className: 'tmins',
            data: tmins
          }]
        },{
          chartPadding: { bottom: 50 },

          fullWidth: true
        });
      }
    },
    beforeMount() {
      this.getForecast();
    }
  };

  function currentDateString() {
    let rawDate = new Date;
    let year  = String(rawDate.getUTCFullYear());
    let month = padDate(rawDate.getUTCMonth());
    let date  = padDate(rawDate.getUTCDate());
    return year + month + date;
  }

  function padDate(rawDate) {
    let date = String(rawDate);
    return (date.length === 1 ? '0' + date : date);
  }

</script>
