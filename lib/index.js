import { parse } from "uri-js";
const schemeRegistry = {};
let registry = {};
/**
 * Add a scheme-able class to the session registry
 * @param newClass Class -implementing static scheme property and getFromUri method - to add to the registry for lookups
 */
const addClass = (newClass) => {
    schemeRegistry[newClass.scheme] = newClass;
};
/**
 * Retrieve from the registry, async to permit a load if it was not previously saved
 * @param uri URI of object to retrieve
 */
const get = async (uri) => {
    if (registry[uri])
        return registry[uri];
    //I need to get this. check the scheme
    const { scheme } = parse(uri);
    if (!scheme)
        throw new Error("bad uri");
    const c = schemeRegistry[scheme];
    if (!c)
        throw new Error("No Registered class for scheme " + scheme);
    return await c.getFromUri(uri);
};
/**
 * Flush the session of cached files
 */
const flushSession = () => {
    registry = {};
};
/**
 * Wraps a function to guarantee a new session before it runs
 * @param f function to wrap
 */
const withSession = (f) => (a, b, c) => {
    flushSession();
    return f(a, b, c);
};
/**
 * Wraps a function to be used in a AWS Appsync Batch invocation
 * @param f function to wrap
 */
const withBatch = (f) => async (args, b, cb) => {
    await withSession(async (args) => {
        const results = await Promise.all(args.map(async (thisArgs) => {
            const newArgs = { ...thisArgs, __skipFlush: true, __isBatch: true };
            try {
                const data = await f(newArgs, b);
                return { data };
            }
            catch (error) {
                return {
                    data: null,
                    errorMessage: error
                        ? error.message
                            ? error.message.toString()
                            : error
                        : "Error was undefined",
                    errorType: "ERROR",
                };
            }
        }));
        cb(null, results);
    })(args);
};
/**
 * Save an object instance to the session registry
 * @param o instance to save in registry
 */
const set = (o) => {
    const uri = o.getUri();
    registry[uri] = o;
};
/**
 * Removes an instance from the reistry by the uri
 * @param uri URI of the element to remove
 */
const remove = (uri) => {
    delete registry[uri];
};
export { withSession, withBatch, set, remove, get, addClass };
//# sourceMappingURL=index.js.map