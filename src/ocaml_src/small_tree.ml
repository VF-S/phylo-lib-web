module SmallTree = struct
  open Tree
  let dog = Tree.leaf_no_params "dog"
  let cat = Tree.leaf_no_params "cat"
  let mouse = Tree.leaf_no_params "mouse"
  let dog_cat = Tree.zip_no_params [dog; cat]
  let dog_cat_mouse = Tree.zip_no_params [dog_cat; mouse]
  let z = Tree.zip_no_params [mouse; dog_cat]
end