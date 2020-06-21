type clade_id = int

type t = Clade of {
    clade_id : clade_id;
    children : t list;
    bootstrap : float option;
    rank : string option;
    id : string option;
    name : string option;
  } | Leaf of {
    scientific_name : string;
    id : string option;
    name : string option;
  }
  
  (** The clade_id [clade_id] could not be found in this phylogenetic tree *)
exception UnknownClade of clade_id

(** The empty phylogenetic tree. *)
val empty : t

(** [is_empty t] is true iff. the tree is empty. *)
val is_empty : t -> bool

(** [leaf species id name] is the tree consisting of leaf with [species], [id] 
    and [name]. *)
val leaf : string -> string option -> string option -> t

(** [leaf_no_params species] is the tree consisting of leaf with species [species]. *)
val leaf_no_params: string -> t

(** [size t] is the size of tree t including both clades and species. *)
val size : t -> int 

(** [zip trees bootstrap id rank name ] is the tree with a clade as the root and 
    [trees] as the children. The root clade has attributes [bootstrap], [id], 
    [rank], and [name]. *)
val zip : t list -> float option -> string option -> string option -> string option -> t

(** [zip_no_params trees] is the tree with a clade as the root and [trees] as the 
    children. *)
val zip_no_params: t list -> t

(** [mem species t] is true if [t] contains a leaf with a scientific name of 
    [species]. *)
val mem : string -> t -> bool

(** [is_equal a b] is true if [a] and [b] are structurally similar, ignoring
    the order of the children. *)
val is_equal : t -> t -> bool

(** [to_string t] returns an ASCII-art string representation of [t]. *)
val to_string : t -> string