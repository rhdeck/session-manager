import { parse } from "uri-js";
interface Schemable {
  scheme: string;
  getFromUri(uri: string): Promise<Sessionable>;
}
interface Sessionable {
  getUri(): string;
}
const schemeRegistry: { [scheme: string]: Schemable } = {};
let registry: { [url: string]: Sessionable } = {};
/**
 * Add a scheme-able class to the session registry
 * @param newClass Class -implementing static scheme property and getFromUri method - to add to the registry for lookups
 */
const addClass = (newClass: Schemable) => {
  schemeRegistry[newClass.scheme] = newClass;
};
/**
 * Retrieve from the registry, async to permit a load if it was not previously saved
 * @param uri URI of object to retrieve
 */
const get = async <T>(uri: string): Promise<T> => {
  if (registry[uri]) return <T>(<unknown>registry[uri]);
  //I need to get this. check the scheme
  const { scheme } = parse(uri);
  if (!scheme) throw new Error("bad uri");
  const c = schemeRegistry[scheme];
  if (!c) throw new Error("No Registered class for scheme " + scheme);
  return <T>(<unknown>await c.getFromUri(uri));
};
/**
 * Flush the session of cached files
 */
const flushSession = () => {
  registry = {};
};
type LambdaFunctionType = (a: any, b?: any, c?: any) => any;
/**
 * Wraps a function to guarantee a new session before it runs
 * @param f function to wrap
 */
const withSession = (f: LambdaFunctionType) => (a: any, b?: any, c?: any) => {
  flushSession();
  return f(a, b, c);
};
/**
 * Wraps a function to be used in a AWS Appsync Batch invocation
 * @param f function to wrap
 */
const withBatch = (f: LambdaFunctionType) => async (
  args: { [key: string]: any }[],
  b?: any,
  cb?: any
) => {
  await withSession(async (args: { [key: string]: any }[]) => {
    const results = await Promise.all(
      args.map(async (thisArgs) => {
        const newArgs = { ...thisArgs, __skipFlush: true, __isBatch: true };
        try {
          const data = await f(newArgs, b);
          return { data };
        } catch (error) {
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
      })
    );
    cb(null, results);
  })(args);
};
/**
 * Save an object instance to the session registry
 * @param o instance to save in registry
 */
const set = (o: Sessionable) => {
  const uri = o.getUri();
  registry[uri] = o;
};
/**
 * Removes an instance from the reistry by the uri
 * @param uri URI of the element to remove
 */
const remove = (uri: string) => {
  delete registry[uri];
};
export { withSession, withBatch, set, remove, get, addClass };