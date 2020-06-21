open Tree
open Distance

(** [add_species s1 s2 checked unchecked] adds [s1] and [s2] as a new clade in 
    [checked]@[unchecked] (which I will refer to as the tree list) if they are 
    not part of any trees in [checked]@[unchecked]. Otherwise, the species that
    is not in the existing tree list is added to the tree that contains the 
    other species. *)
let rec add_species species i j acc = 
  let s1 = species.(i) in
  let s2 = species.(j) in
  match (List.assoc_opt i acc), (List.assoc_opt j acc) with
  | None, None -> 
    ((min i j), zip_no_params [leaf_no_params s1; leaf_no_params s2])
    ::acc
  | Some t, None -> let r = List.remove_assoc i acc in 
    ((min i j ), zip_no_params [leaf_no_params s2; t])::r
  | None, Some t -> let r = List.remove_assoc j acc in 
    ((min i j ), zip_no_params [leaf_no_params s1; t])::r
  | Some t1, Some t2 ->
    let r = acc |> List.remove_assoc i |> List.remove_assoc j in 
    ((min i j), zip_no_params [t1; t2])::r

(** [upgma_help dist species acc] is the phylogenetic tree that results from
    running the UPGMA algorithm on [dist] with species names [species] and 
    zipping up the results with [acc].

    Preconditions: if [acc] is empty, then [is_done dist] must be false, i.e. 
    there must be more than one remaining column in distance matrix [dist].
    For every column index in [dist] there must be a corresponding name in 
    [species]. *)
let rec upgma_help dist species acc = 
  if is_done dist then 
    begin
      let tree_list = (List.rev_map (fun x -> snd x) acc) in
      if List.length tree_list = 1 then (List.hd tree_list)
      else if List.length tree_list > 1 then zip_no_params tree_list
      else failwith "Precondition violated in upgma_help"
    end
  else
    begin
      let i, j = min_index dist in
      let t = add_species species i j acc in
      let d = combine i j dist in 
      upgma_help d species t
    end

let upgma dist species = 
  match Array.length species with
  | 0 -> Tree.empty
  | 1 -> Tree.leaf_no_params species.(0)
  | _ -> upgma_help dist species []