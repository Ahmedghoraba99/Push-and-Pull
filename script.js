const fetchData = () => {
  let tbody = $("#tbody");
  $.ajax({
    url: "http://localhost:8081/projects",
    method: "GET",
    success: function (response) {
      tbody.empty();
      response.forEach((element) => {
        tbody.append(`
          <tr>
            <td>${element.id}</td>
            <td>${element.name}</td>
            <td>${element.descreption}</td>
            <td>
              <button class='btn btn-danger' onclick="DeleteProject(${element.id})">Delete</button>
            </td>
          </tr>
        `);
      });
    },
  });
};

fetchData();

let input = $("#search");
input.keyup(() => {
  let tbody = $("#tbody");
  let search = $("#search").val();
  setTimeout(() => {
    $.ajax({
      url: `http://localhost:8081/projects/search?name=${search}`,
      method: "GET",
      success: function (response) {
        tbody.empty();
        response.forEach((element) => {
          tbody.append(`
            <tr>
              <td>${element.id}</td>
              <td>${element.name}</td>
              <td>${element.decs}</td>
              <td>
                <button class='btn btn-danger' onclick="DeleteProject(${element.id})">Delete</button>
              </td>
            </tr>
          `);
        });
      },
    });
  }, 4000);
});

function DeleteProject(id) {
  $.ajax({
    url: `http://localhost:8081/projects/delete?id=${id}`,
    method: "GET",
    success: function (response) {
      if (response.status == "success") {
        alert("Project Deleted");
        fetchData();
      } else {
        alert("Something went wrong");
      }
    },
  });
}
