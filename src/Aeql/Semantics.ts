import grammar from './Grammar';
import { Query, Subject, Ordering, Identifier } from './Query';
import { Node } from 'ohm-js';

const tree = {
  Query: (_find: Node, entity: Node, order: Node) => {
    let entityTree = entity.tree()
    let orderTree = order.tree()
    console.log("QUERY TREE", { entityTree, orderTree })
    return new Query(entityTree, orderTree[0], [])
  },

  Entity: (id: Node) =>
    new Subject(id.tree()),
  
  Order: (_by: Node, ordering: Node) => {
    console.log("ORDER TREE", { tree: ordering.tree() })
    return new Ordering(ordering.tree())
  },

  ident: (fst: Node, rst: Node) =>
    new Identifier(fst.sourceString + rst.sourceString),
};

const semantics = grammar.createSemantics();
semantics.addOperation('tree', tree);

export default semantics;