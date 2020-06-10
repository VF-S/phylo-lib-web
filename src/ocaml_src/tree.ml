module type TreeType = sig
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

  (** [print_tree t] prints an ASCII-art [t] to console semi-prettily. *)
  val print_tree : t -> unit
end

module Tree : TreeType = struct
  type clade_id = int
  exception UnknownClade of clade_id

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

   (** True if the representation invariant is being checked. *)
  let debug = true

  (** [clade_ids t] is a list of all the clade_ids in [t]. *)
  let rec clade_ids (tree : t)= 
    match tree with
    | Clade info -> 
      info.clade_id::
      (List.flatten (List.map (fun x -> clade_ids x) info.children))
    | Leaf _ -> []

   (** [clade_ids_uniq t] is true if all the clade_ids within [t] are unique. *)
  let clade_ids_uniq t =
    let all_clade_ids = clade_ids t in 
    List.sort_uniq compare all_clade_ids = List.sort compare all_clade_ids

  (** [rep_ok t] checks the representation invariant for [t] if the flag [debug] 
      is true. It is [t] if [t] satisfies the representation invariant, otherwise,
      it raises [Failure] with a message that indicates what part of the rep 
      invariant was broken. *)
  let rep_ok t =
    if not debug then t else
      (if clade_ids_uniq t then t else failwith "clade_ids not unique")

  (** [id ()] is a counter for clade_ids to be called by functions inside this
      module whenever a new clade is constructed. *)
  let id =
    let counter = ref 0 in 
    fun () -> 
      incr counter; 
      !counter

  let empty = Clade { 
      clade_id = id (); 
      children = []; 
      bootstrap = None;
      rank = None;
      id = None;
      name = None;
    }

  let is_empty = function
    | Clade info -> info.children = [] 
                    && info.bootstrap = None 
                    && info.rank = None 
                    && info.id = None 
                    && info.name = None
    | Leaf _ -> false

  let leaf (sci_name : string) (id : string option) (name : string option) : t =
    Leaf {scientific_name = sci_name; id = id; name = name}

  let leaf_no_params sci_name = 
    Leaf {scientific_name = sci_name; id = None; name = None}

  (** [add_scientific_name t clade_id scientific_name] adds [scientific_name] as a child of 
      [clade_id] to phylogenetic tree [t]. Throws [UnknownClade clade_id] if 
      clade_id cannot be found in the phylogenetic tree. *)
  let rec add_node (tree : t) (clade_id : clade_id) (node : t) : t = 
    match tree with
    | Leaf _ -> raise (UnknownClade clade_id)
    | Clade info -> 
      if info.clade_id = clade_id 
      then Clade {info with children =  node::info.children}
      else add_scientific_name_helper info.children clade_id node
  and 
    add_scientific_name_helper (lst: t list) (clade_id : clade_id) (node : t) : t =
    match lst with
    | [] -> raise (UnknownClade clade_id)
    | h::t -> try add_node h clade_id node
      with UnknownClade _ -> add_scientific_name_helper t clade_id node

  let rec size (tree:t) = size_helper tree 0 
  and 
    size_helper (tree: t) (size: int) : int = 
    match tree with 
    | Leaf _ -> size + 1
    | Clade info -> (match info.children with 
        | [] -> size
        | h::t ->
          1 + List.fold_left (fun acc x -> acc + (size_helper x size)) 0 (h::t))

  let zip (trees: t list) (bootstrap: float option) (rank: string option)
      (parsed_id: string option) (name: string option): t = 
    match empty with 
    | Clade x -> Clade {
        clade_id = id (); 
        children = trees; 
        bootstrap = bootstrap; 
        rank = rank; 
        id = parsed_id; 
        name = name;
      } |> rep_ok
    | _ -> failwith "Representation invariant broken"

  let zip_no_params (trees: t list) : t = 
    match empty with 
    | Clade x -> Clade {x with clade_id = id (); children = trees;} |> rep_ok
    | _ -> failwith "Representation invariant broken"

  (** [hierarchy a b] is a comparator for [a] and [b]. *)
  let hierarchy a b = match a, b with
    | Leaf t1, Leaf t2 -> compare t1.scientific_name t2.scientific_name
    | Clade t1, Clade t2 -> compare t1.clade_id t2.clade_id
    | Leaf _, Clade _ -> -1
    | Clade _, Leaf _ -> 1

  let rec tlist_comp a b acc = 
    if acc = false then false else match a, b with
      | [], [] -> true
      | h::t, p::q -> tlist_comp t q (is_equal h p)
      | _ -> false

  and is_equal a b = match a, b with
    | Leaf a, Leaf b -> a.scientific_name = b.scientific_name
    | Clade t1, Clade t2 -> let s1 = List.sort (hierarchy) t1.children in
      let s2 = List.sort (hierarchy) t2.children in tlist_comp s1 s2 true
    | _ -> false

  let rec mem s t =
    match t with
    | Leaf {scientific_name} -> scientific_name = s
    | Clade {children} -> 
      List.fold_left (fun acc tree -> acc || (mem s tree)) false children

  (** [print_spaces n] prints [n] spaces to the console. *)
  let print_spaces (n : int) : unit =
    for x = 1 to n do print_char ' ' done

  (** [print_vert_helper ds pos end_str] prints [end_str] at the depths specified 
      in [ds].
      Requires: [ds] is sorted in ascending order.
      [pos] is the depth last printed
  *)
  let rec print_vert_helper (ds: int list) (pos: int) (end_str: string): unit =
    match ds with
    | [] -> ()
    | h::t -> 
      if h = pos && h <> 0 then print_spaces 1 
      else print_spaces (2 * (h - pos) + (if h = 0 || pos = 0 then 0 else 1));
      if t = [] then print_string end_str
      else print_char '|'; print_vert_helper t (h + 1) end_str

  (** [print_verts ds] prints vertical bars at the depths specified in [ds], 
      followed by a newline. 
      Requires: [ds] is sorted in descending order.
      Example: [print_verts [2;1;0]] would output "| | |" to the console,
      followed by a newline. *)
  let print_verts (ds : int list) : unit =
    print_vert_helper (List.rev ds) 0 "|";
    print_endline ""

  (** [print_branch ds] prints vertical bars at the depths specified in [ds], but
      replaces the last level with the symbol "∘-". 
      Requires: [ds] is sorted in descending order.
      Example: [print_branch [2;1;0]] would output "| | ∘-" to the console. *)
  let print_branch (ds : int list) : unit =
    match ds with
    | [] -> invalid_arg "ds"
    | _::t -> print_vert_helper (List.rev ds) 0 "o-"

  (** [print_tree_helper t_list d ds] prints an ASCII-art of the trees in [t_lst] 
      with initial depth [d] and depth levels [ds] to console semi-prettily. *)
  let rec print_tree_helper (t_lst : t list) (d : int) (ds : int list): unit = 
    match t_lst with 
    | [] -> ()
    | h::t -> 
      begin
        match h with
        | Leaf info -> begin
            if ds <> [] then print_verts ds else print_newline ();
            if ds <> [] then print_branch ds;
            info.scientific_name |> print_endline;
            print_tree_helper t d ds
          end
        | Clade info -> 
          begin
            let new_ds = if t <> [] then d::ds else (
                match ds with 
                | [] -> [d]
                | h::t -> (d::t)
              ) in
            if ds <> [] then print_verts ds else ();
            if ds <> [] then print_branch ds else ();
            print_string "C\n";
            print_tree_helper info.children (d+1) new_ds;
            print_tree_helper t d ds;
          end;
      end

  let print_tree (t : t) : unit = 
    print_tree_helper [t] 0 []
end