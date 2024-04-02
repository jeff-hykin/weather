import { html } from "../imports.js"
import * as ChartJS from "https://esm.sh/chart.js@4.4.2/"
window.ChartJS = ChartJS
ChartJS.Chart.register(...ChartJS.registerables)

export function Chart({style, width, height, data}) {
    const canvas = html`<canvas style=${style} width=${width} height=${height}></canvas>`
    canvas.chart = new ChartJS.Chart(canvas, data)
    return canvas
}