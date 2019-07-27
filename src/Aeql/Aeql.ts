import { Query } from "./Query";
import grammar from './Grammar';
import semantics from "./Semantics";
import capitalism from "./util/capitalism";


type AttributeType = 'Text' | 'Int' | string
export type Persona = { [attribute: string]: AttributeType }
export type Personae = { [model: string]: Persona }

export type Entity = { id: number, [attr: string]: any }
export type Data = {
    [collectionName: string]: Entity[]
}
interface AeqlConfig {
    personae: Personae
    data?: Data
}
export class Aeql {

    public personae: Personae
    public data?: Data

    constructor(public config: AeqlConfig) {
        this.personae = config.personae;
        if (config.data) {
            this.data = config.data;
        }
    }

    public interpret(inputString: string): Query {
        console.log("processing input", inputString);
        let match = grammar.match(inputString);
        if (match.succeeded()) {
            let s = semantics(match);
            return s.tree();
        } else {
            throw new Error("Could not parse input string: " + match.message);
        }
    }

    public evaluate(q: Query): Entity[] {
        if (this.data) {
            return Aeql.processQuery(q, this.data)
        } else {
            throw new Error("No data provided!")
        }
    }

    public resolve(inputString: string): Entity[] {
        return this.evaluate(this.interpret(inputString));
    }

    private static processQuery(q: Query, data: Data) {
        let collectionName: string = capitalism.capitalize(
            q.subject.getName()
        )
        console.log("LOOKUP COLLECTION", { collectionName, data });
        let collection = data[collectionName];
        if (q.order) {
            let { order } = q
            console.log("APPLY ORDER", { order })
            let orderName = order.getName()
            collection = collection.sort((a, b) =>
                a[orderName] > b[orderName] ? 1 : -1
            )
        }
        return collection;
    }
}