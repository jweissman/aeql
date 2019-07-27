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

export class Query {
    constructor(public subject: Subject, public order?: Ordering, public conditions?: Condition[]) {
        console.log("CONSTRUCT QUERY",
        {
            subject,
            order,
            conditions,
        })
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
