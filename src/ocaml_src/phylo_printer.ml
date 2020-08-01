open Tree
open Phylo_parser
open Printf

(** Type of phyloXML start tag attributes *)
type attr = (string * string) list

(** Whether the printing helpers print to a file or append to 
    a string ref. *)
let printing = ref true

(** Points to the string representation of the tree that is being processed
    by [xml_of_tree]. *)
let print_output = ref ""

(** A reference that will point to the out_channel for the file currently 
    being written to. It points to [stdout] when no files are being written. *)
let oc = ref stdout

(** [print_f s] prints [s] to the current file if [printing] is true. Else, 
    it appends [s] to [print_output]. *)
let print_f (s : string) : unit = 
  if !printing then fprintf !oc "%s" s
  else print_output := !print_output ^ s

(** [print_tabs n oc] prints [n] 2-space tabs to the current file. *)
let print_tabs (n : int) : unit =
  for x = 1 to n do print_f "  " done

(** [print_attr attr] prints the key-value pairs in [attr] as space-separated
    attributes in a phyloXML start-tag for the file currently being written to.
    Example: [print_attr [("attr_a", "val_a"), ("attr_b", "val_b")]] would
    print "attr_a="val_a" attr_b="val_b"" to the current file. *)
let rec print_attr (attr : attr) : unit =
  match attr with 
  | [] -> ()
  | (k, v)::t -> 
    let space = (t <> []) in 
    print_f (k ^ "=\"" ^ v ^ "\"" ^ (if space then " " else ""));
    print_attr t

(** [print_start_tag tag attr tabs newline] prints a phyloXML start tag with
    name [tag] and attributes [attr] to the current file, indented by [tabs] 
    tabs. A newline is printed after the start tag if [newline] is true. *)
let print_start_tag (tag : string) (attr : attr) (tabs : int) (newline : bool) 
  : unit =
  print_tabs tabs;
  print_f ("<" ^ tag);
  print_attr attr;
  print_f (if newline then ">\n" else ">")

(** [print_end_tag tag tabs] prints a phyloXML end tag with name [tag] 
    to the current file, indented by [tabs] tabs. *)
let print_end_tag (tag : string) (tabs : int) : unit =
  print_tabs tabs;
  print_f ("</" ^ tag ^ ">\n")

(** [print_inline_tag tag tabs s] prints the phyloXML start and end tag
    indented by [tabs] tabs to the current file in one line, with the content 
    between the tags given by [s]. This is followed by a newline.
    Example: [print_inline_tag "example" 0 "name"] would print 
    "<example>name</example>\n" to the current file. *)
let print_inline_tag (tag : string) (tabs : int) (s : string) : unit =
  print_tabs tabs;
  print_f ("<" ^ tag ^ ">");
  print_f s;
  print_end_tag tag 0

(** [print_inline_opt tag tabs info] prints an inline tag [tag] with [tabs] 
    number of tabs to the current file if [info] carries information. *)
let print_inline_opt (tag : string) (tabs : int) (info : string option) : unit =
  match info with 
  | Some s -> print_inline_tag tag tabs s
  | None -> ()

(** [print_tree_helper tree tabs] prints the phyloXML representation of 
    [tree] to the current file, with the entire tree being indented by [tabs] 
    tabs. *)
let rec print_tree_helper (tree : Tree.t) (tabs : int) : unit =
  match tree with 
  | Clade info -> 
    print_start_tag "clade" [] tabs true;
    print_inline_opt "name" (tabs + 1) info.name;
    let confidence = 
      begin
        match info.bootstrap with 
        | Some bootstrap -> Some (string_of_float bootstrap)
        | None -> None
      end in
    print_inline_opt "confidence" (tabs + 1) confidence;
    (if (info.rank <> None || info.id <> None) 
     then 
       begin
         print_start_tag "taxonomy" [] (tabs + 1) true;
         print_inline_opt "id" (tabs + 2) info.id;
         print_inline_opt "rank" (tabs + 2) info.rank;
         print_end_tag "taxonomy" (tabs + 1);
       end
     else ());
    let rec print_children children tabs = 
      match children with 
      | [] -> ()
      | h::t -> print_tree_helper h tabs; print_children t tabs 
    in 
    print_children info.children (tabs + 1);
    print_end_tag "clade" tabs;
  | Leaf info -> 
    print_start_tag "clade" [] tabs true;
    print_inline_opt "name" (tabs + 1) info.name;
    (if info.scientific_name <> "" || info.id <> None 
     then 
       begin
         print_start_tag "taxonomy" [] (tabs + 1) true;
         begin
           if info.scientific_name <> ""
           then (print_inline_tag "scientific_name" (tabs + 2) 
                   info.scientific_name)
           else ()
         end;
         print_inline_opt "id" (tabs + 2) info.id;
         print_end_tag "taxonomy" (tabs + 1);
       end
     else ());
    print_end_tag "clade" tabs

(** [print_phylo_helper phylo] prints [phylo] to the current file. *)
let print_phylo_helper (phylo : phylo) : unit =
  print_start_tag "phyloxml" [] 0 true;
  print_start_tag "phylogeny" [] 1 true;
  if String.length phylo.name <> 0 then 
    print_inline_tag "name" 2 phylo.name
  else ();
  if String.length phylo.description <> 0 then
    print_inline_tag "description" 2 phylo.description
  else ();
  if is_empty phylo.tree then () 
  else print_tree_helper phylo.tree 2;
  print_end_tag "phylogeny" 1;
  print_end_tag "phyloxml" 0

let print_phylo_xml (phylo : phylo) (f : string) : unit = 
  oc := open_out f;
  print_phylo_helper phylo;
  close_out !oc;
  oc := stdout

let print_tree_xml (tree : Tree.t) (f : string) : unit = 
  printing := true;
  oc := open_out f;
  let phylo = { name = ""; description = ""; tree = tree} in 
  print_phylo_helper phylo;
  close_out !oc;
  oc := stdout

let xml_of_tree (tree : Tree.t) : string = 
  printing := false;
  print_output := "";
  let phylo = { name = ""; description = ""; tree = tree} in 
  print_phylo_helper phylo;
  !print_output