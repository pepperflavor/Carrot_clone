// ts 공식문서에서 type 기능이 필요하기 전까지는

import { InputHTMLAttributes } from "react";

// interface 사용하길 권장함
interface InputProps {
  name: string;
  errors?: string[];
}

export default function Input({
  name,
  errors = [],
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  console.log(rest);
  return (
    <div className="flex flex-col gap-2">
      <input
        className="bg-transparent rounded-md
          w-full h-10 focus:outline-none ring-1 ring-neutral-200
          focus:ring-4 transition
         focus:ring-orange-500 border-none
         placeholder:text-neutral-400 pl-3"
        name={name}
        {...rest}
      />
      <span
        className="text-red-500 
        font-medium flex flex-col"
      >
        {errors.map((error, index) => (
          <span
            key={index}
            className="text-red-500
            font-medium pl-1"
          >
            {error}
          </span>
        ))}
      </span>
    </div>
  );
}
