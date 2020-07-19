interface Schemable {
    scheme: string;
    getFromUri(uri: string): Promise<Sessionable>;
}
interface Sessionable {
    getUri(): string;
}
/**
 * Add a scheme-able class to the session registry
 * @param newClass Class -implementing static scheme property and getFromUri method - to add to the registry for lookups
 */
declare const addClass: (newClass: Schemable) => void;
/**
 * Retrieve from the registry, async to permit a load if it was not previously saved
 * @param uri URI of object to retrieve
 */
declare const get: <T>(uri: string) => Promise<T>;
declare type LambdaFunctionType = (a: any, b?: any, c?: any) => any;
/**
 * Wraps a function to guarantee a new session before it runs
 * @param f function to wrap
 */
declare const withSession: (f: LambdaFunctionType) => (a: any, b?: any, c?: any) => any;
/**
 * Wraps a function to be used in a AWS Appsync Batch invocation
 * @param f function to wrap
 */
declare const withBatch: (f: LambdaFunctionType) => (args: {
    [key: string]: any;
}[], b?: any, cb?: any) => Promise<void>;
/**
 * Save an object instance to the session registry
 * @param o instance to save in registry
 */
declare const set: (o: Sessionable) => void;
/**
 * Removes an instance from the reistry by the uri
 * @param uri URI of the element to remove
 */
declare const remove: (uri: string) => void;
export { withSession, withBatch, set, remove, get, addClass };
