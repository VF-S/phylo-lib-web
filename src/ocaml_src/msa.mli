(** This module is currently only partially implemented. It is meant to
    construct a multiple sequence alignment, given DNA sequences. *)

(** The representation type for multiple sequence alignments consisting of
    nucleotides and gaps. *)
type t

(** [align dnas] is a multiple sequence alignment of the DNA sequences in 
    [dnas]. *)
val align : Dna.t array -> t

(** [num_seq msa] is the number of sequences in [msa]. *)
val num_seq : t -> int

(** [seq_len msa] is the length of each sequence in [msa], where the length
    is the total number of gaps and nucleotide bases. *)
val seq_len : t -> int 

(**[get_seq i msa] is the [i]th sequence in [msa], where [i] is 0-indexed.
    Requires: 0 <= [i] < [size t] *)
val get_seq : int -> t -> Dna.t

(** [get_base i j msa] is the character representation of the nucleotide base or
    gap at the [j]th index in the [i]th sequence, where [i] and [j] are 
    0-indexed. The result is either 'A', 'T', 'C', 'G', or 'N'.
    Requires: 0 <= [i] < [size t] and 0 <= [j] < [seq_len msa] *)
val get_base : int -> int -> t -> char