type token =
  | Phylogeny | Name | Description
  | Clade | Rank | Confidence
  | Taxonomy | SciName | ID
  | LAngle | LAngleSlash | RAngle | Quote | Eq | Num of int | Dot
  | Word of string | True | False
  | EOF | Unit

let is_word (t : token) : bool = 
  match t with 
  | LAngle
  | LAngleSlash 
  | RAngle
  | Quote
  | Eq 
  | EOF 
  | Unit -> false
  | _ -> true

let to_string (t : token) : string = 
  match t with 
  | Phylogeny -> "phylogeny" 
  | Name -> "name" 
  | Description -> "description"
  | Clade -> "clade"
  | Rank -> "rank"
  | Confidence -> "confidence"
  | Taxonomy -> "taxonomy"
  | SciName -> "scientific_name"
  | ID -> "id"
  | LAngle -> "<"
  | LAngleSlash -> "</"
  | RAngle -> ">"
  | Quote -> "quote"
  | Eq -> "="
  | Num n -> string_of_int n
  | Dot -> "."
  | Word s -> s
  | True -> "true"
  | False -> "false"
  | EOF -> "EOF"
  | Unit -> "Unit"

(** Map binding strings to their corresponding token. *)
let word_token_map = Hashtbl.create 16 
let () = Hashtbl.add word_token_map "phylogeny" Phylogeny;
  Hashtbl.add word_token_map "name" Name;
  Hashtbl.add word_token_map "description" Description;
  Hashtbl.add word_token_map "clade" Clade;
  Hashtbl.add word_token_map "rank" Rank;
  Hashtbl.add word_token_map "confidence" Confidence;
  Hashtbl.add word_token_map "taxonomy" Taxonomy;
  Hashtbl.add word_token_map "scientific_name" SciName;
  Hashtbl.add word_token_map "id" ID;
  Hashtbl.add word_token_map "true" True;
  Hashtbl.add word_token_map "false" False

(** [is_token s] is true if [s] represents a valid token. *)
let is_token (s : string) : bool =
  Hashtbl.mem word_token_map s

(** [string_to_token s] converts [s] into a token. 
    Raises: [Not_found] if [is_token s] is false. *)
let string_to_token (s : string) : token =
  Hashtbl.find word_token_map s

let stream_of_file (f : string) : string Stream.t =
  let stream = 
    Stream.from (fun _ ->
        try Some f with End_of_file -> None)
  in 
  match Stream.peek stream with
  | Some s -> 
    begin 
      match String.sub s 0 5 with 
      | exception (Invalid_argument _) -> stream
      | "<?xml" -> (Stream.junk stream; stream)
      | _ -> stream
    end 
  | None -> stream

(** [stream_of_line stream] is a character stream of the next line of 
    string stream [stream]. 
    Effects: Removes the first element in [stream]. 
    Raises: [End_of_file] if the end of the file is reached. *)
let stream_of_line (stream : string Stream.t) : char Stream.t = 
  match (Stream.next stream) with
  | str -> Stream.of_string str
  | exception Stream.Failure -> raise End_of_file

(** [is_special_char c] is true if [c] is a special character. Special 
    characters are: '<', '>', '"', and '='. *)
let is_special_char (c : char) : bool =
  match c with 
  | '<' 
  | '>' 
  | '"'
  | '='-> true
  | _ -> false

(** [lex_keyword stream acc] lexes a word in [stream], taking into account
    the characters in that word that have already been read, which are in 
    [acc]. *)
let rec lex_keyword (stream : char Stream.t) (acc : string) : token =
  match Stream.peek stream with 
  | Some c -> lex_char stream acc c
  | None -> lex_keyword_helper acc

and lex_char (stream : char Stream.t) (acc : string) (c : char) : token =
  match c with
  | exception Stream.Failure -> lex_keyword_helper acc
  | ' ' -> lex_keyword_helper acc
  | _ -> 
    if is_token acc then string_to_token acc
    else if is_special_char c then Word acc
    else (Stream.junk stream; lex_keyword stream (acc ^ (Char.escaped c)))

and lex_keyword_helper (acc : string) : token =
  if is_token acc
  then string_to_token acc 
  else Word acc

(** [is_number c] is true if c represents a numerical digit. 
    Implementation Note: cleaner than RegEx. *)
let is_number (c : char) : bool = 
  match c with 
  | '0'..'9' -> true
  | _ -> false

(** [lex_number stream acc] lexes a number in [stream], taking into account 
    the digits of the number that have already been read, which are in [acc]. *)
let rec lex_number (stream : char Stream.t) (acc : string) : token =
  match Stream.peek stream with 
  | Some c when (is_number c) -> 
    Stream.junk stream; 
    lex_number (stream) (acc ^ (Char.escaped c))
  | Some _ 
  | None -> Num (int_of_string acc)

(** [tokenize_line stream] is a list of the tokens in [stream].
    Effects: Removes the first element of [stream]. *)
let rec tokenize_line (stream : char Stream.t) (acc : token list): token list = 
  match Stream.next stream with 
  | '<' -> 
    begin
      match Stream.peek stream with
      | Some n when n = '/' -> 
        Stream.junk stream; 
        tokenize_line stream (LAngleSlash::acc) 
      | Some n -> tokenize_line stream (LAngle::acc)
      | None -> List.rev (LAngle::acc)
    end
  | '>' -> tokenize_line stream (RAngle::acc)
  | '"' -> tokenize_line stream (Quote::acc)
  | '=' -> tokenize_line stream (Eq::acc)
  | '.' -> tokenize_line stream (Dot::acc)
  | ' ' | '\t' | '\n' | '\r'-> tokenize_line stream acc
  | c when is_number c -> 
    tokenize_line stream ((lex_number stream (Char.escaped c))::acc)
  | c -> tokenize_line stream ((lex_keyword stream (Char.escaped c))::acc)
  | exception Stream.Failure -> List.rev acc
  | exception End_of_file -> [EOF]

let tokenize_next_line (stream : string Stream.t) : token list =
  match stream_of_line stream with
  | exception End_of_file -> [EOF]
  | x -> tokenize_line x []

(** [peek_fun stream tokens_in_line token_function] is a function that
    takes in a unit and outputs the next token in [stream] without modifying 
    [stream]. 
    Requires: Caller is [token_function_builder]. *)
let peek_fun stream tokens_in_line token_function =
  fun () ->
  match !tokens_in_line with
  | [] -> tokens_in_line := (tokenize_next_line stream); !token_function true ()
  | h::_ -> h

(** [consume_fun stream tokens_in_line] is a function that takes in a unit
    and outputs the next token in [stream].
    Requires: Caller is [token_function_builder]. *)
let consume_fun stream tokens_in_line =
  fun () ->
  match !tokens_in_line with
  | [] -> tokens_in_line := (tokenize_next_line stream); Unit
  | _::t -> tokens_in_line := t; Unit

let token_function_builder stream : (bool -> (unit -> token)) =
  let tokens_in_line = ref (tokenize_next_line stream) in 
  let token_function = ref (fun b -> (fun () -> EOF)) in
  token_function := (fun b ->
      if b then peek_fun stream tokens_in_line token_function
      else consume_fun stream tokens_in_line); 
  !token_function