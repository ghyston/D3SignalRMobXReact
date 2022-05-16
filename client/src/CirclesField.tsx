import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import axios from "axios";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

interface CircleDto {
    x: number;
    y: number;
    r: number;
    color: string;
}

const CirclesField = () => {

    const createConnection = () => {
        const connect = new HubConnectionBuilder()
            .withUrl('https://localhost:7181/hub/circle')
            .withAutomaticReconnect()
            .build();

        connect
            .start()
            .then(_ => {
                alert("connection started!");
                connection?.on("NewCircle", onNewCircle)
            })
            .catch(e => alert(`Connection failed: ${e}`));

        return connect;
    }

    const svgRef = useRef(null);
    const [circles, setCircles] = useState<CircleDto[]>([]);
    const [connection] = useState<HubConnection>(createConnection);

    // Subscribe to new circles
    /*useEffect(() => {

        connection
            .start()
            .then(_ => {
                alert("connection started!");
                connection?.on("NewCircle", onNewCircle)
            })
            .catch(e => alert(`Connection failed: ${e}`));

    }, [])*/

    const onNewCircle = (dto: CircleDto) => {
        alert(`onNewCircle: ${dto.x} ${dto.y} ${dto.r}`);
        setCircles([...circles, dto]);
        alert(`circles amount: ${circles.length}`)
    }

    // retrieve initial set of circles
    useEffect(() => {
        alert("requesting circles");
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
                alert("initial circles retrieved");
            })
    }, [])

    const drawCircles = () => {
        if (!svgRef.current) return;
        const graph = d3.select(svgRef.current);

        //alert("draw circles!");
        console.log(`draw circles amount: ${circles.length}`)

        var allCircles = graph
            .selectAll("circle")
            .data(circles);

        allCircles
            .enter()
            .append("circle")
            .attr("cx", (dto: CircleDto) => dto.x)
            .attr("cy", (dto: CircleDto) => dto.y)
            .attr("r", (dto: CircleDto) => dto.r)
            .attr("fill", (dto: CircleDto) => dto.color)

        allCircles
            .exit()
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