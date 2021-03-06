// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Printf from "bs-platform/lib/es6/printf.js";
import * as Pervasives from "bs-platform/lib/es6/pervasives.js";
import * as Tree$PhyloLibWeb from "./tree.bs.js";

var printing = {
  contents: true
};

var print_output = {
  contents: ""
};

var oc = {
  contents: Pervasives.stdout
};

function print_f(s) {
  if (printing.contents) {
    return Curry._1(Printf.fprintf(oc.contents, /* Format */{
                    _0: {
                      TAG: /* String */2,
                      _0: /* No_padding */0,
                      _1: /* End_of_format */0
                    },
                    _1: "%s"
                  }), s);
  } else {
    print_output.contents = print_output.contents + s;
    return ;
  }
}

function print_tabs(n) {
  for(var x = 1; x <= n; ++x){
    print_f("  ");
  }
  
}

function print_attr(_attr) {
  while(true) {
    var attr = _attr;
    if (!attr) {
      return ;
    }
    var t = attr.tl;
    var match = attr.hd;
    var space = t !== /* [] */0;
    print_f(match[0] + ("=\"" + (match[1] + ("\"" + (
                space ? " " : ""
              )))));
    _attr = t;
    continue ;
  };
}

function print_start_tag(tag, attr, tabs, newline) {
  print_tabs(tabs);
  print_f("<" + tag);
  print_attr(attr);
  return print_f(newline ? ">\n" : ">");
}

function print_end_tag(tag, tabs) {
  print_tabs(tabs);
  return print_f("</" + (tag + ">\n"));
}

function print_inline_tag(tag, tabs, s) {
  print_tabs(tabs);
  print_f("<" + (tag + ">"));
  print_f(s);
  return print_end_tag(tag, 0);
}

function print_inline_opt(tag, tabs, info) {
  if (info !== undefined) {
    return print_inline_tag(tag, tabs, info);
  }
  
}

function print_tree_helper(tree, tabs) {
  if (tree.TAG) {
    print_start_tag("clade", /* [] */0, tabs, true);
    print_inline_opt("name", tabs + 1 | 0, tree.name);
    if (tree.scientific_name !== "" || tree.id !== undefined) {
      print_start_tag("taxonomy", /* [] */0, tabs + 1 | 0, true);
      if (tree.scientific_name !== "") {
        print_inline_tag("scientific_name", tabs + 2 | 0, tree.scientific_name);
      }
      print_inline_opt("id", tabs + 2 | 0, tree.id);
      print_end_tag("taxonomy", tabs + 1 | 0);
    }
    return print_end_tag("clade", tabs);
  }
  print_start_tag("clade", /* [] */0, tabs, true);
  print_inline_opt("name", tabs + 1 | 0, tree.name);
  var bootstrap = tree.bootstrap;
  var confidence = bootstrap !== undefined ? Pervasives.string_of_float(bootstrap) : undefined;
  print_inline_opt("confidence", tabs + 1 | 0, confidence);
  if (tree.rank !== undefined || tree.id !== undefined) {
    print_start_tag("taxonomy", /* [] */0, tabs + 1 | 0, true);
    print_inline_opt("id", tabs + 2 | 0, tree.id);
    print_inline_opt("rank", tabs + 2 | 0, tree.rank);
    print_end_tag("taxonomy", tabs + 1 | 0);
  }
  var print_children = function (_children, tabs) {
    while(true) {
      var children = _children;
      if (!children) {
        return ;
      }
      print_tree_helper(children.hd, tabs);
      _children = children.tl;
      continue ;
    };
  };
  print_children(tree.children, tabs + 1 | 0);
  return print_end_tag("clade", tabs);
}

function print_phylo_helper(phylo) {
  print_start_tag("phyloxml", /* [] */0, 0, true);
  print_start_tag("phylogeny", /* [] */0, 1, true);
  if (phylo.name.length !== 0) {
    print_inline_tag("name", 2, phylo.name);
  }
  if (phylo.description.length !== 0) {
    print_inline_tag("description", 2, phylo.description);
  }
  if (Tree$PhyloLibWeb.is_empty(phylo.tree)) {
    
  } else {
    print_tree_helper(phylo.tree, 2);
  }
  print_end_tag("phylogeny", 1);
  return print_end_tag("phyloxml", 0);
}

function print_phylo_xml(phylo, f) {
  oc.contents = Pervasives.open_out(f);
  print_phylo_helper(phylo);
  Pervasives.close_out(oc.contents);
  oc.contents = Pervasives.stdout;
  
}

function print_tree_xml(tree, f) {
  printing.contents = true;
  oc.contents = Pervasives.open_out(f);
  var phylo = {
    name: "",
    description: "",
    tree: tree
  };
  print_phylo_helper(phylo);
  Pervasives.close_out(oc.contents);
  oc.contents = Pervasives.stdout;
  
}

function xml_of_tree(tree) {
  printing.contents = false;
  print_output.contents = "";
  var phylo = {
    name: "",
    description: "",
    tree: tree
  };
  print_phylo_helper(phylo);
  return print_output.contents;
}

export {
  print_phylo_xml ,
  print_tree_xml ,
  xml_of_tree ,
  
}
/* Tree-PhyloLibWeb Not a pure module */
