open Tree

(** The Phylo_parser module parses phyloXML files. *)

exception SyntaxError

(** The type of a parsed phyloXML phylogenetic tree. *)
type phylo = {
  name : string; 
  description : string;
  tree : Tree.t;
}

(** [from_phylo file] parses the phyloXML file at the absolute path [file].
    Requires: there is a valid phyloXML file at the location represented by 
    [file]. *)
val from_phylo : string -> phylo

