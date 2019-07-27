import grammar from './Grammar';
import { Query, Subject, Ordering, Identifier, Via, HttpVehicle } from './Query';
import { Node } from 'ohm-js';

const tree = {
  Query: (_find: Node, entity: Node, elements: Node) => {
    let entityTree = entity.tree()
    let queryElementsTree = elements.tree()
    let orderTree: Ordering | undefined = undefined;
    let viaTree: Via | undefined = undefined;
    if (queryElementsTree instanceof Array) {
      queryElementsTree.forEach(element => {
        if (element instanceof Ordering) {
          if (orderTree) { throw new Error("Can't have multiple orderings") }
          orderTree = element;
        } else if (element instanceof Via) {
          if (viaTree) { throw new Error("Can't have multiple vehicles (vias)") }
          viaTree = element;
        }
      })
    }
    let q = new Query(entityTree, orderTree, [], viaTree)
    return q
  },

  Entity: (id: Node) => new Subject(id.tree()),
  
  Order: (_by: Node, order: Node) => {
    let orderTree = order.tree()
    let ordering = new Ordering(orderTree)
    return ordering;
  },


  Via: (_via: Node, vehicle: Node) => {
    let theVia = new Via(vehicle.tree());
    return theVia;
  },

  Vehicle_http: (_https: Node, url: Node, _closingParens: Node) => {
    let theVehicle: HttpVehicle = new HttpVehicle(url.tree());
    return theVehicle;

  },

  URL: (elems: Node) => {
    return elems.sourceString
  },

  ident: (fst: Node, rst: Node) =>
    new Identifier(fst.sourceString + rst.sourceString),
};

const semantics = grammar.createSemantics();
semantics.addOperation('tree', tree);

export default semantics;