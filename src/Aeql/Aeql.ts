import { Query, Condition, Identifier } from "./Query";
import grammar from './Grammar';
import semantics from "./Semantics";
import capitalism from "./util/capitalism";
import axios from 'axios';
import pluralize from 'pluralize';

type AttributeType = 'Text' | 'Int' | 'Id' // | string

export type Model = { [attribute: string]: AttributeType }
export type Models = { [modelNaem: string]: Model }

export type Persona = { [attribute: string]: AttributeType }
export type Personae = { [personaName: string]: Persona }

export type Entity = { id: number, [attr: string]: any }
export type Data = {
    [collectionName: string]: Entity[]
}
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
        console.log("PROCESS SIMPLE QUERY MANUALLY", { q })
        // let collectionName: string = ''
        let collection: { id: number, [key: string]: any }[] = [];

        let firstCollectionId: Identifier = q.subject.getResources()[0]
        let collectionName = capitalism.capitalize(
            firstCollectionId.getValue()
        )
        if (data[collectionName] && data[collectionName].length) {
            collection = data[collectionName].slice().map(a => ({ ...a }))
        }
        if (q.subject.getResources().length === 1) {
            // okay, collection is fine!
        } else {
            q.subject.getResources().forEach((resourceId: Identifier) => {
                if (resourceId !== firstCollectionId) {
                    let resourceName = capitalism.capitalize(
                        resourceId.getValue()
                    )
                    if (data[resourceName] && data[resourceName].length) {
                        let resource = data[resourceName].slice().map(a => ({ ...a }))
                        if (resource.length) {
                            let allResourceAttrs = Object.keys(resource[0])
                            let allModelAttrs = Object.keys(collection[0])
                            let belongToKey = pluralize.singular(
                                capitalism.downcase(collectionName)
                            ) + "_id"
                            let hasOneKey = pluralize.singular(
                                capitalism.downcase(resourceName)
                            ) + "_id"

                            let belongingAttribute = allResourceAttrs.find(attr =>
                                attr === belongToKey
                            ) || ''
                            let hasOneAttribute = allModelAttrs.find(attr =>
                                attr === hasOneKey
                            ) || ''

                            if (belongingAttribute || hasOneAttribute) {
                                collection = collection.flatMap(it => {
                                    let matchingResource = {}
                                    if (it.id) {
                                        let res = resource.find(otherIt =>
                                            belongingAttribute && otherIt[belongingAttribute] === it.id ||
                                            hasOneAttribute && it[hasOneAttribute] == otherIt.id
                                        )
                                        if (res) {
                                            matchingResource = Object.assign({}, res);
                                            // @ts-ignore
                                            delete matchingResource[belongingAttribute];
                                            // @ts-ignore
                                            delete matchingResource[hasOneAttribute];
                                            let item = Object.assign({}, it)
                                            return Object.assign(item, matchingResource)
                                        }
                                    }
                                }).flat().filter(el => el !== undefined)
                            }
                        }
                    }
                }
            })
        }

        if (q.via) {
            let result = await axios.get(q.via.getUrl(), {
                baseURL: 'https://jsonplaceholder.typicode.com'
            })
            collection = result.data
        }
        if (q.order) {
            let { order } = q
            let orderName = order.getName()
            collection = collection.sort((a, b) =>
                a[orderName] > b[orderName] ? 1 : -1
            )
        }
        if (q.conditions) {
            let { conditions } = q
            conditions.forEach((condition: Condition) => {
                let attr = condition.getAttributeName()
                let val = condition.getValue()
                collection = collection.filter(it => {
                    let matches = it[attr] == val
                    console.log({ it, matches })
                    return !!matches
                })
                console.log("APPLY CONDITION", { condition, collection });
            })
        }
        if (q.subject.isProjected()) {
            collection = collection.map(it => {
                let projection: { id: number, [key: string]: any } = {
                    id: it.id
                };
                q.subject.getProjects().forEach(project => {
                    let val: string = project.getValue();
                    projection[val] = it[val];
                })
                console.log("PROJECTED", { it, projection })
                return projection;
            })
            // q.subject.getProjections()
        }
        return collection;
    }
}