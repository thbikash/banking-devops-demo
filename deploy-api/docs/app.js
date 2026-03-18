const API = "https://deploy-api-342079872292.us-central1.run.app"

async function loadImages(){
  try {
    const res = await fetch(API + "/images")
    const data = await res.json() // data is now an array of objects

    const table = document.getElementById("imageTable")
    table.innerHTML = ""; // Clear table before loading

//     data.forEach(item => {
//       // No need for .match() anymore! 
//       // The server already sent 'image' and 'digest'
//       const image = item.image;
//       const digest = item.digest;
//       const created = item.created;

//      // Inside your data.forEach loop
// const row = document.createElement("tr");
// row.innerHTML = `
//   <td>${item.image}</td>
//   <td>${item.digest}</td>
//   <td>${item.created}</td> 
//   <td><button onclick="deploy('${item.image}','${item.digest}')">Deploy</button></td>
//       `
//       table.appendChild(row)
//     })
//   } catch (error) {
//     console.error("Failed to load images:", error);
//   }
// }
// async function deploy(image,digest){

//  await fetch(API + "/deploy",{
//   method:"POST",
//   headers:{"Content-Type":"application/json"},
//   body: JSON.stringify({image,digest})
//  })

//  alert("Deployment started")

// }

data.forEach(item => {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${item.image}</td>
    <td>${item.digest}</td>
    <td>${item.created}</td> 
    <td>
      <button onclick="deploy('${item.image}', '${item.digest}', '${item.targetService}')">
        Deploy to ${item.targetService}
      </button>
    </td>
  `;
  table.appendChild(row);
});

// Update the deploy function signature
async function deploy(image, digest, serviceName) {
  await fetch(API + "/deploy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image, digest, serviceName }) // Send the service name to backend
  });
  alert(`Deployment started for ${serviceName}`);
}

loadImages()