import Aeql from "../../Aeql";

export let aeql = new Aeql({
  personae: {
    Human: {
      name: 'string',
      age: 'int',
    },
    Employee: {
      name: 'string',
      empId: 'int',
      age: 'int',
      salary: 'int',
      department: 'Department',
    }
  },
  data: {
    Humans: [
      { id: 1, name: 'Zeta',   age: 59 },
      { id: 2, name: 'Bob',    age: 23 },
      { id: 3, name: 'Jim',    age: 19 },
      { id: 4, name: 'Abel',   age: 24 },
      { id: 5, name: 'Sawyer', age: 34 },
    ],
    Employees: [
      { id: 1, name: 'Rhonda', empId: 1002, age: 47, salary: 14000 },
      { id: 2, name: 'Barbara-Anniston', empId: 1034, age: 23, salary: 18000 },
      { id: 3, name: 'Carol Andrews', empId: 1045, age: 35, salary: 10000 },
      { id: 4, name: 'Sandra Amberg', empId: 5044, age: 42, salary: 18500 },
      { id: 5, name: 'Andra Saunders', empId: 231, age: 23, salary: 8000 },
      { id: 6, name: 'Exandra Calabanza', empId: 1, age: 68, salary: 12000 },
    ]
  }
});