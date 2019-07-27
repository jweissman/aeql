import Aeql from '../../Aeql'

describe('Aeql', () => {
    let codd = { id: 1, name: 'Codd', age: 40 }
    let naur = { id: 2, name: 'Naur', age: 34 }
    let backus = { id: 3, name: 'Backus', age: 37 }
    let aeql = new Aeql({
        personae: {
            Human: {
                name: 'Text'
            }
        },
        data: { Humans: [codd, naur, backus]},
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
    });

    describe("resolution", () => {
        it('finds results', () => {
            expect(aeql.resolve('find humans')).toEqual([
                codd,
                naur,
                backus
            ])
        });

        it('orders results', () => {
            expect(aeql.resolve('find humans by name')).toEqual([
                backus,
                codd,
                naur
            ])
        })
 
        it.skip('finds results by attributes', () => {
            expect(aeql.resolve('find humans whose name is Naur')).toEqual([
                { id: 2, name: 'Naur' }
            ])
        })
    })
})