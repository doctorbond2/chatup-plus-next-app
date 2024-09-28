'use client';
import axios from 'axios';
export default function Page() {
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        axios
          .post('/api/todos', data)
          .then((response) => {
            console.log(response.status);
            console.log(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      }}
    >
      <label>Name</label>
      <input name="name"></input>
      <button type="submit">Submit</button>
    </form>
  );
}
