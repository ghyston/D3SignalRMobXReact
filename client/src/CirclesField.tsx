import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import axios from "axios";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import CircleDto from "./CircleDto";

const CirclesField = () => {

    const createConnection = () => {
        const connect = new HubConnectionBuilder()
            .withUrl('https://localhost:7181/hub/circle')
            .withAutomaticReconnect()
            .build();

        connect
            .start()

        return connect;
    }

    const svgRef = useRef(null);
    const [circles, setCircles] = useState<CircleDto[]>([]);
    const [connection] = useState<HubConnection>(createConnection);

    // Subscribe to new circles
    useEffect(() => {
        connection.off("CircleCreated");
        connection.on("CircleCreated", (dto: CircleDto) => {
            setCircles([...circles, dto]);
        })

        connection.off("CircleRemoved");
        connection.on("CircleRemoved", (id: number) => {
            setCircles(circles.filter(c => c.id !== id));
        })

    }, [connection, circles])

    // retrieve initial set of circles
    useEffect(() => {
        axios.get<CircleDto[]>(
            'https://localhost:7181/circles',
            {
                headers: {
                    Accept: 'application/json',
                },
            }
        )
            .then((response) => {
                setCircles(response.data);
            })
    }, [])

    const drawCircles = () => {
        if (!svgRef.current) return;
        const graph = d3.select(svgRef.current);

        var allCircles = graph
            .selectAll<SVGCircleElement, CircleDto>("circle")
            .data(circles, (d: CircleDto) => d.id);

        allCircles
            .enter()
            .append("circle")
            .attr("cx", (dto: CircleDto) => dto.x)
            .attr("cy", (dto: CircleDto) => dto.y)
            .attr("r", 0)
            .attr("fill", (dto: CircleDto) => dto.color)
            .on("click", async (e: MouseEvent, dto: CircleDto) => {
                e.stopPropagation();
                await connection.send('RemoveCircle', dto.id);
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

    const handleClick = async (x: number, y: number) => {
        if (connection?.state !== HubConnectionState.Connected) {
            alert("not connected!");
            return;
        }

        await connection.send('CreateCircle', { x: x, y: y });
    }

    drawCircles();

    return (
        <svg
            ref={svgRef}
            width={640}
            height={480}
            onClick={(e: React.MouseEvent) => handleClick(e.clientX, e.clientY)}>

        </svg>
    );
}

export default CirclesField;