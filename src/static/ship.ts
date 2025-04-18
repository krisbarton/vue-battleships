export default class Ship {
    name: string;
    length: number;

    constructor(name: string, length: number) {
        this.name = name;
        this.length = length;
    }
}

export interface IShip {
    name: string;
    length: number;
}