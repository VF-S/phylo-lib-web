exception Empty

type t = Buffer.t 

(* Helper Functions *)

(** [is_name_line str] checks if [str] is the first line of a .FASTA file *)
let is_name_line (str : string) : bool = 
  String.sub str 0 1 = ">"

(** [is_dna c] is true if [c] is a dna nucleotide or a gap, and false 
    otherwise. *)
let is_dna (c : char) : bool = 
  match c with 
  | 'A'
  | 'C'
  | 'T' 
  | 'G' 
  | '_' | '-' -> true 
  | _ -> false 

(** [is_protein c] is true if [c] is a protein, false otherwise.  *))
let is_protein (c: char) : bool = 
  match c with 
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F'| 'G'| 'H'| 'I'| 'K' | 'L'
  | 'M'| 'N'| 'P'| 'Q'| 'R'| 'S'| 'T'| 'U'| 'V'| 'W'| 'Y'| 'Z' 
  | 'X' -> true 
  | _ -> false 

(* Main Functions *)

(** [parse_char c dna_seq] adds [c] to [dna_seq] if [c] is a DNA sequence. *)
let parse_char (c: char) (dna_seq : Buffer.t) : unit = 
  if is_dna c || is_protein then Buffer.add_char dna_seq c else ()

(** [parse_line str dna_seq] parses the string of DNA sequences and updates 
    dna_seq. *)
let parse_line (str : string) (dna_seq: Buffer.t) : unit = 
  let str = String.uppercase_ascii str in 
  String.iter (fun c -> parse_char c dna_seq) str

(** [parse_first_line dna_stream] removes the descriptive first line, 
    if one exists. *)
let rec parse_first_line (dna_stream : string Stream.t) : unit = 
  match Stream.peek dna_stream with 
  | Some v -> if is_name_line v then Stream.junk dna_stream else ()
  | None -> raise Empty


let to_string (dna_seq : t) : string = 
  Buffer.contents dna_seq 


let from_fasta ?init_size:(init_size = 16384) (loc: string) : t = 
  let f = open_in loc in 
  let read_line = fun i -> try Some (input_line f) with End_of_file -> None in
  let dna_stream = Stream.from read_line in 
  parse_first_line dna_stream; 
  let dna_seq = Buffer.create init_size in 
  Stream.iter (fun str -> parse_line str dna_seq) dna_stream;
  dna_seq 

let trim_name_line str : string =
  let idx = try String.index str '\n' with Not_found -> 0 in 
  let first_line = String.sub str 0 idx in 
  if first_line = "" || is_name_line first_line 
  then String.sub str (idx+1) (String.length str - idx - 1) 
  else str

let from_string str : t = 
  let dna_seq = Buffer.create 128 in 
  parse_line (trim_name_line str) dna_seq;
  dna_seq


let length (dna_seq : t) : int = 
  Buffer.length dna_seq 

let rec multiple_helper str acc : t list =
  if not (is_name_line str) then acc else begin
    let trimmed = trim_name_line str in
    let idx = try String.index trimmed '>' with Not_found -> String.length trimmed - 1 in
    let next = String.sub trimmed 0 idx in
    let left = 
      try String.sub trimmed idx (String.length trimmed - idx) 
      with _ -> "" in
    let dna_seq = Buffer.create 128 in 
    parse_line next dna_seq;
    multiple_helper left (dna_seq::acc)
  end

let multiple_from_string str : t array =
  let lst = multiple_helper str [] in
  Array.of_list
    (List.fold_left (fun a x -> x::a) [] lst)


let is_empty (dna_seq : t) : bool = 
  Buffer.length dna_seq = 0 

let get (dna_seq: t) (pos : int) : char option = 
  try Some (Buffer.nth dna_seq pos) 
  with _ -> None 

let get_e (dna_seq : t) (pos : int) : char = 
  Buffer.nth dna_seq pos

let string_of_range (dna_seq : t) (start_pos : int) (end_pos : int) : string = 
  let range = end_pos - start_pos in 
  Buffer.sub dna_seq start_pos range 
