const sdk = require("node-appwrite");

/*
  'req' variable has:
    'headers' - object with request headers
    'payload' - request body data as a string
    'variables' - object with function variables

  'res' variable has:
    'send(text, status)' - function to return text response. Status code defaults to 200
    'json(obj, status)' - function to return JSON response. Status code defaults to 200

  If an error is thrown, a response with code 500 will be returned.
*/

module.exports = async function (req, res) {
  const client = new sdk.Client();

  const database = new sdk.Databases(client);

  if (
    !req.variables["APPWRITE_FUNCTION_ENDPOINT"] ||
    !req.variables["APPWRITE_FUNCTION_API_KEY"]
  ) {
    console.warn(
      "Environment variables are not set. Function cannot use Appwrite SDK."
    );
  } else {
    client
      .setEndpoint(req.variables["APPWRITE_FUNCTION_ENDPOINT"])
      .setProject(req.variables["APPWRITE_FUNCTION_PROJECT_ID"])
      .setKey(req.variables["APPWRITE_FUNCTION_API_KEY"])
      .setSelfSigned(true);

    const { name } = JSON.parse(req.payload);

    // Check if document exists
    const roles = await database.listDocuments(
      req.variables["DATABASE_ID"],
      req.variables["ROLE_COLLECTION_ID"],
      [sdk.Query.equal("name", [name])]
    );

    // if true return document
    if (roles.total > 0) res.json(roles.documents[0]);

    // else create and return
    const customRole = await database.createDocument(
      req.variables["DATABASE_ID"],
      req.variables["ROLE_COLLECTION_ID"],
      name.replace(/[^a-z0-9]/gi, "_").toLowerCase(),
      { name, approved: false }
    );
    res.json(customRole);
  }

  res.json({
    areDevelopersAwesome: true,
  });
};
