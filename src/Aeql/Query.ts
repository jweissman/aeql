export class Identifier {
    constructor(private value: string) {}
    describe() {
        return this.value;
    }
    getValue() {
        return this.value;
    }
}

export class Subject {
    constructor(private name: Identifier) {}
    describe() {
        return `${this.name.describe()}[subject]`;
    }
    getName() { 
        return this.name.getValue();
    }
}

class Condition {
    describe() { return 'a condition' }
}

export class Ordering {
    constructor(private name: Identifier) {}
    describe() {
        return `${this.name.describe()}[order]`
    }
    getName() {
        return this.name.getValue();
    }
}

export class HttpVehicle {
    constructor(public url: string) {}

}

export class Via {
    constructor(private vehicle: HttpVehicle) {} 

    getUrl(): any {
        return this.vehicle.url
    }
}

export class Query {
    constructor(public subject: Subject, public order?: Ordering, public conditions?: Condition[], public via?: Via) {
    }

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
        return `Find ${this.subject.describe()} ${ordering} ${conditions}`;
    }
}
