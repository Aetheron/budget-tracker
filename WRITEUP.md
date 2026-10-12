## Dev Experience
- ESLint with Prettier
In all my new projects, I add the Organize Imports plugin for Prettier to automatically sort import statements alphabetically.
Prettier keeps code consistant throughout the project and ensures readability,

## Styling
- TailwindCSS

# AI Usage
- Generated `useEffect()` calls for API requests and `useState()` calls to store the data
- Auto-generating type definitions from the data model
- Add the node.js server to the /server directory and generate the api using definitions from the client project
- When I was creating the update api route, I was curious if AI would recommend sending the entire transaction object over the wire, or just the three fields that can be updated. My thought was that the unnecessary extra body size of extra fields, even if it is small, would be better eliminated. AI recommended I change the API endpoint from PUT to PATCH and go with only sending updated fields. Because the spec defined the update endpoint as as PUT request, I created two handlers for the /api/transactions/:id endpoint: one for PUT requests and one for PATCH requests. The PUT verb updates the transaction wholesale and requires all fields. The PATCH verb accepts a subset of fields and updates those.