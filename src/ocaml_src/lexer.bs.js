// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Char from "bs-platform/lib/es6/char.js";
import * as List from "bs-platform/lib/es6/list.js";
import * as Block from "bs-platform/lib/es6/block.js";
import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Stream from "bs-platform/lib/es6/stream.js";
import * as $$String from "bs-platform/lib/es6/string.js";
import * as Hashtbl from "bs-platform/lib/es6/hashtbl.js";
import * as Caml_format from "bs-platform/lib/es6/caml_format.js";
import * as Caml_js_exceptions from "bs-platform/lib/es6/caml_js_exceptions.js";
import * as Caml_builtin_exceptions from "bs-platform/lib/es6/caml_builtin_exceptions.js";

function is_word(t) {
  if (typeof t === "number") {
    if (t >= 14) {
      return t < 17;
    } else {
      return t < 9;
    }
  } else {
    return true;
  }
}

function to_string(t) {
  if (typeof t !== "number") {
    if (t.tag) {
      return t[0];
    } else {
      return String(t[0]);
    }
  }
  switch (t) {
    case /* Phylogeny */0 :
        return "phylogeny";
    case /* Name */1 :
        return "name";
    case /* Description */2 :
        return "description";
    case /* Clade */3 :
        return "clade";
    case /* Rank */4 :
        return "rank";
    case /* Confidence */5 :
        return "confidence";
    case /* Taxonomy */6 :
        return "taxonomy";
    case /* SciName */7 :
        return "scientific_name";
    case /* ID */8 :
        return "id";
    case /* LAngle */9 :
        return "<";
    case /* LAngleSlash */10 :
        return "</";
    case /* RAngle */11 :
        return ">";
    case /* Quote */12 :
        return "quote";
    case /* Eq */13 :
        return "=";
    case /* Dot */14 :
        return ".";
    case /* True */15 :
        return "true";
    case /* False */16 :
        return "false";
    case /* EOF */17 :
        return "EOF";
    case /* Unit */18 :
        return "Unit";
    
  }
}

var word_token_map = Hashtbl.create(undefined, 16);

Hashtbl.add(word_token_map, "phylogeny", /* Phylogeny */0);

Hashtbl.add(word_token_map, "name", /* Name */1);

Hashtbl.add(word_token_map, "description", /* Description */2);

Hashtbl.add(word_token_map, "clade", /* Clade */3);

Hashtbl.add(word_token_map, "rank", /* Rank */4);

Hashtbl.add(word_token_map, "confidence", /* Confidence */5);

Hashtbl.add(word_token_map, "taxonomy", /* Taxonomy */6);

Hashtbl.add(word_token_map, "scientific_name", /* SciName */7);

Hashtbl.add(word_token_map, "id", /* ID */8);

Hashtbl.add(word_token_map, "true", /* True */15);

Hashtbl.add(word_token_map, "false", /* False */16);

function stream_of_file(f) {
  var stream = Stream.from((function (param) {
          try {
            return f;
          }
          catch (exn){
            if (exn === Caml_builtin_exceptions.end_of_file) {
              return ;
            }
            throw exn;
          }
        }));
  var s = Stream.peek(stream);
  if (s === undefined) {
    return stream;
  }
  var val;
  try {
    val = $$String.sub(s, 0, 5);
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn[0] === Caml_builtin_exceptions.invalid_argument) {
      return stream;
    }
    throw exn;
  }
  if (val !== "<?xml") {
    return stream;
  }
  Stream.junk(stream);
  return stream;
}

function stream_of_line(stream) {
  var str;
  try {
    str = Stream.next(stream);
  }
  catch (exn){
    if (exn === Stream.Failure) {
      throw Caml_builtin_exceptions.end_of_file;
    }
    throw exn;
  }
  return Stream.of_string(str);
}

function is_special_char(c) {
  if (c >= 60) {
    return c < 63;
  } else {
    return c === 34;
  }
}

function lex_keyword(stream, acc) {
  var c = Stream.peek(stream);
  if (c !== undefined) {
    var val;
    try {
      val = c;
    }
    catch (exn){
      if (exn === Stream.Failure) {
        return lex_keyword_helper(acc);
      }
      throw exn;
    }
    if (val !== 32) {
      if (Hashtbl.mem(word_token_map, acc)) {
        return Hashtbl.find(word_token_map, acc);
      } else if (is_special_char(c)) {
        return /* Word */Block.__(1, [acc]);
      } else {
        Stream.junk(stream);
        return lex_keyword(stream, acc + Char.escaped(c));
      }
    } else {
      return lex_keyword_helper(acc);
    }
  } else {
    return lex_keyword_helper(acc);
  }
}

function lex_keyword_helper(acc) {
  if (Hashtbl.mem(word_token_map, acc)) {
    return Hashtbl.find(word_token_map, acc);
  } else {
    return /* Word */Block.__(1, [acc]);
  }
}

function is_number(c) {
  return !(c > 57 || c < 48);
}

function lex_number(stream, _acc) {
  while(true) {
    var acc = _acc;
    var c = Stream.peek(stream);
    if (c === undefined) {
      return /* Num */Block.__(0, [Caml_format.caml_int_of_string(acc)]);
    }
    if (!is_number(c)) {
      return /* Num */Block.__(0, [Caml_format.caml_int_of_string(acc)]);
    }
    Stream.junk(stream);
    _acc = acc + Char.escaped(c);
    continue ;
  };
}

function tokenize_next_line(stream) {
  var x;
  try {
    x = stream_of_line(stream);
  }
  catch (exn){
    if (exn === Caml_builtin_exceptions.end_of_file) {
      return /* :: */[
              /* EOF */17,
              /* [] */0
            ];
    }
    throw exn;
  }
  var _acc = /* [] */0;
  while(true) {
    var acc = _acc;
    var exit = 0;
    var c;
    try {
      c = Stream.next(x);
      exit = 1;
    }
    catch (exn$1){
      if (exn$1 === Stream.Failure) {
        return List.rev(acc);
      }
      if (exn$1 === Caml_builtin_exceptions.end_of_file) {
        return /* :: */[
                /* EOF */17,
                /* [] */0
              ];
      }
      throw exn$1;
    }
    if (exit === 1) {
      var exit$1 = 0;
      if (c >= 32) {
        if (c !== 46) {
          if (c >= 60) {
            if (c >= 63) {
              exit$1 = 2;
            } else {
              switch (c - 60 | 0) {
                case 0 :
                    var n = Stream.peek(x);
                    if (n === undefined) {
                      return List.rev(/* :: */[
                                  /* LAngle */9,
                                  acc
                                ]);
                    }
                    if (n === /* "/" */47) {
                      Stream.junk(x);
                      _acc = /* :: */[
                        /* LAngleSlash */10,
                        acc
                      ];
                      continue ;
                    }
                    _acc = /* :: */[
                      /* LAngle */9,
                      acc
                    ];
                    continue ;
                case 1 :
                    _acc = /* :: */[
                      /* Eq */13,
                      acc
                    ];
                    continue ;
                case 2 :
                    _acc = /* :: */[
                      /* RAngle */11,
                      acc
                    ];
                    continue ;
                
              }
            }
          } else if (c >= 35) {
            exit$1 = 2;
          } else {
            switch (c - 32 | 0) {
              case 0 :
                  continue ;
              case 1 :
                  exit$1 = 2;
                  break;
              case 2 :
                  _acc = /* :: */[
                    /* Quote */12,
                    acc
                  ];
                  continue ;
              
            }
          }
        } else {
          _acc = /* :: */[
            /* Dot */14,
            acc
          ];
          continue ;
        }
      } else if (c >= 11) {
        if (c !== 13) {
          exit$1 = 2;
        } else {
          continue ;
        }
      } else {
        if (c >= 9) {
          continue ;
        }
        exit$1 = 2;
      }
      if (exit$1 === 2) {
        if (is_number(c)) {
          _acc = /* :: */[
            lex_number(x, Char.escaped(c)),
            acc
          ];
          continue ;
        }
        _acc = /* :: */[
          lex_keyword(x, Char.escaped(c)),
          acc
        ];
        continue ;
      }
      
    }
    
  };
}

function token_function_builder(stream) {
  var tokens_in_line = {
    contents: tokenize_next_line(stream)
  };
  var token_function = {
    contents: (function (b, param) {
        return /* EOF */17;
      })
  };
  token_function.contents = (function (b) {
      if (b) {
        return (function (param) {
            var match = tokens_in_line.contents;
            if (match) {
              return match[0];
            } else {
              tokens_in_line.contents = tokenize_next_line(stream);
              return Curry._2(token_function.contents, true, undefined);
            }
          });
      } else {
        return (function (param) {
            var match = tokens_in_line.contents;
            if (match) {
              tokens_in_line.contents = match[1];
              return /* Unit */18;
            } else {
              tokens_in_line.contents = tokenize_next_line(stream);
              return /* Unit */18;
            }
          });
      }
    });
  return token_function.contents;
}

export {
  is_word ,
  to_string ,
  stream_of_file ,
  tokenize_next_line ,
  token_function_builder ,
  
}
/* word_token_map Not a pure module */