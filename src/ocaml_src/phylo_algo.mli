(** Implements various most-likely phylogenetic tree generation algorithms, 
    including UPGMA and Maximum Parsimony.*)

(** [upgma dist_matrix species] is a phylogenetic tree produced from 
    [dist_matrix] with species named [species] using the unweighted pair 
    group method with arithmetic mean (UPGMA) algorithm. 
    Check out [https://en.wikipedia.org/wiki/UPGMA] for a detailed explanation
    of the algorithm.
    Effects: Modifies [dist_matrix]. *)
val upgma : Distance.t -> string array -> Tree.t