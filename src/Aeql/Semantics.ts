import grammar from './Grammar';
import { Query, Subject, Condition, Ordering, Identifier as Identifier, Via, HttpVehicle, IntegerLiteral } from './Query';
import { Node } from 'ohm-js';

const tree = {
  Query: (_find: Node, entity: Node, elements: Node) => {
    let entityTree = entity.tree()
    let queryElementsTree = elements.tree()
    let orderTree: Ordering | undefined = undefined;
    let viaTree: Via | undefined = undefined;
    let conditionsTree: Condition[] = []
    if (queryElementsTree instanceof Array) {
      queryElementsTree.forEach(element => {
        if (element instanceof Ordering) {
          if (orderTree) { throw new Error("Can't have multiple orderings") }
          orderTree = element;
        } else if (element instanceof Via) {
          if (viaTree) { throw new Error("Can't have multiple vehicles (vias)") }
          viaTree = element;
        } else if (element instanceof Array && element.length && 
            element[0] instanceof Condition) { 
          if (conditionsTree.length) { throw new Error("Can't have multiple conditions") }
              // presume all conditions?
              conditionsTree = element;
        }
      })
    }
    let q = new Query(entityTree, orderTree, conditionsTree, viaTree)
    return q
  },

  Entity_simple: (id: Node) => new Subject(id.tree()),
  Entity_projection: (id: Node, _of: Node, projects: Node) => {
    let proj = new Subject(
      projects.tree(),
      id.tree(),
    )
    console.log("PROJ", proj)
    return proj
  },

  Criteria: (_where: Node, conditions: Node) => conditions.tree(),

  Conditions: (conditions: Node) => conditions.tree(),

  Condition: (attribute: Node, is: Node, value: Node) =>
    new Condition(attribute.tree(), value.tree()),
  
  Order: (_by: Node, order: Node) => {
    let orderTree = order.tree()
    let ordering = new Ordering(orderTree)
    return ordering;
  },

  Via: (_via: Node, vehicle: Node) => {
    let theVia = new Via(vehicle.tree());
    return theVia;
  },

  Vehicle: (_slash: Node, url: Node) => {
    let theVehicle: HttpVehicle = new HttpVehicle('/' + url.tree());
    return theVehicle;
  },

  URL: (elems: Node) => {
    return elems.sourceString
  },

  EmptyListOf: (): Node[] => [],
  emptyListOf: (): Node[] => [],

  NonemptyListOf: (eFirst: Node, _sep: any, eRest: Node) =>
    [eFirst.tree(), ...eRest.tree()],

  nonemptyListOf: (eFirst: Node, _sep: any, eRest: Node) =>
    [eFirst.tree(), ...eRest.tree()],

  number_whole: (digits: Node) =>
    new IntegerLiteral(Number(digits.sourceString)),

  ident: (fst: Node, rst: Node) =>
    new Identifier(fst.sourceString + rst.sourceString),
};

const semantics = grammar.createSemantics();
semantics.addOperation('tree', tree);

export default semantics;