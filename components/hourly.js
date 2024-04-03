import { Chart } from "../generic_tooling/charts.js"
// import DateTime from "https://deno.land/x/good@1.6.1.3/date.js"
import { DateTime } from "../imports.js"

export function HourlyTimeline({periods, style, width, height, showDayNames=true}) {
    var hourlyData = periods
    // hourlyData = [
    //     {
    //         number: 94,
    //         name: "",
    //         startTime: "2024-04-06T11:00:00-05:00",
    //         endTime: "2024-04-06T12:00:00-05:00",
    //         isDaytime: true,
    //         temperature: 72,
    //         temperatureUnit: "F",
    //         temperatureTrend: null,
    //         probabilityOfPrecipitation: { unitCode: "wmoUnit:percent", value: 0 },
    //         dewpoint: { unitCode: "wmoUnit:degC", value: 15 },
    //         relativeHumidity: { unitCode: "wmoUnit:percent", value: 63 },
    //         windSpeed: "20 mph",
    //         windDirection: "S",
    //         icon: "https://api.weather.gov/icons/land/day/bkn,0?size=small",
    //         shortForecast: "Partly Sunny",
    //         detailedForecast: ""
    //     },
    //     {
    //         number: 95,
    //         name: "",
    //         startTime: "2024-04-06T12:00:00-05:00",
    //         endTime: "2024-04-06T13:00:00-05:00",
    //         isDaytime: true,
    //         temperature: 75,
    //         temperatureUnit: "F",
    //         temperatureTrend: null,
    //         probabilityOfPrecipitation: { unitCode: "wmoUnit:percent", value: 0 },
    //         dewpoint: { unitCode: "wmoUnit:degC", value: 15 },
    //         relativeHumidity: { unitCode: "wmoUnit:percent", value: 58 },
    //         windSpeed: "20 mph",
    //         windDirection: "S",
    //         icon: "https://api.weather.gov/icons/land/day/bkn,0?size=small",
    //         shortForecast: "Partly Sunny",
    //         detailedForecast: ""
    //     },
    // ]
    var dataMax = Math.max(...hourlyData.map(each => each.temperature))
    var dataMin = Math.min(...hourlyData.map(each => each.temperature))
    var max = Math.max(dataMax, 100)
    var min = Math.min(dataMin, 0)
    var startTimes = hourlyData.map(each => (new DateTime(each.startTime)))
    var startHours = startTimes.map(each => `${each.hour12}${each.amPm}`)
    var hasPassedPm = false
    var passedFirstDay = false
    var labels = []
    // for (const each of startTimes) {
    //     let label = `${each.hour12}${each.amPm}`
    //     if (each.amPm=="pm") {
    //         hasPassedPm = true
    //     }
    //     if (hasPassedPm && each.amPm=="am") {
    //         passedFirstDay = true
    //     }
    //     if (passedFirstDay) {
    //         label = `${each.weekDayShort} ${each.hour12}${each.amPm}`
    //     }
    //     labels.push(label)
    // }
    if (showDayNames) {
        labels = startTimes.map(each => `${each.weekDayShort} ${each.hour12}${each.amPm}`)
    } else {
        labels = startTimes.map(each => `${each.hour12}${each.amPm}`)
    }
    let accumulator = 0
    var chartData = {
        type: 'line',
        data: {
            labels: labels, // ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [
                {
                    label: 'Temperature (°F)',
                    yAxisID: 'temperature',
                    data: hourlyData.map(each => each.temperature),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    radius: 2,
                    fill: false
                },
                {
                    label: 'Risk of Rain (%)',
                    yAxisID: 'rain',
                    data: hourlyData.map(each => each.probabilityOfPrecipitation.value),
                    radius: 0,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    fill: true
                },
                {
                    label: 'Wind (mph)',
                    yAxisID: 'wind',
                    data: hourlyData.map(each => each.windSpeed.replace(/ mph/g, "")-0),
                    radius: 0,
                    borderColor: 'rgb(89, 227, 197)',
                    backgroundColor: 'rgb(89, 227, 197, 0.3)',
                    fill: true,
                },
                {
                    label: 'Night',
                    yAxisID: 'dayOrNight',
                    data: hourlyData.map(each => {
                        let output = -75*((accumulator>=1)-0) + -25*((accumulator>=2)-0)
                        if (!each.isDaytime) {
                            if (accumulator < 2) {
                                accumulator += 1
                            }
                        } else {
                            if (accumulator > 0) {
                                accumulator -= 1
                            }
                        }
                        return output
                    }),
                    radius: 0,
                    borderColor: 'rgb(51, 47, 59, 0)',
                    backgroundColor: 'rgb(51, 47, 59, 0.3)',
                    tension: 0.4,
                    fill: true
                },
            ]
        },
        options: {
            plugins: {
                legend: {
                    // display: false,
                    fontColor: 'white',
                    color: 'white',
                    labels: {
                        color: 'white',
                    },
                    font: {
                        size: 14,
                        color: 'white',
                    }
                },
            },
            layout: {
                padding: 20
            },
            scales: {
                x: {
                    grid: {
                        // display: false,
                        // drawOnChartArea: false,
                        // drawTicks: false,
                        color: 'rgb(51, 47, 59, 0)',
                    },
                    ticks: {
                        color: 'rgb(255, 255, 255)',
                        callback: function(val, index) {
                            // Hide every 2nd tick label
                            return index % 2 === 0 ? this.getLabelForValue(val) : '';
                        },
                        font: {
                            size: 14
                        },
                    }
                },
                wind: {
                    max: 100,
                    min: 0,
                    type: 'linear',
                    position: 'left',
                    scaleLabel: {
                        display: true,
                        labelString: 'Wind (mph)',
                        color: 'rgb(255, 255, 255)',
                    },
                    ticks: {
                        color: 'rgb(255, 255, 255)',
                        display: false
                    },
                },
                temperature: {
                    max,
                    min,
                    id: 'temperature',
                    type: 'linear',
                    position: 'left',
                    scaleLabel: {
                        display: true,
                        labelString: 'Temperature (°F)'
                    },
                    ticks: {
                        display: true,
                        callback: function(value, index, values) {
                            return index % 2 === 0 ? "         "+value + '°F' : '';
                        },
                        color: 'rgb(255, 255, 255)',
                        font: {
                            size: 14,
                        },
                    },
                    grid: {
                         color: 'rgb(255, 255, 255, 0.3)',
                    },
                },
                rain: {
                    max: 100,
                    min: 0,
                    type: 'linear',
                    position: 'left',
                    scaleLabel: {
                        display: true,
                        labelString: 'Risk of Rain (%)'
                    },
                    ticks: {
                        display: false
                    },
                    grid: {
                         color: 'rgb(51, 47, 59, 0)',
                    },
                },
                dayOrNight: {
                    max: 0,
                    min: -100,
                    type: 'linear',
                    position: 'left',
                    scaleLabel: {
                        display: false,
                    },
                    ticks: {
                        color: 'rgb(255, 255, 255)',
                        display: false
                    },
                    grid: {
                         color: 'rgb(51, 47, 59, 0)',
                    },
                }
            }
        },
    }
    const canvas =  Chart({
        style,
        width,
        height,
        data: chartData,
    })
    canvas.style.marginLeft = "-58px"
    
    return canvas
}
