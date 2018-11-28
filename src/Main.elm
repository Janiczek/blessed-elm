port module Main exposing (main)

import Platform


port sendNewModel : Model -> Cmd msg


port sendError : String -> Cmd msg


port listenForCommands : (String -> msg) -> Sub msg


type alias Flags =
    ()


type alias Model =
    { counter : Int
    }


type Msg
    = ReceivedCommand String


type Command
    = Inc
    | Dec


main : Program Flags Model Msg
main =
    Platform.worker
        { init = init
        , update = update
        , subscriptions = subscriptions
        }


init : Flags -> ( Model, Cmd Msg )
init flags =
    let
        model : Model
        model =
            { counter = 0 }
    in
    ( model
    , sendNewModel model
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    sendModelIfChanged model <|
        case msg of
            ReceivedCommand commandString ->
                case parseCommand commandString of
                    Ok command ->
                        updateCommand command model

                    Err error ->
                        ( model, sendError error )


sendModelIfChanged : Model -> ( Model, Cmd Msg ) -> ( Model, Cmd Msg )
sendModelIfChanged oldModel ( newModel, cmd ) =
    if oldModel == newModel then
        ( newModel, cmd )

    else
        ( newModel
        , Cmd.batch
            [ cmd
            , sendNewModel newModel
            ]
        )


updateCommand : Command -> Model -> ( Model, Cmd Msg )
updateCommand command model =
    case command of
        Inc ->
            ( { model | counter = model.counter + 1 }
            , Cmd.none
            )

        Dec ->
            ( { model | counter = model.counter - 1 }
            , Cmd.none
            )


parseCommand : String -> Result String Command
parseCommand command =
    case command of
        "Inc" ->
            Ok Inc

        "Dec" ->
            Ok Dec

        _ ->
            Err ("Unknown command: " ++ command)


subscriptions : Model -> Sub Msg
subscriptions model =
    listenForCommands ReceivedCommand
