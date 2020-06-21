(** Computes the distance matrix of multiple DNA sequences, giving the genetic 
    distance score between any 2 sequences. Also supports functions like 
    returning the sequence indices with the minimum score, and 'merging' 2 
    columns by averaging the distance scores corresponding to those sequences. 
*)

(** The representation type for distance matrices. 
    Note: This type is mutable.*)
type t


(** A pair of indices of DNA sequences. 
    RI: The index of the first sequence is strictly less than the index of the 
    second sequence.*)
type index = int * int

(** [dist_dna dnas align misalign indel] is the distance matrix created from 
    pairwise alignments of the sequences in [dnas], with align, misalign, and 
    indel penalties given by [align], [misalign], and [indel].
    Requires: [dnas] is not empty. *)
val dist_dna : Dna.t array -> int -> int -> int -> t

(** [dist_msa msa gap] is the distance matrix created from [msa]. Distances are 
    based on Hamming distance, where a distance of 1 represents a mismatch 
    between two different nucleotides, and a distance of [gap] when either a gap
    or a nucleotide is compared with a gap. *)
val dist_msa : Msa.t -> int -> t

(** [min_index dist_matrix] is a pair of indices of DNA sequences with the 
    minimum distance between them. 
    Requires: [dim dist_matrix] > 1 *)
val min_index : t -> index

(** [min_diff dist_matrix] is the minimum distance between any two different
    DNA sequences. 
    Requires: [dim dist_matrix] > 1 *)
val min_diff : t -> float

(** [diff index dist_matrix] is the distance score given by [dist_matrix] for 
    the two DNA sequences specified by [index]. *)
val diff : index -> t -> float

(**[combine i j dist_matrix] is the result of combining sequences [i] and [j], 
   and averaging their distance against every other sequence.
   Note: Will mutate [dist_matrix]
   Requires: [i] < [j]. *)
val combine : int -> int -> t -> t

(** dim [t] is the dimension [n] of an [n] by [n] distance matrix (one 
    involving [n] DNA sequences).
    n > 0 *)
val dim : t -> int

(**[is_done dist_matrix] is true if there is only 1 sequence in [dist_matrix].*)
val is_done : t -> bool

