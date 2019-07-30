import { Query} from "./Query";
import grammar from './Grammar';
import semantics from "./Semantics";
import { BasicAeqlQueryResolver } from "./BasicAeqlQueryResolver";
import { Personae, Models, Data, Entity } from "./Values";

interface AeqlConfig {
    personae?: Personae
    models: Models
    data?: Data
}

export class Aeql {
    public personae?: Personae
    public models?: Models
    public data?: Data

    constructor(public config: AeqlConfig) {
        if (config.personae) {
            this.personae = config.personae;
        }
        if (config.data) {
            this.data = config.data;
        }
        if (config.models) {
            this.models = config.models;
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
        if (this.data) {
            let result = await Aeql.processSimpleQueryManually(q, this.data || {})
            return result;
        } else {
            throw new Error("No data provided!")
        }
    }

    public async resolve(inputString: string): Promise<Entity[]> {
        return await this.evaluate(this.interpret(inputString));
    }

    private static async processSimpleQueryManually(q: Query, data: Data): Promise<Entity[]> {
        let solver = new BasicAeqlQueryResolver(data);
        return solver.inquire(q);
    }
}