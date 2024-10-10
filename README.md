# Trinn Svelte Store

This package wraps pocketbase and svelte together to create one beautiful union.

Note: for right now this is read-only. Updating is planned for later.

# Usage

You NEED to use Svelte and have an instance of PocketBase you can access.

```ts
//You always have to connect to a PB instance first. Username and password are optional.
await PBWritable.connect("POCKETBASE_URL", "USERNAME", "PASSWORD");

//You can create a store for a single record
const [word, updateWord] = await PBWritable.create<Word>(
  "COLLECTION_NAME",
  "RECORD_ID"
);
updateWord({ word: "some change" });

//You can create a store for a complete collection (beware, when the collection changes it is COMPLETELY redownloaded)
const [words, updateWord, createWord, removeWord] = await PBWritable.createList<
  Word[]
>("COLLECTION_NAME");

//For lists you can use the existing RecordListOptions from Pocketbase, like filter, sort, etc.
const [lastWords, updateLastWord, createLastWord, removeLastWord] =
  await PBWritable.createList<Word[]>("COLLECTION_NAME", {
    sort: "-word",
    page: 1,
    perPage: 10,
  });
```
