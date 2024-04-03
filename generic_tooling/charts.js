import { html } from "../imports.js"
import * as ChartJS from "https://esm.sh/chart.js@4.4.2/"
window.ChartJS = ChartJS
ChartJS.Chart.register(...ChartJS.registerables)
import * as de from 'https://esm.sh/date-fns@3.6.0'

export function Chart({style, width, height, data}) {
    data = data || {}
    const canvas = html`<canvas style=${style} background="transparent" color="white"></canvas>`
    const context = canvas.getContext("2d")
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = "rgba(0, 0, 0, 0)"
    canvas.chart = new ChartJS.Chart(canvas, {
        ...data,
        plugins: [
            ...(data?.plugins||[]),
        ],
        adapters: {
            date: {
                locale: de,
                ...data?.adapters?.date,
            },
            ...data?.adapters,
        },
    })
    return canvas
}