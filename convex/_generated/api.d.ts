/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as unreads from "../unreads.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  unreads: typeof unreads;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  unreadTracking: {
    public: {
      addToGroup: FunctionReference<
        "mutation",
        "internal",
        { groupId: any; userId: any },
        null
      >;
      archive: FunctionReference<
        "mutation",
        "internal",
        { channelId: any },
        number
      >;
      cleanup: FunctionReference<
        "mutation",
        "internal",
        { olderThanMs?: number },
        {
          messagesDeleted: number;
          rangesDeleted: number;
          unreadsDeleted: number;
        }
      >;
      deleteMessage: FunctionReference<
        "mutation",
        "internal",
        { channelId: any; timestamp: number },
        boolean
      >;
      getLastRead: FunctionReference<
        "query",
        "internal",
        { channelId: any; userId: any },
        number | null
      >;
      getLastReads: FunctionReference<
        "query",
        "internal",
        { channelIds: Array<any>; userId: any },
        Array<{ channelId: any; lastReadAt: number | null }>
      >;
      getSingleUnreads: FunctionReference<
        "query",
        "internal",
        { channelIds: Array<any>; userId: any },
        Array<{ channelId: any; count: number }>
      >;
      getTotalUnreadCount: FunctionReference<
        "query",
        "internal",
        { userId: any },
        number
      >;
      getUnreadCount: FunctionReference<
        "query",
        "internal",
        { channelId: any; userId: any },
        number
      >;
      insertMessage: FunctionReference<
        "mutation",
        "internal",
        { authorId?: any; channelId: any; timestamp?: number },
        string
      >;
      markOneUnread: FunctionReference<
        "mutation",
        "internal",
        { channelId: any; timestamp: number; userId: any },
        null
      >;
      markReadRange: FunctionReference<
        "mutation",
        "internal",
        { channelId: any; end: number; start: number; userId: any },
        null
      >;
      markReadUpTo: FunctionReference<
        "mutation",
        "internal",
        { channelId: any; timestamp: number; userId: any },
        null
      >;
      muteSender: FunctionReference<
        "mutation",
        "internal",
        { targetUserId: any; userId: any },
        null
      >;
      removeFromGroup: FunctionReference<
        "mutation",
        "internal",
        { groupId: any; userId: any },
        null
      >;
      subscribe: FunctionReference<
        "mutation",
        "internal",
        { channelId: any; userId: any },
        null
      >;
      subscribeAll: FunctionReference<
        "mutation",
        "internal",
        { channelId: any; groupId: any },
        number
      >;
      unmuteSender: FunctionReference<
        "mutation",
        "internal",
        { targetUserId: any; userId: any },
        null
      >;
      unsubscribeAll: FunctionReference<
        "mutation",
        "internal",
        { channelId: any; groupId: any },
        number
      >;
      unsubscribeChannel: FunctionReference<
        "mutation",
        "internal",
        { channelId: any; userId: any },
        null
      >;
    };
  };
};
