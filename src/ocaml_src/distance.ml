open Msa
open Pairwise

type index = int * int 

(** 
   AF: A binding [i -> f] indicates that the distance between the pair of 
   sequences in [i] is [f]. Equivalent to an [n] by [n] distance matrix, where 
   [n] is the number of sequences in the distance matrix and [n] > 0. [t] will 
   then have [n * (n - 1) / 2] bindings.

   RI: If there is only one sequence, t is empty. There is a binding for every 
   possible [index] pairing that can be generated from the [n] DNA sequences in 
   the distance matrix. *)
type t = (index, float) Hashtbl.t

let dist_dna (dnas: Dna.t array) align misalign indel : t =
  let m = Array.length dnas in
  let dist_matrix = Hashtbl.create m in 
  (for i = 0 to (m - 1) do
     (for j = i + 1 to (m - 1) do
        Hashtbl.add dist_matrix (i, j)
          (float_of_int (Pairwise.diff dnas.(i) dnas.(j) align misalign indel))
      done);
   done);
  dist_matrix

let dist_msa (msa: Msa.t) (gap: int) : t = 
  let m = num_seq msa in
  print_int m;
  let n = seq_len msa in
  print_int n;
  let dist_matrix = Hashtbl.create m in 
  (for i = 0 to (m - 1) do
     let diff = ref 0 in
     (for j = i + 1 to (m - 1) do
        (for k = 0 to (n - 1) do
           print_int i;
           if (get_base i k msa) = '_' ||  (get_base j k msa) = '_' then
             diff := !diff + gap
           else if (get_base i k msa) <> (get_base j k msa) then
             incr(diff)
         done);
        Hashtbl.add dist_matrix (i, j) (float_of_int !diff);
      done);
   done);
  dist_matrix

(** [min t] is a ((i,j), value) tuple of the minimum position 
    and value in [t]. *)
let min_pos dist = 
  if Hashtbl.length dist = 0 then ((0, 0), 0.)
  else
    let acc = ((0, 0), max_float) in 
    Hashtbl.fold (fun k v acc -> if v < snd acc then (k, v) else acc) dist acc

let min_diff (dist: t) : float =  
  dist |> min_pos |> snd

let min_index dist : index = 
  dist |> min_pos |> fst

let diff index dist =
  Hashtbl.find dist index

(** [remove i dist] removes all bindings in [dist] that contains [i] as 
    one of its indices. *)
let remove i dist =
  Hashtbl.filter_map_inplace 
    (fun k v -> if fst k = i || snd k = i then None else Some v) dist

(** [avg_helper j k dist] is the value stored at 
    indices [j] and [k] in [dist]. *)
let avg_helper j k dist =
  Hashtbl.find dist ((min j k), max j k) 

(** [average i j dist] iterates over the elements in matrix dist and updates 
    the entries where row = [i] or column = [i] to the average of 
    distance from current entry to i and distance from current entry to j. 
    Used for UPGMA. 
    See https://en.wikipedia.org/wiki/UPGMA for detailed algorithm.  *)
let average (i : int) (j : int) dist = 
  let avg (k : index) (v : float) = 
    if fst k = i then 
      let other = snd k in 
      let v_val = v +. (avg_helper other i dist) in 
      Some (v_val /. 2.)
    else if snd k = i then
      let other = fst k in 
      Some ((v +. (avg_helper other i dist)) /. 2.)
    else Some v
  in 
  Hashtbl.filter_map_inplace avg dist

let combine i j dist = 
  if i >= j 
  then failwith "invalid input"
  else
    average i j dist;
  remove j dist;
  dist

let dim dist = 
  Hashtbl.fold (fun k v acc -> if fst k = 0 then acc + 1 else acc) dist 1

let is_done dist = 
  (Hashtbl.length dist = 0)


