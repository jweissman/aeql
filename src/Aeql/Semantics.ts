import grammar from './Grammar';
import { Query, Subject, Ordering, Identifier } from './Query';
import { Node } from 'ohm-js';

const tree = {
  Query: (_find: Node, entity: Node, elements: Node) => {
    let entityTree = entity.tree()
    let queryElementsTree = elements.tree()
    let orderTree: Ordering | undefined = undefined;
    //   orderTree = queryElementsTree;
    if (queryElementsTree instanceof Array) {
      console.log("GOT A ARRAY HERE :(")
      // assume query order for now??
      queryElementsTree.forEach(element => {
        if (element instanceof Ordering) {
          if (orderTree) {
            throw new Error("Can't have multiple orderings")
          }
          orderTree = element;
        }
      })
    }
    let q = new Query(entityTree, orderTree, [])
    console.log("QUERY TREE", { q, entityTree, elementsTree: queryElementsTree, orderTree })
    return q
  },

  Entity: (id: Node) => new Subject(id.tree()),
  
  Order: (_by: Node, order: Node) => {
    let orderTree = order.tree()
    // debugger;
    let ordering = new Ordering(orderTree)
    console.log("ORDER TREE", { orderTree, ordering })
    // debugger;
    return ordering;
  },

  ident: (fst: Node, rst: Node) =>
    new Identifier(fst.sourceString + rst.sourceString),
};

const semantics = grammar.createSemantics();
semantics.addOperation('tree', tree);

export default semantics;