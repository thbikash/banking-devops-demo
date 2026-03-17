const API = "https://banking-app-342079872292.us-central1.run.app"

async function loadImages(){

 const res = await fetch(API + "/images")

 let lines

 try{
  lines = await res.json()
 }catch{
  const text = await res.text()
  lines = text.split("\n")
 }

 const table = document.getElementById("imageTable")

 lines.forEach(line => {

  if(!line.includes("packages")) return

  const image = line.split("/packages/")[1].split("/")[0]
  const digest = line.split("/versions/")[1]

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