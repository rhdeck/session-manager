
<a name="readmemd"></a>

[@raydeck/session-manager - v1.1.0](#readmemd)

# @raydeck/session-manager - v1.1.0

## Index

### Interfaces

* [Schemable](#interfacesschemablemd)
* [Sessionable](#interfacessessionablemd)

### Type aliases

* [LambdaFunctionType](#lambdafunctiontype)

### Variables

* [registry](#let-registry)
* [schemeRegistry](#const-schemeregistry)

### Functions

* [addClass](#addclass)
* [flushSession](#flushsession)
* [getFromId](#getfromid)
* [getFromItem](#getfromitem)
* [getFromUri](#getfromuri)
* [remove](#remove)
* [set](#set)
* [withBatch](#withbatch)
* [withSession](#const-withsession)

## Type aliases

###  LambdaFunctionType

Ƭ **LambdaFunctionType**: *function*

*Defined in [index.ts:87](https://github.com/rhdeck/session-manager/blob/c4be340/src/index.ts#L87)*

#### Type declaration:

▸ (`a`: any, `b?`: any, `c?`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`a` | any |
`b?` | any |
`c?` | any |

## Variables

### `Let` registry

• **registry**: *object*

*Defined in [index.ts:19](https://github.com/rhdeck/session-manager/blob/c4be340/src/index.ts#L19)*

#### Type declaration:

* \[ **url**: *string*\]: [Sessionable](#interfacessessionablemd)

___

### `Const` schemeRegistry

• **schemeRegistry**: *object*

*Defined in [index.ts:18](https://github.com/rhdeck/session-manager/blob/c4be340/src/index.ts#L18)*

#### Type declaration:

* \[ **scheme**: *string*\]: [Schemable](#interfacesschemablemd)

## Functions

###  addClass

▸ **addClass**(`newClass`: [Schemable](#interfacesschemablemd)): *Promise‹void›*

*Defined in [index.ts:46](https://github.com/rhdeck/session-manager/blob/c4be340/src/index.ts#L46)*

Add a scheme-able class to the session registry

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`newClass` | [Schemable](#interfacesschemablemd) | Class -implementing static scheme property and getFromUri method - to add to the registry for lookups  |

**Returns:** *Promise‹void›*

___

###  flushSession

▸ **flushSession**(): *void*

*Defined in [index.ts:84](https://github.com/rhdeck/session-manager/blob/c4be340/src/index.ts#L84)*

Flush the session of cached files

**Returns:** *void*

___

###  getFromId

▸ **getFromId**‹**T**›(`schemeOrClass`: string | [Schemable](#interfacesschemablemd), `id`: string): *Promise‹T›*

*Defined in [index.ts:54](https://github.com/rhdeck/session-manager/blob/c4be340/src/index.ts#L54)*

Retrieve from the registry, async to permit a load. Uses the class/scheme to limit the lookup

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`schemeOrClass` | string &#124; [Schemable](#interfacesschemablemd) | Scheme (e.g. "myClass") or classname ("MyClass") to look up |
`id` | string | id global within the class domain  |

**Returns:** *Promise‹T›*

___

###  getFromItem

▸ **getFromItem**‹**T**›(`schemeOrClass`: string | [Schemable](#interfacesschemablemd), `item`: object): *Promise‹T›*

*Defined in [index.ts:25](https://github.com/rhdeck/session-manager/blob/c4be340/src/index.ts#L25)*

Load an item based on map of data (usually from database)

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`schemeOrClass` | string &#124; [Schemable](#interfacesschemablemd) | Scheme (e.g. "myClass") or classname ("MyClass") to look up |
`item` | object | Map of attributes to load from  |

**Returns:** *Promise‹T›*

___

###  getFromUri

▸ **getFromUri**‹**T**›(`uri`: string): *Promise‹T›*

*Defined in [index.ts:72](https://github.com/rhdeck/session-manager/blob/c4be340/src/index.ts#L72)*

Retrieve from the registry, async to permit a load if it was not previously saved

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`uri` | string | URI of object to retrieve  |

**Returns:** *Promise‹T›*

___

###  remove

▸ **remove**(`uri`: string): *void*

*Defined in [index.ts:142](https://github.com/rhdeck/session-manager/blob/c4be340/src/index.ts#L142)*

Removes an instance from the reistry by the uri

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`uri` | string | URI of the element to remove  |

**Returns:** *void*

___

###  set

▸ **set**(`o`: [Sessionable](#interfacessessionablemd)): *void*

*Defined in [index.ts:134](https://github.com/rhdeck/session-manager/blob/c4be340/src/index.ts#L134)*

Save an object instance to the session registry

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`o` | [Sessionable](#interfacessessionablemd) | instance to save in registry  |

**Returns:** *void*

___

###  withBatch

▸ **withBatch**(`f`: [LambdaFunctionType](#lambdafunctiontype)): *(Anonymous function)*

*Defined in [index.ts:104](https://github.com/rhdeck/session-manager/blob/c4be340/src/index.ts#L104)*

Wraps a function to be used in a AWS Appsync Batch invocation

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`f` | [LambdaFunctionType](#lambdafunctiontype) | function to wrap  |

**Returns:** *(Anonymous function)*

___

### `Const` withSession

▸ **withSession**(`f`: [LambdaFunctionType](#lambdafunctiontype)): *(Anonymous function)*

*Defined in [index.ts:92](https://github.com/rhdeck/session-manager/blob/c4be340/src/index.ts#L92)*

Wraps a function to guarantee a new session before it runs

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`f` | [LambdaFunctionType](#lambdafunctiontype) | function to wrap  |

**Returns:** *(Anonymous function)*


<a name="interfacesschemablemd"></a>

[@raydeck/session-manager - v1.1.0](#readmemd) › [Schemable](#interfacesschemablemd)

# Interface: Schemable

Interface for *static* elements on a class

## Hierarchy

* **Schemable**

## Index

### Properties

* [getFromItem](#optional-getfromitem)
* [idToUri](#optional-idtouri)
* [scheme](#scheme)

### Methods

* [get](#get)
* [getFromUri](#getfromuri)

## Properties

### `Optional` getFromItem

• **getFromItem**? : *undefined | function*

*Defined in [index.ts:10](https://github.com/rhdeck/session-manager/blob/c4be340/src/index.ts#L10)*

___

### `Optional` idToUri

• **idToUri**? : *undefined | function*

*Defined in [index.ts:8](https://github.com/rhdeck/session-manager/blob/c4be340/src/index.ts#L8)*

___

###  scheme

• **scheme**: *string*

*Defined in [index.ts:6](https://github.com/rhdeck/session-manager/blob/c4be340/src/index.ts#L6)*

## Methods

###  get

▸ **get**(`id`: string): *Promise‹[Sessionable](#interfacessessionablemd)›*

*Defined in [index.ts:9](https://github.com/rhdeck/session-manager/blob/c4be340/src/index.ts#L9)*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *Promise‹[Sessionable](#interfacessessionablemd)›*

___

###  getFromUri

▸ **getFromUri**(`uri`: string): *Promise‹[Sessionable](#interfacessessionablemd)›*

*Defined in [index.ts:7](https://github.com/rhdeck/session-manager/blob/c4be340/src/index.ts#L7)*

**Parameters:**

Name | Type |
------ | ------ |
`uri` | string |

**Returns:** *Promise‹[Sessionable](#interfacessessionablemd)›*


<a name="interfacessessionablemd"></a>

[@raydeck/session-manager - v1.1.0](#readmemd) › [Sessionable](#interfacessessionablemd)

# Interface: Sessionable

Interface for *instance* elements on a class. (Much simpler requirement)

## Hierarchy

* **Sessionable**

## Index

### Methods

* [getUri](#geturi)

## Methods

###  getUri

▸ **getUri**(): *string*

*Defined in [index.ts:16](https://github.com/rhdeck/session-manager/blob/c4be340/src/index.ts#L16)*

**Returns:** *string*
