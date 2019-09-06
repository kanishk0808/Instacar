
document.getElementById("inputOrigin").onkeypress = function() {
    const text = document.getElementById("inputOrigin").value;
    console.log("text")
    const request = new Request(`http://localhost:3000/citySuggestions?searchText=${text}`, {method: "GET"});
    fetch(request)
        .then(results => results.json())
        .then(results => console.log(results));
    console.log("api is working");
}