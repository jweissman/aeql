import Aeql from '../../Aeql'
import { HttpVehicle } from '../../Aeql/Query';

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
        data: { Humans: [codd, naur, backus] },
    });
    describe("queries", () => {
        it("queries by entity", () => {
            let queryString: string = 'find humans'
            let q = aeql.interpret(queryString)
            expect(q.subject).toEqual({ name: { value: 'humans' } });
        })

        it("queries by dinosaurs", () => {
            let queryString: string = 'find dinosaurs'
            let q = aeql.interpret(queryString)
            expect(q.subject).toEqual({ name: { value: 'dinosaurs' } });
        })

        it("queries with orders", () => {
            let queryString: string = 'find dinosaurs by age'
            let q = aeql.interpret(queryString)
            expect(q.subject).toEqual({ name: { value: 'dinosaurs' } });
            expect(q.order).toEqual({ name: { value: 'age' }})
        })

        it("queries with conditions", () => {
            let queryString: string = 'find dinosaurs whose name is fred'
            let q = aeql.interpret(queryString)
            expect(q.subject).toEqual({ name: { value: 'dinosaurs' } });
            expect(q.conditions).toEqual([{ 
                attributeName: { value: 'name' },
                attributeExpr: { value: 'fred' }
            }])
        })

        it("queries via uri", () => {
            let queryString: string = 'find users via /users'
            let q = aeql.interpret(queryString)
            expect(q.subject).toEqual({ name: { value: 'users' }})
            expect(q.via).toEqual({ vehicle: new HttpVehicle('/users') })
        })
    });

    describe("resolution", () => {
        it('finds results', async () => {
            return aeql.resolve('find humans').then(res => {
                expect(res).toEqual([
                    codd,
                    naur,
                    backus
                ])
            })

            // done()
        });

        it('orders results', async () => {
            return aeql.resolve('find humans by name').then(res => {
              expect(res).toEqual([
                  backus,
                  codd,
                  naur
              ])
            })
        })

        it('selects results by attributes', () => {
            return aeql.resolve('find humans whose name is Naur').then(res => {
                expect(res).toEqual([{ id: 2, age: 34, name: 'Naur' }])
            });
        })

        it.skip('selects results by criteria', () => {
            return aeql.resolve('find humans whose age is over 40').then(res => {
            //expect(aeql.resolve('find humans whose age is over 40')).toEqual([
                expect(res).toEqual({ name: 'Codd' })
            // ])
            })
        })
    })

    test.todo('validates against schema')
})