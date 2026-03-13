const express = require("express")
const cors = require("cors")
const {ArtifactRegistryClient} = require("@google-cloud/artifact-registry")

const app = express()
app.use(cors())

const client = new ArtifactRegistryClient()

const PROJECT = "banking-app-test-486402"
const LOCATION = "us-central1"
const REPO = "banking-repo"

app.get("/images", async (req,res)=>{

 try{

  const parent = `projects/${PROJECT}/locations/${LOCATION}/repositories/${REPO}`

  const [packages] = await client.listPackages({parent})

  let images=[]

  for(const pkg of packages){

   const [versions] = await client.listVersions({
     parent: pkg.name
   })

   versions.forEach(v=>{
     images.push(v.name)
   })

  }

  res.json(images)

 }catch(err){
  res.status(500).send(err.toString())
 }

})

app.listen(8080,()=>console.log("API running"))