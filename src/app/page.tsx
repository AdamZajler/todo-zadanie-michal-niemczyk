import Image from "next/image";
import {TODO} from '../../components/TODO';
import './globals.css'
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <TODO />
    </main>
  );
}
