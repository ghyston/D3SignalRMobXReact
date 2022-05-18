import { action, makeObservable, observable } from "mobx";
import CircleDto from "./CircleDto";

class CirclesStore {
    circles: CircleDto[];

    constructor() {
        makeObservable(this, {
            circles: observable,
            addCircle: action
        })
        this.circles = []
    }

    addCircle(x: number, y: number) {
        //TODO
    }

}
export let circlesStore = new CirclesStore();