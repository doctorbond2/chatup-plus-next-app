'use client';
import { useUserContext } from '@/context/UserContext';
import { LoginInformation } from '@/models/types/Auth';
export default function Page() {
  const { login } = useUserContext();
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const data: any = Object.fromEntries(formData.entries());
        await login(data as any);
      }}
    >
      <label>Name</label>
      <input name="username"></input>
      <label>Password</label>
      <input name="password"></input>
      <button type="submit">Submit</button>
    </form>
  );
}
