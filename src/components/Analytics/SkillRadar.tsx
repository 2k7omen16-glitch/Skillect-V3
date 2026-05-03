import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface SkillData {
  axis: string
  value: number
}

export default function SkillRadar({ data }: { data: SkillData[] }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data.length) return

    const width = 300
    const height = 300
    const margin = 50
    const radius = Math.min(width, height) / 2 - margin
    const levels = 5
    const maxValue = 100
    const angleSlice = (Math.PI * 2) / data.length

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)

    // Circular Grid
    for (let j = 0; j < levels; j++) {
      const levelRadius = (radius / levels) * (j + 1)
      g.append("circle")
        .attr("r", levelRadius)
        .attr("fill", "none")
        .attr("stroke", "#E2E8F0")
        .attr("stroke-dasharray", "4 4")
    }

    // Axis
    const axis = g.selectAll(".axis")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "axis")

    axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (_d, i) => radius * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (_d, i) => radius * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("stroke", "#E2E8F0")
      .attr("stroke-width", "1px")

    axis.append("text")
      .attr("class", "legend")
      .style("font-size", "9px")
      .style("font-weight", "900")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", (_d, i) => (radius + 20) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y", (_d, i) => (radius + 20) * Math.sin(angleSlice * i - Math.PI / 2))
      .text(d => d.axis.toUpperCase())
      .attr("fill", "#0A1628")

    // Radar Area
    const radarLine = d3.lineRadial<SkillData>()
      .radius(_d => (_d.value / maxValue) * radius)
      .angle((_d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed)

    g.append("path")
      .datum(data)
      .attr("d", radarLine)
      .attr("fill", "rgba(232, 19, 42, 0.1)")
      .attr("stroke", "#E8132A")
      .attr("stroke-width", 3)
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .style("opacity", 1)

    // Dots
    g.selectAll(".radarCircle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "radarCircle")
      .attr("r", 4)
      .attr("cx", (d, i) => (d.value / maxValue) * radius * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("cy", (d, i) => (d.value / maxValue) * radius * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("fill", "#FFFFFF")
      .attr("stroke", "#E8132A")
      .attr("stroke-width", 2)

  }, [data])

  return (
    <div className="flex justify-center items-center h-full">
      <svg ref={svgRef} width={300} height={300} className="overflow-visible" />
    </div>
  )
}
