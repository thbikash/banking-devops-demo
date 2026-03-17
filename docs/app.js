const API = "https://banking-app-342079872292.us-central1.run.app"

async function loadImages(){

 const res = await fetch(API + "/images")
 const data = await res.json()

 const table = document.getElementById("imageTable")

 data.forEach(line => {

  // Extract image and digest safely
  const match = line.match(/packages\/(.*?)\/versions\/(sha256:[a-z0-9]+)/)

  if(!match) return

  const image = match[1]
  const digest = match[2]

  const row = document.createElement("tr")

  row.innerHTML = `
   <td>${image}</td>
   <td>${digest}</td>
   <td>-</td>
   <td>
    <button onclick="deploy('${image}','${digest}')">
     Deploy
    </button>
   </td>
  `

  table.appendChild(row)

 })

}

async function deploy(image,digest){

 await fetch(API + "/deploy",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body: JSON.stringify({image,digest})
 })

 alert("Deployment started")

}

loadImages()