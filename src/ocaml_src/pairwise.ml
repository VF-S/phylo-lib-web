open Dna

let small_int = -1000000000

(** [max_thre a b c] is the largest of [a], [b], and [c]. *)
let max_three a b c = max (max a b) c

(** [init_matrix d1 d2 indel m n ] is an initalized matrix of size 
    [m * n] with the row and column headers initialized 
    according to the [indel] penalty. *)
let init_matrix (d1:Dna.t) (d2:Dna.t) (indel:int) (m:int) (n:int)  =
  let mat = Array.make_matrix m n small_int in
  for r = 0 to m - 1 do
    mat.(r).(0) <- r * indel
  done;
  for c = 0 to n - 1 do
    mat.(0).(c) <- c * indel
  done;
  mat

(** [neighbors d1 d2 r c mat align misalign indel] is a 3 element tuple that
    contains the distance score of the cell in [mat] with row [r] and column 
    [c], calculated using the left, top and top left diagonal neighbor.

    The score is calculated using the following rules - for the left/top cells, 
    the [indel] penalty is added to the value in the left/top cell. For the 
    diagonal cell, the [align] bonus/[misalign] penalty is added to the value 
    in the diagonal cell, depending on whether the [r]th character of DNA [d1] 
    and the [c]th character of [d2] match or not.

    Requires:
    0<=[!r]<=[Dna.length d1]
    0<=[!c]<=[Dna.length d2]
    [mat] has [dimx] [r]-1 and [dimy] [c]-1
*)
let neighbors d1 d2 r c mat align misalign indel =
  let left = if !c < 1 then small_int else indel + mat.(!r).(!c - 1) in
  let up = if !r < 1 then small_int else indel + mat.(!r - 1).(!c) in
  let diagonal =
    begin
      if !r < 1 || !c < 1 then small_int
      else mat.(!r-1).(!c-1) + 
           (if Dna.get d1 (max 0 !r-1) = Dna.get d2 (max 0 !c-1) 
            then align else misalign)
    end in
  (left, up, diagonal)

(** [fill_matrix d1 d2 mat align misalign indel] is a filled-in matrix of 
    dimensions m by n that uses the [align], [misalign], 
    and [indel] parameters. *)
let fill_matrix d1 d2 align misalign indel m n =
  let mat = init_matrix d1 d2 indel m n in
  for r = 1 to m - 1 do 
    for c = 1 to n - 1 do
      let (left, up, diagonal) = 
        neighbors d1 d2 (ref r) (ref c) mat align misalign indel in
      mat.(r).(c) <- max_three left up diagonal
    done;
  done;
  mat

(** [backtrack d1 d2 mat align misalign indel] is the array consisting of the
    two sequences that are a result of aligning [d1] and [d2]. The aligned 
    sequences are guaranteed to be the globally optimum alignment that results 
    in the highest match score given the weights [align], [misalign] and 
    [indel], but there can also be other equally optimum alignments.

    Requires: [mat] is the filled in dp matrix constructed by calling 
    [fill_matrix] on [d1] and [d2] using weights [align], [misalign] and 
    [indel]. *)
let backtrack d1 d2 mat align misalign indel = 
  let r = ref (Dna.length d1) in 
  let c = ref ((Dna.length d2)) in
  let acc1 = ref "" in
  let acc2 = ref "" in
  while (!r > 0 || !c > 0) do
    let (left, up, diagonal) = neighbors d1 d2 r c mat align misalign indel in
    let cell = mat.(!r).(!c) in
    (if cell = diagonal then
       begin
         acc1 := Char.escaped(Dna.get_e d1 (!r - 1))^ (!acc1);
         acc2 := Char.escaped(Dna.get_e d2 (!c - 1))^ (!acc2);
         decr r; decr c;
       end
     else if cell = left then 
       begin
         acc1 := "_" ^ !acc1; 
         acc2 := Char.escaped(Dna.get_e d2 (!c - 1)) ^ (!acc2);
         decr c
       end
     else if cell = up then 
       begin
         acc2 := "_" ^ !acc2; 
         acc1 := Char.escaped(Dna.get_e d1 (!r - 1))^ (!acc1);
         decr r
       end
     else failwith "This should not happen");
  done;
  [|Dna.from_string !acc1; Dna.from_string !acc2|]

let align_pair d1 d2 align misalign indel =
  let m = (Dna.length d1) + 1 in
  let n = (Dna.length d2) + 1 in
  let mat = fill_matrix d1 d2 align misalign indel m n in
  let score = mat.(m - 1).(n - 1) in
  let alignment = backtrack d1 d2 mat align misalign indel in 
  (alignment, score)

let diff d1 d2 align misalign indel=
  let m = (Dna.length d1) + 1 in
  let n = (Dna.length d2) + 1 in
  let mat = fill_matrix d1 d2 align misalign indel m n in
  let aligned = backtrack d1 d2 mat align misalign indel in
  let s1 = aligned.(0) in
  let s2 = aligned.(1) in
  let len = Dna.length s1 in
  let diff = ref 0 in
  for r = 0 to len - 1 do 
    if (get s1 r) = Some '_' || (get s2 r) = Some '_' then
      diff := !diff - indel
    else if (get s1 r) <> (get s2 r) then
      incr(diff)
  done;
  !diff

let print_alignment d1 d2 =
  let n = Dna.length d1 in
  for i = 0 to (n - 1) / 80 do
    print_endline (Dna.string_of_range d1 (80 * i) (min n (80 * (i + 1))));
    for j = 80 * i to min (n - 1) (80 * (i + 1) - 1) do
      if Dna.get d1 j = Dna.get d2 j then
        print_char '*'
      else if Dna.get d1 j = Some '_' || Dna.get d2 j = Some '_' then
        print_char ' '
      else 
        print_char '|'
    done;
    print_newline ();
    print_endline (Dna.string_of_range d2 (80 * i) (min n (80 * (i + 1))));
    print_newline ();
  done