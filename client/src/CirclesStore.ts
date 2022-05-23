import { action, makeObservable, observable } from "mobx";
import CircleDto from "./CircleDto";

class CirclesStore {
    circles: CircleDto[];

    constructor() {
        makeObservable(this, {
            circles: observable,
            addCircle: action,
            removeCircle: action,
            updateCircles: action
        })
        this.circles = []
    }

    updateCircles(dtos: CircleDto[]) {
        this.circles = dtos;
    }

    addCircle(dto: CircleDto) {
        this.circles.push(dto)
    }

    removeCircle(id: number) {
        const index = this.circles.findIndex(c => c.id === id);
        if (index > -1) {
            this.circles.splice(index, 1);
        }
    }

}
export let circlesStore = new CirclesStore();