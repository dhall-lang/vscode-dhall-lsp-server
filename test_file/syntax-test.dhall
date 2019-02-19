-- SYNTAX TEST "Packages/SublimeDhall/Dhall.sublime-syntax"

{- COMMENTS -}

    -- foo
-- ^        - comment.line.double-dash.dhall
--  ^^      punctuation.definition.comment.begin.dhall
--  ^^^^^^  comment.line.double-dash.dhall

    {- bar -}
-- ^           - comment.line.double-dash.dhall
--  ^^         punctuation.definition.comment.begin.dhall
--         ^^  punctuation.definition.comment.end.dhall
--  ^^^^^^^^^  comment.block.brace-dash.dhall

    {- lorem {- ipsum -} dolor -}
-- ^                               - comment.line.double-dash.dhall
--  ^^                             punctuation.definition.comment.begin.dhall
--           ^^                    punctuation.definition.comment.begin.dhall
--                    ^^           punctuation.definition.comment.end.dhall
--           ^^^^^^^^^^^           comment.block.brace-dash.dhall comment.block.brace-dash.dhall
--                             ^^  punctuation.definition.comment.end.dhall
--  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  comment.block.brace-dash.dhall

    -- consectetur {- adipisicing
-- ^                               - comment.line.double-dash.dhall
--  ^^                             punctuation.definition.comment.begin.dhall
--                 ^^              - punctuation.definition.comment.begin.dhall
--                 ^^^^^^^^^^^^^^  - comment.block.brace-dash.dhall
--  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  comment.line.double-dash.dhall

    {- sit -- amet -}
-- ^                   - comment.block.brace-dash.dhall
--  ^^                 punctuation.definition.comment.begin.dhall
--         ^^          - punctuation.definition.comment.begin.dhall
--         ^^^^^^^^^^  - comment.line.double-dash.dhall
--                 ^^  punctuation.definition.comment.end.dhall
--  ^^^^^^^^^^^^^^^^^  comment.block.brace-dash.dhall


{- DEFINITIONS -}

    let replicateUnicode : Natural → ∀(a : Type) → a → List a
--  ^^^                                                      keyword.other.let.dhall
--      ^^^^^^^^^^^^^^^^                                     entity.name.function.dhall support.function.dhall
--                       ^                                   keyword.other.colon.dhall
--                         ^^^^^^^                           storage.type.dhall
--                                 ^                         keyword.operator.arrow.dhall
--                                   ^                       storage.modifier.universal-quantifier.dhall
--                                    ^                      punctuation.section.parens.begin.dhall
--                                     ^                     variable.parameter.lambda.dhall
--                                       ^                   keyword.other.colon.dhall
--                                         ^^^^              storage.type.dhall
--                                             ^             punctuation.section.parens.end.dhall
--                                    ^^^^^^^^^^             meta.parens.dhall
--                                               ^           keyword.operator.arrow.dhall
--                                                   ^       keyword.operator.arrow.dhall
--                                                     ^^^^  storage.type.dhall
        =   λ(n : Natural) → λ(a : Type) → λ(x : a)
--      ^                                            keyword.operator.assignment.dhall
--          ^                                        support.function.lambda.dhall
--           ^                                       punctuation.section.parens.begin.dhall
--            ^                                      variable.parameter.lambda.dhall
--              ^                                    keyword.other.colon.dhall
--                ^^^^^^^                            storage.type.dhall
--                       ^                           punctuation.section.parens.end.dhall
--           ^^^^^^^^^^^^^                           meta.parens.dhall
--                         ^                         keyword.operator.arrow.dhall
--                           ^                       support.function.lambda.dhall
--                            ^                      punctuation.section.parens.begin.dhall
--                             ^                     variable.parameter.lambda.dhall
--                               ^                   keyword.other.colon.dhall
--                                 ^^^^              storage.type.dhall
--                                     ^             punctuation.section.parens.end.dhall
--                            ^^^^^^^^^^             meta.parens.dhall
--                                       ^           keyword.operator.arrow.dhall
--                                         ^         support.function.lambda.dhall
--                                          ^        punctuation.section.parens.begin.dhall
--                                           ^       variable.parameter.lambda.dhall
--                                             ^     keyword.other.colon.dhall
--                                               ^   meta.label.dhall
--                                                ^  punctuation.section.parens.end.dhall
--                                          ^^^^^^^  meta.parens.dhall
        →   List/build a
--      ^               keyword.operator.arrow.dhall
--          ^^^^^^^^^^  support.function.dhall
            (   λ(list : Type)
--          ^                   punctuation.section.parens.begin.dhall
--              ^               support.function.lambda.dhall
--               ^              punctuation.section.parens.begin.dhall
--                ^^^^          variable.parameter.lambda.dhall
--                     ^        keyword.other.colon.dhall
--                       ^^^^   storage.type.dhall
--                           ^  punctuation.section.parens.end.dhall
--               ^^^^^^^^^^^^^  meta.parens.dhall meta.parens.dhall
--          ^^^^^^^^^^^^^^^^^^  meta.parens.dhall
            →   λ(cons : a → list → list)
--          ^                              keyword.operator.arrow.dhall
--              ^                          support.function.lambda.dhall
--               ^                         punctuation.section.parens.begin.dhall
--                ^^^^                     variable.parameter.lambda.dhall
--                     ^                   keyword.other.colon.dhall
--                         ^               keyword.operator.arrow.dhall
--                                ^        keyword.operator.arrow.dhall
--                                      ^  punctuation.section.parens.end.dhall
--               ^^^^^^^^^^^^^^^^^^^^^^^^  meta.parens.dhall meta.parens.dhall
--          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  meta.parens.dhall
            →   Natural/fold n list (cons x)
--          ^                                 keyword.operator.arrow.dhall
--              ^^^^^^^^^^^^                  support.function.dhall
--                                  ^         punctuation.section.parens.begin.dhall
--                                         ^  punctuation.section.parens.end.dhall
--                                  ^^^^^^^^  meta.parens.dhall meta.parens.dhall
--          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  meta.parens.dhall
            )
--          ^  punctuation.section.parens.end.dhall
-- ^^^^^^^^^^  meta.parens.dhall


in  let replicateAscii : Natural -> forall(a : Type) -> a -> List a
--  ^^^                                                       keyword.other.let.dhall
--      ^^^^^^^^^^^^^^                                             entity.name.function.dhall support.function.dhall
--                     ^                                           keyword.other.colon.dhall
--                       ^^^^^^^                                   storage.type.dhall
--                               ^^                                keyword.operator.arrow.dhall
--                                  ^^^^^^                         storage.modifier.universal-quantifier.dhall
--                                        ^                        punctuation.section.parens.begin.dhall
--                                         ^                       variable.parameter.lambda.dhall
--                                           ^                     keyword.other.colon.dhall
--                                             ^^^^                storage.type.dhall
--                                                 ^               punctuation.section.parens.end.dhall
--                                        ^^^^^^^^^^               meta.parens.dhall
--                                                   ^^            keyword.operator.arrow.dhall
--                                                        ^^       keyword.operator.arrow.dhall
--                                                           ^^^^  storage.type.dhall
        =   \(n : Natural) -> \(a : Type) -> \(x : a)
--      ^                                            keyword.operator.assignment.dhall
--          ^                                        support.function.lambda.dhall
--           ^                                       punctuation.section.parens.begin.dhall
--            ^                                      variable.parameter.lambda.dhall
--              ^                                    keyword.other.colon.dhall
--                ^^^^^^^                            storage.type.dhall
--                       ^                           punctuation.section.parens.end.dhall
--           ^^^^^^^^^^^^^                           meta.parens.dhall
--                         ^^                         keyword.operator.arrow.dhall
--                            ^                       support.function.lambda.dhall
--                             ^                      punctuation.section.parens.begin.dhall
--                              ^                     variable.parameter.lambda.dhall
--                                ^                   keyword.other.colon.dhall
--                                  ^^^^              storage.type.dhall
--                                      ^             punctuation.section.parens.end.dhall
--                             ^^^^^^^^^^             meta.parens.dhall
--                                        ^^           keyword.operator.arrow.dhall
--                                           ^         support.function.lambda.dhall
--                                            ^        punctuation.section.parens.begin.dhall
--                                             ^       variable.parameter.lambda.dhall
--                                               ^     keyword.other.colon.dhall
--                                                 ^   meta.label.dhall
--                                                  ^  punctuation.section.parens.end.dhall
--                                            ^^^^^^^  meta.parens.dhall
        ->  List/build a
--      ^^               keyword.operator.arrow.dhall
--          ^^^^^^^^^^  support.function.dhall
            (   \(list : Type)
--          ^                   punctuation.section.parens.begin.dhall
--              ^               support.function.lambda.dhall
--               ^              punctuation.section.parens.begin.dhall
--                ^^^^          variable.parameter.lambda.dhall
--                     ^        keyword.other.colon.dhall
--                       ^^^^   storage.type.dhall
--                           ^  punctuation.section.parens.end.dhall
--               ^^^^^^^^^^^^^  meta.parens.dhall meta.parens.dhall
--          ^^^^^^^^^^^^^^^^^^  meta.parens.dhall
            ->  \(cons : a -> list -> list)
--          ^^                                keyword.operator.arrow.dhall
--              ^                            support.function.lambda.dhall
--               ^                           punctuation.section.parens.begin.dhall
--                ^^^^                       variable.parameter.lambda.dhall
--                     ^                     keyword.other.colon.dhall
--                         ^^                keyword.operator.arrow.dhall
--                                 ^^        keyword.operator.arrow.dhall
--                                        ^  punctuation.section.parens.end.dhall
--               ^^^^^^^^^^^^^^^^^^^^^^^^^^  meta.parens.dhall meta.parens.dhall
--          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  meta.parens.dhall
            ->  Natural/fold n list (cons x)
--          ^^                                keyword.operator.arrow.dhall
--              ^^^^^^^^^^^^                  support.function.dhall
--                                  ^         punctuation.section.parens.begin.dhall
--                                         ^  punctuation.section.parens.end.dhall
--                                  ^^^^^^^^  meta.parens.dhall meta.parens.dhall
--          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  meta.parens.dhall
            )
--          ^  punctuation.section.parens.end.dhall
-- ^^^^^^^^^^  meta.parens.dhall

in  let compose
--  ^^^          keyword.other.let.dhall
--      ^^^^^^^  entity.name.function.dhall support.function.dhall
        : forall(a : Type) -> forall(b : Type) -> forall(c : Type)
--      ^                                                           keyword.other.colon.dhall
--        ^^^^^^                                                    storage.modifier.universal-quantifier.dhall
--              ^                                                   punctuation.section.parens.begin.dhall
--               ^                                                  variable.parameter.lambda.dhall
--                 ^                                                keyword.other.colon.dhall
--                   ^^^^                                           storage.type.dhall
--                       ^                                          punctuation.section.parens.end.dhall
--              ^^^^^^^^^^                                          meta.parens.dhall
--                         ^^                                       keyword.operator.arrow.dhall
--                            ^^^^^^                                storage.modifier.universal-quantifier.dhall
--                                  ^                               punctuation.section.parens.begin.dhall
--                                   ^                              variable.parameter.lambda.dhall
--                                     ^                            keyword.other.colon.dhall
--                                       ^^^^                       storage.type.dhall
--                                           ^                      punctuation.section.parens.end.dhall
--                                  ^^^^^^^^^^                      meta.parens.dhall
--                                             ^^                   keyword.operator.arrow.dhall
--                                                ^^^^^^            storage.modifier.universal-quantifier.dhall
--                                                      ^           punctuation.section.parens.begin.dhall
--                                                       ^          variable.parameter.lambda.dhall
--                                                         ^        keyword.other.colon.dhall
--                                                           ^^^^   storage.type.dhall
--                                                               ^  punctuation.section.parens.end.dhall
--                                                      ^^^^^^^^^^  meta.parens.dhall
        -> (a -> b) -> (b -> c) -> (a -> c)
--      ^^                                   keyword.operator.arrow.dhall
--         ^                                 punctuation.section.parens.begin.dhall
--            ^^                             keyword.operator.arrow.dhall
--                ^                          punctuation.section.parens.end.dhall
--         ^^^^^^^^                          meta.parens.dhall
--                  ^^                       keyword.operator.arrow.dhall
--                     ^                     punctuation.section.parens.begin.dhall
--                        ^^                 keyword.operator.arrow.dhall
--                            ^              punctuation.section.parens.end.dhall
--                     ^^^^^^^^              meta.parens.dhall
--                              ^^           keyword.operator.arrow.dhall
--                                 ^         punctuation.section.parens.begin.dhall
--                                    ^^     keyword.operator.arrow.dhall
--                                        ^  punctuation.section.parens.end.dhall
--                                 ^^^^^^^^  meta.parens.dhall

        =  λ(A : Type)   -> λ(B : Type)   -> λ(C : Type)
--      ^                                                 keyword.operator.assignment.dhall
--         ^                                              support.function.lambda.dhall
--          ^                                             punctuation.section.parens.begin.dhall
--           ^                                            variable.parameter.lambda.dhall
--             ^                                          keyword.other.colon.dhall
--               ^^^^                                     storage.type.dhall
--                   ^                                    punctuation.section.parens.end.dhall
--          ^^^^^^^^^^                                    meta.parens.dhall
--                       ^^                               keyword.operator.arrow.dhall
--                          ^                             support.function.lambda.dhall
--                           ^                            punctuation.section.parens.begin.dhall
--                            ^                           variable.parameter.lambda.dhall
--                              ^                         keyword.other.colon.dhall
--                                ^^^^                    storage.type.dhall
--                                    ^                   punctuation.section.parens.end.dhall
--                           ^^^^^^^^^^                   meta.parens.dhall
--                                        ^^              keyword.operator.arrow.dhall
--                                           ^            support.function.lambda.dhall
--                                            ^           punctuation.section.parens.begin.dhall
--                                             ^          variable.parameter.lambda.dhall
--                                               ^        keyword.other.colon.dhall
--                                                 ^^^^   storage.type.dhall
--                                                     ^  punctuation.section.parens.end.dhall
--                                            ^^^^^^^^^^  meta.parens.dhall
        -> λ(f : A -> B) -> λ(g : B -> C) -> λ(x : A)
--      ^^                                             keyword.operator.arrow.dhall
--         ^                                           support.function.lambda.dhall
--          ^                                          punctuation.section.parens.begin.dhall
--           ^                                         variable.parameter.lambda.dhall
--             ^                                       keyword.other.colon.dhall
--                 ^^                                  keyword.operator.arrow.dhall
--                     ^                               punctuation.section.parens.end.dhall
--          ^^^^^^^^^^^^                               meta.parens.dhall
--                       ^^                            keyword.operator.arrow.dhall
--                          ^                          support.function.lambda.dhall
--                           ^                         punctuation.section.parens.begin.dhall
--                            ^                        variable.parameter.lambda.dhall
--                              ^                      keyword.other.colon.dhall
--                                  ^^                 keyword.operator.arrow.dhall
--                                      ^              punctuation.section.parens.end.dhall
--                           ^^^^^^^^^^^^              meta.parens.dhall
--                                        ^^           keyword.operator.arrow.dhall
--                                           ^         support.function.lambda.dhall
--                                            ^        punctuation.section.parens.begin.dhall
--                                             ^       variable.parameter.lambda.dhall
--                                               ^     keyword.other.colon.dhall
--                                                  ^  punctuation.section.parens.end.dhall
--                                            ^^^^^^^  meta.parens.dhall
        -> g (f x)
--      ^^          keyword.operator.arrow.dhall
--           ^      punctuation.section.parens.begin.dhall
--               ^  punctuation.section.parens.end.dhall
--           ^^^^^  meta.parens.dhall

in  let Nesting : Type = < Inline : {} | Nested : Text >
--  ^^^                                                   keyword.other.let.dhall
--      ^^^^^^^                                           entity.name.function.dhall support.function.dhall
--              ^                                         keyword.other.colon.dhall
--                ^^^^                                    storage.type.dhall
--                     ^                                  keyword.operator.assignment.dhall
--                       ^                                punctuation.section.angles.begin.union.dhall
--                         ^^^^^^                         string.unquoted.label.dhall entity.name.tag.dhall
--                                ^                       keyword.other.colon.dhall
--                                  ^                     punctuation.section.braces.begin.record.dhall
--                                   ^                    punctuation.section.braces.end.record.dhall
--                                  ^^                    meta.braces.record.dhall
--                                     ^                  punctuation.separator.sequence.union.dhall
--                                       ^^^^^^           string.unquoted.label.dhall entity.name.tag.dhall
--                                              ^         keyword.other.colon.dhall
--                                                ^^^^    storage.type.dhall
--                                                     ^  punctuation.section.angles.end.union.dhall
--                       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  meta.angles.union.dhall

in  let Tagged : Type → Type
--  ^^^                       keyword.other.let.dhall
--      ^^^^^^                entity.name.function.dhall support.function.dhall
--             ^              keyword.other.colon.dhall
--               ^^^^         storage.type.dhall
--                    ^       keyword.operator.arrow.dhall
--                      ^^^^  storage.type.dhall
        = λ(a : Type) → {field : Text, nesting : ./Nesting, contents : a}
--      ^                                                                  keyword.operator.assignment.dhall
--        ^                                                                support.function.lambda.dhall
--         ^                                                               punctuation.section.parens.begin.dhall
--          ^                                                              variable.parameter.lambda.dhall
--            ^                                                            keyword.other.colon.dhall
--              ^^^^                                                       storage.type.dhall
--                  ^                                                      punctuation.section.parens.end.dhall
--         ^^^^^^^^^^                                                      meta.parens.dhall
--                    ^                                                    keyword.operator.arrow.dhall
--                      ^                                                  punctuation.section.braces.begin.record.dhall
--                       ^^^^^                                             string.unquoted.label.dhall entity.name.tag.dhall
--                             ^                                           keyword.other.colon.dhall
--                               ^^^^                                      storage.type.dhall
--                                   ^                                     punctuation.separator.sequence.record.dhall
--                                     ^^^^^^^                             string.unquoted.label.dhall entity.name.tag.dhall
--                                             ^                           keyword.other.colon.dhall
--                                               ^^^^^^^^^                 string.unquoted.file.dhall meta.path.file.dhall
--                                                        ^                punctuation.separator.sequence.record.dhall
--                                                          ^^^^^^^^       string.unquoted.label.dhall entity.name.tag.dhall
--                                                                   ^     keyword.other.colon.dhall
--                                                                      ^  punctuation.section.braces.end.record.dhall
--                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  meta.braces.record.dhall

in  {=} : {}
--  ^         punctuation.section.braces.begin.record.dhall
--   ^        keyword.operator.assignment.dhall
--    ^       punctuation.section.braces.end.record.dhall
--  ^^^       meta.braces.record.dhall
--      ^     keyword.other.colon.dhall
--        ^   punctuation.section.braces.begin.record.dhall
--         ^  punctuation.section.braces.end.record.dhall
--        ^^  meta.braces.record.dhall
