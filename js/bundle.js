(function (f) { if (typeof exports === "object" && typeof module !== "undefined") { module.exports = f() } else if (typeof define === "function" && define.amd) { define([], f) } else { var g; if (typeof window !== "undefined") { g = window } else if (typeof global !== "undefined") { g = global } else if (typeof self !== "undefined") { g = self } else { g = this } g.myParser = f() } })(function () {
    var define, module, exports; return (function () { function r(e, n, t) { function o(i, f) { if (!n[i]) { if (!e[i]) { var c = "function" == typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a } var p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) { var n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = "function" == typeof require && require, i = 0; i < t.length; i++)o(t[i]); return o } return r })()({
        1: [function (require, module, exports) {
            // shim for using process in browser
            var process = module.exports = {};

            // cached from whatever global is present so that test runners that stub it
            // don't break things.  But we need to wrap it in a try catch in case it is
            // wrapped in strict mode code which doesn't define any globals.  It's inside a
            // function because try/catches deoptimize in certain engines.

            var cachedSetTimeout;
            var cachedClearTimeout;

            function defaultSetTimout() {
                throw new Error('setTimeout has not been defined');
            }
            function defaultClearTimeout() {
                throw new Error('clearTimeout has not been defined');
            }
            (function () {
                try {
                    if (typeof setTimeout === 'function') {
                        cachedSetTimeout = setTimeout;
                    } else {
                        cachedSetTimeout = defaultSetTimout;
                    }
                } catch (e) {
                    cachedSetTimeout = defaultSetTimout;
                }
                try {
                    if (typeof clearTimeout === 'function') {
                        cachedClearTimeout = clearTimeout;
                    } else {
                        cachedClearTimeout = defaultClearTimeout;
                    }
                } catch (e) {
                    cachedClearTimeout = defaultClearTimeout;
                }
            }())
            function runTimeout(fun) {
                if (cachedSetTimeout === setTimeout) {
                    //normal enviroments in sane situations
                    return setTimeout(fun, 0);
                }
                // if setTimeout wasn't available but was latter defined
                if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                    cachedSetTimeout = setTimeout;
                    return setTimeout(fun, 0);
                }
                try {
                    // when when somebody has screwed with setTimeout but no I.E. maddness
                    return cachedSetTimeout(fun, 0);
                } catch (e) {
                    try {
                        // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                        return cachedSetTimeout.call(null, fun, 0);
                    } catch (e) {
                        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                        return cachedSetTimeout.call(this, fun, 0);
                    }
                }


            }
            function runClearTimeout(marker) {
                if (cachedClearTimeout === clearTimeout) {
                    //normal enviroments in sane situations
                    return clearTimeout(marker);
                }
                // if clearTimeout wasn't available but was latter defined
                if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                    cachedClearTimeout = clearTimeout;
                    return clearTimeout(marker);
                }
                try {
                    // when when somebody has screwed with setTimeout but no I.E. maddness
                    return cachedClearTimeout(marker);
                } catch (e) {
                    try {
                        // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                        return cachedClearTimeout.call(null, marker);
                    } catch (e) {
                        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                        // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                        return cachedClearTimeout.call(this, marker);
                    }
                }



            }
            var queue = [];
            var draining = false;
            var currentQueue;
            var queueIndex = -1;

            function cleanUpNextTick() {
                if (!draining || !currentQueue) {
                    return;
                }
                draining = false;
                if (currentQueue.length) {
                    queue = currentQueue.concat(queue);
                } else {
                    queueIndex = -1;
                }
                if (queue.length) {
                    drainQueue();
                }
            }

            function drainQueue() {
                if (draining) {
                    return;
                }
                var timeout = runTimeout(cleanUpNextTick);
                draining = true;

                var len = queue.length;
                while (len) {
                    currentQueue = queue;
                    queue = [];
                    while (++queueIndex < len) {
                        if (currentQueue) {
                            currentQueue[queueIndex].run();
                        }
                    }
                    queueIndex = -1;
                    len = queue.length;
                }
                currentQueue = null;
                draining = false;
                runClearTimeout(timeout);
            }

            process.nextTick = function (fun) {
                var args = new Array(arguments.length - 1);
                if (arguments.length > 1) {
                    for (var i = 1; i < arguments.length; i++) {
                        args[i - 1] = arguments[i];
                    }
                }
                queue.push(new Item(fun, args));
                if (queue.length === 1 && !draining) {
                    runTimeout(drainQueue);
                }
            };

            // v8 likes predictible objects
            function Item(fun, array) {
                this.fun = fun;
                this.array = array;
            }
            Item.prototype.run = function () {
                this.fun.apply(null, this.array);
            };
            process.title = 'browser';
            process.browser = true;
            process.env = {};
            process.argv = [];
            process.version = ''; // empty string to avoid regexp issues
            process.versions = {};

            function noop() { }

            process.on = noop;
            process.addListener = noop;
            process.once = noop;
            process.off = noop;
            process.removeListener = noop;
            process.removeAllListeners = noop;
            process.emit = noop;
            process.prependListener = noop;
            process.prependOnceListener = noop;

            process.listeners = function (name) { return [] }

            process.binding = function (name) {
                throw new Error('process.binding is not supported');
            };

            process.cwd = function () { return '/' };
            process.chdir = function (dir) {
                throw new Error('process.chdir is not supported');
            };
            process.umask = function () { return 0; };

        }, {}], 2: [function (require, module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.stringInput = stringInput;
            exports.TreeFragment = exports.TreeCursor = exports.TreeBuffer = exports.Tree = exports.NodeType = exports.NodeSet = exports.NodeProp = exports.DefaultBufferLength = void 0;
            /// The default maximum length of a `TreeBuffer` node.
            const DefaultBufferLength = 1024;
            exports.DefaultBufferLength = DefaultBufferLength;
            let nextPropID = 0;
            const CachedNode = new WeakMap(); /// Each [node type](#tree.NodeType) can have metadata associated with
            /// it in props. Instances of this class represent prop names.

            class NodeProp {
                /// Create a new node prop type. You can optionally pass a
                /// `deserialize` function.
                constructor({
                    deserialize
                } = {}) {
                    this.id = nextPropID++;

                    this.deserialize = deserialize || (() => {
                        throw new Error("This node type doesn't define a deserialize function");
                    });
                } /// Create a string-valued node prop whose deserialize function is
                /// the identity function.


                static string() {
                    return new NodeProp({
                        deserialize: str => str
                    });
                } /// Create a number-valued node prop whose deserialize function is
                /// just `Number`.


                static number() {
                    return new NodeProp({
                        deserialize: Number
                    });
                } /// Creates a boolean-valued node prop whose deserialize function
                /// returns true for any input.


                static flag() {
                    return new NodeProp({
                        deserialize: () => true
                    });
                } /// Store a value for this prop in the given object. This can be
                /// useful when building up a prop object to pass to the
                /// [`NodeType`](#tree.NodeType) constructor. Returns its first
                /// argument.


                set(propObj, value) {
                    propObj[this.id] = value;
                    return propObj;
                } /// This is meant to be used with
                /// [`NodeSet.extend`](#tree.NodeSet.extend) or
                /// [`Parser.withProps`](#lezer.Parser.withProps) to compute prop
                /// values for each node type in the set. Takes a [match
                /// object](#tree.NodeType^match) or function that returns undefined
                /// if the node type doesn't get this prop, and the prop's value if
                /// it does.


                add(match) {
                    if (typeof match != "function") match = NodeType.match(match);
                    return type => {
                        let result = match(type);
                        return result === undefined ? null : [this, result];
                    };
                }

            } /// Prop that is used to describe matching delimiters. For opening
            /// delimiters, this holds an array of node names (written as a
            /// space-separated string when declaring this prop in a grammar)
            /// for the node types of closing delimiters that match it.


            exports.NodeProp = NodeProp;
            NodeProp.closedBy = new NodeProp({
                deserialize: str => str.split(" ")
            }); /// The inverse of [`openedBy`](#tree.NodeProp^closedBy). This is
            /// attached to closing delimiters, holding an array of node names
            /// of types of matching opening delimiters.

            NodeProp.openedBy = new NodeProp({
                deserialize: str => str.split(" ")
            }); /// Used to assign node types to groups (for example, all node
            /// types that represent an expression could be tagged with an
            /// `"Expression"` group).

            NodeProp.group = new NodeProp({
                deserialize: str => str.split(" ")
            });
            const noProps = Object.create(null); /// Each node in a syntax tree has a node type associated with it.

            class NodeType {
                /// @internal
                constructor( /// The name of the node type. Not necessarily unique, but if the
                    /// grammar was written properly, different node types with the
                    /// same name within a node set should play the same semantic
                    /// role.
                    name, /// @internal
                    props, /// The id of this node in its set. Corresponds to the term ids
                    /// used in the parser.
                    id, /// @internal
                    flags = 0) {
                    this.name = name;
                    this.props = props;
                    this.id = id;
                    this.flags = flags;
                }

                static define(spec) {
                    let props = spec.props && spec.props.length ? Object.create(null) : noProps;
                    let flags = (spec.top ? 1
                        /* Top */
                        : 0) | (spec.skipped ? 2
                            /* Skipped */
                            : 0) | (spec.error ? 4
                                /* Error */
                                : 0) | (spec.name == null ? 8
                                    /* Anonymous */
                                    : 0);
                    let type = new NodeType(spec.name || "", props, spec.id, flags);
                    if (spec.props) for (let src of spec.props) {
                        if (!Array.isArray(src)) src = src(type);
                        if (src) src[0].set(props, src[1]);
                    }
                    return type;
                } /// Retrieves a node prop for this type. Will return `undefined` if
                /// the prop isn't present on this node.


                prop(prop) {
                    return this.props[prop.id];
                } /// True when this is the top node of a grammar.


                get isTop() {
                    return (this.flags & 1
                        /* Top */
                    ) > 0;
                } /// True when this node is produced by a skip rule.


                get isSkipped() {
                    return (this.flags & 2
                        /* Skipped */
                    ) > 0;
                } /// Indicates whether this is an error node.


                get isError() {
                    return (this.flags & 4
                        /* Error */
                    ) > 0;
                } /// When true, this node type doesn't correspond to a user-declared
                /// named node, for example because it is used to cache repetition.


                get isAnonymous() {
                    return (this.flags & 8
                        /* Anonymous */
                    ) > 0;
                } /// Returns true when this node's name or one of its
                /// [groups](#tree.NodeProp^group) matches the given string.


                is(name) {
                    if (typeof name == 'string') {
                        if (this.name == name) return true;
                        let group = this.prop(NodeProp.group);
                        return group ? group.indexOf(name) > -1 : false;
                    }

                    return this.id == name;
                } /// Create a function from node types to arbitrary values by
                /// specifying an object whose property names are node or
                /// [group](#tree.NodeProp^group) names. Often useful with
                /// [`NodeProp.add`](#tree.NodeProp.add). You can put multiple
                /// names, separated by spaces, in a single property name to map
                /// multiple node names to a single value.


                static match(map) {
                    let direct = Object.create(null);

                    for (let prop in map) for (let name of prop.split(" ")) direct[name] = map[prop];

                    return node => {
                        for (let groups = node.prop(NodeProp.group), i = -1; i < (groups ? groups.length : 0); i++) {
                            let found = direct[i < 0 ? node.name : groups[i]];
                            if (found) return found;
                        }
                    };
                }

            } /// An empty dummy node type to use when no actual type is available.


            exports.NodeType = NodeType;
            NodeType.none = new NodeType("", Object.create(null), 0, 8
                /* Anonymous */
            ); /// A node set holds a collection of node types. It is used to
            /// compactly represent trees by storing their type ids, rather than a
            /// full pointer to the type object, in a number array. Each parser
            /// [has](#lezer.Parser.nodeSet) a node set, and [tree
            /// buffers](#tree.TreeBuffer) can only store collections of nodes
            /// from the same set. A set can have a maximum of 2**16 (65536)
            /// node types in it, so that the ids fit into 16-bit typed array
            /// slots.

            class NodeSet {
                /// Create a set with the given types. The `id` property of each
                /// type should correspond to its position within the array.
                constructor( /// The node types in this set, by id.
                    types) {
                    this.types = types;

                    for (let i = 0; i < types.length; i++) if (types[i].id != i) throw new RangeError("Node type ids should correspond to array positions when creating a node set");
                } /// Create a copy of this set with some node properties added. The
                /// arguments to this method should be created with
                /// [`NodeProp.add`](#tree.NodeProp.add).


                extend(...props) {
                    let newTypes = [];

                    for (let type of this.types) {
                        let newProps = null;

                        for (let source of props) {
                            let add = source(type);

                            if (add) {
                                if (!newProps) newProps = Object.assign({}, type.props);
                                add[0].set(newProps, add[1]);
                            }
                        }

                        newTypes.push(newProps ? new NodeType(type.name, newProps, type.id, type.flags) : type);
                    }

                    return new NodeSet(newTypes);
                }

            } /// A piece of syntax tree. There are two ways to approach these
            /// trees: the way they are actually stored in memory, and the
            /// convenient way.
            ///
            /// Syntax trees are stored as a tree of `Tree` and `TreeBuffer`
            /// objects. By packing detail information into `TreeBuffer` leaf
            /// nodes, the representation is made a lot more memory-efficient.
            ///
            /// However, when you want to actually work with tree nodes, this
            /// representation is very awkward, so most client code will want to
            /// use the `TreeCursor` interface instead, which provides a view on
            /// some part of this data structure, and can be used to move around
            /// to adjacent nodes.


            exports.NodeSet = NodeSet;

            class Tree {
                /// Construct a new tree. You usually want to go through
                /// [`Tree.build`](#tree.Tree^build) instead.
                constructor(type, /// The tree's child nodes. Children small enough to fit in a
                    /// `TreeBuffer will be represented as such, other children can be
                    /// further `Tree` instances with their own internal structure.
                    children, /// The positions (offsets relative to the start of this tree) of
                    /// the children.
                    positions, /// The total length of this tree
                    length) {
                    this.type = type;
                    this.children = children;
                    this.positions = positions;
                    this.length = length;
                } /// @internal


                toString() {
                    let children = this.children.map(c => c.toString()).join();
                    return !this.type.name ? children : (/\W/.test(this.type.name) && !this.type.isError ? JSON.stringify(this.type.name) : this.type.name) + (children.length ? "(" + children + ")" : "");
                } /// Get a [tree cursor](#tree.TreeCursor) rooted at this tree. When
                /// `pos` is given, the cursor is [moved](#tree.TreeCursor.moveTo)
                /// to the given position and side.


                cursor(pos, side = 0) {
                    let scope = pos != null && CachedNode.get(this) || this.topNode;
                    let cursor = new TreeCursor(scope);

                    if (pos != null) {
                        cursor.moveTo(pos, side);
                        CachedNode.set(this, cursor._tree);
                    }

                    return cursor;
                } /// Get a [tree cursor](#tree.TreeCursor) that, unlike regular
                /// cursors, doesn't skip [anonymous](#tree.NodeType.isAnonymous)
                /// nodes.


                fullCursor() {
                    return new TreeCursor(this.topNode, true);
                } /// Get a [syntax node](#tree.SyntaxNode) object for the top of the
                /// tree.


                get topNode() {
                    return new TreeNode(this, 0, 0, null);
                } /// Get the [syntax node](#tree.SyntaxNode) at the given position.
                /// If `side` is -1, this will move into nodes that end at the
                /// position. If 1, it'll move into nodes that start at the
                /// position. With 0, it'll only enter nodes that cover the position
                /// from both sides.


                resolve(pos, side = 0) {
                    return this.cursor(pos, side).node;
                } /// Iterate over the tree and its children, calling `enter` for any
                /// node that touches the `from`/`to` region (if given) before
                /// running over such a node's children, and `leave` (if given) when
                /// leaving the node. When `enter` returns `false`, the given node
                /// will not have its children iterated over (or `leave` called).


                iterate(spec) {
                    let {
                        enter,
                        leave,
                        from = 0,
                        to = this.length
                    } = spec;

                    for (let c = this.cursor(); ;) {
                        let mustLeave = false;

                        if (c.from <= to && c.to >= from && (c.type.isAnonymous || enter(c.type, c.from, c.to) !== false)) {
                            if (c.firstChild()) continue;
                            if (!c.type.isAnonymous) mustLeave = true;
                        }

                        for (; ;) {
                            if (mustLeave && leave) leave(c.type, c.from, c.to);
                            mustLeave = c.type.isAnonymous;
                            if (c.nextSibling()) break;
                            if (!c.parent()) return;
                            mustLeave = true;
                        }
                    }
                } /// Balance the direct children of this tree.


                balance(maxBufferLength = DefaultBufferLength) {
                    return this.children.length <= BalanceBranchFactor ? this : balanceRange(this.type, NodeType.none, this.children, this.positions, 0, this.children.length, 0, maxBufferLength, this.length, 0);
                } /// Build a tree from a postfix-ordered buffer of node information,
                /// or a cursor over such a buffer.


                static build(data) {
                    return buildTree(data);
                }

            } /// The empty tree


            exports.Tree = Tree;
            Tree.empty = new Tree(NodeType.none, [], [], 0); // For trees that need a context hash attached, we're using this
            // kludge which assigns an extra property directly after
            // initialization (creating a single new object shape).

            function withHash(tree, hash) {
                if (hash) tree.contextHash = hash;
                return tree;
            } /// Tree buffers contain (type, start, end, endIndex) quads for each
            /// node. In such a buffer, nodes are stored in prefix order (parents
            /// before children, with the endIndex of the parent indicating which
            /// children belong to it)


            class TreeBuffer {
                /// Create a tree buffer @internal
                constructor( /// @internal
                    buffer, // The total length of the group of nodes in the buffer.
                    length, /// @internal
                    set, type = NodeType.none) {
                    this.buffer = buffer;
                    this.length = length;
                    this.set = set;
                    this.type = type;
                } /// @internal


                toString() {
                    let result = [];

                    for (let index = 0; index < this.buffer.length;) {
                        result.push(this.childString(index));
                        index = this.buffer[index + 3];
                    }

                    return result.join(",");
                } /// @internal


                childString(index) {
                    let id = this.buffer[index],
                        endIndex = this.buffer[index + 3];
                    let type = this.set.types[id],
                        result = type.name;
                    if (/\W/.test(result) && !type.isError) result = JSON.stringify(result);
                    index += 4;
                    if (endIndex == index) return result;
                    let children = [];

                    while (index < endIndex) {
                        children.push(this.childString(index));
                        index = this.buffer[index + 3];
                    }

                    return result + "(" + children.join(",") + ")";
                } /// @internal


                findChild(startIndex, endIndex, dir, after) {
                    let {
                        buffer
                    } = this,
                        pick = -1;

                    for (let i = startIndex; i != endIndex; i = buffer[i + 3]) {
                        if (after != -100000000
                            /* None */
                        ) {
                            let start = buffer[i + 1],
                                end = buffer[i + 2];

                            if (dir > 0) {
                                if (end > after) pick = i;
                                if (end > after) break;
                            } else {
                                if (start < after) pick = i;
                                if (end >= after) break;
                            }
                        } else {
                            pick = i;
                            if (dir > 0) break;
                        }
                    }

                    return pick;
                }

            }

            exports.TreeBuffer = TreeBuffer;

            class TreeNode {
                constructor(node, from, index, _parent) {
                    this.node = node;
                    this.from = from;
                    this.index = index;
                    this._parent = _parent;
                }

                get type() {
                    return this.node.type;
                }

                get name() {
                    return this.node.type.name;
                }

                get to() {
                    return this.from + this.node.length;
                }

                nextChild(i, dir, after, full = false) {
                    for (let parent = this; ;) {
                        for (let {
                            children,
                            positions
                        } = parent.node, e = dir > 0 ? children.length : -1; i != e; i += dir) {
                            let next = children[i],
                                start = positions[i] + parent.from;
                            if (after != -100000000
                                /* None */
                                && (dir < 0 ? start >= after : start + next.length <= after)) continue;

                            if (next instanceof TreeBuffer) {
                                let index = next.findChild(0, next.buffer.length, dir, after == -100000000
                                    /* None */
                                    ? -100000000
                                    /* None */
                                    : after - start);
                                if (index > -1) return new BufferNode(new BufferContext(parent, next, i, start), null, index);
                            } else if (full || !next.type.isAnonymous || hasChild(next)) {
                                let inner = new TreeNode(next, start, i, parent);
                                return full || !inner.type.isAnonymous ? inner : inner.nextChild(dir < 0 ? next.children.length - 1 : 0, dir, after);
                            }
                        }

                        if (full || !parent.type.isAnonymous) return null;
                        i = parent.index + dir;
                        parent = parent._parent;
                        if (!parent) return null;
                    }
                }

                get firstChild() {
                    return this.nextChild(0, 1, -100000000
                        /* None */
                    );
                }

                get lastChild() {
                    return this.nextChild(this.node.children.length - 1, -1, -100000000
                        /* None */
                    );
                }

                childAfter(pos) {
                    return this.nextChild(0, 1, pos);
                }

                childBefore(pos) {
                    return this.nextChild(this.node.children.length - 1, -1, pos);
                }

                nextSignificantParent() {
                    let val = this;

                    while (val.type.isAnonymous && val._parent) val = val._parent;

                    return val;
                }

                get parent() {
                    return this._parent ? this._parent.nextSignificantParent() : null;
                }

                get nextSibling() {
                    return this._parent ? this._parent.nextChild(this.index + 1, 1, -1) : null;
                }

                get prevSibling() {
                    return this._parent ? this._parent.nextChild(this.index - 1, -1, -1) : null;
                }

                get cursor() {
                    return new TreeCursor(this);
                }

                resolve(pos, side = 0) {
                    return this.cursor.moveTo(pos, side).node;
                }

                getChild(type, before = null, after = null) {
                    let r = getChildren(this, type, before, after);
                    return r.length ? r[0] : null;
                }

                getChildren(type, before = null, after = null) {
                    return getChildren(this, type, before, after);
                } /// @internal


                toString() {
                    return this.node.toString();
                }

            }

            function getChildren(node, type, before, after) {
                let cur = node.cursor,
                    result = [];
                if (!cur.firstChild()) return result;
                if (before != null) while (!cur.type.is(before)) if (!cur.nextSibling()) return result;

                for (; ;) {
                    if (after != null && cur.type.is(after)) return result;
                    if (cur.type.is(type)) result.push(cur.node);
                    if (!cur.nextSibling()) return after == null ? result : [];
                }
            }

            class BufferContext {
                constructor(parent, buffer, index, start) {
                    this.parent = parent;
                    this.buffer = buffer;
                    this.index = index;
                    this.start = start;
                }

            }

            class BufferNode {
                constructor(context, _parent, index) {
                    this.context = context;
                    this._parent = _parent;
                    this.index = index;
                    this.type = context.buffer.set.types[context.buffer.buffer[index]];
                }

                get name() {
                    return this.type.name;
                }

                get from() {
                    return this.context.start + this.context.buffer.buffer[this.index + 1];
                }

                get to() {
                    return this.context.start + this.context.buffer.buffer[this.index + 2];
                }

                child(dir, after) {
                    let {
                        buffer
                    } = this.context;
                    let index = buffer.findChild(this.index + 4, buffer.buffer[this.index + 3], dir, after == -100000000
                        /* None */
                        ? -100000000
                        /* None */
                        : after - this.context.start);
                    return index < 0 ? null : new BufferNode(this.context, this, index);
                }

                get firstChild() {
                    return this.child(1, -100000000
                        /* None */
                    );
                }

                get lastChild() {
                    return this.child(-1, -100000000
                        /* None */
                    );
                }

                childAfter(pos) {
                    return this.child(1, pos);
                }

                childBefore(pos) {
                    return this.child(-1, pos);
                }

                get parent() {
                    return this._parent || this.context.parent.nextSignificantParent();
                }

                externalSibling(dir) {
                    return this._parent ? null : this.context.parent.nextChild(this.context.index + dir, dir, -1);
                }

                get nextSibling() {
                    let {
                        buffer
                    } = this.context;
                    let after = buffer.buffer[this.index + 3];
                    if (after < (this._parent ? buffer.buffer[this._parent.index + 3] : buffer.buffer.length)) return new BufferNode(this.context, this._parent, after);
                    return this.externalSibling(1);
                }

                get prevSibling() {
                    let {
                        buffer
                    } = this.context;
                    let parentStart = this._parent ? this._parent.index + 4 : 0;
                    if (this.index == parentStart) return this.externalSibling(-1);
                    return new BufferNode(this.context, this._parent, buffer.findChild(parentStart, this.index, -1, -100000000
                        /* None */
                    ));
                }

                get cursor() {
                    return new TreeCursor(this);
                }

                resolve(pos, side = 0) {
                    return this.cursor.moveTo(pos, side).node;
                } /// @internal


                toString() {
                    return this.context.buffer.childString(this.index);
                }

                getChild(type, before = null, after = null) {
                    let r = getChildren(this, type, before, after);
                    return r.length ? r[0] : null;
                }

                getChildren(type, before = null, after = null) {
                    return getChildren(this, type, before, after);
                }

            } /// A tree cursor object focuses on a given node in a syntax tree, and
            /// allows you to move to adjacent nodes.


            class TreeCursor {
                /// @internal
                constructor(node, full = false) {
                    this.full = full;
                    this.buffer = null;
                    this.stack = [];
                    this.index = 0;
                    this.bufferNode = null;

                    if (node instanceof TreeNode) {
                        this.yieldNode(node);
                    } else {
                        this._tree = node.context.parent;
                        this.buffer = node.context;

                        for (let n = node._parent; n; n = n._parent) this.stack.unshift(n.index);

                        this.bufferNode = node;
                        this.yieldBuf(node.index);
                    }
                } /// Shorthand for `.type.name`.


                get name() {
                    return this.type.name;
                }

                yieldNode(node) {
                    if (!node) return false;
                    this._tree = node;
                    this.type = node.type;
                    this.from = node.from;
                    this.to = node.to;
                    return true;
                }

                yieldBuf(index, type) {
                    this.index = index;
                    let {
                        start,
                        buffer
                    } = this.buffer;
                    this.type = type || buffer.set.types[buffer.buffer[index]];
                    this.from = start + buffer.buffer[index + 1];
                    this.to = start + buffer.buffer[index + 2];
                    return true;
                }

                yield(node) {
                    if (!node) return false;

                    if (node instanceof TreeNode) {
                        this.buffer = null;
                        return this.yieldNode(node);
                    }

                    this.buffer = node.context;
                    return this.yieldBuf(node.index, node.type);
                } /// @internal


                toString() {
                    return this.buffer ? this.buffer.buffer.childString(this.index) : this._tree.toString();
                } /// @internal


                enter(dir, after) {
                    if (!this.buffer) return this.yield(this._tree.nextChild(dir < 0 ? this._tree.node.children.length - 1 : 0, dir, after, this.full));
                    let {
                        buffer
                    } = this.buffer;
                    let index = buffer.findChild(this.index + 4, buffer.buffer[this.index + 3], dir, after == -100000000
                        /* None */
                        ? -100000000
                        /* None */
                        : after - this.buffer.start);
                    if (index < 0) return false;
                    this.stack.push(this.index);
                    return this.yieldBuf(index);
                } /// Move the cursor to this node's first child. When this returns
                /// false, the node has no child, and the cursor has not been moved.


                firstChild() {
                    return this.enter(1, -100000000
                        /* None */
                    );
                } /// Move the cursor to this node's last child.


                lastChild() {
                    return this.enter(-1, -100000000
                        /* None */
                    );
                } /// Move the cursor to the first child that starts at or after `pos`.


                childAfter(pos) {
                    return this.enter(1, pos);
                } /// Move to the last child that ends at or before `pos`.


                childBefore(pos) {
                    return this.enter(-1, pos);
                } /// Move the node's parent node, if this isn't the top node.


                parent() {
                    if (!this.buffer) return this.yieldNode(this.full ? this._tree._parent : this._tree.parent);
                    if (this.stack.length) return this.yieldBuf(this.stack.pop());
                    let parent = this.full ? this.buffer.parent : this.buffer.parent.nextSignificantParent();
                    this.buffer = null;
                    return this.yieldNode(parent);
                } /// @internal


                sibling(dir) {
                    if (!this.buffer) return !this._tree._parent ? false : this.yield(this._tree._parent.nextChild(this._tree.index + dir, dir, -100000000
                        /* None */
                        , this.full));
                    let {
                        buffer
                    } = this.buffer,
                        d = this.stack.length - 1;

                    if (dir < 0) {
                        let parentStart = d < 0 ? 0 : this.stack[d] + 4;
                        if (this.index != parentStart) return this.yieldBuf(buffer.findChild(parentStart, this.index, -1, -100000000
                            /* None */
                        ));
                    } else {
                        let after = buffer.buffer[this.index + 3];
                        if (after < (d < 0 ? buffer.buffer.length : buffer.buffer[this.stack[d] + 3])) return this.yieldBuf(after);
                    }

                    return d < 0 ? this.yield(this.buffer.parent.nextChild(this.buffer.index + dir, dir, -100000000
                        /* None */
                        , this.full)) : false;
                } /// Move to this node's next sibling, if any.


                nextSibling() {
                    return this.sibling(1);
                } /// Move to this node's previous sibling, if any.


                prevSibling() {
                    return this.sibling(-1);
                }

                atLastNode(dir) {
                    let index,
                        parent,
                        {
                            buffer
                        } = this;

                    if (buffer) {
                        if (dir > 0) {
                            if (this.index < buffer.buffer.buffer.length) return false;
                        } else {
                            for (let i = 0; i < this.index; i++) if (buffer.buffer.buffer[i + 3] < this.index) return false;
                        }

                        ({
                            index,
                            parent
                        } = buffer);
                    } else {
                        ({
                            index,
                            _parent: parent
                        } = this._tree);
                    }

                    for (; parent; ({
                        index,
                        _parent: parent
                    } = parent)) {
                        for (let i = index + dir, e = dir < 0 ? -1 : parent.node.children.length; i != e; i += dir) {
                            let child = parent.node.children[i];
                            if (this.full || !child.type.isAnonymous || child instanceof TreeBuffer || hasChild(child)) return false;
                        }
                    }

                    return true;
                }

                move(dir) {
                    if (this.enter(dir, -100000000
                        /* None */
                    )) return true;

                    for (; ;) {
                        if (this.sibling(dir)) return true;
                        if (this.atLastNode(dir) || !this.parent()) return false;
                    }
                } /// Move to the next node in a
                /// [pre-order](https://en.wikipedia.org/wiki/Tree_traversal#Pre-order_(NLR))
                /// traversal, going from a node to its first child or, if the
                /// current node is empty, its next sibling or the next sibling of
                /// the first parent node that has one.


                next() {
                    return this.move(1);
                } /// Move to the next node in a last-to-first pre-order traveral. A
                /// node is followed by ist last child or, if it has none, its
                /// previous sibling or the previous sibling of the first parent
                /// node that has one.


                prev() {
                    return this.move(-1);
                } /// Move the cursor to the innermost node that covers `pos`. If
                /// `side` is -1, it will enter nodes that end at `pos`. If it is 1,
                /// it will enter nodes that start at `pos`.


                moveTo(pos, side = 0) {
                    // Move up to a node that actually holds the position, if possible
                    while (this.from == this.to || (side < 1 ? this.from >= pos : this.from > pos) || (side > -1 ? this.to <= pos : this.to < pos)) if (!this.parent()) break; // Then scan down into child nodes as far as possible


                    for (; ;) {
                        if (side < 0 ? !this.childBefore(pos) : !this.childAfter(pos)) break;

                        if (this.from == this.to || (side < 1 ? this.from >= pos : this.from > pos) || (side > -1 ? this.to <= pos : this.to < pos)) {
                            this.parent();
                            break;
                        }
                    }

                    return this;
                } /// Get a [syntax node](#tree.SyntaxNode) at the cursor's current
                /// position.


                get node() {
                    if (!this.buffer) return this._tree;
                    let cache = this.bufferNode,
                        result = null,
                        depth = 0;

                    if (cache && cache.context == this.buffer) {
                        scan: for (let index = this.index, d = this.stack.length; d >= 0;) {
                            for (let c = cache; c; c = c._parent) if (c.index == index) {
                                if (index == this.index) return c;
                                result = c;
                                depth = d + 1;
                                break scan;
                            }

                            index = this.stack[--d];
                        }
                    }

                    for (let i = depth; i < this.stack.length; i++) result = new BufferNode(this.buffer, result, this.stack[i]);

                    return this.bufferNode = new BufferNode(this.buffer, result, this.index);
                } /// Get the [tree](#tree.Tree) that represents the current node, if
                /// any. Will return null when the node is in a [tree
                /// buffer](#tree.TreeBuffer).


                get tree() {
                    return this.buffer ? null : this._tree.node;
                }

            }

            exports.TreeCursor = TreeCursor;

            function hasChild(tree) {
                return tree.children.some(ch => !ch.type.isAnonymous || ch instanceof TreeBuffer || hasChild(ch));
            }

            class FlatBufferCursor {
                constructor(buffer, index) {
                    this.buffer = buffer;
                    this.index = index;
                }

                get id() {
                    return this.buffer[this.index - 4];
                }

                get start() {
                    return this.buffer[this.index - 3];
                }

                get end() {
                    return this.buffer[this.index - 2];
                }

                get size() {
                    return this.buffer[this.index - 1];
                }

                get pos() {
                    return this.index;
                }

                next() {
                    this.index -= 4;
                }

                fork() {
                    return new FlatBufferCursor(this.buffer, this.index);
                }

            }

            const BalanceBranchFactor = 8;

            function buildTree(data) {
                var _a;

                let {
                    buffer,
                    nodeSet,
                    topID = 0,
                    maxBufferLength = DefaultBufferLength,
                    reused = [],
                    minRepeatType = nodeSet.types.length
                } = data;
                let cursor = Array.isArray(buffer) ? new FlatBufferCursor(buffer, buffer.length) : buffer;
                let types = nodeSet.types;
                let contextHash = 0;

                function takeNode(parentStart, minPos, children, positions, inRepeat) {
                    let {
                        id,
                        start,
                        end,
                        size
                    } = cursor;
                    let startPos = start - parentStart;

                    if (size < 0) {
                        if (size == -1) {
                            // Reused node
                            children.push(reused[id]);
                            positions.push(startPos);
                        } else {
                            // Context change
                            contextHash = id;
                        }

                        cursor.next();
                        return;
                    }

                    let type = types[id],
                        node,
                        buffer;

                    if (end - start <= maxBufferLength && (buffer = findBufferSize(cursor.pos - minPos, inRepeat))) {
                        // Small enough for a buffer, and no reused nodes inside
                        let data = new Uint16Array(buffer.size - buffer.skip);
                        let endPos = cursor.pos - buffer.size,
                            index = data.length;

                        while (cursor.pos > endPos) index = copyToBuffer(buffer.start, data, index, inRepeat);

                        node = new TreeBuffer(data, end - buffer.start, nodeSet, inRepeat < 0 ? NodeType.none : types[inRepeat]);
                        startPos = buffer.start - parentStart;
                    } else {
                        // Make it a node
                        let endPos = cursor.pos - size;
                        cursor.next();
                        let localChildren = [],
                            localPositions = [];
                        let localInRepeat = id >= minRepeatType ? id : -1;

                        while (cursor.pos > endPos) {
                            if (cursor.id == localInRepeat) cursor.next(); else takeNode(start, endPos, localChildren, localPositions, localInRepeat);
                        }

                        localChildren.reverse();
                        localPositions.reverse();
                        if (localInRepeat > -1 && localChildren.length > BalanceBranchFactor) node = balanceRange(type, type, localChildren, localPositions, 0, localChildren.length, 0, maxBufferLength, end - start, contextHash); else node = withHash(new Tree(type, localChildren, localPositions, end - start), contextHash);
                    }

                    children.push(node);
                    positions.push(startPos);
                }

                function findBufferSize(maxSize, inRepeat) {
                    // Scan through the buffer to find previous siblings that fit
                    // together in a TreeBuffer, and don't contain any reused nodes
                    // (which can't be stored in a buffer).
                    // If `inRepeat` is > -1, ignore node boundaries of that type for
                    // nesting, but make sure the end falls either at the start
                    // (`maxSize`) or before such a node.
                    let fork = cursor.fork();
                    let size = 0,
                        start = 0,
                        skip = 0,
                        minStart = fork.end - maxBufferLength;
                    let result = {
                        size: 0,
                        start: 0,
                        skip: 0
                    };

                    scan: for (let minPos = fork.pos - maxSize; fork.pos > minPos;) {
                        // Pretend nested repeat nodes of the same type don't exist
                        if (fork.id == inRepeat) {
                            // Except that we store the current state as a valid return
                            // value.
                            result.size = size;
                            result.start = start;
                            result.skip = skip;
                            skip += 4;
                            size += 4;
                            fork.next();
                            continue;
                        }

                        let nodeSize = fork.size,
                            startPos = fork.pos - nodeSize;
                        if (nodeSize < 0 || startPos < minPos || fork.start < minStart) break;
                        let localSkipped = fork.id >= minRepeatType ? 4 : 0;
                        let nodeStart = fork.start;
                        fork.next();

                        while (fork.pos > startPos) {
                            if (fork.size < 0) break scan;
                            if (fork.id >= minRepeatType) localSkipped += 4;
                            fork.next();
                        }

                        start = nodeStart;
                        size += nodeSize;
                        skip += localSkipped;
                    }

                    if (inRepeat < 0 || size == maxSize) {
                        result.size = size;
                        result.start = start;
                        result.skip = skip;
                    }

                    return result.size > 4 ? result : undefined;
                }

                function copyToBuffer(bufferStart, buffer, index, inRepeat) {
                    let {
                        id,
                        start,
                        end,
                        size
                    } = cursor;
                    cursor.next();
                    if (id == inRepeat) return index;
                    let startIndex = index;

                    if (size > 4) {
                        let endPos = cursor.pos - (size - 4);

                        while (cursor.pos > endPos) index = copyToBuffer(bufferStart, buffer, index, inRepeat);
                    }

                    if (id < minRepeatType) {
                        // Don't copy repeat nodes into buffers
                        buffer[--index] = startIndex;
                        buffer[--index] = end - bufferStart;
                        buffer[--index] = start - bufferStart;
                        buffer[--index] = id;
                    }

                    return index;
                }

                let children = [],
                    positions = [];

                while (cursor.pos > 0) takeNode(data.start || 0, 0, children, positions, -1);

                let length = (_a = data.length) !== null && _a !== void 0 ? _a : children.length ? positions[0] + children[0].length : 0;
                return new Tree(types[topID], children.reverse(), positions.reverse(), length);
            }

            function balanceRange(outerType, innerType, children, positions, from, to, start, maxBufferLength, length, contextHash) {
                let localChildren = [],
                    localPositions = [];

                if (length <= maxBufferLength) {
                    for (let i = from; i < to; i++) {
                        localChildren.push(children[i]);
                        localPositions.push(positions[i] - start);
                    }
                } else {
                    let maxChild = Math.max(maxBufferLength, Math.ceil(length * 1.5 / BalanceBranchFactor));

                    for (let i = from; i < to;) {
                        let groupFrom = i,
                            groupStart = positions[i];
                        i++;

                        for (; i < to; i++) {
                            let nextEnd = positions[i] + children[i].length;
                            if (nextEnd - groupStart > maxChild) break;
                        }

                        if (i == groupFrom + 1) {
                            let only = children[groupFrom];

                            if (only instanceof Tree && only.type == innerType && only.length > maxChild << 1) {
                                // Too big, collapse
                                for (let j = 0; j < only.children.length; j++) {
                                    localChildren.push(only.children[j]);
                                    localPositions.push(only.positions[j] + groupStart - start);
                                }

                                continue;
                            }

                            localChildren.push(only);
                        } else if (i == groupFrom + 1) {
                            localChildren.push(children[groupFrom]);
                        } else {
                            let inner = balanceRange(innerType, innerType, children, positions, groupFrom, i, groupStart, maxBufferLength, positions[i - 1] + children[i - 1].length - groupStart, contextHash);
                            if (innerType != NodeType.none && !containsType(inner.children, innerType)) inner = withHash(new Tree(NodeType.none, inner.children, inner.positions, inner.length), contextHash);
                            localChildren.push(inner);
                        }

                        localPositions.push(groupStart - start);
                    }
                }

                return withHash(new Tree(outerType, localChildren, localPositions, length), contextHash);
            }

            function containsType(nodes, type) {
                for (let elt of nodes) if (elt.type == type) return true;

                return false;
            } /// Tree fragments are used during [incremental
            /// parsing](#lezer.ParseOptions.fragments) to track parts of old
            /// trees that can be reused in a new parse. An array of fragments is
            /// used to track regions of an old tree whose nodes might be reused
            /// in new parses. Use the static
            /// [`applyChanges`](#tree.TreeFragment^applyChanges) method to update
            /// fragments for document changes.


            class TreeFragment {
                constructor( /// The start of the unchanged range pointed to by this fragment.
                    /// This refers to an offset in the _updated_ document (as opposed
                    /// to the original tree).
                    from, /// The end of the unchanged range.
                    to, /// The tree that this fragment is based on.
                    tree, /// The offset between the fragment's tree and the document that
                    /// this fragment can be used against. Add this when going from
                    /// document to tree positions, subtract it to go from tree to
                    /// document positions.
                    offset, open) {
                    this.from = from;
                    this.to = to;
                    this.tree = tree;
                    this.offset = offset;
                    this.open = open;
                }

                get openStart() {
                    return (this.open & 1
                        /* Start */
                    ) > 0;
                }

                get openEnd() {
                    return (this.open & 2
                        /* End */
                    ) > 0;
                } /// Apply a set of edits to an array of fragments, removing or
                /// splitting fragments as necessary to remove edited ranges, and
                /// adjusting offsets for fragments that moved.


                static applyChanges(fragments, changes, minGap = 128) {
                    if (!changes.length) return fragments;
                    let result = [];
                    let fI = 1,
                        nextF = fragments.length ? fragments[0] : null;
                    let cI = 0,
                        pos = 0,
                        off = 0;

                    for (; ;) {
                        let nextC = cI < changes.length ? changes[cI++] : null;
                        let nextPos = nextC ? nextC.fromA : 1e9;
                        if (nextPos - pos >= minGap) while (nextF && nextF.from < nextPos) {
                            let cut = nextF;

                            if (pos >= cut.from || nextPos <= cut.to || off) {
                                let fFrom = Math.max(cut.from, pos) - off,
                                    fTo = Math.min(cut.to, nextPos) - off;
                                cut = fFrom >= fTo ? null : new TreeFragment(fFrom, fTo, cut.tree, cut.offset + off, (cI > 0 ? 1
                                    /* Start */
                                    : 0) | (nextC ? 2
                                        /* End */
                                        : 0));
                            }

                            if (cut) result.push(cut);
                            if (nextF.to > nextPos) break;
                            nextF = fI < fragments.length ? fragments[fI++] : null;
                        }
                        if (!nextC) break;
                        pos = nextC.toA;
                        off = nextC.toA - nextC.toB;
                    }

                    return result;
                } /// Create a set of fragments from a freshly parsed tree, or update
                /// an existing set of fragments by replacing the ones that overlap
                /// with a tree with content from the new tree. When `partial` is
                /// true, the parse is treated as incomplete, and the token at its
                /// end is not included in [`safeTo`](#tree.TreeFragment.safeTo).


                static addTree(tree, fragments = [], partial = false) {
                    let result = [new TreeFragment(0, tree.length, tree, 0, partial ? 2
                        /* End */
                        : 0)];

                    for (let f of fragments) if (f.to > tree.length) result.push(f);

                    return result;
                }

            } // Creates an `Input` that is backed by a single, flat string.


            exports.TreeFragment = TreeFragment;

            function stringInput(input) {
                return new StringInput(input);
            }

            class StringInput {
                constructor(string, length = string.length) {
                    this.string = string;
                    this.length = length;
                }

                get(pos) {
                    return pos < 0 || pos >= this.length ? -1 : this.string.charCodeAt(pos);
                }

                lineAfter(pos) {
                    if (pos < 0) return "";
                    let end = this.string.indexOf("\n", pos);
                    return this.string.slice(pos, end < 0 ? this.length : Math.min(end, this.length));
                }

                read(from, to) {
                    return this.string.slice(from, Math.min(this.length, to));
                }

                clip(at) {
                    return new StringInput(this.string, at);
                }

            }

        }, {}], 3: [function (require, module, exports) {
            (function (process) {
                (function () {
                    "use strict";

                    Object.defineProperty(exports, "__esModule", {
                        value: true
                    });
                    Object.defineProperty(exports, "NodeProp", {
                        enumerable: true,
                        get: function () {
                            return _lezerTree.NodeProp;
                        }
                    });
                    Object.defineProperty(exports, "NodeSet", {
                        enumerable: true,
                        get: function () {
                            return _lezerTree.NodeSet;
                        }
                    });
                    Object.defineProperty(exports, "NodeType", {
                        enumerable: true,
                        get: function () {
                            return _lezerTree.NodeType;
                        }
                    });
                    Object.defineProperty(exports, "Tree", {
                        enumerable: true,
                        get: function () {
                            return _lezerTree.Tree;
                        }
                    });
                    Object.defineProperty(exports, "TreeCursor", {
                        enumerable: true,
                        get: function () {
                            return _lezerTree.TreeCursor;
                        }
                    });
                    exports.Token = exports.Stack = exports.Parser = exports.ExternalTokenizer = exports.ContextTracker = void 0;

                    var _lezerTree = require("lezer-tree");

                    /// A parse stack. These are used internally by the parser to track
                    /// parsing progress. They also provide some properties and methods
                    /// that external code such as a tokenizer can use to get information
                    /// about the parse state.
                    class Stack {
                        /// @internal
                        constructor( /// A the parse that this stack is part of @internal
                            p, /// Holds state, pos, value stack pos (15 bits array index, 15 bits
                            /// buffer index) triplets for all but the top state
                            /// @internal
                            stack, /// The current parse state @internal
                            state, // The position at which the next reduce should take place. This
                            // can be less than `this.pos` when skipped expressions have been
                            // added to the stack (which should be moved outside of the next
                            // reduction)
                            /// @internal
                            reducePos, /// The input position up to which this stack has parsed.
                            pos, /// The dynamic score of the stack, including dynamic precedence
                            /// and error-recovery penalties
                            /// @internal
                            score, // The output buffer. Holds (type, start, end, size) quads
                            // representing nodes created by the parser, where `size` is
                            // amount of buffer array entries covered by this node.
                            /// @internal
                            buffer, // The base offset of the buffer. When stacks are split, the split
                            // instance shared the buffer history with its parent up to
                            // `bufferBase`, which is the absolute offset (including the
                            // offset of previous splits) into the buffer at which this stack
                            // starts writing.
                            /// @internal
                            bufferBase, /// @internal
                            curContext, // A parent stack from which this was split off, if any. This is
                            // set up so that it always points to a stack that has some
                            // additional buffer content, never to a stack with an equal
                            // `bufferBase`.
                            /// @internal
                            parent) {
                            this.p = p;
                            this.stack = stack;
                            this.state = state;
                            this.reducePos = reducePos;
                            this.pos = pos;
                            this.score = score;
                            this.buffer = buffer;
                            this.bufferBase = bufferBase;
                            this.curContext = curContext;
                            this.parent = parent;
                        } /// @internal


                        toString() {
                            return `[${this.stack.filter((_, i) => i % 3 == 0).concat(this.state)}]@${this.pos}${this.score ? "!" + this.score : ""}`;
                        } // Start an empty stack
                        /// @internal


                        static start(p, state, pos = 0) {
                            let cx = p.parser.context;
                            return new Stack(p, [], state, pos, pos, 0, [], 0, cx ? new StackContext(cx, cx.start) : null, null);
                        } /// The stack's current [context](#lezer.ContextTracker) value, if
                        /// any. Its type will depend on the context tracker's type
                        /// parameter, or it will be `null` if there is no context
                        /// tracker.


                        get context() {
                            return this.curContext ? this.curContext.context : null;
                        } // Push a state onto the stack, tracking its start position as well
                        // as the buffer base at that point.
                        /// @internal


                        pushState(state, start) {
                            this.stack.push(this.state, start, this.bufferBase + this.buffer.length);
                            this.state = state;
                        } // Apply a reduce action
                        /// @internal


                        reduce(action) {
                            let depth = action >> 19
                                /* ReduceDepthShift */
                                ,
                                type = action & 65535
                                /* ValueMask */
                                ;
                            let {
                                parser
                            } = this.p;
                            let dPrec = parser.dynamicPrecedence(type);
                            if (dPrec) this.score += dPrec;

                            if (depth == 0) {
                                // Zero-depth reductions are a special caseÔÇöthey add stuff to
                                // the stack without popping anything off.
                                if (type < parser.minRepeatTerm) this.storeNode(type, this.reducePos, this.reducePos, 4, true);
                                this.pushState(parser.getGoto(this.state, type, true), this.reducePos);
                                this.reduceContext(type);
                                return;
                            } // Find the base index into `this.stack`, content after which will
                            // be dropped. Note that with `StayFlag` reductions we need to
                            // consume two extra frames (the dummy parent node for the skipped
                            // expression and the state that we'll be staying in, which should
                            // be moved to `this.state`).


                            let base = this.stack.length - (depth - 1) * 3 - (action & 262144
                                /* StayFlag */
                                ? 6 : 0);
                            let start = this.stack[base - 2];
                            let bufferBase = this.stack[base - 1],
                                count = this.bufferBase + this.buffer.length - bufferBase; // Store normal terms or `R -> R R` repeat reductions

                            if (type < parser.minRepeatTerm || action & 131072
                                /* RepeatFlag */
                            ) {
                                let pos = parser.stateFlag(this.state, 1
                                    /* Skipped */
                                ) ? this.pos : this.reducePos;
                                this.storeNode(type, start, pos, count + 4, true);
                            }

                            if (action & 262144
                                /* StayFlag */
                            ) {
                                this.state = this.stack[base];
                            } else {
                                let baseStateID = this.stack[base - 3];
                                this.state = parser.getGoto(baseStateID, type, true);
                            }

                            while (this.stack.length > base) this.stack.pop();

                            this.reduceContext(type);
                        } // Shift a value into the buffer
                        /// @internal


                        storeNode(term, start, end, size = 4, isReduce = false) {
                            if (term == 0
                                /* Err */
                            ) {
                                // Try to omit/merge adjacent error nodes
                                let cur = this,
                                    top = this.buffer.length;

                                if (top == 0 && cur.parent) {
                                    top = cur.bufferBase - cur.parent.bufferBase;
                                    cur = cur.parent;
                                }

                                if (top > 0 && cur.buffer[top - 4] == 0
                                    /* Err */
                                    && cur.buffer[top - 1] > -1) {
                                    if (start == end) return;

                                    if (cur.buffer[top - 2] >= start) {
                                        cur.buffer[top - 2] = end;
                                        return;
                                    }
                                }
                            }

                            if (!isReduce || this.pos == end) {
                                // Simple case, just append
                                this.buffer.push(term, start, end, size);
                            } else {
                                // There may be skipped nodes that have to be moved forward
                                let index = this.buffer.length;
                                if (index > 0 && this.buffer[index - 4] != 0
                                    /* Err */
                                ) while (index > 0 && this.buffer[index - 2] > end) {
                                    // Move this record forward
                                    this.buffer[index] = this.buffer[index - 4];
                                    this.buffer[index + 1] = this.buffer[index - 3];
                                    this.buffer[index + 2] = this.buffer[index - 2];
                                    this.buffer[index + 3] = this.buffer[index - 1];
                                    index -= 4;
                                    if (size > 4) size -= 4;
                                }
                                this.buffer[index] = term;
                                this.buffer[index + 1] = start;
                                this.buffer[index + 2] = end;
                                this.buffer[index + 3] = size;
                            }
                        } // Apply a shift action
                        /// @internal


                        shift(action, next, nextEnd) {
                            if (action & 131072
                                /* GotoFlag */
                            ) {
                                this.pushState(action & 65535
                                    /* ValueMask */
                                    , this.pos);
                            } else if ((action & 262144
                                /* StayFlag */
                            ) == 0) {
                                // Regular shift
                                let start = this.pos,
                                    nextState = action,
                                    {
                                        parser
                                    } = this.p;

                                if (nextEnd > this.pos || next <= parser.maxNode) {
                                    this.pos = nextEnd;
                                    if (!parser.stateFlag(nextState, 1
                                        /* Skipped */
                                    )) this.reducePos = nextEnd;
                                }

                                this.pushState(nextState, start);
                                if (next <= parser.maxNode) this.buffer.push(next, start, nextEnd, 4);
                                this.shiftContext(next);
                            } else {
                                // Shift-and-stay, which means this is a skipped token
                                if (next <= this.p.parser.maxNode) this.buffer.push(next, this.pos, nextEnd, 4);
                                this.pos = nextEnd;
                            }
                        } // Apply an action
                        /// @internal


                        apply(action, next, nextEnd) {
                            if (action & 65536
                                /* ReduceFlag */
                            ) this.reduce(action); else this.shift(action, next, nextEnd);
                        } // Add a prebuilt node into the buffer. This may be a reused node or
                        // the result of running a nested parser.
                        /// @internal


                        useNode(value, next) {
                            let index = this.p.reused.length - 1;

                            if (index < 0 || this.p.reused[index] != value) {
                                this.p.reused.push(value);
                                index++;
                            }

                            let start = this.pos;
                            this.reducePos = this.pos = start + value.length;
                            this.pushState(next, start);
                            this.buffer.push(index, start, this.reducePos, -1
                                /* size < 0 means this is a reused value */
                            );
                            if (this.curContext) this.updateContext(this.curContext.tracker.reuse(this.curContext.context, value, this.p.input, this));
                        } // Split the stack. Due to the buffer sharing and the fact
                        // that `this.stack` tends to stay quite shallow, this isn't very
                        // expensive.
                        /// @internal


                        split() {
                            let parent = this;
                            let off = parent.buffer.length; // Because the top of the buffer (after this.pos) may be mutated
                            // to reorder reductions and skipped tokens, and shared buffers
                            // should be immutable, this copies any outstanding skipped tokens
                            // to the new buffer, and puts the base pointer before them.

                            while (off > 0 && parent.buffer[off - 2] > parent.reducePos) off -= 4;

                            let buffer = parent.buffer.slice(off),
                                base = parent.bufferBase + off; // Make sure parent points to an actual parent with content, if there is such a parent.

                            while (parent && base == parent.bufferBase) parent = parent.parent;

                            return new Stack(this.p, this.stack.slice(), this.state, this.reducePos, this.pos, this.score, buffer, base, this.curContext, parent);
                        } // Try to recover from an error by 'deleting' (ignoring) one token.
                        /// @internal


                        recoverByDelete(next, nextEnd) {
                            let isNode = next <= this.p.parser.maxNode;
                            if (isNode) this.storeNode(next, this.pos, nextEnd);
                            this.storeNode(0
                                /* Err */
                                , this.pos, nextEnd, isNode ? 8 : 4);
                            this.pos = this.reducePos = nextEnd;
                            this.score -= 200
                                /* Token */
                                ;
                        } /// Check if the given term would be able to be shifted (optionally
                        /// after some reductions) on this stack. This can be useful for
                        /// external tokenizers that want to make sure they only provide a
                        /// given token when it applies.


                        canShift(term) {
                            for (let sim = new SimulatedStack(this); ;) {
                                let action = this.p.parser.stateSlot(sim.top, 4
                                    /* DefaultReduce */
                                ) || this.p.parser.hasAction(sim.top, term);
                                if ((action & 65536
                                    /* ReduceFlag */
                                ) == 0) return true;
                                if (action == 0) return false;
                                sim.reduce(action);
                            }
                        } /// Find the start position of the rule that is currently being parsed.


                        get ruleStart() {
                            for (let state = this.state, base = this.stack.length; ;) {
                                let force = this.p.parser.stateSlot(state, 5
                                    /* ForcedReduce */
                                );
                                if (!(force & 65536
                                    /* ReduceFlag */
                                )) return 0;
                                base -= 3 * (force >> 19
                                    /* ReduceDepthShift */
                                );
                                if ((force & 65535
                                    /* ValueMask */
                                ) < this.p.parser.minRepeatTerm) return this.stack[base + 1];
                                state = this.stack[base];
                            }
                        } /// Find the start position of an instance of any of the given term
                        /// types, or return `null` when none of them are found.
                        ///
                        /// **Note:** this is only reliable when there is at least some
                        /// state that unambiguously matches the given rule on the stack.
                        /// I.e. if you have a grammar like this, where the difference
                        /// between `a` and `b` is only apparent at the third token:
                        ///
                        ///     a { b | c }
                        ///     b { "x" "y" "x" }
                        ///     c { "x" "y" "z" }
                        ///
                        /// Then a parse state after `"x"` will not reliably tell you that
                        /// `b` is on the stack. You _can_ pass `[b, c]` to reliably check
                        /// for either of those two rules (assuming that `a` isn't part of
                        /// some rule that includes other things starting with `"x"`).
                        ///
                        /// When `before` is given, this keeps scanning up the stack until
                        /// it finds a match that starts before that position.
                        ///
                        /// Note that you have to be careful when using this in tokenizers,
                        /// since it's relatively easy to introduce data dependencies that
                        /// break incremental parsing by using this method.


                        startOf(types, before) {
                            let state = this.state,
                                frame = this.stack.length,
                                {
                                    parser
                                } = this.p;

                            for (; ;) {
                                let force = parser.stateSlot(state, 5
                                    /* ForcedReduce */
                                );
                                let depth = force >> 19
                                    /* ReduceDepthShift */
                                    ,
                                    term = force & 65535
                                    /* ValueMask */
                                    ;

                                if (types.indexOf(term) > -1) {
                                    let base = frame - 3 * (force >> 19
                                        /* ReduceDepthShift */
                                    ),
                                        pos = this.stack[base + 1];
                                    if (before == null || before > pos) return pos;
                                }

                                if (frame == 0) return null;

                                if (depth == 0) {
                                    frame -= 3;
                                    state = this.stack[frame];
                                } else {
                                    frame -= 3 * (depth - 1);
                                    state = parser.getGoto(this.stack[frame - 3], term, true);
                                }
                            }
                        } // Apply up to Recover.MaxNext recovery actions that conceptually
                        // inserts some missing token or rule.
                        /// @internal


                        recoverByInsert(next) {
                            if (this.stack.length >= 300
                                /* MaxInsertStackDepth */
                            ) return [];
                            let nextStates = this.p.parser.nextStates(this.state);

                            if (nextStates.length > 4
                                /* MaxNext */
                                << 1 || this.stack.length >= 120
                                /* DampenInsertStackDepth */
                            ) {
                                let best = [];

                                for (let i = 0, s; i < nextStates.length; i += 2) {
                                    if ((s = nextStates[i + 1]) != this.state && this.p.parser.hasAction(s, next)) best.push(nextStates[i], s);
                                }

                                if (this.stack.length < 120
                                    /* DampenInsertStackDepth */
                                ) for (let i = 0; best.length < 4
                                    /* MaxNext */
                                    << 1 && i < nextStates.length; i += 2) {
                                        let s = nextStates[i + 1];
                                        if (!best.some((v, i) => i & 1 && v == s)) best.push(nextStates[i], s);
                                    }
                                nextStates = best;
                            }

                            let result = [];

                            for (let i = 0; i < nextStates.length && result.length < 4
                                /* MaxNext */
                                ; i += 2) {
                                let s = nextStates[i + 1];
                                if (s == this.state) continue;
                                let stack = this.split();
                                stack.storeNode(0
                                    /* Err */
                                    , stack.pos, stack.pos, 4, true);
                                stack.pushState(s, this.pos);
                                stack.shiftContext(nextStates[i]);
                                stack.score -= 200
                                    /* Token */
                                    ;
                                result.push(stack);
                            }

                            return result;
                        } // Force a reduce, if possible. Return false if that can't
                        // be done.
                        /// @internal


                        forceReduce() {
                            let reduce = this.p.parser.stateSlot(this.state, 5
                                /* ForcedReduce */
                            );
                            if ((reduce & 65536
                                /* ReduceFlag */
                            ) == 0) return false;

                            if (!this.p.parser.validAction(this.state, reduce)) {
                                this.storeNode(0
                                    /* Err */
                                    , this.reducePos, this.reducePos, 4, true);
                                this.score -= 100
                                    /* Reduce */
                                    ;
                            }

                            this.reduce(reduce);
                            return true;
                        } /// @internal


                        forceAll() {
                            while (!this.p.parser.stateFlag(this.state, 2
                                /* Accepting */
                            ) && this.forceReduce()) { }

                            return this;
                        } /// Check whether this state has no further actions (assumed to be a direct descendant of the
                        /// top state, since any other states must be able to continue
                        /// somehow). @internal


                        get deadEnd() {
                            if (this.stack.length != 3) return false;
                            let {
                                parser
                            } = this.p;
                            return parser.data[parser.stateSlot(this.state, 1
                                /* Actions */
                            )] == 65535
                                /* End */
                                && !parser.stateSlot(this.state, 4
                                    /* DefaultReduce */
                                );
                        } /// Restart the stack (put it back in its start state). Only safe
                        /// when this.stack.length == 3 (state is directly below the top
                        /// state). @internal


                        restart() {
                            this.state = this.stack[0];
                            this.stack.length = 0;
                        } /// @internal


                        sameState(other) {
                            if (this.state != other.state || this.stack.length != other.stack.length) return false;

                            for (let i = 0; i < this.stack.length; i += 3) if (this.stack[i] != other.stack[i]) return false;

                            return true;
                        } /// Get the parser used by this stack.


                        get parser() {
                            return this.p.parser;
                        } /// Test whether a given dialect (by numeric ID, as exported from
                        /// the terms file) is enabled.


                        dialectEnabled(dialectID) {
                            return this.p.parser.dialect.flags[dialectID];
                        }

                        shiftContext(term) {
                            if (this.curContext) this.updateContext(this.curContext.tracker.shift(this.curContext.context, term, this.p.input, this));
                        }

                        reduceContext(term) {
                            if (this.curContext) this.updateContext(this.curContext.tracker.reduce(this.curContext.context, term, this.p.input, this));
                        } /// @internal


                        emitContext() {
                            let cx = this.curContext;
                            if (!cx.tracker.strict) return;
                            let last = this.buffer.length - 1;
                            if (last < 0 || this.buffer[last] != -2) this.buffer.push(cx.hash, this.reducePos, this.reducePos, -2);
                        }

                        updateContext(context) {
                            if (context != this.curContext.context) {
                                let newCx = new StackContext(this.curContext.tracker, context);
                                if (newCx.hash != this.curContext.hash) this.emitContext();
                                this.curContext = newCx;
                            }
                        }

                    }

                    exports.Stack = Stack;

                    class StackContext {
                        constructor(tracker, context) {
                            this.tracker = tracker;
                            this.context = context;
                            this.hash = tracker.hash(context);
                        }

                    }

                    var Recover;

                    (function (Recover) {
                        Recover[Recover["Token"] = 200] = "Token";
                        Recover[Recover["Reduce"] = 100] = "Reduce";
                        Recover[Recover["MaxNext"] = 4] = "MaxNext";
                        Recover[Recover["MaxInsertStackDepth"] = 300] = "MaxInsertStackDepth";
                        Recover[Recover["DampenInsertStackDepth"] = 120] = "DampenInsertStackDepth";
                    })(Recover || (Recover = {})); // Used to cheaply run some reductions to scan ahead without mutating
                    // an entire stack


                    class SimulatedStack {
                        constructor(stack) {
                            this.stack = stack;
                            this.top = stack.state;
                            this.rest = stack.stack;
                            this.offset = this.rest.length;
                        }

                        reduce(action) {
                            let term = action & 65535
                                /* ValueMask */
                                ,
                                depth = action >> 19
                                /* ReduceDepthShift */
                                ;

                            if (depth == 0) {
                                if (this.rest == this.stack.stack) this.rest = this.rest.slice();
                                this.rest.push(this.top, 0, 0);
                                this.offset += 3;
                            } else {
                                this.offset -= (depth - 1) * 3;
                            }

                            let goto = this.stack.p.parser.getGoto(this.rest[this.offset - 3], term, true);
                            this.top = goto;
                        }

                    } // This is given to `Tree.build` to build a buffer, and encapsulates
                    // the parent-stack-walking necessary to read the nodes.


                    class StackBufferCursor {
                        constructor(stack, pos, index) {
                            this.stack = stack;
                            this.pos = pos;
                            this.index = index;
                            this.buffer = stack.buffer;
                            if (this.index == 0) this.maybeNext();
                        }

                        static create(stack) {
                            return new StackBufferCursor(stack, stack.bufferBase + stack.buffer.length, stack.buffer.length);
                        }

                        maybeNext() {
                            let next = this.stack.parent;

                            if (next != null) {
                                this.index = this.stack.bufferBase - next.bufferBase;
                                this.stack = next;
                                this.buffer = next.buffer;
                            }
                        }

                        get id() {
                            return this.buffer[this.index - 4];
                        }

                        get start() {
                            return this.buffer[this.index - 3];
                        }

                        get end() {
                            return this.buffer[this.index - 2];
                        }

                        get size() {
                            return this.buffer[this.index - 1];
                        }

                        next() {
                            this.index -= 4;
                            this.pos -= 4;
                            if (this.index == 0) this.maybeNext();
                        }

                        fork() {
                            return new StackBufferCursor(this.stack, this.pos, this.index);
                        }

                    } /// Tokenizers write the tokens they read into instances of this class.


                    class Token {
                        constructor() {
                            /// The start of the token. This is set by the parser, and should not
                            /// be mutated by the tokenizer.
                            this.start = -1; /// This starts at -1, and should be updated to a term id when a
                            /// matching token is found.

                            this.value = -1; /// When setting `.value`, you should also set `.end` to the end
                            /// position of the token. (You'll usually want to use the `accept`
                            /// method.)

                            this.end = -1;
                        } /// Accept a token, setting `value` and `end` to the given values.


                        accept(value, end) {
                            this.value = value;
                            this.end = end;
                        }

                    } /// @internal


                    exports.Token = Token;

                    class TokenGroup {
                        constructor(data, id) {
                            this.data = data;
                            this.id = id;
                        }

                        token(input, token, stack) {
                            readToken(this.data, input, token, stack, this.id);
                        }

                    }

                    TokenGroup.prototype.contextual = TokenGroup.prototype.fallback = TokenGroup.prototype.extend = false; /// Exports that are used for `@external tokens` in the grammar should
                    /// export an instance of this class.

                    class ExternalTokenizer {
                        /// Create a tokenizer. The first argument is the function that,
                        /// given an input stream and a token object,
                        /// [fills](#lezer.Token.accept) the token object if it recognizes a
                        /// token. `token.start` should be used as the start position to
                        /// scan from.
                        constructor( /// @internal
                            token, options = {}) {
                            this.token = token;
                            this.contextual = !!options.contextual;
                            this.fallback = !!options.fallback;
                            this.extend = !!options.extend;
                        }

                    } // Tokenizer data is stored a big uint16 array containing, for each
                    // state:
                    //
                    //  - A group bitmask, indicating what token groups are reachable from
                    //    this state, so that paths that can only lead to tokens not in
                    //    any of the current groups can be cut off early.
                    //
                    //  - The position of the end of the state's sequence of accepting
                    //    tokens
                    //
                    //  - The number of outgoing edges for the state
                    //
                    //  - The accepting tokens, as (token id, group mask) pairs
                    //
                    //  - The outgoing edges, as (start character, end character, state
                    //    index) triples, with end character being exclusive
                    //
                    // This function interprets that data, running through a stream as
                    // long as new states with the a matching group mask can be reached,
                    // and updating `token` when it matches a token.


                    exports.ExternalTokenizer = ExternalTokenizer;

                    function readToken(data, input, token, stack, group) {
                        let state = 0,
                            groupMask = 1 << group,
                            dialect = stack.p.parser.dialect;

                        scan: for (let pos = token.start; ;) {
                            if ((groupMask & data[state]) == 0) break;
                            let accEnd = data[state + 1]; // Check whether this state can lead to a token in the current group
                            // Accept tokens in this state, possibly overwriting
                            // lower-precedence / shorter tokens

                            for (let i = state + 3; i < accEnd; i += 2) if ((data[i + 1] & groupMask) > 0) {
                                let term = data[i];

                                if (dialect.allows(term) && (token.value == -1 || token.value == term || stack.p.parser.overrides(term, token.value))) {
                                    token.accept(term, pos);
                                    break;
                                }
                            }

                            let next = input.get(pos++); // Do a binary search on the state's edges

                            for (let low = 0, high = data[state + 2]; low < high;) {
                                let mid = low + high >> 1;
                                let index = accEnd + mid + (mid << 1);
                                let from = data[index],
                                    to = data[index + 1];
                                if (next < from) high = mid; else if (next >= to) low = mid + 1; else {
                                    state = data[index + 2];
                                    continue scan;
                                }
                            }

                            break;
                        }
                    } // See lezer-generator/src/encode.ts for comments about the encoding
                    // used here


                    function decodeArray(input, Type = Uint16Array) {
                        if (typeof input != "string") return input;
                        let array = null;

                        for (let pos = 0, out = 0; pos < input.length;) {
                            let value = 0;

                            for (; ;) {
                                let next = input.charCodeAt(pos++),
                                    stop = false;

                                if (next == 126
                                    /* BigValCode */
                                ) {
                                    value = 65535
                                        /* BigVal */
                                        ;
                                    break;
                                }

                                if (next >= 92
                                    /* Gap2 */
                                ) next--;
                                if (next >= 34
                                    /* Gap1 */
                                ) next--;
                                let digit = next - 32
                                    /* Start */
                                    ;

                                if (digit >= 46
                                    /* Base */
                                ) {
                                    digit -= 46
                                        /* Base */
                                        ;
                                    stop = true;
                                }

                                value += digit;
                                if (stop) break;
                                value *= 46
                                    /* Base */
                                    ;
                            }

                            if (array) array[out++] = value; else array = new Type(value);
                        }

                        return array;
                    } // FIXME find some way to reduce recovery work done when the input
                    // doesn't match the grammar at all.
                    // Environment variable used to control console output


                    const verbose = typeof process != "undefined" && /\bparse\b/.test(process.env.LOG);
                    let stackIDs = null;

                    function cutAt(tree, pos, side) {
                        let cursor = tree.cursor(pos);

                        for (; ;) {
                            if (!(side < 0 ? cursor.childBefore(pos) : cursor.childAfter(pos))) for (; ;) {
                                if ((side < 0 ? cursor.to < pos : cursor.from > pos) && !cursor.type.isError) return side < 0 ? Math.max(0, Math.min(cursor.to - 1, pos - 5)) : Math.min(tree.length, Math.max(cursor.from + 1, pos + 5));
                                if (side < 0 ? cursor.prevSibling() : cursor.nextSibling()) break;
                                if (!cursor.parent()) return side < 0 ? 0 : tree.length;
                            }
                        }
                    }

                    class FragmentCursor {
                        constructor(fragments) {
                            this.fragments = fragments;
                            this.i = 0;
                            this.fragment = null;
                            this.safeFrom = -1;
                            this.safeTo = -1;
                            this.trees = [];
                            this.start = [];
                            this.index = [];
                            this.nextFragment();
                        }

                        nextFragment() {
                            let fr = this.fragment = this.i == this.fragments.length ? null : this.fragments[this.i++];

                            if (fr) {
                                this.safeFrom = fr.openStart ? cutAt(fr.tree, fr.from + fr.offset, 1) - fr.offset : fr.from;
                                this.safeTo = fr.openEnd ? cutAt(fr.tree, fr.to + fr.offset, -1) - fr.offset : fr.to;

                                while (this.trees.length) {
                                    this.trees.pop();
                                    this.start.pop();
                                    this.index.pop();
                                }

                                this.trees.push(fr.tree);
                                this.start.push(-fr.offset);
                                this.index.push(0);
                                this.nextStart = this.safeFrom;
                            } else {
                                this.nextStart = 1e9;
                            }
                        } // `pos` must be >= any previously given `pos` for this cursor


                        nodeAt(pos) {
                            if (pos < this.nextStart) return null;

                            while (this.fragment && this.safeTo <= pos) this.nextFragment();

                            if (!this.fragment) return null;

                            for (; ;) {
                                let last = this.trees.length - 1;

                                if (last < 0) {
                                    // End of tree
                                    this.nextFragment();
                                    return null;
                                }

                                let top = this.trees[last],
                                    index = this.index[last];

                                if (index == top.children.length) {
                                    this.trees.pop();
                                    this.start.pop();
                                    this.index.pop();
                                    continue;
                                }

                                let next = top.children[index];
                                let start = this.start[last] + top.positions[index];

                                if (start > pos) {
                                    this.nextStart = start;
                                    return null;
                                } else if (start == pos && start + next.length <= this.safeTo) {
                                    return start == pos && start >= this.safeFrom ? next : null;
                                }

                                if (next instanceof _lezerTree.TreeBuffer) {
                                    this.index[last]++;
                                    this.nextStart = start + next.length;
                                } else {
                                    this.index[last]++;

                                    if (start + next.length >= pos) {
                                        // Enter this node
                                        this.trees.push(next);
                                        this.start.push(start);
                                        this.index.push(0);
                                    }
                                }
                            }
                        }

                    }

                    class CachedToken extends Token {
                        constructor() {
                            super(...arguments);
                            this.extended = -1;
                            this.mask = 0;
                            this.context = 0;
                        }

                        clear(start) {
                            this.start = start;
                            this.value = this.extended = -1;
                        }

                    }

                    const dummyToken = new Token();

                    class TokenCache {
                        constructor(parser) {
                            this.tokens = [];
                            this.mainToken = dummyToken;
                            this.actions = [];
                            this.tokens = parser.tokenizers.map(_ => new CachedToken());
                        }

                        getActions(stack, input) {
                            let actionIndex = 0;
                            let main = null;
                            let {
                                parser
                            } = stack.p,
                                {
                                    tokenizers
                                } = parser;
                            let mask = parser.stateSlot(stack.state, 3
                                /* TokenizerMask */
                            );
                            let context = stack.curContext ? stack.curContext.hash : 0;

                            for (let i = 0; i < tokenizers.length; i++) {
                                if ((1 << i & mask) == 0) continue;
                                let tokenizer = tokenizers[i],
                                    token = this.tokens[i];
                                if (main && !tokenizer.fallback) continue;

                                if (tokenizer.contextual || token.start != stack.pos || token.mask != mask || token.context != context) {
                                    this.updateCachedToken(token, tokenizer, stack, input);
                                    token.mask = mask;
                                    token.context = context;
                                }

                                if (token.value != 0
                                    /* Err */
                                ) {
                                    let startIndex = actionIndex;
                                    if (token.extended > -1) actionIndex = this.addActions(stack, token.extended, token.end, actionIndex);
                                    actionIndex = this.addActions(stack, token.value, token.end, actionIndex);

                                    if (!tokenizer.extend) {
                                        main = token;
                                        if (actionIndex > startIndex) break;
                                    }
                                }
                            }

                            while (this.actions.length > actionIndex) this.actions.pop();

                            if (!main) {
                                main = dummyToken;
                                main.start = stack.pos;
                                if (stack.pos == input.length) main.accept(stack.p.parser.eofTerm, stack.pos); else main.accept(0
                                    /* Err */
                                    , stack.pos + 1);
                            }

                            this.mainToken = main;
                            return this.actions;
                        }

                        updateCachedToken(token, tokenizer, stack, input) {
                            token.clear(stack.pos);
                            tokenizer.token(input, token, stack);

                            if (token.value > -1) {
                                let {
                                    parser
                                } = stack.p;

                                for (let i = 0; i < parser.specialized.length; i++) if (parser.specialized[i] == token.value) {
                                    let result = parser.specializers[i](input.read(token.start, token.end), stack);

                                    if (result >= 0 && stack.p.parser.dialect.allows(result >> 1)) {
                                        if ((result & 1) == 0
                                            /* Specialize */
                                        ) token.value = result >> 1; else token.extended = result >> 1;
                                        break;
                                    }
                                }
                            } else if (stack.pos == input.length) {
                                token.accept(stack.p.parser.eofTerm, stack.pos);
                            } else {
                                token.accept(0
                                    /* Err */
                                    , stack.pos + 1);
                            }
                        }

                        putAction(action, token, end, index) {
                            // Don't add duplicate actions
                            for (let i = 0; i < index; i += 3) if (this.actions[i] == action) return index;

                            this.actions[index++] = action;
                            this.actions[index++] = token;
                            this.actions[index++] = end;
                            return index;
                        }

                        addActions(stack, token, end, index) {
                            let {
                                state
                            } = stack,
                                {
                                    parser
                                } = stack.p,
                                {
                                    data
                                } = parser;

                            for (let set = 0; set < 2; set++) {
                                for (let i = parser.stateSlot(state, set ? 2
                                    /* Skip */
                                    : 1
                                    /* Actions */
                                ); ; i += 3) {
                                    if (data[i] == 65535
                                        /* End */
                                    ) {
                                        if (data[i + 1] == 1
                                            /* Next */
                                        ) {
                                            i = pair(data, i + 2);
                                        } else {
                                            if (index == 0 && data[i + 1] == 2
                                                /* Other */
                                            ) index = this.putAction(pair(data, i + 1), token, end, index);
                                            break;
                                        }
                                    }

                                    if (data[i] == token) index = this.putAction(pair(data, i + 1), token, end, index);
                                }
                            }

                            return index;
                        }

                    }

                    var Rec;

                    (function (Rec) {
                        Rec[Rec["Distance"] = 5] = "Distance";
                        Rec[Rec["MaxRemainingPerStep"] = 3] = "MaxRemainingPerStep";
                        Rec[Rec["MinBufferLengthPrune"] = 200] = "MinBufferLengthPrune";
                        Rec[Rec["ForceReduceLimit"] = 10] = "ForceReduceLimit";
                    })(Rec || (Rec = {})); /// A parse context can be used for step-by-step parsing. After
                    /// creating it, you repeatedly call `.advance()` until it returns a
                    /// tree to indicate it has reached the end of the parse.


                    class Parse {
                        constructor(parser, input, startPos, context) {
                            this.parser = parser;
                            this.input = input;
                            this.startPos = startPos;
                            this.context = context; // The position to which the parse has advanced.

                            this.pos = 0;
                            this.recovering = 0;
                            this.nextStackID = 0x2654;
                            this.nested = null;
                            this.nestEnd = 0;
                            this.nestWrap = null;
                            this.reused = [];
                            this.tokens = new TokenCache(parser);
                            this.topTerm = parser.top[1];
                            this.stacks = [Stack.start(this, parser.top[0], this.startPos)];
                            let fragments = context === null || context === void 0 ? void 0 : context.fragments;
                            this.fragments = fragments && fragments.length ? new FragmentCursor(fragments) : null;
                        } // Move the parser forward. This will process all parse stacks at
                        // `this.pos` and try to advance them to a further position. If no
                        // stack for such a position is found, it'll start error-recovery.
                        //
                        // When the parse is finished, this will return a syntax tree. When
                        // not, it returns `null`.


                        advance() {
                            if (this.nested) {
                                let result = this.nested.advance();
                                this.pos = this.nested.pos;

                                if (result) {
                                    this.finishNested(this.stacks[0], result);
                                    this.nested = null;
                                }

                                return null;
                            }

                            let stacks = this.stacks,
                                pos = this.pos; // This will hold stacks beyond `pos`.

                            let newStacks = this.stacks = [];
                            let stopped, stoppedTokens;
                            let maybeNest; // Keep advancing any stacks at `pos` until they either move
                            // forward or can't be advanced. Gather stacks that can't be
                            // advanced further in `stopped`.

                            for (let i = 0; i < stacks.length; i++) {
                                let stack = stacks[i],
                                    nest;

                                for (; ;) {
                                    if (stack.pos > pos) {
                                        newStacks.push(stack);
                                    } else if (nest = this.checkNest(stack)) {
                                        if (!maybeNest || maybeNest.stack.score < stack.score) maybeNest = nest;
                                    } else if (this.advanceStack(stack, newStacks, stacks)) {
                                        continue;
                                    } else {
                                        if (!stopped) {
                                            stopped = [];
                                            stoppedTokens = [];
                                        }

                                        stopped.push(stack);
                                        let tok = this.tokens.mainToken;
                                        stoppedTokens.push(tok.value, tok.end);
                                    }

                                    break;
                                }
                            }

                            if (maybeNest) {
                                this.startNested(maybeNest);
                                return null;
                            }

                            if (!newStacks.length) {
                                let finished = stopped && findFinished(stopped);
                                if (finished) return this.stackToTree(finished);

                                if (this.parser.strict) {
                                    if (verbose && stopped) console.log("Stuck with token " + this.parser.getName(this.tokens.mainToken.value));
                                    throw new SyntaxError("No parse at " + pos);
                                }

                                if (!this.recovering) this.recovering = 5
                                    /* Distance */
                                    ;
                            }

                            if (this.recovering && stopped) {
                                let finished = this.runRecovery(stopped, stoppedTokens, newStacks);
                                if (finished) return this.stackToTree(finished.forceAll());
                            }

                            if (this.recovering) {
                                let maxRemaining = this.recovering == 1 ? 1 : this.recovering * 3
                                    /* MaxRemainingPerStep */
                                    ;

                                if (newStacks.length > maxRemaining) {
                                    newStacks.sort((a, b) => b.score - a.score);

                                    while (newStacks.length > maxRemaining) newStacks.pop();
                                }

                                if (newStacks.some(s => s.reducePos > pos)) this.recovering--;
                            } else if (newStacks.length > 1) {
                                // Prune stacks that are in the same state, or that have been
                                // running without splitting for a while, to avoid getting stuck
                                // with multiple successful stacks running endlessly on.
                                outer: for (let i = 0; i < newStacks.length - 1; i++) {
                                    let stack = newStacks[i];

                                    for (let j = i + 1; j < newStacks.length; j++) {
                                        let other = newStacks[j];

                                        if (stack.sameState(other) || stack.buffer.length > 200
                                            /* MinBufferLengthPrune */
                                            && other.buffer.length > 200
                                            /* MinBufferLengthPrune */
                                        ) {
                                            if ((stack.score - other.score || stack.buffer.length - other.buffer.length) > 0) {
                                                newStacks.splice(j--, 1);
                                            } else {
                                                newStacks.splice(i--, 1);
                                                continue outer;
                                            }
                                        }
                                    }
                                }
                            }

                            this.pos = newStacks[0].pos;

                            for (let i = 1; i < newStacks.length; i++) if (newStacks[i].pos < this.pos) this.pos = newStacks[i].pos;

                            return null;
                        } // Returns an updated version of the given stack, or null if the
                        // stack can't advance normally. When `split` and `stacks` are
                        // given, stacks split off by ambiguous operations will be pushed to
                        // `split`, or added to `stacks` if they move `pos` forward.


                        advanceStack(stack, stacks, split) {
                            let start = stack.pos,
                                {
                                    input,
                                    parser
                                } = this;
                            let base = verbose ? this.stackID(stack) + " -> " : "";

                            if (this.fragments) {
                                let strictCx = stack.curContext && stack.curContext.tracker.strict,
                                    cxHash = strictCx ? stack.curContext.hash : 0;

                                for (let cached = this.fragments.nodeAt(start); cached;) {
                                    let match = this.parser.nodeSet.types[cached.type.id] == cached.type ? parser.getGoto(stack.state, cached.type.id) : -1;

                                    if (match > -1 && cached.length && (!strictCx || (cached.contextHash || 0) == cxHash)) {
                                        stack.useNode(cached, match);
                                        if (verbose) console.log(base + this.stackID(stack) + ` (via reuse of ${parser.getName(cached.type.id)})`);
                                        return true;
                                    }

                                    if (!(cached instanceof _lezerTree.Tree) || cached.children.length == 0 || cached.positions[0] > 0) break;
                                    let inner = cached.children[0];
                                    if (inner instanceof _lezerTree.Tree) cached = inner; else break;
                                }
                            }

                            let defaultReduce = parser.stateSlot(stack.state, 4
                                /* DefaultReduce */
                            );

                            if (defaultReduce > 0) {
                                stack.reduce(defaultReduce);
                                if (verbose) console.log(base + this.stackID(stack) + ` (via always-reduce ${parser.getName(defaultReduce & 65535
                                    /* ValueMask */
                                )})`);
                                return true;
                            }

                            let actions = this.tokens.getActions(stack, input);

                            for (let i = 0; i < actions.length;) {
                                let action = actions[i++],
                                    term = actions[i++],
                                    end = actions[i++];
                                let last = i == actions.length || !split;
                                let localStack = last ? stack : stack.split();
                                localStack.apply(action, term, end);
                                if (verbose) console.log(base + this.stackID(localStack) + ` (via ${(action & 65536
                                    /* ReduceFlag */
                                ) == 0 ? "shift" : `reduce of ${parser.getName(action & 65535
                                    /* ValueMask */
                                )}`} for ${parser.getName(term)} @ ${start}${localStack == stack ? "" : ", split"})`);
                                if (last) return true; else if (localStack.pos > start) stacks.push(localStack); else split.push(localStack);
                            }

                            return false;
                        } // Advance a given stack forward as far as it will go. Returns the
                        // (possibly updated) stack if it got stuck, or null if it moved
                        // forward and was given to `pushStackDedup`.


                        advanceFully(stack, newStacks) {
                            let pos = stack.pos;

                            for (; ;) {
                                let nest = this.checkNest(stack);
                                if (nest) return nest;
                                if (!this.advanceStack(stack, null, null)) return false;

                                if (stack.pos > pos) {
                                    pushStackDedup(stack, newStacks);
                                    return true;
                                }
                            }
                        }

                        runRecovery(stacks, tokens, newStacks) {
                            let finished = null,
                                restarted = false;
                            let maybeNest;

                            for (let i = 0; i < stacks.length; i++) {
                                let stack = stacks[i],
                                    token = tokens[i << 1],
                                    tokenEnd = tokens[(i << 1) + 1];
                                let base = verbose ? this.stackID(stack) + " -> " : "";

                                if (stack.deadEnd) {
                                    if (restarted) continue;
                                    restarted = true;
                                    stack.restart();
                                    if (verbose) console.log(base + this.stackID(stack) + " (restarted)");
                                    let done = this.advanceFully(stack, newStacks);

                                    if (done) {
                                        if (done !== true) maybeNest = done;
                                        continue;
                                    }
                                }

                                let force = stack.split(),
                                    forceBase = base;

                                for (let j = 0; force.forceReduce() && j < 10
                                    /* ForceReduceLimit */
                                    ; j++) {
                                    if (verbose) console.log(forceBase + this.stackID(force) + " (via force-reduce)");
                                    let done = this.advanceFully(force, newStacks);

                                    if (done) {
                                        if (done !== true) maybeNest = done;
                                        break;
                                    }

                                    if (verbose) forceBase = this.stackID(force) + " -> ";
                                }

                                for (let insert of stack.recoverByInsert(token)) {
                                    if (verbose) console.log(base + this.stackID(insert) + " (via recover-insert)");
                                    this.advanceFully(insert, newStacks);
                                }

                                if (this.input.length > stack.pos) {
                                    if (tokenEnd == stack.pos) {
                                        tokenEnd++;
                                        token = 0
                                            /* Err */
                                            ;
                                    }

                                    stack.recoverByDelete(token, tokenEnd);
                                    if (verbose) console.log(base + this.stackID(stack) + ` (via recover-delete ${this.parser.getName(token)})`);
                                    pushStackDedup(stack, newStacks);
                                } else if (!finished || finished.score < stack.score) {
                                    finished = stack;
                                }
                            }

                            if (finished) return finished;
                            if (maybeNest) for (let s of this.stacks) if (s.score > maybeNest.stack.score) {
                                maybeNest = undefined;
                                break;
                            }
                            if (maybeNest) this.startNested(maybeNest);
                            return null;
                        }

                        forceFinish() {
                            let stack = this.stacks[0].split();
                            if (this.nested) this.finishNested(stack, this.nested.forceFinish());
                            return this.stackToTree(stack.forceAll());
                        } // Convert the stack's buffer to a syntax tree.


                        stackToTree(stack, pos = stack.pos) {
                            if (this.parser.context) stack.emitContext();
                            return _lezerTree.Tree.build({
                                buffer: StackBufferCursor.create(stack),
                                nodeSet: this.parser.nodeSet,
                                topID: this.topTerm,
                                maxBufferLength: this.parser.bufferLength,
                                reused: this.reused,
                                start: this.startPos,
                                length: pos - this.startPos,
                                minRepeatType: this.parser.minRepeatTerm
                            });
                        }

                        checkNest(stack) {
                            let info = this.parser.findNested(stack.state);
                            if (!info) return null;
                            let spec = info.value;
                            if (typeof spec == "function") spec = spec(this.input, stack);
                            return spec ? {
                                stack,
                                info,
                                spec
                            } : null;
                        }

                        startNested(nest) {
                            let {
                                stack,
                                info,
                                spec
                            } = nest;
                            this.stacks = [stack];
                            this.nestEnd = this.scanForNestEnd(stack, info.end, spec.filterEnd);
                            this.nestWrap = typeof spec.wrapType == "number" ? this.parser.nodeSet.types[spec.wrapType] : spec.wrapType || null;

                            if (spec.startParse) {
                                this.nested = spec.startParse(this.input.clip(this.nestEnd), stack.pos, this.context);
                            } else {
                                this.finishNested(stack);
                            }
                        }

                        scanForNestEnd(stack, endToken, filter) {
                            for (let pos = stack.pos; pos < this.input.length; pos++) {
                                dummyToken.start = pos;
                                dummyToken.value = -1;
                                endToken.token(this.input, dummyToken, stack);
                                if (dummyToken.value > -1 && (!filter || filter(this.input.read(pos, dummyToken.end)))) return pos;
                            }

                            return this.input.length;
                        }

                        finishNested(stack, tree) {
                            if (this.nestWrap) tree = new _lezerTree.Tree(this.nestWrap, tree ? [tree] : [], tree ? [0] : [], this.nestEnd - stack.pos); else if (!tree) tree = new _lezerTree.Tree(_lezerTree.NodeType.none, [], [], this.nestEnd - stack.pos);
                            let info = this.parser.findNested(stack.state);
                            stack.useNode(tree, this.parser.getGoto(stack.state, info.placeholder, true));
                            if (verbose) console.log(this.stackID(stack) + ` (via unnest)`);
                        }

                        stackID(stack) {
                            let id = (stackIDs || (stackIDs = new WeakMap())).get(stack);
                            if (!id) stackIDs.set(stack, id = String.fromCodePoint(this.nextStackID++));
                            return id + stack;
                        }

                    }

                    function pushStackDedup(stack, newStacks) {
                        for (let i = 0; i < newStacks.length; i++) {
                            let other = newStacks[i];

                            if (other.pos == stack.pos && other.sameState(stack)) {
                                if (newStacks[i].score < stack.score) newStacks[i] = stack;
                                return;
                            }
                        }

                        newStacks.push(stack);
                    }

                    class Dialect {
                        constructor(source, flags, disabled) {
                            this.source = source;
                            this.flags = flags;
                            this.disabled = disabled;
                        }

                        allows(term) {
                            return !this.disabled || this.disabled[term] == 0;
                        }

                    }

                    const id = x => x; /// Context trackers are used to track stateful context (such as
                    /// indentation in the Python grammar, or parent elements in the XML
                    /// grammar) needed by external tokenizers. You declare them in a
                    /// grammar file as `@context exportName from "module"`.
                    ///
                    /// Context values should be immutable, and can be updated (replaced)
                    /// on shift or reduce actions.


                    class ContextTracker {
                        /// The export used in a `@context` declaration should be of this
                        /// type.
                        constructor(spec) {
                            this.start = spec.start;
                            this.shift = spec.shift || id;
                            this.reduce = spec.reduce || id;
                            this.reuse = spec.reuse || id;
                            this.hash = spec.hash;
                            this.strict = spec.strict !== false;
                        }

                    } /// A parser holds the parse tables for a given grammar, as generated
                    /// by `lezer-generator`.


                    exports.ContextTracker = ContextTracker;

                    class Parser {
                        /// @internal
                        constructor(spec) {
                            /// @internal
                            this.bufferLength = _lezerTree.DefaultBufferLength; /// @internal

                            this.strict = false;
                            this.cachedDialect = null;
                            if (spec.version != 13
                                /* Version */
                            ) throw new RangeError(`Parser version (${spec.version}) doesn't match runtime version (${13
                                /* Version */
                                })`);
                            let tokenArray = decodeArray(spec.tokenData);
                            let nodeNames = spec.nodeNames.split(" ");
                            this.minRepeatTerm = nodeNames.length;
                            this.context = spec.context;

                            for (let i = 0; i < spec.repeatNodeCount; i++) nodeNames.push("");

                            let nodeProps = [];

                            for (let i = 0; i < nodeNames.length; i++) nodeProps.push([]);

                            function setProp(nodeID, prop, value) {
                                nodeProps[nodeID].push([prop, prop.deserialize(String(value))]);
                            }

                            if (spec.nodeProps) for (let propSpec of spec.nodeProps) {
                                let prop = propSpec[0];

                                for (let i = 1; i < propSpec.length;) {
                                    let next = propSpec[i++];

                                    if (next >= 0) {
                                        setProp(next, prop, propSpec[i++]);
                                    } else {
                                        let value = propSpec[i + -next];

                                        for (let j = -next; j > 0; j--) setProp(propSpec[i++], prop, value);

                                        i++;
                                    }
                                }
                            }
                            this.specialized = new Uint16Array(spec.specialized ? spec.specialized.length : 0);
                            this.specializers = [];
                            if (spec.specialized) for (let i = 0; i < spec.specialized.length; i++) {
                                this.specialized[i] = spec.specialized[i].term;
                                this.specializers[i] = spec.specialized[i].get;
                            }
                            this.states = decodeArray(spec.states, Uint32Array);
                            this.data = decodeArray(spec.stateData);
                            this.goto = decodeArray(spec.goto);
                            let topTerms = Object.keys(spec.topRules).map(r => spec.topRules[r][1]);
                            this.nodeSet = new _lezerTree.NodeSet(nodeNames.map((name, i) => _lezerTree.NodeType.define({
                                name: i >= this.minRepeatTerm ? undefined : name,
                                id: i,
                                props: nodeProps[i],
                                top: topTerms.indexOf(i) > -1,
                                error: i == 0,
                                skipped: spec.skippedNodes && spec.skippedNodes.indexOf(i) > -1
                            })));
                            this.maxTerm = spec.maxTerm;
                            this.tokenizers = spec.tokenizers.map(value => typeof value == "number" ? new TokenGroup(tokenArray, value) : value);
                            this.topRules = spec.topRules;
                            this.nested = (spec.nested || []).map(([name, value, endToken, placeholder]) => {
                                return {
                                    name,
                                    value,
                                    end: new TokenGroup(decodeArray(endToken), 0),
                                    placeholder
                                };
                            });
                            this.dialects = spec.dialects || {};
                            this.dynamicPrecedences = spec.dynamicPrecedences || null;
                            this.tokenPrecTable = spec.tokenPrec;
                            this.termNames = spec.termNames || null;
                            this.maxNode = this.nodeSet.types.length - 1;
                            this.dialect = this.parseDialect();
                            this.top = this.topRules[Object.keys(this.topRules)[0]];
                        } /// Parse a given string or stream.


                        parse(input, startPos = 0, context = {}) {
                            if (typeof input == "string") input = (0, _lezerTree.stringInput)(input);
                            let cx = new Parse(this, input, startPos, context);

                            for (; ;) {
                                let done = cx.advance();
                                if (done) return done;
                            }
                        } /// Start an incremental parse.


                        startParse(input, startPos = 0, context = {}) {
                            if (typeof input == "string") input = (0, _lezerTree.stringInput)(input);
                            return new Parse(this, input, startPos, context);
                        } /// Get a goto table entry @internal


                        getGoto(state, term, loose = false) {
                            let table = this.goto;
                            if (term >= table[0]) return -1;

                            for (let pos = table[term + 1]; ;) {
                                let groupTag = table[pos++],
                                    last = groupTag & 1;
                                let target = table[pos++];
                                if (last && loose) return target;

                                for (let end = pos + (groupTag >> 1); pos < end; pos++) if (table[pos] == state) return target;

                                if (last) return -1;
                            }
                        } /// Check if this state has an action for a given terminal @internal


                        hasAction(state, terminal) {
                            let data = this.data;

                            for (let set = 0; set < 2; set++) {
                                for (let i = this.stateSlot(state, set ? 2
                                    /* Skip */
                                    : 1
                                    /* Actions */
                                ), next; ; i += 3) {
                                    if ((next = data[i]) == 65535
                                        /* End */
                                    ) {
                                        if (data[i + 1] == 1
                                            /* Next */
                                        ) next = data[i = pair(data, i + 2)]; else if (data[i + 1] == 2
                                            /* Other */
                                        ) return pair(data, i + 2); else break;
                                    }

                                    if (next == terminal || next == 0
                                        /* Err */
                                    ) return pair(data, i + 1);
                                }
                            }

                            return 0;
                        } /// @internal


                        stateSlot(state, slot) {
                            return this.states[state * 6
                                /* Size */
                                + slot];
                        } /// @internal


                        stateFlag(state, flag) {
                            return (this.stateSlot(state, 0
                                /* Flags */
                            ) & flag) > 0;
                        } /// @internal


                        findNested(state) {
                            let flags = this.stateSlot(state, 0
                                /* Flags */
                            );
                            return flags & 4
                                /* StartNest */
                                ? this.nested[flags >> 10
                                /* NestShift */
                                ] : null;
                        } /// @internal


                        validAction(state, action) {
                            if (action == this.stateSlot(state, 4
                                /* DefaultReduce */
                            )) return true;

                            for (let i = this.stateSlot(state, 1
                                /* Actions */
                            ); ; i += 3) {
                                if (this.data[i] == 65535
                                    /* End */
                                ) {
                                    if (this.data[i + 1] == 1
                                        /* Next */
                                    ) i = pair(this.data, i + 2); else return false;
                                }

                                if (action == pair(this.data, i + 1)) return true;
                            }
                        } /// Get the states that can follow this one through shift actions or
                        /// goto jumps. @internal


                        nextStates(state) {
                            let result = [];

                            for (let i = this.stateSlot(state, 1
                                /* Actions */
                            ); ; i += 3) {
                                if (this.data[i] == 65535
                                    /* End */
                                ) {
                                    if (this.data[i + 1] == 1
                                        /* Next */
                                    ) i = pair(this.data, i + 2); else break;
                                }

                                if ((this.data[i + 2] & 65536
                                    /* ReduceFlag */
                                    >> 16) == 0) {
                                    let value = this.data[i + 1];
                                    if (!result.some((v, i) => i & 1 && v == value)) result.push(this.data[i], value);
                                }
                            }

                            return result;
                        } /// @internal


                        overrides(token, prev) {
                            let iPrev = findOffset(this.data, this.tokenPrecTable, prev);
                            return iPrev < 0 || findOffset(this.data, this.tokenPrecTable, token) < iPrev;
                        } /// Configure the parser. Returns a new parser instance that has the
                        /// given settings modified. Settings not provided in `config` are
                        /// kept from the original parser.


                        configure(config) {
                            // Hideous reflection-based kludge to make it easy to create a
                            // slightly modified copy of a parser.
                            let copy = Object.assign(Object.create(Parser.prototype), this);
                            if (config.props) copy.nodeSet = this.nodeSet.extend(...config.props);

                            if (config.top) {
                                let info = this.topRules[config.top];
                                if (!info) throw new RangeError(`Invalid top rule name ${config.top}`);
                                copy.top = info;
                            }

                            if (config.tokenizers) copy.tokenizers = this.tokenizers.map(t => {
                                let found = config.tokenizers.find(r => r.from == t);
                                return found ? found.to : t;
                            });
                            if (config.dialect) copy.dialect = this.parseDialect(config.dialect);
                            if (config.nested) copy.nested = this.nested.map(obj => {
                                if (!Object.prototype.hasOwnProperty.call(config.nested, obj.name)) return obj;
                                return {
                                    name: obj.name,
                                    value: config.nested[obj.name],
                                    end: obj.end,
                                    placeholder: obj.placeholder
                                };
                            });
                            if (config.strict != null) copy.strict = config.strict;
                            if (config.bufferLength != null) copy.bufferLength = config.bufferLength;
                            return copy;
                        } /// Returns the name associated with a given term. This will only
                        /// work for all terms when the parser was generated with the
                        /// `--names` option. By default, only the names of tagged terms are
                        /// stored.


                        getName(term) {
                            return this.termNames ? this.termNames[term] : String(term <= this.maxNode && this.nodeSet.types[term].name || term);
                        } /// The eof term id is always allocated directly after the node
                        /// types. @internal


                        get eofTerm() {
                            return this.maxNode + 1;
                        } /// Tells you whether this grammar has any nested grammars.


                        get hasNested() {
                            return this.nested.length > 0;
                        } /// The type of top node produced by the parser.


                        get topNode() {
                            return this.nodeSet.types[this.top[1]];
                        } /// @internal


                        dynamicPrecedence(term) {
                            let prec = this.dynamicPrecedences;
                            return prec == null ? 0 : prec[term] || 0;
                        } /// @internal


                        parseDialect(dialect) {
                            if (this.cachedDialect && this.cachedDialect.source == dialect) return this.cachedDialect;
                            let values = Object.keys(this.dialects),
                                flags = values.map(() => false);
                            if (dialect) for (let part of dialect.split(" ")) {
                                let id = values.indexOf(part);
                                if (id >= 0) flags[id] = true;
                            }
                            let disabled = null;

                            for (let i = 0; i < values.length; i++) if (!flags[i]) {
                                for (let j = this.dialects[values[i]], id; (id = this.data[j++]) != 65535
                                    /* End */
                                    ;) (disabled || (disabled = new Uint8Array(this.maxTerm + 1)))[id] = 1;
                            }

                            return this.cachedDialect = new Dialect(dialect, flags, disabled);
                        } /// (used by the output of the parser generator) @internal


                        static deserialize(spec) {
                            return new Parser(spec);
                        }

                    }

                    exports.Parser = Parser;

                    function pair(data, off) {
                        return data[off] | data[off + 1] << 16;
                    }

                    function findOffset(data, start, term) {
                        for (let i = start, next; (next = data[i]) != 65535
                            /* End */
                            ; i++) if (next == term) return i - start;

                        return -1;
                    }

                    function findFinished(stacks) {
                        let best = null;

                        for (let stack of stacks) {
                            if (stack.pos == stack.p.input.length && stack.p.parser.stateFlag(stack.state, 2
                                /* Accepting */
                            ) && (!best || best.score < stack.score)) best = stack;
                        }

                        return best;
                    }

                }).call(this)
            }).call(this, require('_process'))
        }, { "_process": 1, "lezer-tree": 2 }], 4: [function (require, module, exports) {
            "use strict";

            // This file was generated by lezer-generator. You probably shouldn't edit it.
            const {
                Parser
            } = require("lezer");

            const {
                legacyPrint,
                trackIndent
            } = require("./tokens.js");

            const {
                indentation,
                newlines
            } = require("./tokens");

            const {
                NodeProp
            } = require("lezer");

            const spec_identifier = {
                __proto__: null,
                await: 40,
                or: 48,
                and: 50,
                in: 54,
                not: 56,
                is: 58,
                if: 64,
                else: 66,
                lambda: 70,
                yield: 88,
                from: 90,
                async: 98,
                for: 100,
                None: 152,
                True: 154,
                False: 154,
                del: 168,
                pass: 172,
                break: 176,
                continue: 180,
                return: 184,
                raise: 192,
                import: 196,
                as: 198,
                global: 202,
                nonlocal: 204,
                assert: 208,
                elif: 226,
                while: 230,
                try: 236,
                except: 238,
                finally: 240,
                with: 244,
                def: 248,
                class: 258
            };
            exports.parser = Parser.deserialize({
                version: 13,
                states: "!@fO`Q$IXOOO%cQ$I[O'#GeOOQ$IS'#Cm'#CmOOQ$IS'#Cn'#CnO'RQ$IWO'#ClO(tQ$I[O'#GdOOQ$IS'#Ge'#GeOOQ$IS'#DR'#DROOQ$IS'#Gd'#GdO)bQ$IWO'#CqO)rQ$IWO'#DbO*SQ$IWO'#DfOOQ$IS'#Ds'#DsO*gO`O'#DsO*oOpO'#DsO*wO!bO'#DtO+SO#tO'#DtO+_O&jO'#DtO+jO,UO'#DtO-lQ$I[O'#GUOOQ$IS'#GU'#GUO'RQ$IWO'#GTO/OQ$I[O'#GTOOQ$IS'#E]'#E]O/gQ$IWO'#E^OOQ$IS'#GS'#GSO/qQ$IWO'#GROOQ$IV'#GR'#GRO/|Q$IWO'#FTOOQ$IS'#Fv'#FvO0RQ$IWO'#FSOOQ$IV'#H_'#H_OOQ$IV'#GQ'#GQOOQ$IT'#FV'#FVQ`Q$IXOOO'RQ$IWO'#CoO0aQ$IWO'#CzO0hQ$IWO'#DOO0vQ$IWO'#GiO1WQ$I[O'#EQO'RQ$IWO'#EROOQ$IS'#ET'#ETOOQ$IS'#EV'#EVOOQ$IS'#EX'#EXO1lQ$IWO'#EZO2SQ$IWO'#E_O/|Q$IWO'#EaO2gQ$I[O'#EaO/|Q$IWO'#EdO/gQ$IWO'#EgO/gQ$IWO'#EkO/gQ$IWO'#ErO2rQ$IWO'#EtO2yQ$IWO'#EyO3UQ$IWO'#EuO/gQ$IWO'#EyO/|Q$IWO'#E{O/|Q$IWO'#FQOOQ$IS'#Cc'#CcOOQ$IS'#Cd'#CdOOQ$IS'#Ce'#CeOOQ$IS'#Cf'#CfOOQ$IS'#Cg'#CgOOQ$IS'#Ch'#ChOOQ$IS'#Cj'#CjO'RQ$IWO,58|O'RQ$IWO,58|O'RQ$IWO,58|O'RQ$IWO,58|O'RQ$IWO,58|O'RQ$IWO,58|O3ZQ$IWO'#DmOOQ$IS,5:W,5:WO3nQ$IWO,5:ZO3{Q%1`O,5:ZO4QQ$I[O,59WO0aQ$IWO,59_O0aQ$IWO,59_O0aQ$IWO,59_O6pQ$IWO,59_O6uQ$IWO,59_O6|Q$IWO,59gO7TQ$IWO'#GdO8ZQ$IWO'#GcOOQ$IS'#Gc'#GcOOQ$IS'#DX'#DXO8rQ$IWO,59]O'RQ$IWO,59]O9QQ$IWO,59]O9VQ$IWO,5:PO'RQ$IWO,5:POOQ$IS,59|,59|O9eQ$IWO,59|O9jQ$IWO,5:VO'RQ$IWO,5:VO'RQ$IWO,5:TOOQ$IS,5:Q,5:QO9{Q$IWO,5:QO:QQ$IWO,5:UOOOO'#F_'#F_O:VO`O,5:_OOQ$IS,5:_,5:_OOOO'#F`'#F`O:_OpO,5:_O:gQ$IWO'#DuOOOO'#Fa'#FaO:wO!bO,5:`OOQ$IS,5:`,5:`OOOO'#Fd'#FdO;SO#tO,5:`OOOO'#Fe'#FeO;_O&jO,5:`OOOO'#Ff'#FfO;jO,UO,5:`OOQ$IS'#Fg'#FgO;uQ$I[O,5:dO>gQ$I[O,5<oO?QQ%GlO,5<oO?qQ$I[O,5<oOOQ$IS,5:x,5:xO@YQ$IXO'#FoOAiQ$IWO,5;TOOQ$IV,5<m,5<mOAtQ$I[O'#H[OB]Q$IWO,5;oOOQ$IS-E9t-E9tOOQ$IV,5;n,5;nO3PQ$IWO'#E{OOQ$IT-E9T-E9TOBeQ$I[O,59ZODlQ$I[O,59fOEVQ$IWO'#GfOEbQ$IWO'#GfO/|Q$IWO'#GfOEmQ$IWO'#DQOEuQ$IWO,59jOEzQ$IWO'#GjO'RQ$IWO'#GjO/gQ$IWO,5=TOOQ$IS,5=T,5=TO/gQ$IWO'#D|OOQ$IS'#D}'#D}OFiQ$IWO'#FiOFyQ$IWO,58zOGXQ$IWO,58zO)eQ$IWO,5:jOG^Q$I[O'#GlOOQ$IS,5:m,5:mOOQ$IS,5:u,5:uOGqQ$IWO,5:yOHSQ$IWO,5:{OOQ$IS'#Fl'#FlOHbQ$I[O,5:{OHpQ$IWO,5:{OHuQ$IWO'#H^OOQ$IS,5;O,5;OOITQ$IWO'#HZOOQ$IS,5;R,5;RO3UQ$IWO,5;VO3UQ$IWO,5;^OIfQ$I[O'#H`O'RQ$IWO'#H`OIpQ$IWO,5;`O2rQ$IWO,5;`O/gQ$IWO,5;eO/|Q$IWO,5;gOIuQ$IXO'#ElOKOQ$IZO,5;aONaQ$IWO'#HaO3UQ$IWO,5;eONlQ$IWO,5;gONqQ$IWO,5;lO!#fQ$I[O1G.hO!#mQ$I[O1G.hO!&^Q$I[O1G.hO!&hQ$I[O1G.hO!)RQ$I[O1G.hO!)fQ$I[O1G.hO!)yQ$IWO'#GrO!*XQ$I[O'#GUO/gQ$IWO'#GrO!*cQ$IWO'#GqOOQ$IS,5:X,5:XO!*kQ$IWO,5:XO!*pQ$IWO'#GsO!*{Q$IWO'#GsO!+`Q$IWO1G/uOOQ$IS'#Dq'#DqOOQ$IS1G/u1G/uOOQ$IS1G.y1G.yO!,`Q$I[O1G.yO!,gQ$I[O1G.yO0aQ$IWO1G.yO!-SQ$IWO1G/ROOQ$IS'#DW'#DWO/gQ$IWO,59qOOQ$IS1G.w1G.wO!-ZQ$IWO1G/cO!-kQ$IWO1G/cO!-sQ$IWO1G/dO'RQ$IWO'#GkO!-xQ$IWO'#GkO!-}Q$I[O1G.wO!._Q$IWO,59fO!/eQ$IWO,5=ZO!/uQ$IWO,5=ZO!/}Q$IWO1G/kO!0SQ$I[O1G/kOOQ$IS1G/h1G/hO!0dQ$IWO,5=UO!1ZQ$IWO,5=UO/gQ$IWO1G/oO!1xQ$IWO1G/qO!1}Q$I[O1G/qO!2_Q$I[O1G/oOOQ$IS1G/l1G/lOOQ$IS1G/p1G/pOOOO-E9]-E9]OOQ$IS1G/y1G/yOOOO-E9^-E9^O!2oQ$IWO'#HOO/gQ$IWO'#HOO!2}Q$IWO,5:aOOOO-E9_-E9_OOQ$IS1G/z1G/zOOOO-E9b-E9bOOOO-E9c-E9cOOOO-E9d-E9dOOQ$IS-E9e-E9eO!3YQ%GlO1G2ZO!3yQ$I[O1G2ZO'RQ$IWO,5<SOOQ$IS,5<S,5<SOOQ$IS-E9f-E9fOOQ$IS,5<Z,5<ZOOQ$IS-E9m-E9mOOQ$IV1G0o1G0oO/|Q$IWO'#FkO!4bQ$I[O,5=vOOQ$IS1G1Z1G1ZO!4yQ$IWO1G1ZOOQ$IS'#DS'#DSO/gQ$IWO,5=QOOQ$IS,5=Q,5=QO!5OQ$IWO'#FWO!5ZQ$IWO,59lO!5cQ$IWO1G/UO!5mQ$I[O,5=UOOQ$IS1G2o1G2oOOQ$IS,5:h,5:hO!6^Q$IWO'#GTOOQ$IS,5<T,5<TOOQ$IS-E9g-E9gO!6oQ$IWO1G.fOOQ$IS1G0U1G0UO!6}Q$IWO,5=WO!7_Q$IWO,5=WO/gQ$IWO1G0eO/gQ$IWO1G0eO/|Q$IWO1G0gOOQ$IS-E9j-E9jO!7pQ$IWO1G0gO!7{Q$IWO1G0gO!8QQ$IWO,5=xO!8`Q$IWO,5=xO!8nQ$IWO,5=uO!9UQ$IWO,5=uO!9gQ$IZO1G0qO!<uQ$IZO1G0xO!@QQ$IWO,5=zO!@[Q$IWO,5=zO!@dQ$I[O,5=zO/gQ$IWO1G0zO!@nQ$IWO1G0zO3UQ$IWO1G1PONlQ$IWO1G1ROOQ$IU'#Em'#EmOOQ$IV,5;W,5;WO!@sQ$IYO,5;WO!@xQ$IZO1G0{O!DZQ$IWO'#FsO3UQ$IWO1G0{O3UQ$IWO1G0{O!DhQ$IWO,5={O!DuQ$IWO,5={O/|Q$IWO,5={OOQ$IV1G1P1G1PO!D}Q$IWO'#E}O!E`Q%1`O1G1ROOQ$IV1G1W1G1WO3UQ$IWO1G1WOOQ$IS,5=^,5=^OOQ$IS'#Dn'#DnO/gQ$IWO,5=^O!EhQ$IWO,5=]O!E{Q$IWO,5=]OOQ$IS1G/s1G/sO!FTQ$IWO,5=_O!FeQ$IWO,5=_O!FmQ$IWO,5=_O!GQQ$IWO,5=_O!GbQ$IWO,5=_OOQ$IS7+%a7+%aOOQ$IS7+$e7+$eO!5cQ$IWO7+$mO!ITQ$IWO1G.yO!I[Q$IWO1G.yOOQ$IS1G/]1G/]OOQ$IS,5;t,5;tO'RQ$IWO,5;tOOQ$IS7+$}7+$}O!IcQ$IWO7+$}OOQ$IS-E9W-E9WOOQ$IS7+%O7+%OO!IsQ$IWO,5=VO'RQ$IWO,5=VOOQ$IS7+$c7+$cO!IxQ$IWO7+$}O!JQQ$IWO7+%OO!JVQ$IWO1G2uOOQ$IS7+%V7+%VO!JgQ$IWO1G2uO!JoQ$IWO7+%VOOQ$IS,5;s,5;sO'RQ$IWO,5;sO!JtQ$IWO1G2pOOQ$IS-E9V-E9VO!KkQ$IWO7+%ZOOQ$IS7+%]7+%]O!KyQ$IWO1G2pO!LhQ$IWO7+%]O!LmQ$IWO1G2vO!L}Q$IWO1G2vO!MVQ$IWO7+%ZO!M[Q$IWO,5=jO!MrQ$IWO,5=jO!MrQ$IWO,5=jO!NQO!LQO'#DwO!N]OSO'#HPOOOO1G/{1G/{O!NbQ$IWO1G/{O!NjQ%GlO7+'uO# ZQ$I[O1G1nP# tQ$IWO'#FhOOQ$IS,5<V,5<VOOQ$IS-E9i-E9iOOQ$IS7+&u7+&uOOQ$IS1G2l1G2lOOQ$IS,5;r,5;rOOQ$IS-E9U-E9UOOQ$IS7+$p7+$pO#!RQ$IWO,5<oO#!lQ$IWO,5<oO#!}Q$I[O,5;uO##bQ$IWO1G2rOOQ$IS-E9X-E9XOOQ$IS7+&P7+&PO##rQ$IWO7+&POOQ$IS7+&R7+&RO#$QQ$IWO'#H]O/|Q$IWO7+&RO#$fQ$IWO7+&ROOQ$IS,5<Y,5<YO#$qQ$IWO1G3dOOQ$IS-E9l-E9lOOQ$IS,5<U,5<UO#%PQ$IWO1G3aOOQ$IS-E9h-E9hO#%gQ$IZO7+&]O!DZQ$IWO'#FqO3UQ$IWO7+&]O3UQ$IWO7+&dO#(uQ$I[O,5<^O'RQ$IWO,5<^O#)PQ$IWO1G3fOOQ$IS-E9p-E9pO#)ZQ$IWO1G3fO3UQ$IWO7+&fO/gQ$IWO7+&fOOQ$IV7+&k7+&kO!E`Q%1`O7+&mOOQ$IT'#En'#EnO#)cQ$IXO1G0rOOQ$IV-E9q-E9qO3UQ$IWO7+&gO3UQ$IWO7+&gOOQ$IV,5<_,5<_O#+UQ$IWO,5<_OOQ$IV7+&g7+&gO#+aQ$IZO7+&gO#.lQ$IWO,5<`O#.wQ$IWO1G3gOOQ$IS-E9r-E9rO#/UQ$IWO1G3gO#/^Q$IWO'#HcO#/lQ$IWO'#HcO/|Q$IWO'#HcOOQ$IS'#Hc'#HcO#/wQ$IWO'#HbOOQ$IS,5;i,5;iO#0PQ$IWO,5;iO/gQ$IWO'#FPOOQ$IV7+&m7+&mO3UQ$IWO7+&mOOQ$IV7+&r7+&rOOQ$IS1G2x1G2xOOQ$IS,5;w,5;wO#0UQ$IWO1G2wOOQ$IS-E9Z-E9ZO#0iQ$IWO,5;xO#0tQ$IWO,5;xO#1XQ$IWO1G2yOOQ$IS-E9[-E9[O#1iQ$IWO1G2yO#1qQ$IWO1G2yO#2RQ$IWO1G2yO#1iQ$IWO1G2yOOQ$IS<<HX<<HXO#2^Q$I[O1G1`OOQ$IS<<Hi<<HiP#2kQ$IWO'#FYO6|Q$IWO1G2qO#2xQ$IWO1G2qO#2}Q$IWO<<HiOOQ$IS<<Hj<<HjO#3_Q$IWO7+(aOOQ$IS<<Hq<<HqO#3oQ$I[O1G1_P#4`Q$IWO'#FXO#4mQ$IWO7+(bO#4}Q$IWO7+(bO#5VQ$IWO<<HuO#5[Q$IWO7+([OOQ$IS<<Hw<<HwO#6RQ$IWO,5;vO'RQ$IWO,5;vOOQ$IS-E9Y-E9YOOQ$IS<<Hu<<HuOOQ$IS,5;|,5;|O/gQ$IWO,5;|O#6WQ$IWO1G3UOOQ$IS-E9`-E9`O#6nQ$IWO1G3UOOOO'#Fc'#FcO#6|O!LQO,5:cOOOO,5=k,5=kOOOO7+%g7+%gO#7XQ$IWO1G2ZO#7rQ$IWO1G2ZP'RQ$IWO'#FZO/gQ$IWO<<IkO#8TQ$IWO,5=wO#8fQ$IWO,5=wO/|Q$IWO,5=wO#8wQ$IWO<<ImOOQ$IS<<Im<<ImO/|Q$IWO<<ImP/|Q$IWO'#FnP/gQ$IWO'#FjOOQ$IV-E9o-E9oO3UQ$IWO<<IwOOQ$IV,5<],5<]O3UQ$IWO,5<]OOQ$IV<<Iw<<IwOOQ$IV<<JO<<JOO#8|Q$I[O1G1xP#9WQ$IWO'#FrO#9_Q$IWO7+)QO#9iQ$IZO<<JQO3UQ$IWO<<JQOOQ$IV<<JX<<JXO3UQ$IWO<<JXOOQ$IV'#Fp'#FpO#<tQ$IZO7+&^OOQ$IV<<JR<<JRO#>mQ$IZO<<JROOQ$IV1G1y1G1yO/|Q$IWO1G1yO3UQ$IWO<<JRO/|Q$IWO1G1zP/gQ$IWO'#FtO#AxQ$IWO7+)RO#BVQ$IWO7+)ROOQ$IS'#FO'#FOO/gQ$IWO,5=}O#B_Q$IWO,5=}OOQ$IS,5=},5=}O#BjQ$IWO,5=|O#B{Q$IWO,5=|OOQ$IS1G1T1G1TOOQ$IS,5;k,5;kP#CTQ$IWO'#F]O#CeQ$IWO1G1dO#CxQ$IWO1G1dO#DYQ$IWO1G1dP#DeQ$IWO'#F^O#DrQ$IWO7+(eO#ESQ$IWO7+(eO#ESQ$IWO7+(eO#E[Q$IWO7+(eO#ElQ$IWO7+(]O6|Q$IWO7+(]OOQ$ISAN>TAN>TO#FVQ$IWO<<K|OOQ$ISAN>aAN>aO/gQ$IWO1G1bO#FgQ$I[O1G1bP#FqQ$IWO'#F[OOQ$IS1G1h1G1hP#GOQ$IWO'#FbO#G]Q$IWO7+(pOOOO-E9a-E9aO#GsQ$IWO7+'uOOQ$ISAN?VAN?VO#H^Q$IWO,5<XO#HrQ$IWO1G3cOOQ$IS-E9k-E9kO#ITQ$IWO1G3cOOQ$ISAN?XAN?XO#IfQ$IWOAN?XOOQ$IVAN?cAN?cOOQ$IV1G1w1G1wO3UQ$IWOAN?lO#IkQ$IZOAN?lOOQ$IVAN?sAN?sOOQ$IV-E9n-E9nOOQ$IV'#Eo'#EoOOQ$IV'#Ep'#EpOOQ$IV<<Ix<<IxO3UQ$IWOAN?mO3UQ$IWO7+'eOOQ$IVAN?mAN?mOOQ$IS7+'f7+'fO#LvQ$IWO<<LmOOQ$IS1G3i1G3iO/gQ$IWO1G3iOOQ$IS,5<a,5<aO#MTQ$IWO1G3hOOQ$IS-E9s-E9sO#MfQ$IWO7+'OO#MvQ$IWO7+'OOOQ$IS7+'O7+'OO#NRQ$IWO<<LPO#NcQ$IWO<<LPO#NcQ$IWO<<LPO#NkQ$IWO'#GmOOQ$IS<<Kw<<KwO#NuQ$IWO<<KwOOQ$IS7+&|7+&|O/|Q$IWO1G1sP/|Q$IWO'#FmO$ `Q$IWO7+(}O$ qQ$IWO7+(}OOQ$ISG24sG24sOOQ$IVG25WG25WO3UQ$IWOG25WOOQ$IVG25XG25XOOQ$IV<<KP<<KPOOQ$IS7+)T7+)TP$!SQ$IWO'#FuOOQ$IS<<Jj<<JjO$!bQ$IWO<<JjO$!rQ$IWOANAkO$#SQ$IWOANAkO$#[Q$IWO'#GnOOQ$IS'#Gn'#GnO0hQ$IWO'#DaO$#uQ$IWO,5=XOOQ$ISANAcANAcOOQ$IS7+'_7+'_O$$^Q$IWO<<LiOOQ$IVLD*rLD*rOOQ$ISAN@UAN@UO$$oQ$IWOG27VO$%PQ$IWO,59{OOQ$IS1G2s1G2sO#NkQ$IWO1G/gOOQ$IS7+%R7+%RO6|Q$IWO'#CzO6|Q$IWO,59_O6|Q$IWO,59_O6|Q$IWO,59_O$%UQ$I[O,5<oO6|Q$IWO1G.yO/gQ$IWO1G/UO/gQ$IWO7+$mP$%iQ$IWO'#FhO'RQ$IWO'#GTO$%vQ$IWO,59_O$%{Q$IWO,59_O$&SQ$IWO,59jO$&XQ$IWO1G/RO0hQ$IWO'#DOO6|Q$IWO,59g",
                stateData: "$&o~O$sOS$pOS$oOSQOS~OPhOTeOdsOfXOltOp!SOsuO|vO}!PO!R!VO!S!UO!VYO!ZZO!fdO!mdO!ndO!odO!vxO!xyO!zzO!|{O#O|O#S}O#U!OO#X!QO#Y!QO#[!RO#g!TO#j!WO#n!XO#p!YO#u!ZO#xlO$nqO%OQO%PQO%TRO%UVO%i[O%j]O%m^O%p_O%v`O%yaO%{bO~OT!aO]!aO_!bOf!iO!V!kO!d!lO$y![O$z!]O${!^O$|!_O$}!_O%O!`O%P!`O%Q!aO%R!aO%S!aO~Oh%XXi%XXj%XXk%XXl%XXm%XXp%XXw%XXx%XX!s%XX#^%XX$n%XX$q%XX%Z%XX!O%XX!R%XX!S%XX%[%XX!W%XX![%XX}%XX#V%XXq%XX!j%XX~P$_OdsOfXO!VYO!ZZO!fdO!mdO!ndO!odO%OQO%PQO%TRO%UVO%i[O%j]O%m^O%p_O%v`O%yaO%{bO~Ow%WXx%WX#^%WX$n%WX$q%WX%Z%WX~Oh!oOi!pOj!nOk!nOl!qOm!rOp!sO!s%WX~P(`OT!yOl-jOs-xO|vO~P'ROT!|Ol-jOs-xO!W!}O~P'ROT#QO_#ROl-jOs-xO![#SO~P'RO%k#VO%l#XO~O%n#YO%o#XO~O!Z#[O%q#]O%u#_O~O!Z#[O%w#`O%x#_O~O!Z#[O%l#_O%z#bO~O!Z#[O%o#_O%|#dO~OT$xX]$xX_$xXf$xXh$xXi$xXj$xXk$xXl$xXm$xXp$xXw$xX!V$xX!d$xX$y$xX$z$xX${$xX$|$xX$}$xX%O$xX%P$xX%Q$xX%R$xX%S$xX!O$xX!R$xX!S$xX~O%i[O%j]O%m^O%p_O%v`O%yaO%{bOx$xX!s$xX#^$xX$n$xX$q$xX%Z$xX%[$xX!W$xX![$xX}$xX#V$xXq$xX!j$xX~P+uOw#iOx$wX!s$wX#^$wX$n$wX$q$wX%Z$wX~Ol-jOs-xO~P'RO#^#lO$n#nO$q#nO~O%UVO~O!R#sO#p!YO#u!ZO#xlO~OltO~P'ROT#xO_#yO%UVOxtP~OT#}Ol-jOs-xO}$OO~P'ROx$QO!s$VO%Z$RO#^!tX$n!tX$q!tX~OT#}Ol-jOs-xO#^!}X$n!}X$q!}X~P'ROl-jOs-xO#^#RX$n#RX$q#RX~P'RO!d$]O!m$]O%UVO~OT$gO~P'RO!S$iO#n$jO#p$kO~Ox$lO~OT$zO_$zOl-jOs-xO!O$|O~P'ROl-jOs-xOx%PO~P'RO%h%RO~O_!bOf!iO!V!kO!d!lOT`a]`ah`ai`aj`ak`al`am`ap`aw`ax`a!s`a#^`a$n`a$q`a$y`a$z`a${`a$|`a$}`a%O`a%P`a%Q`a%R`a%S`a%Z`a!O`a!R`a!S`a%[`a!W`a![`a}`a#V`aq`a!j`a~Ok%WO~Ol%WO~P'ROl-jO~P'ROh-lOi-mOj-kOk-kOl-tOm-uOp-yO!O%WX!R%WX!S%WX%[%WX!W%WX![%WX}%WX#V%WX!j%WX~P(`O%[%YOw%VX!O%VX!R%VX!S%VX!W%VXx%VX~Ow%]O!O%[O!R%aO!S%`O~O!O%[O~Ow%dO!R%aO!S%`O!W%cX~O!W%hO~Ow%iOx%kO!R%aO!S%`O![%^X~O![%oO~O![%pO~O%k#VO%l%rO~O%n#YO%o%rO~OT%uOl-jOs-xO|vO~P'RO!Z#[O%q#]O%u%xO~O!Z#[O%w#`O%x%xO~O!Z#[O%l%xO%z#bO~O!Z#[O%o%xO%|#dO~OT!la]!la_!laf!lah!lai!laj!lak!lal!lam!lap!law!lax!la!V!la!d!la!s!la#^!la$n!la$q!la$y!la$z!la${!la$|!la$}!la%O!la%P!la%Q!la%R!la%S!la%Z!la!O!la!R!la!S!la%[!la!W!la![!la}!la#V!laq!la!j!la~P#vOw%}Ox$wa!s$wa#^$wa$n$wa$q$wa%Z$wa~P$_OT&POltOsuOx$wa!s$wa#^$wa$n$wa$q$wa%Z$wa~P'ROw%}Ox$wa!s$wa#^$wa$n$wa$q$wa%Z$wa~OPhOTeOltOsuO|vO}!PO!vxO!xyO!zzO!|{O#O|O#S}O#U!OO#X!QO#Y!QO#[!RO#^$cX$n$cX$q$cX~P'RO#^#lO$n&UO$q&UO~O!d&VOf&OX$n&OX#V&OX#^&OX$q&OX#U&OX~Of!iO$n&XO~Ohcaicajcakcalcamcapcawcaxca!sca#^ca$nca$qca%Zca!Oca!Rca!Sca%[ca!Wca![ca}ca#Vcaqca!jca~P$_Opnawnaxna#^na$nna$qna%Zna~Oh!oOi!pOj!nOk!nOl!qOm!rO!sna~PDTO%Z&ZOw%YXx%YX~O%UVOw%YXx%YX~Ow&^OxtX~Ox&`O~Ow%iO#^%^X$n%^X$q%^X!O%^Xx%^X![%^X!j%^X%Z%^X~OT-sOl-jOs-xO|vO~P'RO%Z$RO#^Sa$nSa$qSa~O%Z$RO~Ow&iO#^%`X$n%`X$q%`Xk%`X~P$_Ow&lO}&kO#^#Ra$n#Ra$q#Ra~O#V&mO#^#Ta$n#Ta$q#Ta~O!d$]O!m$]O#U&oO%UVO~O#U&oO~Ow&qO#^&QX$n&QX$q&QX~Ow&sO#^%}X$n%}X$q%}Xx%}X~Ow&wOk&SX~P$_Ok&zO~OPhOTeOltOsuO|vO}!PO!vxO!xyO!zzO!|{O#O|O#S}O#U!OO#X!QO#Y!QO#[!RO$n'OO~P'ROq'UO#k'SO#l'TOP#iaT#iad#iaf#ial#iap#ias#ia|#ia}#ia!R#ia!S#ia!V#ia!Z#ia!f#ia!m#ia!n#ia!o#ia!v#ia!x#ia!z#ia!|#ia#O#ia#S#ia#U#ia#X#ia#Y#ia#[#ia#g#ia#j#ia#n#ia#p#ia#u#ia#x#ia$k#ia$n#ia%O#ia%P#ia%T#ia%U#ia%i#ia%j#ia%m#ia%p#ia%v#ia%y#ia%{#ia$m#ia$q#ia~Ow'VO#V'XOx&TX~Of'ZO~Of!iOx$lO~OT!aO]!aO_!bOf!iO!V!kO!d!lO${!^O$|!_O$}!_O%O!`O%P!`O%Q!aO%R!aO%S!aOhUiiUijUikUilUimUipUiwUixUi!sUi#^Ui$nUi$qUi$yUi%ZUi!OUi!RUi!SUi%[Ui!WUi![Ui}Ui#VUiqUi!jUi~O$z!]O~PNyO$zUi~PNyOT!aO]!aO_!bOf!iO!V!kO!d!lO%O!`O%P!`O%Q!aO%R!aO%S!aOhUiiUijUikUilUimUipUiwUixUi!sUi#^Ui$nUi$qUi$yUi$zUi${Ui%ZUi!OUi!RUi!SUi%[Ui!WUi![Ui}Ui#VUiqUi!jUi~O$|!_O$}!_O~P!#tO$|Ui$}Ui~P!#tO_!bOf!iO!V!kO!d!lOhUiiUijUikUilUimUipUiwUixUi!sUi#^Ui$nUi$qUi$yUi$zUi${Ui$|Ui$}Ui%OUi%PUi%ZUi!OUi!RUi!SUi%[Ui!WUi![Ui}Ui#VUiqUi!jUi~OT!aO]!aO%Q!aO%R!aO%S!aO~P!&rOTUi]Ui%QUi%RUi%SUi~P!&rO!R%aO!S%`Ow%fX!O%fX~O%Z'`O%['`O~P+uOw'bO!O%eX~O!O'dO~Ow'eOx'gO!W%gX~Ol-jOs-xOw'eOx'hO!W%gX~P'RO!W'jO~Oj!nOk!nOl!qOm!rOhgipgiwgixgi!sgi#^gi$ngi$qgi%Zgi~Oi!pO~P!+eOigi~P!+eOh-lOi-mOj-kOk-kOl-tOm-uO~Oq'lO~P!,nOT'qOl-jOs-xO!O'rO~P'ROw'sO!O'rO~O!O'uO~O!S'wO~Ow'sO!O'xO!R%aO!S%`O~P$_Oh-lOi-mOj-kOk-kOl-tOm-uO!Ona!Rna!Sna%[na!Wna![na}na#Vnaqna!jna~PDTOT'qOl-jOs-xO!W%ca~P'ROw'{O!W%ca~O!W'|O~Ow'{O!R%aO!S%`O!W%ca~P$_OT(QOl-jOs-xO![%^a#^%^a$n%^a$q%^a!O%^ax%^a!j%^a%Z%^a~P'ROw(RO![%^a#^%^a$n%^a$q%^a!O%^ax%^a!j%^a%Z%^a~O![(UO~Ow(RO!R%aO!S%`O![%^a~P$_Ow(XO!R%aO!S%`O![%da~P$_Ow([Ox%rX![%rX!j%rX~Ox(_O![(aO!j(bO~OT&POltOsuOx$wi!s$wi#^$wi$n$wi$q$wi%Z$wi~P'ROw(cOx$wi!s$wi#^$wi$n$wi$q$wi%Z$wi~O!d&VOf&Oa$n&Oa#V&Oa#^&Oa$q&Oa#U&Oa~O$n(hO~OT#xO_#yO%UVO~Ow&^Oxta~OltOsuO~P'ROw(RO#^%^a$n%^a$q%^a!O%^ax%^a![%^a!j%^a%Z%^a~P$_Ow(mO#^$wX$n$wX$q$wX%Z$wX~O%Z$RO#^Si$nSi$qSi~O#^%`a$n%`a$q%`ak%`a~P'ROw(pO#^%`a$n%`a$q%`ak%`a~OT(tOf(vO%UVO~O#U(wO~O%UVO#^&Qa$n&Qa$q&Qa~Ow(yO#^&Qa$n&Qa$q&Qa~Ol-jOs-xO#^%}a$n%}a$q%}ax%}a~P'ROw(|O#^%}a$n%}a$q%}ax%}a~Oq)QO#e)POP#_iT#_id#_if#_il#_ip#_is#_i|#_i}#_i!R#_i!S#_i!V#_i!Z#_i!f#_i!m#_i!n#_i!o#_i!v#_i!x#_i!z#_i!|#_i#O#_i#S#_i#U#_i#X#_i#Y#_i#[#_i#g#_i#j#_i#n#_i#p#_i#u#_i#x#_i$k#_i$n#_i%O#_i%P#_i%T#_i%U#_i%i#_i%j#_i%m#_i%p#_i%v#_i%y#_i%{#_i$m#_i$q#_i~Oq)ROP#fiT#fid#fif#fil#fip#fis#fi|#fi}#fi!R#fi!S#fi!V#fi!Z#fi!f#fi!m#fi!n#fi!o#fi!v#fi!x#fi!z#fi!|#fi#O#fi#S#fi#U#fi#X#fi#Y#fi#[#fi#g#fi#j#fi#n#fi#p#fi#u#fi#x#fi$k#fi$n#fi%O#fi%P#fi%T#fi%U#fi%i#fi%j#fi%m#fi%p#fi%v#fi%y#fi%{#fi$m#fi$q#fi~OT)TOk&Sa~P'ROw)UOk&Sa~Ow)UOk&Sa~P$_Ok)YO~O$l)]O~Oq)aO#k'SO#l)`OP#iiT#iid#iif#iil#iip#iis#ii|#ii}#ii!R#ii!S#ii!V#ii!Z#ii!f#ii!m#ii!n#ii!o#ii!v#ii!x#ii!z#ii!|#ii#O#ii#S#ii#U#ii#X#ii#Y#ii#[#ii#g#ii#j#ii#n#ii#p#ii#u#ii#x#ii$k#ii$n#ii%O#ii%P#ii%T#ii%U#ii%i#ii%j#ii%m#ii%p#ii%v#ii%y#ii%{#ii$m#ii$q#ii~Ol-jOs-xOx$lO~P'ROl-jOs-xOx&Ta~P'ROw)gOx&Ta~OT)kO_)lO!O)oO%Q)mO%UVO~Ox$lO&W)qO~OT$zO_$zOl-jOs-xO!O%ea~P'ROw)wO!O%ea~Ol-jOs-xOx)zO!W%ga~P'ROw){O!W%ga~Ol-jOs-xOw){Ox*OO!W%ga~P'ROl-jOs-xOw){O!W%ga~P'ROw){Ox*OO!W%ga~Oj-kOk-kOl-tOm-uOhgipgiwgi!Ogi!Rgi!Sgi%[gi!Wgixgi![gi#^gi$ngi$qgi}gi#Vgiqgi!jgi%Zgi~Oi-mO~P!GmOigi~P!GmOT'qOl-jOs-xO!O*TO~P'ROk*VO~Ow*XO!O*TO~O!O*YO~OT'qOl-jOs-xO!W%ci~P'ROw*ZO!W%ci~O!W*[O~OT(QOl-jOs-xO![%^i#^%^i$n%^i$q%^i!O%^ix%^i!j%^i%Z%^i~P'ROw*_O!R%aO!S%`O![%di~Ow*bO![%^i#^%^i$n%^i$q%^i!O%^ix%^i!j%^i%Z%^i~O![*cO~O_*eOl-jOs-xO![%di~P'ROw*_O![%di~O![*gO~OT*iOl-jOs-xOx%ra![%ra!j%ra~P'ROw*jOx%ra![%ra!j%ra~O!Z#[O%t*mO![!kX~O![*oO~Ox(_O![*pO~OT&POltOsuOx$wq!s$wq#^$wq$n$wq$q$wq%Z$wq~P'ROw$[ix$[i!s$[i#^$[i$n$[i$q$[i%Z$[i~P$_OT&POltOsuO~P'ROT&POl-jOs-xO#^$wa$n$wa$q$wa%Z$wa~P'ROw*qO#^$wa$n$wa$q$wa%Z$wa~Ow#}a#^#}a$n#}a$q#}ak#}a~P$_O#^%`i$n%`i$q%`ik%`i~P'ROw*tO#^#Rq$n#Rq$q#Rq~Ow*uO#V*wO#^&PX$n&PX$q&PX!O&PX~OT*yOf*zO%UVO~O%UVO#^&Qi$n&Qi$q&Qi~Ol-jOs-xO#^%}i$n%}i$q%}ix%}i~P'ROq+OO#e)POP#_qT#_qd#_qf#_ql#_qp#_qs#_q|#_q}#_q!R#_q!S#_q!V#_q!Z#_q!f#_q!m#_q!n#_q!o#_q!v#_q!x#_q!z#_q!|#_q#O#_q#S#_q#U#_q#X#_q#Y#_q#[#_q#g#_q#j#_q#n#_q#p#_q#u#_q#x#_q$k#_q$n#_q%O#_q%P#_q%T#_q%U#_q%i#_q%j#_q%m#_q%p#_q%v#_q%y#_q%{#_q$m#_q$q#_q~Ok$faw$fa~P$_OT)TOk&Si~P'ROw+VOk&Si~OPhOTeOltOp!SOsuO|vO}!PO!R!VO!S!UO!vxO!xyO!zzO!|{O#O|O#S}O#U!OO#X!QO#Y!QO#[!RO#g!TO#j!WO#n!XO#p!YO#u!ZO#xlO~P'ROw+aOx$lO#V+aO~O#l+bOP#iqT#iqd#iqf#iql#iqp#iqs#iq|#iq}#iq!R#iq!S#iq!V#iq!Z#iq!f#iq!m#iq!n#iq!o#iq!v#iq!x#iq!z#iq!|#iq#O#iq#S#iq#U#iq#X#iq#Y#iq#[#iq#g#iq#j#iq#n#iq#p#iq#u#iq#x#iq$k#iq$n#iq%O#iq%P#iq%T#iq%U#iq%i#iq%j#iq%m#iq%p#iq%v#iq%y#iq%{#iq$m#iq$q#iq~O#V+cOw$hax$ha~Ol-jOs-xOx&Ti~P'ROw+eOx&Ti~Ox$QO%Z+gOw&VX!O&VX~O%UVOw&VX!O&VX~Ow+kO!O&UX~O!O+mO~OT$zO_$zOl-jOs-xO!O%ei~P'ROx+pOw$Qa!W$Qa~Ol-jOs-xOx+qOw$Qa!W$Qa~P'ROl-jOs-xOx)zO!W%gi~P'ROw+tO!W%gi~Ol-jOs-xOw+tO!W%gi~P'ROw+tOx+wO!W%gi~Ow#|i!O#|i!W#|i~P$_OT'qOl-jOs-xO~P'ROk+yO~OT'qOl-jOs-xO!O+zO~P'ROT'qOl-jOs-xO!W%cq~P'ROw#{i![#{i#^#{i$n#{i$q#{i!O#{ix#{i!j#{i%Z#{i~P$_OT(QOl-jOs-xO~P'RO_*eOl-jOs-xO![%dq~P'ROw+{O![%dq~O![+|O~OT(QOl-jOs-xO![%^q#^%^q$n%^q$q%^q!O%^qx%^q!j%^q%Z%^q~P'ROx+}O~OT*iOl-jOs-xOx%ri![%ri!j%ri~P'ROw,SOx%ri![%ri!j%ri~O!Z#[O%t*mO![!ka~OT&POl-jOs-xO#^$wi$n$wi$q$wi%Z$wi~P'ROw,UO#^$wi$n$wi$q$wi%Z$wi~O%UVO#^&Pa$n&Pa$q&Pa!O&Pa~Ow,XO#^&Pa$n&Pa$q&Pa!O&Pa~O!O,[O~Ok$fiw$fi~P$_OT)TO~P'ROT)TOk&Sq~P'ROq,`OP#hyT#hyd#hyf#hyl#hyp#hys#hy|#hy}#hy!R#hy!S#hy!V#hy!Z#hy!f#hy!m#hy!n#hy!o#hy!v#hy!x#hy!z#hy!|#hy#O#hy#S#hy#U#hy#X#hy#Y#hy#[#hy#g#hy#j#hy#n#hy#p#hy#u#hy#x#hy$k#hy$n#hy%O#hy%P#hy%T#hy%U#hy%i#hy%j#hy%m#hy%p#hy%v#hy%y#hy%{#hy$m#hy$q#hy~OPhOTeOltOp!SOsuO|vO}!PO!R!VO!S!UO!vxO!xyO!zzO!|{O#O|O#S}O#U!OO#X!QO#Y!QO#[!RO#g!TO#j!WO#n!XO#p!YO#u!ZO#xlO$m,dO$q,eO~P'RO#l,gOP#iyT#iyd#iyf#iyl#iyp#iys#iy|#iy}#iy!R#iy!S#iy!V#iy!Z#iy!f#iy!m#iy!n#iy!o#iy!v#iy!x#iy!z#iy!|#iy#O#iy#S#iy#U#iy#X#iy#Y#iy#[#iy#g#iy#j#iy#n#iy#p#iy#u#iy#x#iy$k#iy$n#iy%O#iy%P#iy%T#iy%U#iy%i#iy%j#iy%m#iy%p#iy%v#iy%y#iy%{#iy$m#iy$q#iy~Ol-jOs-xOx&Tq~P'ROw,kOx&Tq~O%Z+gOw&Va!O&Va~OT)kO_)lO%Q)mO%UVO!O&Ua~Ow,oO!O&Ua~OT$zO_$zOl-jOs-xO~P'ROl-jOs-xOx,qOw$Qi!W$Qi~P'ROl-jOs-xOw$Qi!W$Qi~P'ROx,qOw$Qi!W$Qi~Ol-jOs-xOx)zO~P'ROl-jOs-xOx)zO!W%gq~P'ROw,tO!W%gq~Ol-jOs-xOw,tO!W%gq~P'ROp,wO!R%aO!S%`O!O%_q!W%_q![%_qw%_q~P!,nO_*eOl-jOs-xO![%dy~P'ROw$Oi![$Oi~P$_O_*eOl-jOs-xO~P'ROT*iOl-jOs-xO~P'ROT*iOl-jOs-xOx%rq![%rq!j%rq~P'ROT&POl-jOs-xO#^$wq$n$wq$q$wq%Z$wq~P'RO#V,{Ow$aa#^$aa$n$aa$q$aa!O$aa~O%UVO#^&Pi$n&Pi$q&Pi!O&Pi~Ow,}O#^&Pi$n&Pi$q&Pi!O&Pi~O!O-PO~Oq-ROP#h!RT#h!Rd#h!Rf#h!Rl#h!Rp#h!Rs#h!R|#h!R}#h!R!R#h!R!S#h!R!V#h!R!Z#h!R!f#h!R!m#h!R!n#h!R!o#h!R!v#h!R!x#h!R!z#h!R!|#h!R#O#h!R#S#h!R#U#h!R#X#h!R#Y#h!R#[#h!R#g#h!R#j#h!R#n#h!R#p#h!R#u#h!R#x#h!R$k#h!R$n#h!R%O#h!R%P#h!R%T#h!R%U#h!R%i#h!R%j#h!R%m#h!R%p#h!R%v#h!R%y#h!R%{#h!R$m#h!R$q#h!R~Ol-jOs-xOx&Ty~P'ROT)kO_)lO%Q)mO%UVO!O&Ui~Ol-jOs-xOw$Qq!W$Qq~P'ROx-XOw$Qq!W$Qq~Ol-jOs-xOx)zO!W%gy~P'ROw-YO!W%gy~Ol-jOs-^O~P'ROp,wO!R%aO!S%`O!O%_y!W%_y![%_yw%_y~P!,nO%UVO#^&Pq$n&Pq$q&Pq!O&Pq~Ow-bO#^&Pq$n&Pq$q&Pq!O&Pq~OT)kO_)lO%Q)mO%UVO~Ol-jOs-xOw$Qy!W$Qy~P'ROl-jOs-xOx)zO!W%g!R~P'ROw-eO!W%g!R~Op%bX!O%bX!R%bX!S%bX!W%bX![%bXw%bX~P!,nOp,wO!R%aO!S%`O!O%aa!W%aa![%aaw%aa~O%UVO#^&Py$n&Py$q&Py!O&Py~Ol-jOs-xOx)zO!W%g!Z~P'ROx-hO~Ow*qO#^$wa$n$wa$q$wa%Z$wa~P$_OT&POl-jOs-xO~P'ROk-oO~Ol-oO~P'ROx-pO~Oq-qO~P!,nO%j%m%y%{%i!Z%q%w%z%|%p%v%p%U~",
                goto: "!-S&WPPPP&XP&a)r*X*o+W+p,ZP,uP&a-c-c&aP&aP0tPPPPPP0t3dPP3dP5p5y:}PP;Q;`;cPPP&a&aPP;o&aPP&a&aPP&a&a&a&a;s<g&aP<jP<m<m@SP@h&aPPP@l@r&XP&X&XP&XP&XP&XP&XP&X&X&XP&XPP&XPP&XP@xPAPAVCOCRCUCUPAPPAPAPPPPAPPCXPCbChCnCXPAPCtPC{DRDXDeDwD}EXE_E{FRFXF_FiFoFuF{GRGXGkGuG{HRHXHcHiHoHuH{IVI]IgImPPPPPPPPPIvJOJXJcJnPPPPPPPPPPPP! T! m!%{!)XPP!)a!)o!)x!*n!*e!*w!*}!+Q!+T!+W!+`PPPPPPPPPP!+c!+fPPPPPPPPP!+l!+x!,U!,b!,e!,k!,q!,w!,z]iOr#l$l)^+]'odOSXYZehrstvx|}!R!S!T!U!X!c!d!e!f!g!h!i!k!n!o!p!r!s!y!|#Q#R#[#i#l#}$O$Q$S$V$g$i$j$l$z%P%W%Z%]%`%d%i%k%u%}&P&[&`&i&k&l&s&w&z'S'V'a'b'e'g'h'l'q's'w'{(Q(R(X([(c(e(m(p(|)P)T)U)Y)^)g)q)w)z){*O*U*V*X*Z*^*_*b*e*i*j*q*s*t*|+U+V+]+d+e+h+o+p+q+s+t+w+y+{+},P,R,S,U,k,m,q,t,w-X-Y-e-h-j-k-l-m-o-p-q-r-s-u-yw!cP#h#u$W$f%b%g%m%n&a&y(d(o)S*S*]+T,O-ny!dP#h#u$W$f$r%b%g%m%n&a&y(d(o)S*S*]+T,O-n{!eP#h#u$W$f$r$s%b%g%m%n&a&y(d(o)S*S*]+T,O-n}!fP#h#u$W$f$r$s$t%b%g%m%n&a&y(d(o)S*S*]+T,O-n!P!gP#h#u$W$f$r$s$t$u%b%g%m%n&a&y(d(o)S*S*]+T,O-n!R!hP#h#u$W$f$r$s$t$u$v%b%g%m%n&a&y(d(o)S*S*]+T,O-n!V!hP!m#h#u$W$f$r$s$t$u$v$w%b%g%m%n&a&y(d(o)S*S*]+T,O-n'oSOSXYZehrstvx|}!R!S!T!U!X!c!d!e!f!g!h!i!k!n!o!p!r!s!y!|#Q#R#[#i#l#}$O$Q$S$V$g$i$j$l$z%P%W%Z%]%`%d%i%k%u%}&P&[&`&i&k&l&s&w&z'S'V'a'b'e'g'h'l'q's'w'{(Q(R(X([(c(e(m(p(|)P)T)U)Y)^)g)q)w)z){*O*U*V*X*Z*^*_*b*e*i*j*q*s*t*|+U+V+]+d+e+h+o+p+q+s+t+w+y+{+},P,R,S,U,k,m,q,t,w-X-Y-e-h-j-k-l-m-o-p-q-r-s-u-y&ZUOXYZhrtv|}!R!S!T!X!i!k!n!o!p!r!s#[#i#l$O$Q$S$V$j$l$z%P%W%Z%]%d%i%k%u%}&[&`&k&l&s&z'S'V'a'b'e'g'h'l's'{(R(X([(c(e(m(|)P)Y)^)g)q)w)z){*O*U*V*X*Z*^*_*b*i*j*q*t*|+]+d+e+h+o+p+q+s+t+w+y+{+},P,R,S,U,k,m,q,t,w-X-Y-e-h-j-k-l-m-o-p-q-r-u-y%eWOXYZhrv|}!R!S!T!X!i!k#[#i#l$O$Q$S$V$j$l$z%P%Z%]%d%i%k%u%}&[&`&k&l&s&z'S'V'a'b'e'g'h'l's'{(R(X([(c(e(m(|)P)Y)^)g)q)w)z){*O*U*X*Z*^*_*b*i*j*q*t*|+]+d+e+h+o+p+q+s+t+w+{+},P,R,S,U,k,m,q,t-X-Y-e-p-q-rQ#{uQ-f-^R-v-x'fdOSXYZehrstvx|}!R!S!T!U!X!c!d!e!f!g!h!k!n!o!p!r!s!y!|#Q#R#[#i#l#}$O$Q$S$V$g$i$j$l$z%P%W%Z%]%`%d%i%k%u%}&P&[&`&i&k&l&s&w&z'S'V'a'e'g'h'l'q's'w'{(Q(R(X([(c(e(m(p(|)P)T)U)Y)^)g)q)z){*O*U*V*X*Z*^*_*b*e*i*j*q*s*t*|+U+V+]+d+e+h+p+q+s+t+w+y+{+},P,R,S,U,k,m,q,t,w-X-Y-e-h-j-k-l-m-o-p-q-r-s-u-yW#ol!O!P$^W#wu&^-^-xQ$`!QQ$p!YQ$q!ZW$y!i'b)w+oS&]#x#yQ&}$kQ(f&VQ(t&mW(u&o(v(w*zU(x&q(y*{Q)i'XW)j'Z+k,o-VS+j)k)lY,W*u,X,|,}-bQ,Z*wQ,h+aQ,j+cR-a,{R&[#wi!vXY!S!T%]%d's'{)P*U*X*ZR%Z!uQ!zXQ%v#[Q&e$SR&h$VT-],w-h!U!jP!m#h#u$W$f$r$s$t$u$v$w%b%g%m%n&a&y(d(o)S*S*]+T,O-nQ&Y#pR'^$qR'a$yR%S!l'ncOSXYZehrstvx|}!R!S!T!U!X!c!d!e!f!g!h!i!k!n!o!p!r!s!y!|#Q#R#[#i#l#}$O$Q$S$V$g$i$j$l$z%P%W%Z%]%`%d%i%k%u%}&P&[&`&i&k&l&s&w&z'S'V'a'b'e'g'h'l'q's'w'{(Q(R(X([(c(e(m(p(|)P)T)U)Y)^)g)q)w)z){*O*U*V*X*Z*^*_*b*e*i*j*q*s*t*|+U+V+]+d+e+h+o+p+q+s+t+w+y+{+},P,R,S,U,k,m,q,t,w-X-Y-e-h-j-k-l-m-o-p-q-r-s-u-yT#fc#gS#]_#^S#``#aS#ba#cS#db#eT*m(_*nT(`%v(bQ$UwR+i)jX$Sw$T$U&gZkOr$l)^+]XoOr)^+]Q$m!WQ&u$dQ&v$eQ'Y$oQ']$qQ)Z&|Q)b'SQ)d'TQ)e'UQ)r'[Q)t'^Q+P)PQ+R)QQ+S)RQ+W)XS+Y)[)sQ+^)`Q+_)aQ+`)cQ,^+OQ,_+QQ,a+XQ,b+ZQ,i+bQ-Q,`Q-S,gQ-T,hR-c-RR'Q$lR)^'QR,f+]WoOr)^+]R#rnQ'[$pR)[&}Q+h)jR,m+iQ)s'[R+Z)[ZmOnr)^+]QrOR#trQ&_#zR(k&_S%j#P#|S(S%j(VT(V%m&aQ%^!xQ%e!{W't%^%e'y'}Q'y%bR'}%gQ&j$WR(q&jQ(Y%nQ*`(TT*f(Y*`Q'c${R)x'cS'f%O%PY)|'f)}+u,u-ZU)}'g'h'iU+u*O*P*QS,u+v+wR-Z,vQ#W]R%q#WQ#Z^R%s#ZQ#^_R%w#^Q(]%tS*k(]*lR*l(^Q*n(_R,T*nQ#a`R%y#aQ#caR%z#cQ#ebR%{#eQ#gcR%|#gQ#jfQ&O#hW&R#j&O(n*rQ(n&dR*r-nQ$TwS&f$T&gR&g$UQ&t$bR(}&tQ&W#oR(g&WQ$^!PR&n$^Q*v(uS,Y*v-OR-O,ZQ&r$`R(z&rQ#mjR&T#mQ+])^R,c+]Q)O&uR*})OQ&x$fS)V&x)WR)W&yQ'R$mR)_'RQ'W$nS)h'W+fR+f)iQ+l)nR,p+lWnOr)^+]R#qnSqOrT+[)^+]WpOr)^+]R'P$lYjOr$l)^+]R&S#l[wOr#l$l)^+]R&e$S&YPOXYZhrtv|}!R!S!T!X!i!k!n!o!p!r!s#[#i#l$O$Q$S$V$j$l$z%P%W%Z%]%d%i%k%u%}&[&`&k&l&s&z'S'V'a'b'e'g'h'l's'{(R(X([(c(e(m(|)P)Y)^)g)q)w)z){*O*U*V*X*Z*^*_*b*i*j*q*t*|+]+d+e+h+o+p+q+s+t+w+y+{+},P,R,S,U,k,m,q,t,w-X-Y-e-h-j-k-l-m-o-p-q-r-u-yQ!mSQ#heQ#usU$Wx%`'wS$f!U$iQ$r!cQ$s!dQ$t!eQ$u!fQ$v!gQ$w!hQ%b!yQ%g!|Q%m#QQ%n#RQ&a#}Q&y$gQ(d&PU(o&i(p*sW)S&w)U+U+VQ*S'qQ*](QQ+T)TQ,O*eR-n-sQ!xXQ!{YQ$d!SQ$e!T^'p%]%d's'{*U*X*ZR+Q)P[fOr#l$l)^+]h!uXY!S!T%]%d's'{)P*U*X*ZQ#PZQ#khS#|v|Q$Z}W$b!R$V&z)YS$n!X$jW$x!i'b)w+oQ%O!kQ%t#[`&Q#i%}(c(e(m*q,U-rQ&b$OQ&c$QQ&d$SQ'_$zQ'i%PQ'o%ZW(P%i(R*^*bQ(T%kQ(^%uQ(i&[S(l&`-pQ(r&kQ(s&lU({&s(|*|Q)c'SY)f'V)g+d+e,kQ)u'a^)y'e){+s+t,t-Y-eQ*P'gQ*Q'hS*R'l-qW*d(X*_+{,PW*h([*j,R,SQ+n)qQ+r)zQ+v*OQ,Q*iQ,V*tQ,l+hQ,r+pQ,s+qQ,v+wQ,z+}Q-U,mQ-W,qR-d-XhTOr#i#l$l%}&`'l(c(e)^+]$z!tXYZhv|}!R!S!T!X!i!k#[$O$Q$S$V$j$z%P%Z%]%d%i%k%u&[&k&l&s&z'S'V'a'b'e'g'h's'{(R(X([(m(|)P)Y)g)q)w)z){*O*U*X*Z*^*_*b*i*j*q*t*|+d+e+h+o+p+q+s+t+w+{+},P,R,S,U,k,m,q,t-X-Y-e-p-q-rQ#vtW%T!n!r-k-uQ%U!oQ%V!pQ%X!sQ%c-jS'k%W-oQ'm-lQ'n-mQ+x*VQ,y+yS-[,w-hR-w-yU#zu-^-xR(j&^[gOr#l$l)^+]X!wX#[$S$VQ#UZQ$PvR$Y|Q%_!xQ%f!{Q%l#PQ'_$xQ'z%bQ(O%gQ(W%mQ(Z%nQ*a(TQ,x+xQ-`,yR-g-_Q$XxQ'v%`R*W'wQ-_,wR-i-hR#OYR#TZR$}!iQ${!iV)v'b)w+oR%Q!kR%v#[Q(a%vR*p(bQ$c!RQ&h$VQ)X&zR+X)YQ#plQ$[!OQ$_!PR&p$^Q(t&oQ*x(vQ*y(wR,]*zR$a!QXpOr)^+]Q$h!UR&{$iQ$o!XR&|$jR)p'ZQ)n'ZV,n+k,o-V",
                nodeNames: "ErrorNode print Comment Script AssignStatement * BinaryExpression BitOp BitOp BitOp BitOp ArithOp ArithOp @ ArithOp ** UnaryExpression ArithOp BitOp AwaitExpression await ParenthesizedExpression ( BinaryExpression or and CompareOp in not is UnaryExpression ConditionalExpression if else LambdaExpression lambda ParamList VariableName AssignOp , : NamedExpression AssignOp YieldExpression yield from ) TupleExpression ComprehensionExpression async for LambdaExpression ArrayExpression [ ] ArrayComprehensionExpression DictionaryExpression { } DictionaryComprehensionExpression SetExpression SetComprehensionExpression CallExpression ArgList AssignOp MemberExpression . PropertyName Number String FormatString FormatReplacement FormatConversion FormatSpec ContinuedString Ellipsis None Boolean TypeDef AssignOp UpdateStatement UpdateOp ExpressionStatement DeleteStatement del PassStatement pass BreakStatement break ContinueStatement continue ReturnStatement return YieldStatement PrintStatement RaiseStatement raise ImportStatement import as ScopeStatement global nonlocal AssertStatement assert StatementGroup ; IfStatement Body Newline Indent Dedent EOF elif WhileStatement while ForStatement TryStatement try except finally WithStatement with FunctionDefinition def ParamList AssignOp TypeDef ClassDefinition class DecoratedStatement Decorator At",
                maxTerm: 238,
                context: trackIndent,
                nodeProps: [[NodeProp.group, -14, 4, 80, 82, 83, 85, 87, 89, 91, 93, 94, 95, 97, 100, 103, "Statement Statement", -22, 6, 16, 19, 21, 37, 47, 48, 52, 55, 56, 59, 60, 61, 62, 65, 68, 69, 70, 74, 75, 76, 77, "Expression", -9, 105, 107, 114, 116, 117, 121, 123, 128, 130, "Statement"]],
                skippedNodes: [0, 2],
                repeatNodeCount: 32,
                tokenData: "&?uMgR!^OX$}XY!#xY[$}[]!#x]p$}pq!#xqr!&Srs!)yst!CZtu$}uv$+]vw$-owx$.{xy$KPyz$LVz{$M]{|% {|}%#X}!O%$_!O!P%&t!P!Q%1z!Q!R%4j!R![%8l![!]%Ch!]!^%Ez!^!_%GQ!_!`%Ip!`!a%J|!a!b$}!b!c%Mi!c!d%Nw!d!e&!i!e!h%Nw!h!i&,g!i!t%Nw!t!u&5{!u!w%Nw!w!x&*u!x!}%Nw!}#O&8V#O#P!%b#P#Q&9]#Q#R&:c#R#S%Nw#S#T$}#T#U%Nw#U#V&!i#V#Y%Nw#Y#Z&,g#Z#f%Nw#f#g&5{#g#i%Nw#i#j&*u#j#o%Nw#o#p&;o#p#q&<e#q#r&=q#r#s&>o#s$g$}$g~%Nw<r%`Z%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}9[&^Z%t7[%kS%q`%z!bOr'PrsCxsw'Pwx(Px#O'P#O#P>v#P#o'P#o#pCU#p#q'P#q#r?[#r~'P9['^Z%t7[%kS%nW%q`%z!bOr'Prs&Rsw'Pwx(Px#O'P#O#P>v#P#o'P#o#pCU#p#q'P#q#r?[#r~'P8z(WZ%t7[%nWOr(yrs)wsw(ywx;bx#O(y#O#P2V#P#o(y#o#p7n#p#q(y#q#r2k#r~(y8z)UZ%t7[%kS%nW%z!bOr(yrs)wsw(ywx(Px#O(y#O#P2V#P#o(y#o#p7n#p#q(y#q#r2k#r~(y8z*QZ%t7[%kS%z!bOr(yrs*ssw(ywx(Px#O(y#O#P2V#P#o(y#o#p7n#p#q(y#q#r2k#r~(y8z*|Z%t7[%kS%z!bOr(yrs+osw(ywx(Px#O(y#O#P2V#P#o(y#o#p7n#p#q(y#q#r2k#r~(y8r+xX%t7[%kS%z!bOw+owx,ex#O+o#O#P.V#P#o+o#o#p0^#p#q+o#q#r.k#r~+o8r,jX%t7[Ow+owx-Vx#O+o#O#P.V#P#o+o#o#p0^#p#q+o#q#r.k#r~+o8r-[X%t7[Ow+owx-wx#O+o#O#P.V#P#o+o#o#p0^#p#q+o#q#r.k#r~+o7[-|R%t7[O#o-w#p#q-w#r~-w8r.[T%t7[O#o+o#o#p.k#p#q+o#q#r.k#r~+o!f.rV%kS%z!bOw.kwx/Xx#O.k#O#P0W#P#o.k#o#p0^#p~.k!f/[VOw.kwx/qx#O.k#O#P0W#P#o.k#o#p0^#p~.k!f/tUOw.kx#O.k#O#P0W#P#o.k#o#p0^#p~.k!f0ZPO~.k!f0cV%kSOw0xwx1^x#O0x#O#P2P#P#o0x#o#p.k#p~0xS0}T%kSOw0xwx1^x#O0x#O#P2P#P~0xS1aTOw0xwx1px#O0x#O#P2P#P~0xS1sSOw0xx#O0x#O#P2P#P~0xS2SPO~0x8z2[T%t7[O#o(y#o#p2k#p#q(y#q#r2k#r~(y!n2tX%kS%nW%z!bOr2krs3asw2kwx4wx#O2k#O#P7h#P#o2k#o#p7n#p~2k!n3hX%kS%z!bOr2krs4Tsw2kwx4wx#O2k#O#P7h#P#o2k#o#p7n#p~2k!n4[X%kS%z!bOr2krs.ksw2kwx4wx#O2k#O#P7h#P#o2k#o#p7n#p~2k!n4|X%nWOr2krs3asw2kwx5ix#O2k#O#P7h#P#o2k#o#p7n#p~2k!n5nX%nWOr2krs3asw2kwx6Zx#O2k#O#P7h#P#o2k#o#p7n#p~2kW6`T%nWOr6Zrs6os#O6Z#O#P7b#P~6ZW6rTOr6Zrs7Rs#O6Z#O#P7b#P~6ZW7USOr6Zs#O6Z#O#P7b#P~6ZW7ePO~6Z!n7kPO~2k!n7uX%kS%nWOr8brs9Osw8bwx:Ux#O8b#O#P;[#P#o8b#o#p2k#p~8b[8iV%kS%nWOr8brs9Osw8bwx:Ux#O8b#O#P;[#P~8b[9TV%kSOr8brs9jsw8bwx:Ux#O8b#O#P;[#P~8b[9oV%kSOr8brs0xsw8bwx:Ux#O8b#O#P;[#P~8b[:ZV%nWOr8brs9Osw8bwx:px#O8b#O#P;[#P~8b[:uV%nWOr8brs9Osw8bwx6Zx#O8b#O#P;[#P~8b[;_PO~8b8z;iZ%t7[%nWOr(yrs)wsw(ywx<[x#O(y#O#P2V#P#o(y#o#p7n#p#q(y#q#r2k#r~(y7d<cX%t7[%nWOr<[rs=Os#O<[#O#P>b#P#o<[#o#p6Z#p#q<[#q#r6Z#r~<[7d=TX%t7[Or<[rs=ps#O<[#O#P>b#P#o<[#o#p6Z#p#q<[#q#r6Z#r~<[7d=uX%t7[Or<[rs-ws#O<[#O#P>b#P#o<[#o#p6Z#p#q<[#q#r6Z#r~<[7d>gT%t7[O#o<[#o#p6Z#p#q<[#q#r6Z#r~<[9[>{T%t7[O#o'P#o#p?[#p#q'P#q#r?[#r~'P#O?gX%kS%nW%q`%z!bOr?[rs@Ssw?[wx4wx#O?[#O#PCO#P#o?[#o#pCU#p~?[#O@]X%kS%q`%z!bOr?[rs@xsw?[wx4wx#O?[#O#PCO#P#o?[#o#pCU#p~?[#OARX%kS%q`%z!bOr?[rsAnsw?[wx4wx#O?[#O#PCO#P#o?[#o#pCU#p~?[!vAwV%kS%q`%z!bOwAnwx/Xx#OAn#O#PB^#P#oAn#o#pBd#p~An!vBaPO~An!vBiV%kSOw0xwx1^x#O0x#O#P2P#P#o0x#o#pAn#p~0x#OCRPO~?[#OC]X%kS%nWOr8brs9Osw8bwx:Ux#O8b#O#P;[#P#o8b#o#p?[#p~8b9[DTZ%t7[%kS%q`%z!bOr'PrsDvsw'Pwx(Px#O'P#O#P>v#P#o'P#o#pCU#p#q'P#q#r?[#r~'P9SERX%t7[%kS%q`%z!bOwDvwx,ex#ODv#O#PEn#P#oDv#o#pBd#p#qDv#q#rAn#r~Dv9SEsT%t7[O#oDv#o#pAn#p#qDv#q#rAn#r~Dv<bF_Z%t7[%nW%wp%|#tOrGQrs)wswGQwxM^x#OGQ#O#PHS#P#oGQ#o#pLj#p#qGQ#q#rHh#r~GQ<bGaZ%t7[%kS%nW%wp%z!b%|#tOrGQrs)wswGQwxFSx#OGQ#O#PHS#P#oGQ#o#pLj#p#qGQ#q#rHh#r~GQ<bHXT%t7[O#oGQ#o#pHh#p#qGQ#q#rHh#r~GQ&UHuX%kS%nW%wp%z!b%|#tOrHhrs3aswHhwxIbx#OHh#O#PLd#P#oHh#o#pLj#p~Hh&UIkX%nW%wp%|#tOrHhrs3aswHhwxJWx#OHh#O#PLd#P#oHh#o#pLj#p~Hh&UJaX%nW%wp%|#tOrHhrs3aswHhwxJ|x#OHh#O#PLd#P#oHh#o#pLj#p~Hh$nKVX%nW%wp%|#tOrJ|rs6oswJ|wxJ|x#OJ|#O#PKr#P#oJ|#o#pKx#p~J|$nKuPO~J|$nK}V%nWOr6Zrs6os#O6Z#O#P7b#P#o6Z#o#pJ|#p~6Z&ULgPO~Hh&ULqX%kS%nWOr8brs9Osw8bwx:Ux#O8b#O#P;[#P#o8b#o#pHh#p~8b<bMiZ%t7[%nW%wp%|#tOrGQrs)wswGQwxN[x#OGQ#O#PHS#P#oGQ#o#pLj#p#qGQ#q#rHh#r~GQ:zNgZ%t7[%nW%wp%|#tOrN[rs=OswN[wxN[x#ON[#O#P! Y#P#oN[#o#pKx#p#qN[#q#rJ|#r~N[:z! _T%t7[O#oN[#o#pJ|#p#qN[#q#rJ|#r~N[<r! sT%t7[O#o$}#o#p!!S#p#q$}#q#r!!S#r~$}&f!!cX%kS%nW%q`%wp%z!b%|#tOr!!Srs@Ssw!!SwxIbx#O!!S#O#P!#O#P#o!!S#o#p!#U#p~!!S&f!#RPO~!!S&f!#]X%kS%nWOr8brs9Osw8bwx:Ux#O8b#O#P;[#P#o8b#o#p!!S#p~8bMg!$]a%t7[%kS%nW$s1s%q`%wp%z!b%|#tOX$}XY!#xY[$}[]!#x]p$}pq!#xqr$}rs&Rsw$}wxFSx#O$}#O#P!%b#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Mg!%gX%t7[OY$}YZ!#xZ]$}]^!#x^#o$}#o#p!!S#p#q$}#q#r!!S#r~$}<u!&eb%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!_$}!_!`!'m!`#O$}#O#P! n#P#T$}#T#U!(s#U#f$}#f#g!(s#g#h!(s#h#o$}#o#p!#U#p#q$}#q#r!!S#r~$}<u!(QZjR%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}<u!)WZ!jR%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{!*W_%xp%t7[%kS%q`%z!bOY!+VYZ'PZ]!+V]^'P^r!+Vrs!A_sw!+Vwx!-cx#O!+V#O#P!=w#P#o!+V#o#p!@_#p#q!+V#q#r!>]#r~!+VDe!+d_%t7[%kS%nW%q`%z!bOY!+VYZ'PZ]!+V]^'P^r!+Vrs!,csw!+Vwx!-cx#O!+V#O#P!=w#P#o!+V#o#p!@_#p#q!+V#q#r!>]#r~!+VDe!,pZ%t7[%kS%i,X%q`%z!bOr'PrsCxsw'Pwx(Px#O'P#O#P>v#P#o'P#o#pCU#p#q'P#q#r?[#r~'PDT!-j_%t7[%nWOY!.iYZ(yZ]!.i]^(y^r!.irs!/ssw!.iwx!:ix#O!.i#O#P!0q#P#o!.i#o#p!6]#p#q!.i#q#r!1V#r~!.iDT!.t_%t7[%kS%nW%z!bOY!.iYZ(yZ]!.i]^(y^r!.irs!/ssw!.iwx!-cx#O!.i#O#P!0q#P#o!.i#o#p!6]#p#q!.i#q#r!1V#r~!.iDT!0OZ%t7[%kS%i,X%z!bOr(yrs*ssw(ywx(Px#O(y#O#P2V#P#o(y#o#p7n#p#q(y#q#r2k#r~(yDT!0vT%t7[O#o!.i#o#p!1V#p#q!.i#q#r!1V#r~!.i-w!1`]%kS%nW%z!bOY!1VYZ2kZ]!1V]^2k^r!1Vrs!2Xsw!1Vwx!2}x#O!1V#O#P!6V#P#o!1V#o#p!6]#p~!1V-w!2bX%kS%i,X%z!bOr2krs4Tsw2kwx4wx#O2k#O#P7h#P#o2k#o#p7n#p~2k-w!3S]%nWOY!1VYZ2kZ]!1V]^2k^r!1Vrs!2Xsw!1Vwx!3{x#O!1V#O#P!6V#P#o!1V#o#p!6]#p~!1V-w!4Q]%nWOY!1VYZ2kZ]!1V]^2k^r!1Vrs!2Xsw!1Vwx!4yx#O!1V#O#P!6V#P#o!1V#o#p!6]#p~!1V,a!5OX%nWOY!4yYZ6ZZ]!4y]^6Z^r!4yrs!5ks#O!4y#O#P!6P#P~!4y,a!5pT%i,XOr6Zrs7Rs#O6Z#O#P7b#P~6Z,a!6SPO~!4y-w!6YPO~!1V-w!6d]%kS%nWOY!7]YZ8bZ]!7]]^8b^r!7]rs!8Vsw!7]wx!8sx#O!7]#O#P!:c#P#o!7]#o#p!1V#p~!7],e!7dZ%kS%nWOY!7]YZ8bZ]!7]]^8b^r!7]rs!8Vsw!7]wx!8sx#O!7]#O#P!:c#P~!7],e!8^V%kS%i,XOr8brs9jsw8bwx:Ux#O8b#O#P;[#P~8b,e!8xZ%nWOY!7]YZ8bZ]!7]]^8b^r!7]rs!8Vsw!7]wx!9kx#O!7]#O#P!:c#P~!7],e!9pZ%nWOY!7]YZ8bZ]!7]]^8b^r!7]rs!8Vsw!7]wx!4yx#O!7]#O#P!:c#P~!7],e!:fPO~!7]DT!:p_%t7[%nWOY!.iYZ(yZ]!.i]^(y^r!.irs!/ssw!.iwx!;ox#O!.i#O#P!0q#P#o!.i#o#p!6]#p#q!.i#q#r!1V#r~!.iBm!;v]%t7[%nWOY!;oYZ<[Z]!;o]^<[^r!;ors!<os#O!;o#O#P!=c#P#o!;o#o#p!4y#p#q!;o#q#r!4y#r~!;oBm!<vX%t7[%i,XOr<[rs=ps#O<[#O#P>b#P#o<[#o#p6Z#p#q<[#q#r6Z#r~<[Bm!=hT%t7[O#o!;o#o#p!4y#p#q!;o#q#r!4y#r~!;oDe!=|T%t7[O#o!+V#o#p!>]#p#q!+V#q#r!>]#r~!+V.X!>h]%kS%nW%q`%z!bOY!>]YZ?[Z]!>]]^?[^r!>]rs!?asw!>]wx!2}x#O!>]#O#P!@X#P#o!>]#o#p!@_#p~!>].X!?lX%kS%i,X%q`%z!bOr?[rs@xsw?[wx4wx#O?[#O#PCO#P#o?[#o#pCU#p~?[.X!@[PO~!>].X!@f]%kS%nWOY!7]YZ8bZ]!7]]^8b^r!7]rs!8Vsw!7]wx!8sx#O!7]#O#P!:c#P#o!7]#o#p!>]#p~!7]GZ!AlZ%t7[%kS%i,X%q`%z!bOr'Prs!B_sw'Pwx(Px#O'P#O#P>v#P#o'P#o#pCU#p#q'P#q#r?[#r~'PGZ!BnX%o#|%t7[%kS%m,X%q`%z!bOwDvwx,ex#ODv#O#PEn#P#oDv#o#pBd#p#qDv#q#rAn#r~DvMg!Cn_Q1s%t7[%kS%nW%q`%wp%z!b%|#tOY!CZYZ$}Z]!CZ]^$}^r!CZrs!Dmsw!CZwx#HPx#O!CZ#O#P$'w#P#o!CZ#o#p$*Z#p#q!CZ#q#r$(k#r~!CZJP!Dz_Q1s%t7[%kS%q`%z!bOY!EyYZ'PZ]!Ey]^'P^r!Eyrs#Dysw!Eywx!GXx#O!Ey#O#P#=T#P#o!Ey#o#p#Cw#p#q!Ey#q#r#=w#r~!EyJP!FY_Q1s%t7[%kS%nW%q`%z!bOY!EyYZ'PZ]!Ey]^'P^r!Eyrs!Dmsw!Eywx!GXx#O!Ey#O#P#=T#P#o!Ey#o#p#Cw#p#q!Ey#q#r#=w#r~!EyIo!Gb_Q1s%t7[%nWOY!HaYZ(yZ]!Ha]^(y^r!Hars!Imsw!Hawx#8Vx#O!Ha#O#P#)a#P#o!Ha#o#p#2]#p#q!Ha#q#r#*T#r~!HaIo!Hn_Q1s%t7[%kS%nW%z!bOY!HaYZ(yZ]!Ha]^(y^r!Hars!Imsw!Hawx!GXx#O!Ha#O#P#)a#P#o!Ha#o#p#2]#p#q!Ha#q#r#*T#r~!HaIo!Ix_Q1s%t7[%kS%z!bOY!HaYZ(yZ]!Ha]^(y^r!Hars!Jwsw!Hawx!GXx#O!Ha#O#P#)a#P#o!Ha#o#p#2]#p#q!Ha#q#r#*T#r~!HaIo!KS_Q1s%t7[%kS%z!bOY!HaYZ(yZ]!Ha]^(y^r!Hars!LRsw!Hawx!GXx#O!Ha#O#P#)a#P#o!Ha#o#p#2]#p#q!Ha#q#r#*T#r~!HaIg!L^]Q1s%t7[%kS%z!bOY!LRYZ+oZ]!LR]^+o^w!LRwx!MVx#O!LR#O#P#!X#P#o!LR#o#p#%{#p#q!LR#q#r#!{#r~!LRIg!M^]Q1s%t7[OY!LRYZ+oZ]!LR]^+o^w!LRwx!NVx#O!LR#O#P#!X#P#o!LR#o#p#%{#p#q!LR#q#r#!{#r~!LRIg!N^]Q1s%t7[OY!LRYZ+oZ]!LR]^+o^w!LRwx# Vx#O!LR#O#P#!X#P#o!LR#o#p#%{#p#q!LR#q#r#!{#r~!LRHP# ^XQ1s%t7[OY# VYZ-wZ]# V]^-w^#o# V#o#p# y#p#q# V#q#r# y#r~# V1s#!ORQ1sOY# yZ]# y^~# yIg#!`XQ1s%t7[OY!LRYZ+oZ]!LR]^+o^#o!LR#o#p#!{#p#q!LR#q#r#!{#r~!LR3Z##UZQ1s%kS%z!bOY#!{YZ.kZ]#!{]^.k^w#!{wx##wx#O#!{#O#P#%g#P#o#!{#o#p#%{#p~#!{3Z##|ZQ1sOY#!{YZ.kZ]#!{]^.k^w#!{wx#$ox#O#!{#O#P#%g#P#o#!{#o#p#%{#p~#!{3Z#$tZQ1sOY#!{YZ.kZ]#!{]^.k^w#!{wx# yx#O#!{#O#P#%g#P#o#!{#o#p#%{#p~#!{3Z#%lTQ1sOY#!{YZ.kZ]#!{]^.k^~#!{3Z#&SZQ1s%kSOY#&uYZ0xZ]#&u]^0x^w#&uwx#'ix#O#&u#O#P#({#P#o#&u#o#p#!{#p~#&u1w#&|XQ1s%kSOY#&uYZ0xZ]#&u]^0x^w#&uwx#'ix#O#&u#O#P#({#P~#&u1w#'nXQ1sOY#&uYZ0xZ]#&u]^0x^w#&uwx#(Zx#O#&u#O#P#({#P~#&u1w#(`XQ1sOY#&uYZ0xZ]#&u]^0x^w#&uwx# yx#O#&u#O#P#({#P~#&u1w#)QTQ1sOY#&uYZ0xZ]#&u]^0x^~#&uIo#)hXQ1s%t7[OY!HaYZ(yZ]!Ha]^(y^#o!Ha#o#p#*T#p#q!Ha#q#r#*T#r~!Ha3c#*`]Q1s%kS%nW%z!bOY#*TYZ2kZ]#*T]^2k^r#*Trs#+Xsw#*Twx#-]x#O#*T#O#P#1w#P#o#*T#o#p#2]#p~#*T3c#+b]Q1s%kS%z!bOY#*TYZ2kZ]#*T]^2k^r#*Trs#,Zsw#*Twx#-]x#O#*T#O#P#1w#P#o#*T#o#p#2]#p~#*T3c#,d]Q1s%kS%z!bOY#*TYZ2kZ]#*T]^2k^r#*Trs#!{sw#*Twx#-]x#O#*T#O#P#1w#P#o#*T#o#p#2]#p~#*T3c#-d]Q1s%nWOY#*TYZ2kZ]#*T]^2k^r#*Trs#+Xsw#*Twx#.]x#O#*T#O#P#1w#P#o#*T#o#p#2]#p~#*T3c#.d]Q1s%nWOY#*TYZ2kZ]#*T]^2k^r#*Trs#+Xsw#*Twx#/]x#O#*T#O#P#1w#P#o#*T#o#p#2]#p~#*T1{#/dXQ1s%nWOY#/]YZ6ZZ]#/]]^6Z^r#/]rs#0Ps#O#/]#O#P#1c#P~#/]1{#0UXQ1sOY#/]YZ6ZZ]#/]]^6Z^r#/]rs#0qs#O#/]#O#P#1c#P~#/]1{#0vXQ1sOY#/]YZ6ZZ]#/]]^6Z^r#/]rs# ys#O#/]#O#P#1c#P~#/]1{#1hTQ1sOY#/]YZ6ZZ]#/]]^6Z^~#/]3c#1|TQ1sOY#*TYZ2kZ]#*T]^2k^~#*T3c#2f]Q1s%kS%nWOY#3_YZ8bZ]#3_]^8b^r#3_rs#4Zsw#3_wx#5}x#O#3_#O#P#7q#P#o#3_#o#p#*T#p~#3_2P#3hZQ1s%kS%nWOY#3_YZ8bZ]#3_]^8b^r#3_rs#4Zsw#3_wx#5}x#O#3_#O#P#7q#P~#3_2P#4bZQ1s%kSOY#3_YZ8bZ]#3_]^8b^r#3_rs#5Tsw#3_wx#5}x#O#3_#O#P#7q#P~#3_2P#5[ZQ1s%kSOY#3_YZ8bZ]#3_]^8b^r#3_rs#&usw#3_wx#5}x#O#3_#O#P#7q#P~#3_2P#6UZQ1s%nWOY#3_YZ8bZ]#3_]^8b^r#3_rs#4Zsw#3_wx#6wx#O#3_#O#P#7q#P~#3_2P#7OZQ1s%nWOY#3_YZ8bZ]#3_]^8b^r#3_rs#4Zsw#3_wx#/]x#O#3_#O#P#7q#P~#3_2P#7vTQ1sOY#3_YZ8bZ]#3_]^8b^~#3_Io#8`_Q1s%t7[%nWOY!HaYZ(yZ]!Ha]^(y^r!Hars!Imsw!Hawx#9_x#O!Ha#O#P#)a#P#o!Ha#o#p#2]#p#q!Ha#q#r#*T#r~!HaHX#9h]Q1s%t7[%nWOY#9_YZ<[Z]#9_]^<[^r#9_rs#:as#O#9_#O#P#<a#P#o#9_#o#p#/]#p#q#9_#q#r#/]#r~#9_HX#:h]Q1s%t7[OY#9_YZ<[Z]#9_]^<[^r#9_rs#;as#O#9_#O#P#<a#P#o#9_#o#p#/]#p#q#9_#q#r#/]#r~#9_HX#;h]Q1s%t7[OY#9_YZ<[Z]#9_]^<[^r#9_rs# Vs#O#9_#O#P#<a#P#o#9_#o#p#/]#p#q#9_#q#r#/]#r~#9_HX#<hXQ1s%t7[OY#9_YZ<[Z]#9_]^<[^#o#9_#o#p#/]#p#q#9_#q#r#/]#r~#9_JP#=[XQ1s%t7[OY!EyYZ'PZ]!Ey]^'P^#o!Ey#o#p#=w#p#q!Ey#q#r#=w#r~!Ey3s#>U]Q1s%kS%nW%q`%z!bOY#=wYZ?[Z]#=w]^?[^r#=wrs#>}sw#=wwx#-]x#O#=w#O#P#Cc#P#o#=w#o#p#Cw#p~#=w3s#?Y]Q1s%kS%q`%z!bOY#=wYZ?[Z]#=w]^?[^r#=wrs#@Rsw#=wwx#-]x#O#=w#O#P#Cc#P#o#=w#o#p#Cw#p~#=w3s#@^]Q1s%kS%q`%z!bOY#=wYZ?[Z]#=w]^?[^r#=wrs#AVsw#=wwx#-]x#O#=w#O#P#Cc#P#o#=w#o#p#Cw#p~#=w3k#AbZQ1s%kS%q`%z!bOY#AVYZAnZ]#AV]^An^w#AVwx##wx#O#AV#O#P#BT#P#o#AV#o#p#Bi#p~#AV3k#BYTQ1sOY#AVYZAnZ]#AV]^An^~#AV3k#BpZQ1s%kSOY#&uYZ0xZ]#&u]^0x^w#&uwx#'ix#O#&u#O#P#({#P#o#&u#o#p#AV#p~#&u3s#ChTQ1sOY#=wYZ?[Z]#=w]^?[^~#=w3s#DQ]Q1s%kS%nWOY#3_YZ8bZ]#3_]^8b^r#3_rs#4Zsw#3_wx#5}x#O#3_#O#P#7q#P#o#3_#o#p#=w#p~#3_JP#EW_Q1s%t7[%kS%q`%z!bOY!EyYZ'PZ]!Ey]^'P^r!Eyrs#FVsw!Eywx!GXx#O!Ey#O#P#=T#P#o!Ey#o#p#Cw#p#q!Ey#q#r#=w#r~!EyIw#Fd]Q1s%t7[%kS%q`%z!bOY#FVYZDvZ]#FV]^Dv^w#FVwx!MVx#O#FV#O#P#G]#P#o#FV#o#p#Bi#p#q#FV#q#r#AV#r~#FVIw#GdXQ1s%t7[OY#FVYZDvZ]#FV]^Dv^#o#FV#o#p#AV#p#q#FV#q#r#AV#r~#FVMV#H^_Q1s%t7[%nW%wp%|#tOY#I]YZGQZ]#I]]^GQ^r#I]rs!Imsw#I]wx$$kx#O#I]#O#P#Jm#P#o#I]#o#p$#i#p#q#I]#q#r#Ka#r~#I]MV#In_Q1s%t7[%kS%nW%wp%z!b%|#tOY#I]YZGQZ]#I]]^GQ^r#I]rs!Imsw#I]wx#HPx#O#I]#O#P#Jm#P#o#I]#o#p$#i#p#q#I]#q#r#Ka#r~#I]MV#JtXQ1s%t7[OY#I]YZGQZ]#I]]^GQ^#o#I]#o#p#Ka#p#q#I]#q#r#Ka#r~#I]6y#Kp]Q1s%kS%nW%wp%z!b%|#tOY#KaYZHhZ]#Ka]^Hh^r#Kars#+Xsw#Kawx#Lix#O#Ka#O#P$#T#P#o#Ka#o#p$#i#p~#Ka6y#Lt]Q1s%nW%wp%|#tOY#KaYZHhZ]#Ka]^Hh^r#Kars#+Xsw#Kawx#Mmx#O#Ka#O#P$#T#P#o#Ka#o#p$#i#p~#Ka6y#Mx]Q1s%nW%wp%|#tOY#KaYZHhZ]#Ka]^Hh^r#Kars#+Xsw#Kawx#Nqx#O#Ka#O#P$#T#P#o#Ka#o#p$#i#p~#Ka5c#N|]Q1s%nW%wp%|#tOY#NqYZJ|Z]#Nq]^J|^r#Nqrs#0Psw#Nqwx#Nqx#O#Nq#O#P$ u#P#o#Nq#o#p$!Z#p~#Nq5c$ zTQ1sOY#NqYZJ|Z]#Nq]^J|^~#Nq5c$!bZQ1s%nWOY#/]YZ6ZZ]#/]]^6Z^r#/]rs#0Ps#O#/]#O#P#1c#P#o#/]#o#p#Nq#p~#/]6y$#YTQ1sOY#KaYZHhZ]#Ka]^Hh^~#Ka6y$#r]Q1s%kS%nWOY#3_YZ8bZ]#3_]^8b^r#3_rs#4Zsw#3_wx#5}x#O#3_#O#P#7q#P#o#3_#o#p#Ka#p~#3_MV$$x_Q1s%t7[%nW%wp%|#tOY#I]YZGQZ]#I]]^GQ^r#I]rs!Imsw#I]wx$%wx#O#I]#O#P#Jm#P#o#I]#o#p$#i#p#q#I]#q#r#Ka#r~#I]Ko$&U_Q1s%t7[%nW%wp%|#tOY$%wYZN[Z]$%w]^N[^r$%wrs#:asw$%wwx$%wx#O$%w#O#P$'T#P#o$%w#o#p$!Z#p#q$%w#q#r#Nq#r~$%wKo$'[XQ1s%t7[OY$%wYZN[Z]$%w]^N[^#o$%w#o#p#Nq#p#q$%w#q#r#Nq#r~$%wMg$(OXQ1s%t7[OY!CZYZ$}Z]!CZ]^$}^#o!CZ#o#p$(k#p#q!CZ#q#r$(k#r~!CZ7Z$(|]Q1s%kS%nW%q`%wp%z!b%|#tOY$(kYZ!!SZ]$(k]^!!S^r$(krs#>}sw$(kwx#Lix#O$(k#O#P$)u#P#o$(k#o#p$*Z#p~$(k7Z$)zTQ1sOY$(kYZ!!SZ]$(k]^!!S^~$(k7Z$*d]Q1s%kS%nWOY#3_YZ8bZ]#3_]^8b^r#3_rs#4Zsw#3_wx#5}x#O#3_#O#P#7q#P#o#3_#o#p$(k#p~#3_Gz$+p]%RQ%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!_$}!_!`$,i!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gz$,|Z!s,W%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gz$.S]${Q%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!_$}!_!`$,i!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{$/Y_%u`%t7[%nW%wp%|#tOY$0XYZGQZ]$0X]^GQ^r$0Xrs$1gsw$0Xwx$H}x#O$0X#O#P$Ee#P#o$0X#o#p$G}#p#q$0X#q#r$Ey#r~$0XGk$0h_%t7[%kS%nW%wp%z!b%|#tOY$0XYZGQZ]$0X]^GQ^r$0Xrs$1gsw$0Xwx$Dex#O$0X#O#P$Ee#P#o$0X#o#p$G}#p#q$0X#q#r$Ey#r~$0XDT$1p_%t7[%kS%z!bOY$2oYZ(yZ]$2o]^(y^r$2ors$ARsw$2owx$3yx#O$2o#O#P$4u#P#o$2o#o#p$<u#p#q$2o#q#r$5Z#r~$2oDT$2z_%t7[%kS%nW%z!bOY$2oYZ(yZ]$2o]^(y^r$2ors$1gsw$2owx$3yx#O$2o#O#P$4u#P#o$2o#o#p$<u#p#q$2o#q#r$5Z#r~$2oDT$4SZ%t7[%nW%i,XOr(yrs)wsw(ywx;bx#O(y#O#P2V#P#o(y#o#p7n#p#q(y#q#r2k#r~(yDT$4zT%t7[O#o$2o#o#p$5Z#p#q$2o#q#r$5Z#r~$2o-w$5d]%kS%nW%z!bOY$5ZYZ2kZ]$5Z]^2k^r$5Zrs$6]sw$5Zwx$;{x#O$5Z#O#P$<o#P#o$5Z#o#p$<u#p~$5Z-w$6d]%kS%z!bOY$5ZYZ2kZ]$5Z]^2k^r$5Zrs$7]sw$5Zwx$;{x#O$5Z#O#P$<o#P#o$5Z#o#p$<u#p~$5Z-w$7d]%kS%z!bOY$5ZYZ2kZ]$5Z]^2k^r$5Zrs$8]sw$5Zwx$;{x#O$5Z#O#P$<o#P#o$5Z#o#p$<u#p~$5Z-o$8dZ%kS%z!bOY$8]YZ.kZ]$8]]^.k^w$8]wx$9Vx#O$8]#O#P$9q#P#o$8]#o#p$9w#p~$8]-o$9[V%i,XOw.kwx/qx#O.k#O#P0W#P#o.k#o#p0^#p~.k-o$9tPO~$8]-o$9|Z%kSOY$:oYZ0xZ]$:o]^0x^w$:owx$;ax#O$:o#O#P$;u#P#o$:o#o#p$8]#p~$:o,]$:tX%kSOY$:oYZ0xZ]$:o]^0x^w$:owx$;ax#O$:o#O#P$;u#P~$:o,]$;fT%i,XOw0xwx1px#O0x#O#P2P#P~0x,]$;xPO~$:o-w$<SX%nW%i,XOr2krs3asw2kwx5ix#O2k#O#P7h#P#o2k#o#p7n#p~2k-w$<rPO~$5Z-w$<|]%kS%nWOY$=uYZ8bZ]$=u]^8b^r$=urs$>osw$=uwx$@_x#O$=u#O#P$@{#P#o$=u#o#p$5Z#p~$=u,e$=|Z%kS%nWOY$=uYZ8bZ]$=u]^8b^r$=urs$>osw$=uwx$@_x#O$=u#O#P$@{#P~$=u,e$>tZ%kSOY$=uYZ8bZ]$=u]^8b^r$=urs$?gsw$=uwx$@_x#O$=u#O#P$@{#P~$=u,e$?lZ%kSOY$=uYZ8bZ]$=u]^8b^r$=urs$:osw$=uwx$@_x#O$=u#O#P$@{#P~$=u,e$@fV%nW%i,XOr8brs9Osw8bwx:px#O8b#O#P;[#P~8b,e$AOPO~$=uDT$A[_%t7[%kS%z!bOY$2oYZ(yZ]$2o]^(y^r$2ors$BZsw$2owx$3yx#O$2o#O#P$4u#P#o$2o#o#p$<u#p#q$2o#q#r$5Z#r~$2oC{$Bd]%t7[%kS%z!bOY$BZYZ+oZ]$BZ]^+o^w$BZwx$C]x#O$BZ#O#P$DP#P#o$BZ#o#p$9w#p#q$BZ#q#r$8]#r~$BZC{$CdX%t7[%i,XOw+owx-Vx#O+o#O#P.V#P#o+o#o#p0^#p#q+o#q#r.k#r~+oC{$DUT%t7[O#o$BZ#o#p$8]#p#q$BZ#q#r$8]#r~$BZGk$DrZ%t7[%nW%i,X%wp%|#tOrGQrs)wswGQwxM^x#OGQ#O#PHS#P#oGQ#o#pLj#p#qGQ#q#rHh#r~GQGk$EjT%t7[O#o$0X#o#p$Ey#p#q$0X#q#r$Ey#r~$0X1_$FW]%kS%nW%wp%z!b%|#tOY$EyYZHhZ]$Ey]^Hh^r$Eyrs$6]sw$Eywx$GPx#O$Ey#O#P$Gw#P#o$Ey#o#p$G}#p~$Ey1_$G[X%nW%i,X%wp%|#tOrHhrs3aswHhwxJWx#OHh#O#PLd#P#oHh#o#pLj#p~Hh1_$GzPO~$Ey1_$HU]%kS%nWOY$=uYZ8bZ]$=u]^8b^r$=urs$>osw$=uwx$@_x#O$=u#O#P$@{#P#o$=u#o#p$Ey#p~$=uGk$I[Z%t7[%nW%i,X%wp%|#tOrGQrs)wswGQwx$I}x#OGQ#O#PHS#P#oGQ#o#pLj#p#qGQ#q#rHh#r~GQGk$J^Z%l!f%t7[%nW%j,X%wp%|#tOrN[rs=OswN[wxN[x#ON[#O#P! Y#P#oN[#o#pKx#p#qN[#q#rJ|#r~N[G{$KdZf,X%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}<u$LjZ!OR%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{$Mp_T,X%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSxz$}z{$No{!_$}!_!`$,i!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{% S]_R%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!_$}!_!`$,i!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{%!`]%O,X%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!_$}!_!`$,i!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}<u%#lZwR%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Mg%$r^%P,X%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!_$}!_!`$,i!`!a%%n!a#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}B^%&RZ&W&j%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{%'X_!dQ%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!O$}!O!P%(W!P!Q$}!Q![%*h![#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{%(i]%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!O$}!O!P%)b!P#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{%)uZ!m,X%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%*{g!f,V%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!Q$}!Q![%*h![!g$}!g!h%,d!h!l$}!l!m%0t!m#O$}#O#P! n#P#R$}#R#S%*h#S#X$}#X#Y%,d#Y#^$}#^#_%0t#_#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%,ua%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx{$}{|%-z|}$}}!O%-z!O!Q$}!Q![%/U![#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%.]]%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!Q$}!Q![%/U![#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%/ic!f,V%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!Q$}!Q![%/U![!l$}!l!m%0t!m#O$}#O#P! n#P#R$}#R#S%/U#S#^$}#^#_%0t#_#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%1XZ!f,V%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{%2__%QR%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!P$}!P!Q%3^!Q!_$}!_!`$,i!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gz%3q]%SQ%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!_$}!_!`$,i!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%4}u!f,V%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!O$}!O!P%7b!P!Q$}!Q![%8l![!d$}!d!e%:n!e!g$}!g!h%,d!h!l$}!l!m%0t!m!q$}!q!r%=h!r!z$}!z!{%@[!{#O$}#O#P! n#P#R$}#R#S%8l#S#U$}#U#V%:n#V#X$}#X#Y%,d#Y#^$}#^#_%0t#_#c$}#c#d%=h#d#l$}#l#m%@[#m#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%7s]%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!Q$}!Q![%*h![#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%9Pi!f,V%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!O$}!O!P%7b!P!Q$}!Q![%8l![!g$}!g!h%,d!h!l$}!l!m%0t!m#O$}#O#P! n#P#R$}#R#S%8l#S#X$}#X#Y%,d#Y#^$}#^#_%0t#_#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%;P`%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!Q$}!Q!R%<R!R!S%<R!S#O$}#O#P! n#P#R$}#R#S%<R#S#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%<f`!f,V%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!Q$}!Q!R%<R!R!S%<R!S#O$}#O#P! n#P#R$}#R#S%<R#S#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%=y_%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!Q$}!Q!Y%>x!Y#O$}#O#P! n#P#R$}#R#S%>x#S#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%?]_!f,V%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!Q$}!Q!Y%>x!Y#O$}#O#P! n#P#R$}#R#S%>x#S#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%@mc%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!Q$}!Q![%Ax![!c$}!c!i%Ax!i#O$}#O#P! n#P#R$}#R#S%Ax#S#T$}#T#Z%Ax#Z#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%B]c!f,V%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!Q$}!Q![%Ax![!c$}!c!i%Ax!i#O$}#O#P! n#P#R$}#R#S%Ax#S#T$}#T#Z%Ax#Z#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Mg%C{]x1s%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!_$}!_!`%Dt!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}<u%EXZ%[R%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{%F_Z#^,X%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{%Ge_jR%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!^$}!^!_%Hd!_!`!'m!`!a!'m!a#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gz%Hw]$|Q%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!_$}!_!`$,i!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{%JT]%Z,X%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!_$}!_!`!'m!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{%Ka^jR%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!_$}!_!`!'m!`!a%L]!a#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gz%Lp]$}Q%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!_$}!_!`$,i!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{%NO]]Q#xP%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!_$}!_!`$,i!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Mg& ^c%t7[%kS%nW%h&j%q`%wp%z!b%|#t%U,XOr$}rs&Rsw$}wxFSx!Q$}!Q![%Nw![!c$}!c!}%Nw!}#O$}#O#P! n#P#R$}#R#S%Nw#S#T$}#T#o%Nw#o#p!#U#p#q$}#q#r!!S#r$g$}$g~%NwMg&#Og%t7[%kS%nW%h&j%q`%wp%z!b%|#t%U,XOr$}rs&$gsw$}wx&'kx!Q$}!Q![%Nw![!c$}!c!t%Nw!t!u&*u!u!}%Nw!}#O$}#O#P! n#P#R$}#R#S%Nw#S#T$}#T#f%Nw#f#g&*u#g#o%Nw#o#p!#U#p#q$}#q#r!!S#r$g$}$g~%NwDe&$r_%t7[%kS%q`%z!bOY!+VYZ'PZ]!+V]^'P^r!+Vrs&%qsw!+Vwx!-cx#O!+V#O#P!=w#P#o!+V#o#p!@_#p#q!+V#q#r!>]#r~!+VDe&&OZ%t7[%kS%i,X%q`%z!bOr'Prs&&qsw'Pwx(Px#O'P#O#P>v#P#o'P#o#pCU#p#q'P#q#r?[#r~'PD]&'OX%t7[%kS%m,X%q`%z!bOwDvwx,ex#ODv#O#PEn#P#oDv#o#pBd#p#qDv#q#rAn#r~DvGk&'v_%t7[%nW%wp%|#tOY$0XYZGQZ]$0X]^GQ^r$0Xrs$1gsw$0Xwx&(ux#O$0X#O#P$Ee#P#o$0X#o#p$G}#p#q$0X#q#r$Ey#r~$0XGk&)SZ%t7[%nW%i,X%wp%|#tOrGQrs)wswGQwx&)ux#OGQ#O#PHS#P#oGQ#o#pLj#p#qGQ#q#rHh#r~GQFT&*SZ%t7[%nW%j,X%wp%|#tOrN[rs=OswN[wxN[x#ON[#O#P! Y#P#oN[#o#pKx#p#qN[#q#rJ|#r~N[Mg&+[c%t7[%kS%nW%h&j%q`%wp%z!b%|#t%U,XOr$}rs&$gsw$}wx&'kx!Q$}!Q![%Nw![!c$}!c!}%Nw!}#O$}#O#P! n#P#R$}#R#S%Nw#S#T$}#T#o%Nw#o#p!#U#p#q$}#q#r!!S#r$g$}$g~%NwMg&,|g%t7[%kS%nW%h&j%q`%wp%z!b%|#t%U,XOr$}rs&.esw$}wx&1]x!Q$}!Q![%Nw![!c$}!c!t%Nw!t!u&4Z!u!}%Nw!}#O$}#O#P! n#P#R$}#R#S%Nw#S#T$}#T#f%Nw#f#g&4Z#g#o%Nw#o#p!#U#p#q$}#q#r!!S#r$g$}$g~%NwDe&.rZ%t7[%kS%q`%z!b%v,XOr'Prs&/esw'Pwx(Px#O'P#O#P>v#P#o'P#o#pCU#p#q'P#q#r?[#r~'PDe&/pZ%t7[%kS%q`%z!bOr'Prs&0csw'Pwx(Px#O'P#O#P>v#P#o'P#o#pCU#p#q'P#q#r?[#r~'PD]&0pX%t7[%kS%{,X%q`%z!bOwDvwx,ex#ODv#O#PEn#P#oDv#o#pBd#p#qDv#q#rAn#r~DvGk&1jZ%t7[%nW%wp%|#t%p,XOrGQrs)wswGQwx&2]x#OGQ#O#PHS#P#oGQ#o#pLj#p#qGQ#q#rHh#r~GQGk&2hZ%t7[%nW%wp%|#tOrGQrs)wswGQwx&3Zx#OGQ#O#PHS#P#oGQ#o#pLj#p#qGQ#q#rHh#r~GQFT&3hZ%t7[%nW%y,X%wp%|#tOrN[rs=OswN[wxN[x#ON[#O#P! Y#P#oN[#o#pKx#p#qN[#q#rJ|#r~N[Mg&4pc%t7[%kS%nW%h&j%q`%wp%z!b%|#t%U,XOr$}rs&.esw$}wx&1]x!Q$}!Q![%Nw![!c$}!c!}%Nw!}#O$}#O#P! n#P#R$}#R#S%Nw#S#T$}#T#o%Nw#o#p!#U#p#q$}#q#r!!S#r$g$}$g~%NwMg&6bk%t7[%kS%nW%h&j%q`%wp%z!b%|#t%U,XOr$}rs&$gsw$}wx&'kx!Q$}!Q![%Nw![!c$}!c!h%Nw!h!i&4Z!i!t%Nw!t!u&*u!u!}%Nw!}#O$}#O#P! n#P#R$}#R#S%Nw#S#T$}#T#U%Nw#U#V&*u#V#Y%Nw#Y#Z&4Z#Z#o%Nw#o#p!#U#p#q$}#q#r!!S#r$g$}$g~%NwG{&8jZ!V,X%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}<u&9pZ!WR%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gz&:v]$zQ%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!_$}!_!`$,i!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy&;xX%kS%nW!ZGmOr8brs9Osw8bwx:Ux#O8b#O#P;[#P#o8b#o#p!!S#p~8bGz&<x]$yQ%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx!_$}!_!`$,i!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}<u&>SX![7_%kS%nW%q`%wp%z!b%|#tOr!!Srs@Ssw!!SwxIbx#O!!S#O#P!#O#P#o!!S#o#p!#U#p~!!SGy&?SZ%T,V%t7[%kS%nW%q`%wp%z!b%|#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}",
                tokenizers: [legacyPrint, indentation, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, newlines],
                topRules: {
                    "Script": [0, 3]
                },
                specialized: [{
                    term: 190,
                    get: value => spec_identifier[value] || -1
                }],
                tokenPrec: 6594
            });

        }, { "./tokens": 6, "./tokens.js": 6, "lezer": 3 }], 5: [function (require, module, exports) {
            // This file was generated by lezer-generator. You probably shouldn't edit it.
            module.exports = {
                printKeyword: 1,
                indent: 166,
                dedent: 167,
                newline: 168,
                newlineBracketed: 169,
                newlineEmpty: 170,
                eof: 171,
                Comment: 2,
                Script: 3,
                BinaryExpression: 6,
                ParenthesizedExpression: 21,
                binaryTest: 23,
                CompareOp: 26,
                unaryTest: 30,
                lambdaParams: 36,
                VariableName: 37,
                YieldExpression: 43,
                TupleExpression: 47,
                ComprehensionExpression: 48,
                ArrayExpression: 52,
                ArrayComprehensionExpression: 55,
                DictionaryExpression: 56,
                DictionaryComprehensionExpression: 59,
                SetExpression: 60,
                SetComprehensionExpression: 61,
                ArgList: 63,
                PropertyName: 67,
                Number: 68,
                String: 69,
                FormatString: 70,
                FormatReplacement: 71,
                FormatConversion: 72,
                TypeDef: 78,
                UpdateOp: 81,
                ImportStatement: 97,
                IfStatement: 107,
                Body: 108,
                Newline: 109,
                Indent: 110,
                Dedent: 111,
                EOF: 112,
                TryStatement: 117,
                FunctionDefinition: 123,
                ClassDefinition: 128,
                Decorator: 131,
                At: 132
            }
        }, {}], 6: [function (require, module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.legacyPrint = exports.trackIndent = exports.indentation = exports.newlines = void 0;

            var _lezer = require("lezer");

            var _parserTerms = require("./parser.terms.js");

            const newline = 10,
                carriageReturn = 13,
                space = 32,
                tab = 9,
                hash = 35,
                parenOpen = 40,
                dot = 46;
            const bracketed = [_parserTerms.ParenthesizedExpression, _parserTerms.TupleExpression, _parserTerms.ComprehensionExpression, _parserTerms.ArrayExpression, _parserTerms.ArrayComprehensionExpression, _parserTerms.DictionaryExpression, _parserTerms.DictionaryComprehensionExpression, _parserTerms.SetExpression, _parserTerms.SetComprehensionExpression];
            let cachedIndent = 0,
                cachedInput = null,
                cachedPos = 0;

            function getIndent(input, pos) {
                if (pos == cachedPos && input == cachedInput) return cachedIndent;
                cachedInput = input;
                cachedPos = pos;
                return cachedIndent = getIndentInner(input, pos);
            }

            function getIndentInner(input, pos) {
                for (let indent = 0; ; pos++) {
                    let ch = input.get(pos);
                    if (ch == space) indent++; else if (ch == tab) indent += 8 - indent % 8; else if (ch == newline || ch == carriageReturn || ch == hash) return -1; else return indent;
                }
            }

            const newlines = new _lezer.ExternalTokenizer((input, token, stack) => {
                let next = input.get(token.start);

                if (next < 0) {
                    token.accept(_parserTerms.eof, token.start);
                } else if (next != newline && next != carriageReturn) { } else if (stack.startOf(bracketed) != null) {
                    token.accept(_parserTerms.newlineBracketed, token.start + 1);
                } else if (getIndent(input, token.start + 1) < 0) {
                    token.accept(_parserTerms.newlineEmpty, token.start + 1);
                } else {
                    token.accept(_parserTerms.newline, token.start + 1);
                }
            }, {
                contextual: true,
                fallback: true
            });
            exports.newlines = newlines;
            const indentation = new _lezer.ExternalTokenizer((input, token, stack) => {
                let prev = input.get(token.start - 1),
                    depth;
                if ((prev == newline || prev == carriageReturn) && (depth = getIndent(input, token.start)) >= 0 && depth != stack.context.depth && stack.startOf(bracketed) == null) token.accept(depth < stack.context.depth ? _parserTerms.dedent : _parserTerms.indent, token.start);
            });
            exports.indentation = indentation;

            function IndentLevel(parent, depth) {
                this.parent = parent;
                this.depth = depth;
                this.hash = (parent ? parent.hash + parent.hash << 8 : 0) + depth + (depth << 4);
            }

            const topIndent = new IndentLevel(null, 0);
            const trackIndent = new _lezer.ContextTracker({
                
                start: topIndent,

                shift(context, term, input, stack) {
                    return term == _parserTerms.indent ? new IndentLevel(context, getIndent(input, stack.pos)) : term == _parserTerms.dedent ? context.parent : context;
                },

                hash(context) {
                    return context.hash;
                }
            });
            exports.trackIndent = trackIndent;
            const legacyPrint = new _lezer.ExternalTokenizer((input, token) => {
                let pos = token.start;

                for (let print = "print", i = 0; i < print.length; i++, pos++) if (input.get(pos) != print.charCodeAt(i)) return;

                let end = pos;
                if (/\w/.test(String.fromCharCode(input.get(pos)))) return;

                for (; ; pos++) {
                    let next = input.get(pos);
                    if (next == space || next == tab) continue;
                    if (next != parenOpen && next != dot && next != newline && next != carriageReturn && next != hash) token.accept(_parserTerms.printKeyword, end);
                    return;
                }
            });
            exports.legacyPrint = legacyPrint;

        }, { "./parser.terms.js": 5, "lezer": 3 }]
    }, {}, [4])(4)
});
