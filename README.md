# use-immer-state-provider

A React **state provider** and a **hook** factory to read and manipulate an immutable state using [immer](https://github.com/mweststrate/immer) and a ✨ magical actions api.

# Installation

`npm install immer use-immer use-immer-state-provider`

# API

## createImmerStateContext

`createImmerStateContext(initialState: T, actions: ActionsT)` is similar to [`createContext`](https://react.dev/reference/react/createContext).
The function returns a Context (same as React's `createContext` will) and 
`initialValue` which will be the initial value of that context and will also expose the types of its elements to the consumer.
- `defaultValue` should have the type of the state we would like to have.
- `actions` should be an object of functions, where the functions have a signature of `(draft: T, ...args)`

### Extracting the API's type

```typescript
export type MyStateApi = (typeof result.initialValue)[1];
```

## useImmerStateProvider

`useImmerStateProvider(initialState: T, actions: ActionsT, onError?: (e: Error) => any)`
This hook function is used inside the provider component.
- Returns `[state, api, value]`
  - `state` - Current state (type of `initialState`)
  - `api` - An API to update the state (map of functions, static reference; doesn't change), using names from `actions` and parameters without the first `draft` parameter
  - `value` - To be used inside as the `context.Provider`'s `value` prop.

# Example

```typescript jsx
import { PropsWithChildren, useContext } from "react";
import { createImmerStateContext, useImmerStateProvider } from "use-immer-state-provider";

export type User = { id: string, name: string, email: string };

// Define the state type
type UsersState = {
    users: User[];
};

const initialState: UsersState = {
    users: []
};

const actions = {
  addUser: (draft: UsersState, user: User) => {
      draft.users.push(user);
  },
  deleteUser: (draft: UserState, id: string) => {
      const index = draft.users.findIndex(u => u.id === id);
      if (index > -1) {
          draft.users.splice(i, 1);
      }
  },
  setName: (draft: UserState, id: string, name: string) => {
    const index = draft.users.findIndex(u => u.id === id);
    if (index > -1) {
      draft.users[i].name = name;
    }
  },
  setEmail: (draft: UserState, id: string, email: string) => {
    const index = draft.users.findIndex(u => u.id === id);
    if (index > -1) {
      draft.users[i].email = email;
    }
  },
};

const { context, initialValue } = createImmerStateContext(initialState, actions);

export type UsersApi = (typeof initialValue)[1];

export const useUsers = () => {
  return useContext(context);
};

export const UsersProvider = ({ children }: PropsWithChildren<{}>) => {
  const [, api, value] = useImmerStateProvider(initialState, actions);
  
  // if you want, you can extract state too and do something with it here
  
  return <context.Provider value={value}>{children}</context.Provider>;
};
```

And inside a component:

```typescript jsx
import { useUsers } from './usersProvider';

const UserList = () => {
  const [{ users }, api] = useUsers();
  
  return (
      <div>
        <ul>
          {users.map((user, i) => (
            <li key={user.id}>
              {user.name}
              <button onClick={() => api.deleteUser(user.id)}>Delete</button>
            </li>
          ))}
        </ul>
    </div>
  );
}
```

- Notice: `api.deleteUser(user.id)` we use the same function name we created in the `actions` object but we didn't use the draft argument. This is done by some Typescript magic ✨.
- Another cool thing you get out of it is that the IDE can detect where a function of the API is being used by searching usages.

# License
[MIT](./LICENSE)