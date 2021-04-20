document.addEventListener("DOMContentLoaded", () => {
  fetch(
    `https://dog.ceo/api/breed/${dog.apiBreed}/${dog.apiSubBreed}/images/random`
  )
    .then((res) => res.json)
    .then((data) => data);
console.log("Dog Data", data)
});
