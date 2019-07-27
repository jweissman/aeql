import Aeql from '../../Aeql'
import { HttpVehicle } from '../../Aeql/Query';

describe('Aeql', () => {
    let codd = { id: 1, name: 'Codd', age: 40 }
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

        it("queries via uri", () => {
            let queryString: string = 'find users via https(/users)'
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

        it.skip('finds results by attributes', () => {
            expect(aeql.resolve('find humans whose name is Naur')).toEqual([
                { id: 2, name: 'Naur' }
            ])
        })
    })
})