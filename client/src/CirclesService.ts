import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import axios from "axios";
import CircleDto from "./CircleDto";
import { circlesStore } from "./CirclesStore";

class CirclesService {

    connection?: HubConnection;

    async connect() {
        this.createConnection();
        await this.connection?.start();

        this.connection?.on("CircleCreated", (dto: CircleDto) => {
            circlesStore.addCircle(dto)
        });
        this.connection?.on("CircleRemoved", (id: number) => {
            circlesStore.removeCircle(id)
        });
    }

    async disconnect() {
        this.createConnection();
        this.connection?.off("CircleCreated");
        this.connection?.off("CircleRemoved");
        await this.connection?.stop();
    }

    subscribe(color: "red" | "blue" | "orange" | "yellow" | "green") {
        this.connection?.send('SubscribeToColor', color);
    }

    unsubscribe(color: "red" | "blue" | "orange" | "yellow" | "green") {
        this.connection?.send('UnsubscribeToColor', color);
    }

    initialLoad() {
        axios.get<CircleDto[]>(
            'https://localhost:7181/circles',
            {
                headers: {
                    Accept: 'application/json',
                },
            }
        )
            .then((response) => {
                circlesStore.updateCircles(response.data)
            })
    }

    async createCircle(x: number, y: number) {
        if (this.connection?.state !== HubConnectionState.Connected) {
            alert("not connected!");
            return;
        }

        await this.connection?.send('CreateCircle', { x: x, y: y });
    }

    async removeCircle(id: number) {
        if (this.connection?.state !== HubConnectionState.Connected) {
            alert("not connected!");
            return;
        }

        await this.connection?.send('RemoveCircle', id);
    }

    private createConnection() {
        if (this.connection)
            return;

        this.connection = new HubConnectionBuilder()
            .withUrl('https://localhost:7181/hub/circle')
            .withAutomaticReconnect()
            .build();
    }
}

export let circlesService = new CirclesService();