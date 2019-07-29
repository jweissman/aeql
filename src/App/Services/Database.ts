import Aeql from "../../Aeql";
// import { Int}

export let aeql = new Aeql({
  personae: {
    Human: {
      name: 'Text',
      age: 'Int',
    },
    Employee: {
      name: 'Text',
      employee_number: 'Int',
      age: 'Int',
      salary: 'Int',
      department_id: 'Id',
    }
  },
  models: {
    Department: {
      area: 'Text',
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
      { id: 1, name: 'Rhonda',            department_id: 1, employee_number: 1002, age: 47, salary: 14000 },
      { id: 2, name: 'Barbara-Anniston',  department_id: 1, employee_number: 1034, age: 23, salary: 18000 },
      { id: 3, name: 'Carol Andrews',     department_id: 2, employee_number: 1045, age: 35, salary: 10000 },
      { id: 4, name: 'Sandra Amberg',     department_id: 3, employee_number: 5044, age: 42, salary: 18500 },
      { id: 5, name: 'Andra Saunders',    department_id: 3, employee_number: 231, age: 23, salary: 8000 },
      { id: 6, name: 'Exandra Calabanza', department_id: 3, employee_number: 1, age: 68, salary: 12000 },
    ],
    Departments: [
      { id: 1, area: 'Finance' },
      { id: 2, area: 'Human Resources' },
      { id: 3, area: 'Logistics' },
    ]
  }
});