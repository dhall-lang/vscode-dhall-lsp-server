
let Config : Type =
      { home : Text
      , privateKey : Text
      , publicKey : Text
      , smth: Text
      }

let makeUser : Text -> Config = \(user : Text) ->
      let home       : Text   = "/home/${user}"
      let privateKey : Text   = "${home}/id_ed25519"
      let publicKey  : Text   = "${privateKey}.pub"
      let config     : Config =
            { home       = home
            , privateKey = privateKey
            , publicKey  = publicKey
            , smth = "3"      
            }
      in  config

let configs : List Config = 
      [ makeUser "bifll"
      , makeUser "foo"       
      ]

let foo = makeUser 3   "foo"
let z = ./bar.dhall
in  configs
 


