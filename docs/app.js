const API = "https://banking-app-342079872292.us-central1.run.app"

async function loadImages(){
  try {
    const res = await fetch(API + "/images")
    const data = await res.json() // data is now an array of objects

    const table = document.getElementById("imageTable")
    table.innerHTML = ""; // Clear table before loading

    data.forEach(item => {
      // No need for .match() anymore! 
      // The server already sent 'image' and 'digest'
      const image = item.image;
      const digest = item.digest;
      const created = item.created;

      const row = document.createElement("tr")

      row.innerHTML = `
        <td>${image}</td>
        <td>${digest}</td>
        <td>${item.created || '-'}</td>
        <td>
          <button onclick="deploy('${image}','${digest}')">
            Deploy
          </button>
        </td>
      `
      table.appendChild(row)
    })
  } catch (error) {
    console.error("Failed to load images:", error);
  }
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