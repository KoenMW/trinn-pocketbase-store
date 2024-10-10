# Trinn Svelte Store

This package wraps pocketbase and svelte together to create one beautiful union.

Note: for right now this is read-only. Updating is planned for later.

# Usage

You NEED to use Svelte and have an instance of PocketBase you can access.

```ts
//You can create a store for a single record
const word = await PBWritable.create<Word>("COLLECTION_NAME", "RECORD_ID");

//You can create a store for a complete collection (beware, when the collection changes it is COMPLETELY redownloaded)
const words = await PBWritable.createList<Word[]>("COLLECTION_NAME");

//For lists you can use the existing RecordListOptions from Pocketbase, like filter, sort, etc.
const lastWords = await PBWritable.createList<Word[]>("COLLECTION_NAME", {
  sort: "-word",
  page: 1,
  perPage: 10,
});
```
