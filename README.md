# Read Me

This is just a small local REST API that uses a mySQL database to add and remove items from a 'todo list'

I use expressjs to set up the endpoints and XMLHttpRequest to send HTTP requests from clientside to server side in order to retrieve all the todo list items to render them on the frontend

## More about the functionality
There is a HTML form that sends a post request to an endpoint that queries the database and inserts the data included in the HTML form (a new todo list item)

You then get redirected to the todo list page which lists all the current todo list items and includes a link to return back to the page that allows you to add a new item.
If you click on one of the items, the database will be queried once more and the item will be removed

