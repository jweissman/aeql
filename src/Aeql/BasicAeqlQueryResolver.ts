import { Query, Condition, Resource, HttpVehicle } from "./Query";
import capitalism from "./util/capitalism";
import axios from 'axios';
import pluralize from 'pluralize';
import { AeqlQueryResolver, Data, Entity, ResourceCollection } from "./Values";
export class BasicAeqlQueryResolver implements AeqlQueryResolver {
    data: Data;
    constructor(data: Data) {
        this.data = { ...data };
    }
    private async gatherResource(resource: Resource): Promise<Entity[]> {
        let data = this.data;
        let collection: Entity[] = [];
        let collectionId: string = resource.getName();
        let collectionName = capitalism.capitalize(collectionId);
        let maybeVehicle = resource.getVehicle();
        if (maybeVehicle) {
            let vehicle: HttpVehicle = maybeVehicle;
            let result = await axios.get(vehicle.getUrl(), {
                baseURL: 'https://jsonplaceholder.typicode.com'
            });
            collection = result.data;
        }
        else if (data[collectionName] && data[collectionName].length) {
            data[collectionName].forEach(row => collection.push({ ...row }));
        }
        else {
            throw new Error(`Could not gather data for resource ${resource.describe()}`);
        }
        return collection;
    }

    private static join(alpha: ResourceCollection, beta: ResourceCollection): ResourceCollection {
        let { resource: alphaName, collection: alphaCollection } = alpha;
        let { resource: betaName, collection: betaCollection } = beta;
        let firstCollectionId = alphaName.getName();
        let resourceId = betaName.getName();
        let resultCollection: Entity[] = [];
        if (resourceId !== firstCollectionId) {
            if (betaCollection && betaCollection.length) {
                let resource = betaCollection.slice().map(a => ({ ...a }));
                if (resource.length) {
                    let allResourceAttrs = Object.keys(resource[0]);
                    let allModelAttrs = Object.keys(alphaCollection[0]);
                    let belongToKey = pluralize.singular(capitalism.downcase(firstCollectionId)); //+ "_id"
                    let hasOneKey = pluralize.singular(capitalism.downcase(resourceId)); //+ "_id"
                    let belongsToPattern = new RegExp(belongToKey + "?.id", "i");
                    let hasOnePattern = new RegExp(hasOneKey + "?.id", "i");
                    let belongingAttribute = allResourceAttrs.find(attr => attr.match(belongsToPattern)) || '';
                    let hasOneAttribute = allModelAttrs.find(attr => attr.match(hasOnePattern)) || '';
                    if (belongingAttribute || hasOneAttribute) {
                        resultCollection = alphaCollection.flatMap(it => {
                            if (it.id) {
                                let res = resource.find(otherIt => belongingAttribute && otherIt[belongingAttribute] === it.id ||
                                    hasOneAttribute && it[hasOneAttribute] == otherIt.id);
                                if (res) {
                                    return { ...it, ...res };
                                }
                            }
                        }).flat().filter(el => el !== undefined).map((it, idx) => {
                            // delete it.id
                            it.id = idx + 1;
                            if (belongingAttribute) {
                                // delete it[belongingAttribute]
                            }
                            if (hasOneAttribute) {
                                // delete it[hasOneAttribute]
                            }
                            return it;
                        });
                    }
                }
            }
        }
        return { resource: alphaName, collection: resultCollection };
    }
    private async gatherResources(resources: Resource[]): Promise<Entity[]> {
        let gatherers: Promise<ResourceCollection>[] = resources.map(async (resource) => { return { resource, collection: await this.gatherResource(resource) }; });
        let resourceCollections: ResourceCollection[] = await Promise.all(gatherers);
        let entities: ResourceCollection = resourceCollections.reduce((acc, curr) => BasicAeqlQueryResolver.join(acc, curr));
        return entities.collection;
    }
    public async inquire(q: Query): Promise<Entity[]> {
        console.log("PROCESS SIMPLE QUERY MANUALLY", { q });
        let collection: Entity[] = await this.gatherResources(q.subject.getResources());
        if (q.order) {
            let { order } = q;
            let orderName = order.getName();
            collection = collection.sort((a, b) => a[orderName] > b[orderName] ? 1 : -1);
        }
        if (q.conditions) {
            let { conditions } = q;
            conditions.forEach((condition: Condition) => {
                let attr = condition.getAttributeName();
                let val = condition.getValue();
                collection = collection.filter(it => {
                    let matches = it[attr] == val;
                    console.log({ it, matches });
                    return !!matches;
                });
                console.log("APPLY CONDITION", { condition, collection });
            });
        }
        if (q.subject.isProjected()) {
            collection = collection.map(it => {
                let projection: {
                    id: number;
                    [key: string]: any;
                } = {
                    id: it.id
                };
                q.subject.getProjects().forEach(project => {
                    let val: string = project.getValue();
                    projection[val] = it[val];
                });
                console.log("PROJECTED", { it, projection });
                return projection;
            });
        }
        return collection;
    }
}
