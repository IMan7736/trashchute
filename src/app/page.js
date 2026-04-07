import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome to my Next.js App</h1>
      <p>This is the home page</p>
      <Link href="/about">Go to About page</Link>
      <Link href="/todos">Go to Todos</Link>
    </div>
  );
}