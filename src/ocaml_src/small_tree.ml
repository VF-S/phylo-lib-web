module SmallTree = struct
  open Tree
  let dog = leaf_no_params "dog"
  let cat = leaf_no_params "cat"
  let mouse = leaf_no_params "mouse"
  let dog_cat = zip_no_params [dog; cat]
  let dog_cat_mouse = zip_no_params [dog_cat; mouse]
  let z = zip_no_params [mouse; dog_cat]
end