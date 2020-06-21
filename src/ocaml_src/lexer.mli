(** The Lexer module lexes phyloXML files. *)

(** The type of lexer tokens. *)
type token =
  | Phylogeny | Name | Description
  | Clade | Rank | Confidence
  | Taxonomy | SciName | ID
  | LAngle | LAngleSlash | RAngle | Quote | Eq | Num of int | Dot
  | Word of string | True | False
  | EOF | Unit

(** [is_word t] is true if [t] represents either a word or number. *)
val is_word : token -> bool

(** [to_string t] is a string representing [t]. *)
val to_string : token -> string

(** [stream_of_file f] is a stream of lines from the file with filename 
    [f]. Requires [f] to be a valid file. *)
val stream_of_file : string -> string Stream.t

(** [tokenize_next_line stream] is a list of tokens represented by the 
    first element of [stream].
    Effects: Removes the first element in [stream]. 
    Note that it is [[EOF]] if the end of the file is reached. *)
val tokenize_next_line: string Stream.t ->  token list 

(** [token_function_builder stream] is a function that takes in a boolean 
    value that indicates whether the function to be built will be used to 
    peek or consume the next token in [stream].

    Sample usage:
    [let line_stream = stream_of_file "file.txt" in
    let token_fun = token_function_builder line_stream in
    let peek = token_fun true in
    let consume = token_fun false in
    true] will bind [peek] and [consume] to functions that take in a unit and
    peek and consume from the "file.txt" stream, respectively. *)
val token_function_builder : string Stream.t -> (bool -> (unit -> token))