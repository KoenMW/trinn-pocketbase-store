import PocketBase, { type RecordModel } from "pocketbase";
import { writable } from "svelte/store";

const ERROR_CREATE_PB =
  "Something went wrong during instantiation of the Pocketbase instance. Do you have the correct url?";
const ERROR_AUTH =
  "Something went wrong during login of pocketbase. Please check your credentials";
const ERROR_INIT =
  "Please initialize the library first using PBWritable.init before using any method";
abstract class PBWritable {
  static baseUrl: string | null = null;
  private static pb: PocketBase | null = null;

  /**
   * The constructor is not used. This class is not meant to be used.
   */
  private constructor() {}

  /**
   * Initializes the global instance of pocketbase we want to use. Currently we only support one instance
   * @param pocketBaseUrl the location of your pocketbase instance
   * @param username (optional) if provided, will try to login using this username
   * @param password (optional) if provided, will try to login using this password
   * @returns returns if pocketbase was  correctly created. If credentials are provided, it also returns if login was succesful
   */
  static async init(
    pocketBaseUrl: string,
    username?: string,
    password?: string
  ) {
    this.baseUrl = pocketBaseUrl;

    try {
      this.pb = new PocketBase(pocketBaseUrl);
    } catch {
      console.error(ERROR_CREATE_PB);
      return false;
    }

    if (username && password) {
      try {
        await this.pb.collection("users").authWithPassword(username, password);

        return this.pb.authStore.isValid;
      } catch {
        console.error(ERROR_AUTH);
        return false;
      }
    }

    return true;
  }

  /**
   *
   * @param collectionName the name of the pocketbase colleciton
   * @param id the id of the pocketbase record to subscribe to
   * @param transform (optional) transform that is called everytime a new element is set in the store
   * @returns a default Svelte writable
   */
  static async create<T>(
    collectionName: string,
    id: string,
    transform?: (r: RecordModel) => T
  ) {
    if (!this.pb) {
      console.error(ERROR_INIT);
      return writable<T>();
    }

    const initialRecord = await this.pb.collection(collectionName).getOne(id);
    const store = writable<T>(
      transform ? transform(initialRecord) : (initialRecord as T)
    );

    this.pb.collection(collectionName).unsubscribe(id);
    this.pb.collection(collectionName).subscribe(id, async () => {
      const newRecord = await this.pb?.collection(collectionName).getOne(id);
      if (newRecord) {
        store.set(transform ? transform(newRecord) : (newRecord as T));
      }
    });

    return store;
  }
}
