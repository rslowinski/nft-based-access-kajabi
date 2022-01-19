Moralis.Cloud.define("HelloWorld", async(req) => {
    const projectId = req.params.projectId;
    const Project = Moralis.Object.extend("Project");
    const query = new Moralis.Query(Project);
    query.equalTo("isPublic", true)
    query.equalTo("objectId", projectId)
    const result = await query.first()

    return {requiredNftAddress: result.get("requiredNftAddress"), requiredNftName: result.get("requiredNftName"), name: result.get("name")}
});

Moralis.Cloud.define("blah", async(req) => {
    const projectId = req.params.projectId;
    const userEmail = req.params.email;


    const Project = Moralis.Object.extend("Project");
    const query = new Moralis.Query(Project);
    query.equalTo("isPublic", true)
    query.equalTo("objectId", projectId)
    const result = await query.first()
    const project = result;

    const userAddr = req.user.get("ethAddress")

    const userNft = await Moralis.Web3API.account.getNFTsForContract({address: userAddr,token_address: result.get("requiredNftAddress")})

    if(userNft.result.length <= 0){
//  	return {result: (userAddr + " doesnt have required nft")}
    }

    const AccessMint = Moralis.Object.extend("AccessMint");
    const accessMintQuery = new Moralis.Query("AccessMint");
    accessMintQuery.equalTo("ownerAddr", userAddr)
    accessMintQuery.equalTo("project", project)
    const existingAMs = await accessMintQuery.first()
    if (existingAMs){
        throw "Conflict! Access already received."
    }

    const accessMint = new AccessMint();
    accessMint.set("ownerAddr", userAddr)
    accessMint.set("ownerEmail", userEmail)
    accessMint.set("project", result)
    await accessMint.save()


    Moralis.Cloud.httpRequest({
        method: 'POST',
        url: project.get("kajabiActivationUrl"),
        body: {
            email: userEmail,
            name: userEmail,
            external_user_id: userEmail
        }
    }).then(function(httpResponse) {
        console.log(httpResponse.text);
    }, function(httpResponse) {
        console.error('Request failed with response code ' + httpResponse.status);
        return httpRespose
    });

    return 200;
});

Moralis.Cloud.afterSave("AccessMint", (request) => {
    return request
});