'use client';

import { FormEvent } from 'react';

export default function LoginPage() {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email</label>
        <input placeholder="email" />
      </div>
      <div>
        <label>Email</label>
        <input placeholder="password" />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
