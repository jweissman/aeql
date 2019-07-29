import Aeql from '../../Aeql'
import { HttpVehicle, Subject } from '../../Aeql/Query';

describe('Aeql', () => {
    let codd = { id: 1, name: 'Codd', age: 41 }
    let naur = { id: 2, name: 'Naur', age: 34 }
    let backus = { id: 3, name: 'Backus', age: 37 }
    let aeql = new Aeql({
        personae: {
            Human: {
                name: 'Text'
            },
            // User: {
            //     name: 'Text',
            //     username: 'Text',
            // }
        },
        models: {
            Experiment: {
                subject: 'Text',
                human_id: 'Id',
            }
        },
        data: {
            Humans: [codd, naur, backus],
            Experiments: [ {id: 1, subject: 'Database Science', human_id: 1} ],
        },
    });
    describe("queries", () => {
        it("queries by entity", () => {
            let queryString: string = 'find humans'
            let q = aeql.interpret(queryString)
            expect(q.subject).toEqual(Subject.of('humans'))
        })

        it("queries by dinosaurs", () => {
            let queryString: string = 'find dinosaurs'
            let q = aeql.interpret(queryString)
            expect(q.subject).toEqual(Subject.of('dinosaurs'))
        })

        it("queries with orders", () => {
            let queryString: string = 'find dinosaurs by age'
            let q = aeql.interpret(queryString)
            expect(q.subject).toEqual(Subject.of('dinosaurs'))
            expect(q.order).toEqual({ name: { value: 'age' }})
        })

        it("queries with string conditions", () => {
            let queryString: string = 'find dinosaurs whose name is fred'
            let q = aeql.interpret(queryString)
            expect(q.subject).toEqual(Subject.of('dinosaurs'))
            expect(q.conditions).toEqual([{ 
                attributeName: { value: 'name' },
                attributeExpr: { value: 'fred' }
            }])
        })

        it("queries with numeric conditions", () => {
            let qs = 'find dinosaurs whose age is 30000000'
            let q = aeql.interpret(qs)
            expect(q.subject).toEqual(Subject.of('dinosaurs'))
            expect(q.conditions).toEqual([{
                attributeName: { value: 'age' },
                attributeExpr: { value: 30000000 },
            }]);
        })

        it("queries with projections", () => {
            let qs = 'get name from employees'
            let q = aeql.interpret(qs)
            expect(q.subject).toEqual(Subject.project('employees', ['name']))
        })
        
        it("joins", () => {
            let qs = 'get employees and departments'
            let q = aeql.interpret(qs)
            expect(q.subject).toEqual(
                Subject.join('employees', 'departments')
            )
        })

        test.todo("queries with approximate conditions")
        test.todo("queries with arithmetic conditions")

        // test.todo("queries with algebraic conditions")
        // test.todo("queries with logical conditions")
        // test.todo("queries with categoreal conditions")

        it("queries via uri", () => {
            let queryString: string = 'find users via /users'
            let q = aeql.interpret(queryString)
            expect(q.subject).toEqual(Subject.of('users'))
            expect(q.via).toEqual({ vehicle: new HttpVehicle('/users') })
        })

        test.todo('queries with joins')
    });

    describe("resolution", () => {
        it('finds results', async () => {
            const res = await aeql.resolve('find humans');
            expect(res).toEqual([
                codd,
                naur,
                backus
            ]);
        });

        it('orders results', async () => {
            const res = await aeql.resolve('find humans by name');
            expect(res).toEqual([
                backus,
                codd,
                naur
            ]);
        })

        it('selects results by attributes', async () => {
            const res = await aeql.resolve('find humans whose name is Naur');
            expect(res).toEqual([{ id: 2, age: 34, name: 'Naur' }]);
        })

        it('projects results by attributes', async () => {
            const res = await aeql.resolve('find name of humans whose age is 34');
            expect(res).toEqual([{ id: 2, name: 'Naur' }]);
        })

        it.skip('naturally joins', async () => {
            const res = await aeql.resolve('find humans and experiments');
            expect(res).toEqual([{ id: 1, name: 'Codd', age: 41, subject: 'Database Science' }]);
        })

        it.skip('selects results by complex criteria', async () => {
            const res = await aeql.resolve('find humans whose age is over 40');
            expect(res).toEqual({ name: 'Codd' });
        })
    })

    test.todo('validates against schema')
})