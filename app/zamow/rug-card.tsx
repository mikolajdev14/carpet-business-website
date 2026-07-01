"use client";

import Image from "next/image";
import porshe from "@/public/porshe-gradient.png";
import { useRouter } from "next/navigation";

interface RugProps {
  id: number;
  name: string;
  description: string;
  leadDays: number;
  imgUrl: string;
}

export const RugCard = (props: RugProps) => {
  const router = useRouter();

  const handleClick = async () => {
    router.push("/zamow/" + props.id);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <span>{props.name}</span>
      <p>{props.description}</p>
      <Image width="400" height="200" src={porshe.src} alt="porshe"></Image>
    </div>
  );
};
