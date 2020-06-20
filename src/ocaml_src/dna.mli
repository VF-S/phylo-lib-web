(** This module reads in DNA sequences from various file types and represents 
    them. *)

(** The abstract data type representing a DNA sequence. *)
type t

(** The exception type for empty files *)
exception Empty

(** [from_fasta string ?init_size] parses a .FASTA file and creates a 
    DNA sequence. 
    Precondition: string input into from_fasta is the absolute file location 
    of a valid .fasta file 
    Supports DNA only. Other characters ignored. DNA sequences are upper 
    or lower case variants of 'A', 'T', 'C', 'G', '_'. 
    Raises [Empty] if file is empty.
    Set [init_size] to set size of data structure holding the dna sequence. *)
val from_fasta : ?init_size:int -> string -> t

(** [from_string] parses a .FASTA file and creates a DNA sequence. *)
val from_string : string -> t

(** [is_empty t ] is true iff. [t] is empty *)
val is_empty : t -> bool 

(** [length t] is the number of base pairs stored in [t]. *)
val length : t -> int

(** [get t int] is the DNA letter at [pos]. 0 indexed. Returns None
    if [int] is not a valid position for [t]. *)
val get : t -> int -> char option 

(** [get_e dna pos] is the DNA letter at position [pos]. 0 indexed.
    Requires [pos] is a valid position. *)
val get_e: t -> int -> char 

(** [string_of_range t start finish] is a string with base pairs represented as 
    chars in the interval from [t.start] to [t.finish] exclusive.
    Requires: [start], [finish] are valid positions in [t], [finish] > [start]. 
*)
val string_of_range : t -> int -> int -> string

(** [to_string dna_seq] is a string representation of [dna_seq]. *)
val to_string: t -> string 

