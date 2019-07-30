import { Query, Resource } from "./Query";

type AttributeType = 'Text' | 'Int' | 'Id'

export type Model = { [attribute: string]: AttributeType }
export type Models = { [modelNaem: string]: Model }

export type Persona = { [attribute: string]: AttributeType }
export type Personae = { [personaName: string]: Persona }

export type Entity = { id: number, [attr: string]: any }
export type Data = {
    [collectionName: string]: Entity[]
}

export interface AeqlQueryResolver {
    inquire(q: Query): Promise<Entity[]>
}

export type ResourceCollection = //[Resource, Entity[]]
{ resource: Resource, collection: Entity[] }

