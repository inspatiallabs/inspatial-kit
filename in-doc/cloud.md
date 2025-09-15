
# Cloud | Server & Backend 

InSpatial Cloud is built on `@inspatial/cloud` and exposes `@inspatial/cloud` APIs for comprehensive backend and data management across all platforms. `@inspatial/cloud-client` is what you should always use on the cient app. `@inSpatial/cloud` is only for server.

### Adding a New Cloud Collection/Table

```ts
import {
  ChildEntryType as ChildCollection,
  EntryType as Collection,
} from "@inspatial/cloud";

export const customerAccount = new Collection("customerAccount", {
  label: "Customer Account",
  idMode: "ulid",
  titleField: "customerName",
  fields: [
    {
      key: "customerName",
      type: "DataField",
      label: "Customer Name",
      required: true,
    },
    {
      key: "customerId",
      type: "DataField",
      label: "Customer ID",
      required: true,
    },
  ],
  children: [
    new ChildCollection("users", {
      description: "Users associated with this account",
      label: "Users",
      fields: [
        {
          key: "user",
          label: "User",
          type: "ConnectionField",
          entryType: "user",
        },
        {
          key: "isOwner",
          label: "Is Owner",
          type: "BooleanField",
        },
      ],
    }),
  ],
});
```

With InSpatial Cloud, everything is an exension. You can create in one of two apis `new CloudExtension` and `createInCloud` which is the highest level abstraction.

### Using - `new CloudExtension()`

```ts
import { CloudExtension } from "@inspatial/cloud";
import { product } from "./collection/product.ts";
import { customerAccount } from "./collection/customer-account.ts";

const crmExtension = new CloudExtension("crm", {
  label: "CRM",
  description: "Customer Relationship Management",
  version: "1.0.0",
  entryTypes: [customerAccount, product],
  roles: [
    {
      roleName: "customer",
      description: "A customer",
      label: "Customer",
    },
    {
      roleName: "manager",
      description: "A manager",
      label: "Manager",
    },
  ],
});

export default crmExtension;
```

### Using - `createInCloud()`

```ts
import { createInCloud } from "@inspatial/cloud";
import { product } from "./collection/product.ts";
import { customerAccount } from "./collection/customer-account.ts";

createInCloud({
  name: "CRM",
  description: "Customer Relationship Management",
  version: "1.0.0",
  entryTypes: [customerAccount, product],
  roles: [
    {
      roleName: "customer",
      description: "A customer",
      label: "Customer",
    },
    {
      roleName: "manager",
      description: "A manager",
      label: "Manager",
    },
  ],
});
```