import { Elemental } from "./imports.js"
import { DateTime } from "./imports.js"
import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "https://deno.land/x/good_component@0.2.12/elements.js"
import { fadeIn, fadeOut } from "https://deno.land/x/good_component@0.2.12/main/animations.js"
import { showToast } from "https://deno.land/x/good_component@0.2.12/main/actions.js"
import { addDynamicStyleFlags, setupStyles, createCssClass, setupClassStyles, hoverStyleHelper, combineClasses, mergeStyles, AfterSilent, removeAllChildElements } from "https://deno.land/x/good_component@0.2.12/main/helpers.js"
import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://deno.land/x/good@1.5.1.0/array.js"
window.wrapAroundGet = wrapAroundGet
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
// pink color

const colors = ["rgba(24,52,126,1)","rgba(24,52,126,1)","rgba(24,52,126,1)","rgba(24,52,126,1)","#5b73df", "#897ed3","#cf5c5c","#c19b4a","#498ada","#208ea2","#64b3d9","#64b3d9","#64b3d9","#64b3d9","#64b3d9","#64b3d9","#c19b4a","#cf5c5c","#897ed3","rgba(24,52,126,1)","rgba(24,52,126,1)","rgba(24,52,126,1)","rgba(24,52,126,1)","rgba(24,52,126,1)",]
let nextColors = []
let index = -1
for (const each of colors) {
    nextColors.push(
        wrapAroundGet((new Date().getHours())+index, colors)
    )
    index+=1
}
document.body = html`
    <body
        font-size=15px
        background-color=whitesmoke
        overflow=scroll
        width=100vw
        display="flex"
        alignItems="center"
        flexDirection="column"
        transition="background 360s ease-in-out"
        class="stage"
        >
        <style>
            body {
                margin: 0;
            }
            .stage {
                animation: animateBg 86400s linear infinite;
                background-image: linear-gradient(201deg,${nextColors.join(",")});
                background-size: 100% 1500%;
                height: 100vh;
                width: 100vw;
            }
            @keyframes animateBg {
                0% { background-position: 0% 0%; }
                100% { background-position: 0% 100%; }
            }
        </style>
            ${column = html`<Column width="fill-available" flex-grow=1 align-items="center" horizontalAlignment="center" height=200vh>
                <Row flex-grow=1 style="width: 55rem; max-width: calc(90vw - 1rem); margin: 2rem; background-color: rgba(255,255,255,0.2); box-sizing: content-box; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 4px 5px 0 rgba(0,0,0,0.10),0 1px 10px 0 rgba(0,0,0,0.08),0 2px 4px -1px rgba(0,0,0,0.24);" verticalAlignment="center" horizontalAlignment="center" overflow="hidden" position="relative" max-height=30rem>
                    <HourlyTimeline periods=${todaysHourlyData} width=500px height=300px  showDayNames=${false}/>
                </Row>
                <Row flex-grow=1 style="width: 55rem; max-width: calc(90vw - 1rem); margin: 2rem; background-color: rgba(255,255,255,0.2); box-sizing: content-box; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 4px 5px 0 rgba(0,0,0,0.10),0 1px 10px 0 rgba(0,0,0,0.08),0 2px 4px -1px rgba(0,0,0,0.24);" verticalAlignment="center" horizontalAlignment="center" overflow="hidden" position="relative" max-height=30rem>
                    <HourlyTimeline periods=${otherHourlyData} width=500px height=300px  />
                </Row>
            </Column>`}
    </body>
`
// setTimeout(()=>{
//     column.style.alignItems = "center"
// }, 1000)