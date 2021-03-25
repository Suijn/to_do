# To do app

## Live
Link: https://todoapp-hub.herokuapp.com/

## Technologies used:
### Backend
- Django REST
- JWT authentication
- Unittest

### Frontend
- React
- Redux
- Css
- Html

## API

<table>
  <tr>
    <th>Task List</th>
	<th>User restricted</th>
    <td>/api/task-list/</td>
  </tr>
  <tr>
    <th>Task</th>
	<th>User restricted</th>
    <td>/api/task/&lt;str:pk&gt;/</td>
  </tr>
  <tr>
  	<th>Create Task</th>
	<th>User restricted</th>
	<td>/api/task-create/</td>
  </tr>
  <tr>
  	<th>Update Task</th>
	<th>User restricted</th>
	<td> /api/task-update/&lt;str:pk&gt;/</td>
  </tr>
  <tr>
  	<th>Delete Task</th>
	<th>User restricted</th>
	<td>/api/task-delete/&lt;str:pk&gt;/</td>
  </tr>
    <tr>
        <th> User Register </th>
		<th>Allow all</th>
        <td> /users/register/ </td>
    </tr>
     <tr>
        <th> User Login </th>
		<th>Allow all</th>
        <td> /users/login/ </td>
    </tr>
     <tr>
        <th> User </th>
		<th>User restricted</th>
        <td> /users/user/&lt<str:pk>&gt;/ </td>
    </tr>
     <tr>
        <th>User List</th>
		<th>Admin restricted</th>
        <td> /users/getUsers/ </td>
    </tr>
     <tr>
        <th> Tokens </th>
		<th> Allow all</th>
        <td> /users/api/token/ </td>
    </tr>
     <tr>
        <th> Refresh Token </th>
		<th>User restricted</th>
        <td> /users/api/token/refresh/ </td>
    </tr>
</table>


