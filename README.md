# AEQL

a tiny query language for humans

# Synopsis

- Define relational models and querying them
- Define your schema declaratively in yaml files
  - Human beings/roles in `personae.yml`
  - Domain models in `models.yml` 
  - Queries/views/logic in `algebrae.yml`
- Query language is focused on
  - Simplicity
    - Favor user-defined 'attributes' to narrow resources over complicated things: `find most_liked post` where `most_liked` is defined in algebrae?)
    - But you should also be able to do simple computations: `find companies where employees.count > average(Company.employee_count)` 
  - Composability
  - Naturality: `find people in toronto whose job is accountant`

# Ideas

 we think that a relational-algebraic grammar which exposes the raw power of that formalism
            would be great but is kind of untenable

            we think instead we can opt to favor composable of basic operations, and have things spelled <output>
            
            we think tooling that gives lots of feedback early on in the query development process is good

            We think that having a strong opinion about query grammar is important -- we feel like SQL suffers from ambiguity which leads to vendor fragmentation (this is also arguably a strength of the 'ecosystem' but that feels like a problem too)            </output>
              Okay, so a "fresh start" kind of query language!

              Based on human values, and declarative specification of structures

              So you'll give your schema to aeql in the form of a handful of yaml files,
              most notably the `personae.yml` in which you specify the roles of PEOPLE

              The idea is that queries are 'based' around people in general (or the agents,
              systems, etc in your relations: although the idea is that personae are truly
              people and not systems, that we're creating value for people. a simple 'user'
              of the system resources in question...)

              Maybe you don't have to start from people, but the idea is that there's affordances
              and 'naturalisms' we can offer around personae that would highlight the value of doing
              this (of doing user-centered domain modelling)

# More ideas

- maybe if left undefined, `people` matches across ALL personae, even if they 
  don't share a parent model