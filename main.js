import { Elemental } from "./imports.js"
import { DateTime } from "./imports.js"
import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "https://deno.land/x/good_component@0.2.12/elements.js"
import { fadeIn, fadeOut } from "https://deno.land/x/good_component@0.2.12/main/animations.js"
import { showToast } from "https://deno.land/x/good_component@0.2.12/main/actions.js"
import { addDynamicStyleFlags, setupStyles, createCssClass, setupClassStyles, hoverStyleHelper, combineClasses, mergeStyles, AfterSilent, removeAllChildElements } from "https://deno.land/x/good_component@0.2.12/main/helpers.js"
import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://deno.land/x/good@1.5.1.0/array.js"

import storageObject from "https://deno.land/x/storage_object@0.0.2.0/main.js"
import { HourlyTimeline } from "./components/hourly.js"

const { html } = Elemental({
    ...components,
    HourlyTimeline,
})
import { getLatitudeLongitude } from "./generic_tooling/get_location.js"
import { getWeather } from "./generic_tooling/weather_api.js"

const weatherData = await getLatitudeLongitude().then(getWeather)
window.weatherData = weatherData
const hourlyData = weatherData?.properties?.periods

var todayLimit = (new DateTime()).add({days:1}).unix
var todaysHourlyData = hourlyData.filter(each => (new DateTime(each.startTime)).unix<todayLimit)
var otherHourlyData = hourlyData.filter(each => (new DateTime(each.startTime)).unix>=todayLimit)
let column
document.body = html`
    <body
        font-size=15px
        background-color=whitesmoke
        overflow=scroll
        width=100vw
        background="rgb(53,51,87)";
        background="linear-gradient(21deg, rgba(53,51,87,1) 0%, rgba(24,52,126,1) 11%, rgba(0,213,255,1) 100%)"
        display="flex"
        alignItems="center"
        flexDirection="column"
        >
            ${column = html`<Column width="fill-available" flex-grow=1 align-items="center" horizontalAlignment="center">
                <Row flex-grow=1 style="width: 55rem; max-width: calc(90vw - 1rem); margin: 2rem; background-color: rgba(255,255,255,0.2); box-sizing: content-box; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 4px 5px 0 rgba(0,0,0,0.10),0 1px 10px 0 rgba(0,0,0,0.08),0 2px 4px -1px rgba(0,0,0,0.24);" verticalAlignment="center" horizontalAlignment="center" overflow="hidden" position="relative">
                    <HourlyTimeline periods=${todaysHourlyData} width=500px height=300px  showDayNames=${false}/>
                </Row>
                <Row flex-grow=1 style="width: 55rem; max-width: calc(90vw - 1rem); margin: 2rem; background-color: rgba(255,255,255,0.2); box-sizing: content-box; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 4px 5px 0 rgba(0,0,0,0.10),0 1px 10px 0 rgba(0,0,0,0.08),0 2px 4px -1px rgba(0,0,0,0.24);" verticalAlignment="center" horizontalAlignment="center" overflow="hidden" position="relative">
                    <HourlyTimeline periods=${otherHourlyData} width=500px height=300px  />
                </Row>
            </Column>`}
    </body>
`
// setTimeout(()=>{
//     column.style.alignItems = "center"
// }, 1000)