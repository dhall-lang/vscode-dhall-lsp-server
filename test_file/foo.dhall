
let Config : Type =
      { home : Text
      , privateKey : Text
      , publicKey : Text
      , smth: Text
      }

let TypeUnion =  < Foo : Integer | Bar : Bool >

let RecordUnion =  < Foo : Integer | Bar = True > -- !FIXME: bug here! -> True, 3, etc ...

let makeUser : Text -> Config = \(user : Text) ->
      let home       : Text   = "/home/${user}"
      let privateKey : Text   = "${home}/id_ed25519"
      let publicKey  : Text   = "${privateKey}.pub"
      let config     : Config =
            { home       = home
            , privateKey = privateKey
            , publicKey  = publicKey
            , smth = 35   
            }
      in  config

let `configs` : List Config = 
      [ (makeUser "bifll")
      , makeUser "foo"       
      ]

let foo = makeUser  "foo"
let z = ./bar.dhall 
let u = foo.home 
let l = [1,2, {- this comments are important -} 3]
let z = ["1", "2", "3"]
let s = Double/show "34"
let i = "foo${ 2 + ["1", "2", "3"] + 3 }baz"
let esc = "foo\\bar\u005C\$\bdsf"
let doo = ((1 + 2) + 3
let single = ''
                 foo
                 ${ff}
                 '''
                 ''${foo
                 foo

             ''

let generate = //prelude.dhall-lang.org/List/generate

let Person
    : Type
    =   forall (Person : Type)
      → ∀(MakePerson : { children : List Person, name : Text } → Person)
      → Person

let example
    : Person
    =   λ(Person : Type)
      → λ(MakePerson : { children : List Person, name : Text } → Person)
      → MakePerson
        { children =
            [ MakePerson { children = [] : List Person, name = "Mary" }
            , MakePerson { children = [] : List Person, name = "Jane" }
            ]
        , name =
            "John"
        }
let concat = https://prelude.dhall-lang.org/List/concat
let foo    = //foo/bar/baz
let everybody
    : Person → List Text
    = 
      
      let zoo    = ./Foo.dhall
      let boo    = ./foo/../bar.dhall
      
      in    λ(x : Person)
          → x
            (List Text)
            (   λ(p : { children : List (List Text), name : Text })
              → [ p.name ] -- concat Text p.children wtf? where are my comments?
            )

let result : List Text = everybody example
in  configs
 


