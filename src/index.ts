import { parse } from "uri-js";
/**
 * Interface for *static* elements on a class
 */
export interface Schemable {
  scheme: string;
  getFromUri(uri: string): Promise<Sessionable>;
  idToUri?: (id: string) => string;
  get(id: string): Promise<Sessionable>;
  getFromItem?: (item: { [key: string]: any }) => Promise<Sessionable>;
}
/**
 * Interface for *instance* elements on a class. (Much simpler requirement)
 */
export interface Sessionable {
  getUri(): string;
}
const schemeRegistry: { [scheme: string]: Schemable } = {};
let registry: { [url: string]: Sessionable } = {};
/**
 * Load an item based on map of data (usually from database)
 * @param schemeOrClass Scheme (e.g. "myClass") or classname ("MyClass") to look up
 * @param item Map of attributes to load from
 */
export async function getFromItem<T>(
  schemeOrClass: string | Schemable,
  item: { [key: string]: any }
) {
  let thisClass: Schemable;
  if (typeof schemeOrClass === "string") {
    thisClass = schemeRegistry[schemeOrClass];
  } else thisClass = schemeOrClass;
  if (thisClass.getFromItem) {
    return <T>(<unknown>thisClass.getFromItem(item));
  }
  throw new Error(
    "Class on scheme" +
      (<Schemable>schemeOrClass).scheme +
      " does not implement getFromItem"
  );
}
/**
 * Add a scheme-able class to the session registry
 * @param newClass Class -implementing static scheme property and getFromUri method - to add to the registry for lookups
 */
export async function addClass(newClass: Schemable) {
  schemeRegistry[newClass.scheme] = newClass;
}
/**
 * Retrieve from the registry, async to permit a load. Uses the class/scheme to limit the lookup
 * @param schemeOrClass Scheme (e.g. "myClass") or classname ("MyClass") to look up
 * @param id id global within the class domain
 */
export async function getFromId<T>(
  schemeOrClass: string | Schemable,
  id: string
): Promise<T> {
  let thisClass;
  if (typeof schemeOrClass === "string") {
    thisClass = schemeRegistry[schemeOrClass];
  } else thisClass = schemeOrClass;
  if (!thisClass) throw new Error("Scheme not registered");
  if (typeof thisClass.idToUri === "function") {
    return getFromUri(thisClass.idToUri(id));
  }
  return <T>(<unknown>thisClass.get(id));
}
/**
 * Retrieve from the registry, async to permit a load if it was not previously saved
 * @param uri URI of object to retrieve
 */
export async function getFromUri<T>(uri: string): Promise<T> {
  if (registry[uri]) return <T>(<unknown>registry[uri]);
  //I need to get this. check the scheme
  const { scheme } = parse(uri);
  if (!scheme) throw new Error("bad uri");
  const c = schemeRegistry[scheme];
  if (!c) throw new Error("No Registered class for scheme " + scheme);
  return <T>(<unknown>await c.getFromUri(uri));
}
/**
 * Flush the session of cached files
 */
export function flushSession() {
  registry = {};
}
type LambdaFunctionType = (a: any, b?: any, c?: any) => any;
/**
 * Wraps a function to guarantee a new session before it runs
 * @param f function to wrap
 */
export const withSession = (f: LambdaFunctionType) => (
  a: any,
  b?: any,
  c?: any
) => {
  flushSession();
  return f(a, b, c);
};
/**
 * Wraps a function to be used in a AWS Appsync Batch invocation
 * @param f function to wrap
 */
export function withBatch(f: LambdaFunctionType) {
  return async (args: { [key: string]: any }[], b?: any, cb?: any) => {
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
}
/**
 * Save an object instance to the session registry
 * @param o instance to save in registry
 */
export function set(o: Sessionable) {
  const uri = o.getUri();
  registry[uri] = o;
}
/**
 * Removes an instance from the reistry by the uri
 * @param uri URI of the element to remove
 */
export function remove(uri: string) {
  delete registry[uri];
}
/**
 * Determine if an object with this uri is already cached
 * @param uri
 */
export function isCached(uri: string): boolean {
  return !!registry[uri];
}
