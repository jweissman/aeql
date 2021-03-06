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

export class IntegerLiteral implements QueryElement {
    constructor(private value: number) {}
    describe() { return this.value.toString(); }
    getValue() { return this.value; }
}

export class HttpVehicle {
    constructor(public url: string) {}
    getUrl() { return this.url; }
    describe(): String {
        return this.url;
    }
}

export class Resource implements QueryElement {
    
    static of(nameValue: string) {
        return new Resource(
            new Identifier(nameValue)
        );
    }

    constructor(private identifier: Identifier, private via?: HttpVehicle) { }
    describe(): string {
        if (this.via) {
            return `${this.identifier.describe()} via ${this.via.describe()}`;
        } else {
            return this.identifier.describe();
        }
    }

    getName() {
        return this.identifier.getValue();
    }

    hasVehicle() {
        return !!this.via;
    }

    getVehicle() {
        return this.via;
    }

}

export class Subject implements QueryElement {
    static of(nameValue: string) {
        return new Subject([ Resource.of(nameValue) ]);
    }

    static project(nameValue: string, projectValues: string[]) {
        return new Subject(
            [ Resource.of(nameValue) ],
            projectValues.map(project => new Identifier(project)),
        )
    }

    static join(...resourceNames: string[]) {
        return new Subject(
            resourceNames.map(resourceName => Resource.of(resourceName))
        );
    }

    constructor(
        private resources: Resource[] = [],
        private projections: Identifier[] = []
    ) { }

    isProjected() {
        return !!this.projections.length;
    }

    describe() {
        let resourceDescription = this.resources.
            map(res => res.getName()).join(' and ');

        if (this.projections.length) {
            return this.projections.map(project =>
                project.describe()
            ).join(", ") + ` of ${resourceDescription}`;
        } else {
            return resourceDescription;
        }
    }

    getResources() {
        return this.resources;
    }

    getProjects() {
        return this.projections;
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



export class Query {
    constructor(
        public subject: Subject,
        public order?: Ordering,
        public conditions?: Condition[],
        // public via?: Via
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
        // if (this.via) {
        //     via = `via ${this.via.describe()}`
        // }
        return `Find ${this.subject.describe()} ${ordering} ${conditions} ${via}`;
    }
}
