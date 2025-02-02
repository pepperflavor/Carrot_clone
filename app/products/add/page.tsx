"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function AddProduct() {
  const [preview, setPriview] = useState("");
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }
    const file = files[0];
    const url = URL.createObjectURL(file);
    console.log(url); // 유저 컴퓨터에만 존재하는 url
  };
  return (
    <div>
      <form className="flex flex-col gap-5 p-5">
        <label
          htmlFor="photo"
          className=" border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 border-dashed rounded-md cursor-pointer"
        >
          <PhotoIcon className="w-20" />
          <div className="text-neural-400 text-sm">사진을 추가해주세요.</div>
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          className="hidden"
        />
        <Input name="title" required placeholder="제목" type="text" />
        <Input name="price" required placeholder="가격" type="number" />
        <Input
          name="description"
          required
          placeholder="자세한 설명"
          type="text"
        />
        <Button text="작성완료" />
      </form>
    </div>
  );
}
