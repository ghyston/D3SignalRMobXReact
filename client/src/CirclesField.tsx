import * as d3 from "d3";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import CircleDto from "./CircleDto";
import { circlesService } from "./CirclesService";
import { circlesStore } from "./CirclesStore";

const CirclesField = observer(() => {

    const svgRef = useRef(null);

    useEffect(() => {
        circlesService.initialLoad();
        circlesService.connect();
        
        return () => {
            circlesService.disconnect()
        }
    }, [])

    const drawCircles = (circles: CircleDto[]) => {
        if (!svgRef.current) return;
        const graph = d3.select(svgRef.current);

        var allCircles = graph
            .selectAll<SVGCircleElement, CircleDto>("circle")
            .data(circlesStore.circles, (d: CircleDto) => d.id);

        allCircles
            .enter()
            .append("circle")
            .attr("cx", (dto: CircleDto) => dto.x)
            .attr("cy", (dto: CircleDto) => dto.y)
            .attr("r", 0)
            .attr("fill", (dto: CircleDto) => dto.color)
            .on("click", async (e: MouseEvent, dto: CircleDto) => {
                e.stopPropagation();
                circlesService.removeCircle(dto.id)
            })
            .transition()
            .ease(d3.easeBounceOut)
            .duration(300)
            .attr("r", (dto: CircleDto) => dto.r);

        allCircles
            .exit()
            .transition()
            .ease(d3.easeQuadIn)
            .duration(300)
            .attr("r", 0)
            .remove();
    }

    drawCircles(circlesStore.circles);

    return (
        <>
            <svg
                ref={svgRef}
                width={640}
                height={480}
                onClick={(e: React.MouseEvent) => circlesService.createCircle(e.clientX, e.clientY)}>
            </svg>
            
        </>
    );
})

export default CirclesField;