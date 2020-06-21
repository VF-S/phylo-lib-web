(** Computes pairwise alignments of two DNA sequences.*)

(** [align_pair d1 d2 align misalign indel] is a pair where the first element 
    is an array of aligned dna sequences [|d1; d2|] using [align], [misalign], 
    [indel]. The algorithm used is Needleman-Wunsch. The second element is the
    alignment score. 
    Details of the algorithm can be found on 
    https://en.wikipedia.org/wiki/Needleman–Wunsch_algorithm.*)
val align_pair : Dna.t -> Dna.t -> int -> int -> int -> (Dna.t array * int)

(** [diff d1 d2 gap] is the difference score obtained after
    aligning [d1] and [d2], using [gap] as the gap penalty for mismatches.
    This is different from the score obtained in [align_pair], since that 
    measures similarity of the sequences while this measures the difference.*)
val diff :  Dna.t -> Dna.t -> int -> int -> int -> int

(** [print_alignment d1 d2] pretty-prints [d1] and [d2], showing base pair 
    matches, mismatches and gaps. A [*] indicates a pair match, a [|] indicates 
    a mismatch, and a blank space [ ] indicates a gap.
    For example, if given the sequences ATCG and ATCC, the following would be 
    printed.

    [ATCG]

    [***|]

    [ATCC]

    Requires: [d1] and [d2] are of the same length.
    The viewing screen is at least 80 characters wide. *)
val print_alignment : Dna.t -> Dna.t -> unit