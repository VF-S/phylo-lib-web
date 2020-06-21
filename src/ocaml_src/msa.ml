open Dna

type t = Dna.t array

let align dnas = dnas

let num_seq msa = Array.length msa

let seq_len msa = 
  Dna.length msa.(0)

let get_seq i msa = 
  msa.(i)

let get_base i j msa = 
  match Dna.get (get_seq i msa) j with
  | None -> failwith "Index out of bounds"
  | Some c -> c