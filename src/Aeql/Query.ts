import { Node } from 'ohm-js';

export interface QueryElement {
    describe(): string
}

export class Identifier implements QueryElement {
    constructor(private value: string) {}
    describe() {
        return this.value;
    }
    getValue() {
        return this.value;
    }
}

export class Subject implements QueryElement {
    constructor(private name: Identifier) {}
    describe() {
        return `${this.name.describe()}`;
    }
    getName() { 
        return this.name.getValue();
    }
}

export class Condition implements QueryElement {
    getAttributeName() {
        return this.attributeName.getValue();
    }
    getValue() {
        return this.attributeExpr.getValue();
    }
    constructor(private attributeName: Identifier, private attributeExpr: any) {
    }

    describe() {
        return `${this.attributeName.describe()} is ${this.attributeExpr.describe()}`
    }
}

export class Ordering implements QueryElement {
    constructor(private name: Identifier) {}
    describe() {
        return `${this.name.describe()}`
    }
    getName() {
        return this.name.getValue();
    }
}

export class HttpVehicle {
    constructor(public url: string) {}

}

export class Via implements QueryElement {
    constructor(private vehicle: HttpVehicle) {} 
    describe() {
        return `${this.vehicle.url}`
    }

    getUrl(): any {
        return this.vehicle.url
    }
}

export class Query {
    constructor(
        public subject: Subject,
        public order?: Ordering,
        public conditions?: Condition[],
        public via?: Via
    ) {}

    describe() {
        console.log("conditions", this.conditions)
        let conditions = '';
        if (this.conditions && this.conditions.length) {
            conditions = `where ${this.conditions.map(condition => condition.describe())}`;
        } 
        let ordering = '';
        if (this.order) {
            ordering = `by ${this.order.describe()}`
        }
        let via = '';
        if (this.via) {
            via = `via ${this.via.describe()}`
        }
        return `Find ${this.subject.describe()} ${ordering} ${conditions} ${via}`;
    }
}
