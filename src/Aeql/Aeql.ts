import { Query } from "./Query";
import grammar from './Grammar';
import semantics from "./Semantics";
import capitalism from "./util/capitalism";
import axios from 'axios';


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
        let match = grammar.match(inputString);
        if (match.succeeded()) {
            let s = semantics(match);
            return s.tree();
        } else {
            throw new Error("Could not parse input string: " + match.message);
        }
    }

    public async evaluate(q: Query): Promise<Entity[]> {
        if (q.via || this.data) {
            let result = await Aeql.processSimpleQueryManually(q, this.data || {})
            return result;
        } else {
            throw new Error("No data provided!")
        }
    }

    public async resolve(inputString: string): Promise<Entity[]> {
        return await this.evaluate(this.interpret(inputString));
    }

    private static async processSimpleQueryManually(q: Query, data: Data) {
        let collectionName: string = capitalism.capitalize(
            q.subject.getName()
        )
        let collection: Entity[] = [];
        if (q.via) {
            let result = await axios.get(q.via.getUrl(), {
                baseURL: 'https://jsonplaceholder.typicode.com'
            })
            collection = result.data
        } else if (data[collectionName] && data[collectionName].length) {
            collection = data[collectionName].slice();
        }
        if (q.order) {
            let { order } = q
            let orderName = order.getName()
            collection = collection.sort((a, b) =>
                a[orderName] > b[orderName] ? 1 : -1
            )
        }
        return collection;
    }
}