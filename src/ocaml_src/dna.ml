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
  | '_' -> true 
  | _ -> false 

(* Main Functions *)

(** [parse_char c dna_seq] adds [c] to [dna_seq] if [c] is a DNA sequence. *)
let parse_char (c: char) (dna_seq : Buffer.t) : unit = 
  if is_dna c then Buffer.add_char dna_seq c else ()

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

let from_fasta ?init_size:(init_size = 16384) (loc: string) : t = 
  let f = open_in loc in 
  let read_line = fun i -> try Some (input_line f) with End_of_file -> None in
  let dna_stream = Stream.from read_line in 
  parse_first_line dna_stream; 
  let dna_seq = Buffer.create init_size in 
  Stream.iter (fun str -> parse_line str dna_seq) dna_stream;
  dna_seq 

let from_string str : t = 
  let dna_seq = Buffer.create 128 in 
  parse_line str dna_seq; 
  dna_seq

let is_empty (dna_seq : t) : bool = 
  Buffer.length dna_seq = 0 

let length (dna_seq : t) : int = 
  Buffer.length dna_seq 

let get (dna_seq: t) (pos : int) : char option = 
  try Some (Buffer.nth dna_seq pos) 
  with _ -> None 

let get_e (dna_seq : t) (pos : int) : char = 
  Buffer.nth dna_seq pos

let string_of_range (dna_seq : t) (start_pos : int) (end_pos : int) : string = 
  let range = end_pos - start_pos in 
  Buffer.sub dna_seq start_pos range 

let to_string (dna_seq : t) : string = 
  Buffer.contents dna_seq 
